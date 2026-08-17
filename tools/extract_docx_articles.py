from __future__ import annotations

import json
import re
import shutil
import zipfile
from dataclasses import dataclass
from pathlib import Path

from lxml import etree
from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ASSET_ROOT = ROOT / "public" / "assets" / "articles"
OUT_FILE = ROOT / "src" / "articleData.js"

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
A_NS = "http://schemas.openxmlformats.org/drawingml/2006/main"
WP_NS = "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
R_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"

NS = {"w": W_NS, "a": A_NS, "wp": WP_NS, "r": R_NS, "rel": REL_NS}


@dataclass(frozen=True)
class ArticleSpec:
    key: str
    slug: str
    source: str


SPECS = [
    ArticleSpec("sekiroCombat", "sekiro-combat", "《只狼 影逝二度》的战斗体验拆解.docx"),
    ArticleSpec("hokWorldCombat", "hok-world-combat", "《王者荣耀世界》战斗系统拆解.docx"),
    ArticleSpec("monsterHunterCombat", "monster-hunter-combat", "怪猎世界中怪物的战斗体验设计.docx"),
]


def qn(ns: str, tag: str) -> str:
    return f"{{{ns}}}{tag}"


def read_xml(zf: zipfile.ZipFile, name: str) -> etree._Element:
    return etree.fromstring(zf.read(name))


def relationships(zf: zipfile.ZipFile) -> dict[str, str]:
    rels = read_xml(zf, "word/_rels/document.xml.rels")
    result: dict[str, str] = {}
    for rel in rels.findall("rel:Relationship", namespaces=NS):
      rid = rel.get("Id")
      target = rel.get("Target")
      if rid and target:
          result[rid] = target
    return result


def element_text(element: etree._Element) -> str:
    parts: list[str] = []
    for node in element.iter():
        if node.tag == qn(W_NS, "t") and node.text:
            parts.append(node.text)
        elif node.tag == qn(W_NS, "tab"):
            parts.append("\t")
        elif node.tag == qn(W_NS, "br"):
            parts.append("\n")
    text = "".join(parts)
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def emu_to_px(value: str | None) -> int | None:
    if not value:
        return None
    try:
        return round(int(value) / 914400 * 96)
    except ValueError:
        return None


def paragraph_alignment(paragraph: etree._Element) -> str:
    jc = paragraph.find("w:pPr/w:jc", namespaces=NS)
    value = jc.get(qn(W_NS, "val")) if jc is not None else None
    if value in {"center", "right"}:
        return value
    return "left"


def image_occurrences(element: etree._Element) -> list[dict]:
    images: list[dict] = []
    for blip in element.findall(".//a:blip", namespaces=NS):
        rid = blip.get(qn(R_NS, "embed")) or blip.get(qn(R_NS, "link"))
        if not rid:
            continue
        drawing = next(
            (
                ancestor
                for ancestor in blip.iterancestors()
                if ancestor.tag in {qn(WP_NS, "inline"), qn(WP_NS, "anchor")}
            ),
            None,
        )
        extent = drawing.find("wp:extent", namespaces=NS) if drawing is not None else None
        images.append(
            {
                "rid": rid,
                "width": emu_to_px(extent.get("cx") if extent is not None else None),
                "height": emu_to_px(extent.get("cy") if extent is not None else None),
            }
        )
    return images


def table_rows(table: etree._Element) -> list[list[str]]:
    rows: list[list[str]] = []
    for tr in table.findall("w:tr", namespaces=NS):
        row: list[str] = []
        for tc in tr.findall("w:tc", namespaces=NS):
            cell_text = element_text(tc)
            row.append(cell_text)
        if any(cell.strip() for cell in row):
            rows.append(row)
    return rows


def table_image_ids(table: etree._Element) -> list[str]:
    ids: list[str] = []
    for blip in table.findall(".//a:blip", namespaces=NS):
        rid = blip.get(qn(R_NS, "embed")) or blip.get(qn(R_NS, "link"))
        if rid and rid not in ids:
            ids.append(rid)
    return ids


def make_image_block(
    zf: zipfile.ZipFile,
    rels: dict[str, str],
    image: dict,
    image_map: dict[str, str],
    out_dir: Path,
    image_index: int,
    alt: str = "",
    align: str = "center",
) -> tuple[dict | None, int]:
    rid = image["rid"]
    target = rels.get(rid)
    if not target:
        return None, image_index
    media_name = "word/" + target.lstrip("/")
    if media_name not in image_map:
        image_map[media_name] = save_image(zf, media_name, out_dir, image_index)
        image_index += 1
    block = {"type": "image", "src": image_map[media_name], "alt": alt, "align": align}
    if image["width"]:
        block["width"] = image["width"]
    if image["height"]:
        block["height"] = image["height"]
    return block, image_index


def classify_text(text: str, block_index: int) -> str:
    compact = re.sub(r"\s+", "", text)
    if block_index == 0:
        return "title"
    if not compact:
        return "paragraph"

    heading_patterns = [
        r"^[一二三四五六七八九十]+[、.．]",
        r"^\d+[.．、]",
        r"^第[一二三四五六七八九十]+[章节部分]",
        r"^[Pp][Vv][EePp]",
        r"^Boss",
    ]
    looks_numbered_heading = any(re.match(pattern, compact) for pattern in heading_patterns)
    has_sentence_punctuation = bool(re.search(r"[。！？；;]$", compact))
    has_many_commas = compact.count("，") + compact.count(",") >= 2

    if looks_numbered_heading and len(compact) <= 48:
        return "heading"
    if len(compact) <= 24 and not has_sentence_punctuation and not has_many_commas:
        return "heading"
    if len(compact) <= 34 and "：" in compact and not has_sentence_punctuation:
        return "heading"
    return "paragraph"


def save_image(zf: zipfile.ZipFile, media_name: str, out_dir: Path, index: int) -> str:
    suffix = Path(media_name).suffix.lower()
    raw_name = f"image-{index:02d}{suffix}"
    raw_path = out_dir / raw_name
    raw_path.write_bytes(zf.read(media_name))

    try:
        with Image.open(raw_path) as image:
            image = ImageOps.exif_transpose(image)
            image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
            has_alpha = image.mode in ("RGBA", "LA") or (image.mode == "P" and "transparency" in image.info)
            if has_alpha:
                converted = image.convert("RGBA")
            else:
                converted = image.convert("RGB")
            web_name = f"image-{index:02d}.webp"
            web_path = out_dir / web_name
            converted.save(web_path, "WEBP", quality=84, method=6)
            raw_path.unlink(missing_ok=True)
            return f"assets/articles/{out_dir.name}/{web_name}"
    except Exception:
        return f"assets/articles/{out_dir.name}/{raw_name}"


def extract_article(spec: ArticleSpec) -> dict:
    source_path = ROOT / spec.source
    out_dir = ASSET_ROOT / spec.slug
    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    blocks: list[dict] = []
    image_map: dict[str, str] = {}
    image_index = 1

    with zipfile.ZipFile(source_path) as zf:
        rels = relationships(zf)
        doc = read_xml(zf, "word/document.xml")
        body = doc.find("w:body", namespaces=NS)
        if body is None:
            raise RuntimeError(f"No document body in {source_path}")

        text_block_index = 0
        for child in body:
            if child.tag == qn(W_NS, "p"):
                text = element_text(child)
                images = image_occurrences(child)
                align = paragraph_alignment(child)
                if text:
                    block_type = classify_text(text, text_block_index)
                    blocks.append({"type": block_type, "text": text})
                    text_block_index += 1
                for image in images:
                    rid = image["rid"]
                    target = rels.get(rid)
                    if not target:
                        continue
                    media_name = "word/" + target.lstrip("/")
                    if media_name not in image_map:
                        image_map[media_name] = save_image(zf, media_name, out_dir, image_index)
                        image_index += 1
                    block = {"type": "image", "src": image_map[media_name], "alt": text[:48] if text else "", "align": align}
                    if image["width"]:
                        block["width"] = image["width"]
                    if image["height"]:
                        block["height"] = image["height"]
                    blocks.append(block)
            elif child.tag == qn(W_NS, "tbl"):
                if image_occurrences(child):
                    rich_rows: list[list[dict]] = []
                    for tr in child.findall("w:tr", namespaces=NS):
                        rich_row: list[dict] = []
                        for tc in tr.findall("w:tc", namespaces=NS):
                            cell_images: list[dict] = []
                            for image in image_occurrences(tc):
                                image_block, image_index = make_image_block(
                                    zf, rels, image, image_map, out_dir, image_index, align="center"
                                )
                                if image_block:
                                    cell_images.append(image_block)
                            rich_row.append({"text": element_text(tc), "images": cell_images})
                        if any(cell["text"].strip() or cell["images"] for cell in rich_row):
                            rich_rows.append(rich_row)
                    if rich_rows:
                        blocks.append({"type": "imageTable", "rows": rich_rows})
                else:
                    rows = table_rows(child)
                    if rows:
                        blocks.append({"type": "table", "rows": rows})

    title = next((block["text"] for block in blocks if block["type"] == "title"), spec.source)
    article_blocks = [block for block in blocks if block["type"] != "title"]
    cover = next((block["src"] for block in article_blocks if block["type"] == "image"), "")

    return {
        "title": title,
        "source": spec.source,
        "cover": cover,
        "blocks": article_blocks,
    }


def main() -> None:
    articles = {spec.key: extract_article(spec) for spec in SPECS}
    js = (
        "const articleData = "
        + json.dumps(articles, ensure_ascii=False, indent=2)
        + ";\n\nexport default articleData;\n"
    )
    OUT_FILE.write_text(js, encoding="utf-8")
    print(f"Wrote {OUT_FILE}")
    for key, article in articles.items():
        images = sum(1 for block in article["blocks"] if block["type"] == "image")
        tables = sum(1 for block in article["blocks"] if block["type"] == "table")
        paragraphs = sum(1 for block in article["blocks"] if block["type"] in {"paragraph", "heading"})
        print(f"{key}: {paragraphs} text blocks, {images} images, {tables} tables")


if __name__ == "__main__":
    main()
