import React, { useEffect, useState } from "react";
import articleData from "./articleData";

const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");
const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
const route = (path = "/", hash = "") => `${BASE_PATH}${path}${hash}`;

const contacts = [
  { label: "电话", value: "13360052825", href: "tel:13360052825" },
  { label: "邮箱", value: "1366124796@qq.com", href: "mailto:1366124796@qq.com" },
  { label: "城市", value: "深圳 / 广州 / 杭州", href: "#contact" },
];

const profileStats = [
  ["方向", "游戏策划 / 游戏设计"],
  ["教育", "深圳大学 · 数字媒体艺术"],
  ["关键词", "系统拆解 · 关卡节奏 · AI 管线"],
  ["求职城市", "深圳 / 广州 / 杭州"],
];

const experiences = [
  {
    time: "2023.09 - 2027.07",
    title: "深圳大学 · 数字媒体艺术（本科）",
    tag: "教育背景",
    text: "主修课程：《CG渲染》《游戏设计基础》《互动媒体设计》《游戏设计综合实践》《互动媒体策划》。持续积累游戏策划、交互叙事、多媒体设计与视觉表达能力，能把设计想法整理成清晰的图文方案。",
  },
  {
    time: "2025.01 - 2025.06",
    title: "AI 设计师 · 炼丹科技有限公司",
    tag: "实习经历",
    text: "参与故事脚本、视频流程和视觉参考的整理，使用 ComfyUI、Midjourney 等工具辅助内容生成与测试。",
  },
  {
    time: "2025.12 - 2026.03",
    title: "美术资产管线与项目管理 · 腾娱互动有限公司",
    tag: "实习经历",
    text: "参与 3D 模型与 2D 原画资源管理，配合管线检查、入库标注和项目进度追踪。",
  },
  {
    time: "2024 - 2026",
    title: "校园活动与创作经历",
    tag: "组织协作",
    text: "担任校级活动策划负责人，参与彩色跑、十大歌手、毕业歌会等大型校园活动策划与执行。",
  },
];

const gameGroups = [
  {
    type: "ARPG",
    tone: "orange",
    items: [
      ["艾尔登法环", "120h+", "重点关注敌我攻防交互、攻击窗口与 Boss 招式设计，体验不同敌人的压迫、规避与反击节奏"],
      ["原神", "活跃约2年", "熟悉核心战斗、角色养成与元素反应体系，对角色循环及长期内容结构有基础理解"],
      ["绝区零", "100h+", "较系统体验战斗体系，关注角色切换、闪避/招架、失衡机制与队伍循环构成"],
      ["王者荣耀世界", "100h+", "SO-S1 开服玩家，深度体验游戏战斗系统分析文档《王者荣耀世界战斗系统拆解》"],
      ["......", "", ""],
    ],
  },
  {
    type: "ACT",
    tone: "lime",
    items: [
      ["怪物猎人：世界", "200h+", "本体 + DLC 通关，熟悉大部分怪物各种派生技能，分析文档《怪猎世界的怪物体验分析》"],
      ["只狼：影逝二度", "100h+", "游戏多周目通关，深度体验游戏战斗系统，分析文档《只狼战斗体验分析》"],
    ],
  },
  {
    type: "FPS",
    tone: "blue",
    items: [
      ["无畏契约", "700h+", "钻石 2 长期竞技体验，具备地图控制、信息博弈、技能协同、转点与攻防节奏理解"],
      ["CS2", "200h+", "了解传统战术 FPS 的枪械、经济、道具与地图控制框架，主要用于与英雄射击品类进行对比体验"],
    ],
  },
  {
    type: "其他体验",
    tone: "lime",
    summary: "杀戮尖塔2、逃离鸭科夫、去月球、逃生、生灵重塑、逃出生天、双影奇境...",
  },
];

const strengths = [
  ["系统拆解", "从体验目标、资源循环、反馈节奏和风险收益拆解玩法。"],
  ["关卡节奏", "关注 POI、路径引导、信息露出和玩家学习曲线。"],
  ["战斗体验", "长期玩 FPS、MOBA、ACT，对操作反馈和压力曲线有积累。"],
  ["AI 工具", "能用 AI 工具辅助脚本、分镜、视觉参考和快速验证。"],
  ["表达落地", "能用图表、展板、原型和文档把想法讲清楚。"],
  ["协作推进", "有活动策划和项目管理经历，能推动多人协作交付。"],
];

const projects = [
  {
    slug: "afterparty",
    title: "余兴派对",
    subtitle: "微恐合作解谜 Demo",
    role: "3C 交互 / 关卡 POI / 系统设计 / 视频策划",
    year: "2026",
    cover: asset("assets/afterparty-main.png"),
    summary: "负责 3C 操作验证、木偶肢体交互、物理机关与新手 POI 设计，搭建“探索-解谜-追逃-撤离”的合作微恐 Demo。",
    points: ["3C 操作验证", "木偶肢体交互", "新手关卡 POI", "Boss 追逃节奏"],
    featured: true,
    sections: [
      {
        title: "Demo 演示",
        text: "围绕可展示 Demo，我整理了主菜单、角色视觉、美术氛围与核心交互演示，重点验证移动、镜头、交互反馈等 3C 基础是否能支撑合作微恐体验，并为后续关卡扩展提供可复用的节奏样板。",
        video: asset("assets/afterparty-demo-web.mp4"),
      },
      {
        title: "项目定位",
        text: "我把项目定位为“轻量搜打撤 + 物理合作解谜”：保留搜刮、资源取舍和撤离释放感，但弱化枪械与硬核数值对抗，把压力转移到机关处理、队友协作和 Boss 追逃上，让玩家在互助与互坑之间产生社交笑点。",
        image: asset("assets/afterparty-main.png"),
      },
      {
        title: "核心交互设计：木偶肢体系统",
        text: "核心机制围绕木偶的可拆卸四肢展开：玩家可以主动拔下手脚用于投掷、压机关或触发远处目标，踩中陷阱也会产生断肢惩罚。断腿会降低移动能力，断手会限制搬运和道具使用；失去行动能力的玩家可以吸附到队友背上，转为照明、看图、投掷道具的辅助角色，把失败状态变成合作分工。",
        image: asset("assets/afterparty-character.png"),
      },
      {
        title: "对局玩法循环",
        text: "我将单局拆成接受任务、规划路线、搜集谢幕道具、交付或兑换、进入下一回合等阶段。前期让玩家在背包空间、搬运分工和机关风险之间做收益判断；后期通过 Boss 强化和门禁撤离，把探索积累转化为高压追逃决策。",
        image: asset("assets/afterparty-loop.png"),
      },
      {
        title: "新手关卡设计：出生 POI",
        text: "出生 POI 承担低压 3C 教学功能：先让玩家理解移动、镜头方向、交互按钮和任务目标。该区域不直接施加强敌压力，而是通过出口方向、物件摆放和轻量提示，让玩家自然进入探索状态。",
        image: asset("assets/afterparty-poi-spawn.png"),
      },
      {
        title: "新手关卡设计：捕鼠笼 POI",
        text: "捕鼠笼 POI 用来教学“观察后行动”和“机关风险”。玩家需要识别触发范围、理解断肢或减速等失败代价，并尝试通过路线选择、投掷肢体或队友配合规避风险。",
        image: asset("assets/afterparty-poi-trap.png"),
      },
      {
        title: "新手关卡设计：核心 POI",
        text: "核心 POI 用来综合检验移动、观察、交互和合作分工。这里把目标物、机关、搬运路线和风险放在同一空间里，让玩家第一次面对完整单局问题：谁搬运、谁警戒、何时推进、遇到危险是否放弃收益。",
        image: asset("assets/afterparty-poi-core.png"),
      },
    ],
  },
  {
    slug: "monster-rescue",
    title: "今天也要把猎人拖回来",
    subtitle: "怪物猎人 IP 轻度衍生玩法 Demo",
    role: "玩法策划 / 系统设计 / Demo 原型",
    year: "2026",
    cover: asset("assets/monster-rescue-cover.jpg"),
    summary: "从艾露猫救回力尽猎人的视角切入，把搜索情报、救援准备、路线选择与猫车追逃串成一局轻量救援体验。",
    points: ["IP 视角反转", "搜索与救援", "风险路线", "猫车追逃"],
    resources: [
      {
        label: "查看立项分析 PDF",
        href: asset("assets/monster-rescue-concept-report.pdf"),
      },
      {
        label: "下载玩法设计 DOCX",
        href: asset("assets/monster-rescue-game-design.docx"),
        download: true,
      },
      {
        label: "下载 AI 游戏案例研究",
        href: asset("assets/ai-game-case-research-2022-2026.xlsx"),
        download: true,
      },
    ],
    sections: [
      {
        title: "Demo 演示",
        text: "Demo 已实现从行动准备、派遣艾露猫搜索，到确认猎人位置、选择撤离路线和驾驶猫车追逃的完整流程。原型重点验证：玩家能否通过有限猫手、行动时间与情报，在救援速度和路线安全之间做出清晰取舍。",
        video: asset("assets/monster-rescue-demo-web.mp4"),
      },
      {
        title: "视角反转：失败结算变成主玩法",
        text: "原作讲猎人如何狩猎怪物，这个项目则让弱小的艾露猫成为救援队。玩家面对的不是复杂武器操作，而是如何在大型怪物仍然活动的危险区域里找到猎人、组织猫手并把他安全拖走。熟悉 IP 的玩家能读到“猫车”梗，新玩家也能立即理解救援目标。",
        image: asset("assets/monster-rescue-cover.jpg"),
      },
      {
        title: "搜索：用猫手换取情报",
        text: "地图由多个不同地形与风险的区块组成。投入更多艾露猫可以更快完成搜索、降低猎人持续受伤的代价，但也会消耗更多行动资源。找到猎人后，玩家还要判断是否继续探索未知区域，为后续撤离换取更完整的路线情报。",
        image: asset("assets/monster-rescue-search.jpg"),
      },
      {
        title: "路线选择：把前期情报变成决策",
        text: "救援成功后，已探索区域会显示距离、障碍密度与追击压力，未知路线则可能更短但风险不明。玩家可以走稳妥的已知路径，也可以为了节省时间进入未知区域，让前期搜索结果真正影响后半局的撤离策略。",
        image: asset("assets/monster-rescue-route.jpg"),
      },
      {
        title: "追逃与个性化战报",
        text: "猫车阶段将规划结果转化为即时操作：玩家需要引导方向、加速并跳跃障碍，同时管理猫车耐久、猎人体力与怪物距离。后续设想由受约束的 AI 动态组合救援事件与事故战报，让每局经历可复盘、可分享，但始终由稳定的救援玩法承担核心乐趣。",
        image: asset("assets/monster-rescue-chase.jpg"),
      },
    ],
  },
  {
    slug: "casual-extraction",
    title: "休闲化搜打撤",
    subtitle: "品类分析 / 原创产品方案",
    role: "品类研究 / 用户反馈归纳 / 系统策划",
    year: "2026",
    cover: asset("assets/casual-extraction-cover.png"),
    summary: "结合 36 条可核验社区线索，拆解搜打撤的四类门槛，并以“木偶避难所”方案重构风险、回收与撤离节奏。",
    points: ["风险曲线", "社区反馈", "阶段小撤", "原创产品方案"],
    resources: [
      {
        label: "打开完整分析 PDF",
        href: asset("assets/casual-extraction-analysis.pdf"),
      },
      {
        label: "下载社区反馈归纳",
        href: asset("assets/extraction-community-feedback.xlsx"),
        download: true,
      },
    ],
    sections: [
      {
        title: "核心判断：不是降难，是重画风险曲线",
        text: "搜打撤的吸引力来自“带出价值—临场决策—撤离释放”的完整情绪曲线。休闲化不应削平紧张感，而应集中解决高压、高惩罚、高认知和高操作的叠加门槛，把一次性下注改造成可观察、可调整、可阶段回收的风险。",
        image: asset("assets/casual-extraction-cover.png"),
      },
      {
        title: "社区证据：先让损失可信，再让风险可选",
        text: "研究归纳了 30 条 Steam 公开评价与 6 条 B 站公开线索。玩家真正排斥的并非风险本身，而是外挂、闪退、掉线、收益不清等不可控因素造成的“不可信损失”。因此产品底线应先保证公平、稳定与清晰恢复，再通过低损失入口、合作 PVE 和可选高价值目标控制压力上限。",
        image: asset("assets/casual-extraction-insights.png"),
      },
      {
        title: "原创方案：木偶避难所",
        text: "玩家操控废弃木偶进入危险区域搜集资源、营救同伴并修复社区。木偶可以主动拆下肢体，把它们作为诱饵、工具、机关部件或战斗消耗品，使生命状态、道具栏与解谜能力合并成一套直观资源系统。核心取舍是：保留行动能力，还是用身体换取机会。",
        image: asset("assets/casual-extraction-product.png"),
      },
      {
        title: "两次“小撤”与最终撤离",
        text: "安全屋不是提前存档，而是局内风险回收点。玩家把低价值或重复物资兑换成当前局需要的工具，重新判断路线后选择稳妥撤离或继续加码；高价值物资仍必须从最终出口带出。阶段回收降低了认知与沉没成本，同时保留最后一段撤离压力。",
        image: asset("assets/casual-extraction-safehouse.png"),
      },
    ],
  },
  {
    slug: "sekiro-combat",
    title: "只狼的战斗体验拆解",
    subtitle: "动作战斗体验分析",
    role: "战斗系统拆解 / 反馈分析",
    year: "2026",
    cover: asset("assets/sekiro-analysis-cover.png"),
    summary: "从架势、弹刀、攻防主动权与视听反馈出发，分析《只狼》如何把敌人的高压进攻转化为玩家的反击收益。",
    points: ["架势系统", "攻防转换", "危字攻击", "视听反馈"],
    article: articleData.sekiroCombat,
    sections: [
      {
        title: "核心循环：在交锋中争夺主动权",
        text: "Boss 战可以概括为：观察敌人、主动进攻施压、根据反应切换攻防、累积生命与架势优势、制造忍杀机会，再进入下一阶段重新观察。所有机制都在鼓励玩家面对攻击、理解攻击，并用正确回应把敌人的压力转成自己的收益。",
        image: asset("assets/sekiro-analysis-cover.png"),
      },
      {
        title: "架势把防御改造成进攻",
        text: "完美弹刀既避免生命损失，也会增加敌人的架势，因此防御不再只是减少伤害。架势离战后会恢复，且生命越低恢复越慢，这让削减生命、保持近身压制和连续弹刀相互支持，推动玩家主动维持战斗节奏。",
        image: asset("assets/sekiro-posture-system.png"),
      },
      {
        title: "攻防转换形成强交互",
        text: "玩家的连续攻击会被 Boss 格挡或完美弹反；一旦 Boss 取得反击优先权，继续出刀的风险就会显著提高，玩家需要立刻转入防守或针对性应对。主动权在双方之间快速流动，使战斗更像近距离交锋，而不是等待固定输出窗口。",
        image: asset("assets/sekiro-initiative-loop.png"),
      },
      {
        title: "“危”字与弹刀反馈承担教学",
        text: "统一的“危”字先提示普通格挡无法解决问题，再由突刺、下段和投技的动作前摇要求玩家选择识破、跳跃或垫步。弹刀火花、清脆音效、动作姿态和忍杀镜头同时告诉玩家当前由谁掌握主动权，以及下一步是否应该继续进攻。",
        image: asset("assets/sekiro-combat-feedback.png"),
      },
    ],
  },
  {
    slug: "hok-world-combat",
    title: "王者荣耀世界战斗系统拆解",
    subtitle: "MMOARPG 战斗系统分析",
    role: "战斗系统拆解 / PVE 与 PVP 分析",
    year: "2026",
    cover: asset(articleData.hokWorldCombat.cover),
    summary: "围绕《王者荣耀世界》的元素克制、战斗行为、PVE Boss 机制与 PVP 对战结构，拆解其 MMOARPG 战斗体验。",
    points: ["元素体系", "战斗行为", "PVE 机制", "PVP 对战"],
    article: articleData.hokWorldCombat,
    sections: [],
  },
  {
    slug: "monster-hunter-combat",
    title: "怪猎世界中怪物的战斗体验设计",
    subtitle: "战斗体验分析报告",
    role: "战斗体验分析 / 系统拆解",
    year: "2026",
    cover: asset("assets/monster-hunter-report-cover.png"),
    summary: "围绕《怪物猎人：世界》的怪物设计，分析狩猎体验如何通过威胁、弱点、节奏争夺和武器反馈形成战斗爽感。",
    points: ["节奏拔河", "威胁与弱点", "Boss 行为逻辑", "武器反馈"],
    article: articleData.monsterHunterCombat,
    sections: [
      {
        title: "核心观点",
        text: "《怪物猎人：世界》的战斗并不是玩家单方面输出怪物，而是玩家与怪物围绕战斗主动权展开的节奏拔河。玩家需要观察动作、判断派生逻辑、选择站位，并利用武器机制夺回输出窗口。",
        image: asset("assets/monster-hunter-report-cover.png"),
      },
      {
        title: "威胁与弱点来自同一个设计源",
        text: "优秀怪物通常拥有鲜明的核心特性。这个特性既是主要威胁，也是玩家可以针对的突破口。比如爆炸黏菌既限制走位、制造延迟威胁，也为玩家提供观察、拆解和反制的方向。",
        image: asset("assets/monster-hunter-report-cover.png"),
      },
      {
        title: "完整报告",
        text: "报告共 7 页，包含狩猎节奏、怪物行为、武器输出窗口、玩家学习过程等分析。点击下方按钮可以打开完整 PDF。",
        image: asset("assets/monster-hunter-report-cover.png"),
      },
    ],
  },
  {
    slug: "semilinear",
    title: "半序元",
    subtitle: "新媒体交互 / 展览视觉",
    role: "视觉叙事 / 交互展示",
    year: "2025",
    cover: asset("assets/semilinear-board.png"),
    summary: "以 DNA 双螺旋和生命历程为线索，用粒子、影像和展板组织一组面向观众的沉浸式视觉叙事。",
    points: ["生命历程叙事", "展陈视觉", "粒子影像", "信息图表达"],
    sections: [
      {
        title: "设计概念",
        text: "作品从“人类本质是什么”出发，将基因、成长、社会互动等抽象概念转化为可观看的视觉章节。",
        image: asset("assets/semilinear-poster.png"),
      },
      {
        title: "展板组织",
        text: "通过章节化的信息结构，让观众在大幅视觉中先获得情绪吸引，再进入 DNA、蛋白质复制、细胞分裂等具体内容。",
        image: asset("assets/semilinear-board.png"),
      },
    ],
  },
  {
    slug: "campus-events",
    title: "校园活动策划",
    subtitle: "社联策划部 / 校园文化活动",
    role: "活动策划 / 流程统筹 / 执行协作",
    year: "2024 - 2025",
    cover: asset("assets/event-singer-1.jpg"),
    summary: "参考社联策划部策划案，整理彩色跑、十大歌手、毕业歌会三类校园文化活动的策划目标、活动玩法与执行内容。",
    points: ["主题概念", "活动流程", "点位设计", "现场执行"],
    sections: [
      {
        title: "2024 彩色跑：My BesT! Color Run",
        text: "彩色跑作为校运会开幕式活动，以“让运动更有趣”为目标，把环校跑和 MBTI 互动点位结合起来。路线经过多个校园节点，参与者通过绿色、蓝色、紫色、黄色四个点位收集人格徽章，在运动中完成社交互动、拍照打卡和自我表达。",
        image: asset("assets/event-color-run-1.jpg"),
        images: [asset("assets/event-color-run-1.jpg"), asset("assets/event-color-run-2.jpg")],
      },
      {
        title: "2025 十大歌手：「深音宇宙」X 号种子",
        text: "十大歌手是校园音乐品牌活动。本届以“深音宇宙·X 号种子”为核心概念，将赛事包装成可持续运营的校园音乐 IP。策划内容包含复赛与决赛、选手招募、设点宣传、社团表演审核、门票派发、舞台内容与观众氛围营造。",
        image: asset("assets/event-singer-1.jpg"),
        images: [asset("assets/event-singer-1.jpg"), asset("assets/event-singer-2.jpg")],
      },
      {
        title: "2025 毕业季·沙漏音乐节",
        text: "毕业歌会以“10590毕业季·沙漏音乐节”为主题，用音乐和光影为毕业生打造告别仪式。活动包含线上预热、线下快闪、毕业寄语互动、纸飞机祝福、沙漏装置与正式歌会，强调珍藏时光、传递力量与延续校友情感联结。",
        image: asset("assets/event-graduation-1.jpg"),
        images: [asset("assets/event-graduation-1.jpg"), asset("assets/event-graduation-2.jpg")],
      },
    ],
  },
];

function App() {
  const [activeSlug, setActiveSlug] = useState(getSlugFromPath());

  useEffect(() => {
    const syncRoute = () => setActiveSlug(getSlugFromPath());
    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  const navigateProject = (slug) => {
    window.history.pushState({}, "", route(`/projects/${slug}`));
    setActiveSlug(slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateHome = (hash = "") => {
    window.history.pushState({}, "", route("/", hash));
    setActiveSlug(null);
    requestAnimationFrame(() => {
      if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const activeProject = projects.find((project) => project.slug === activeSlug);

  if (activeProject) {
    return (
      <ProjectDetail
        project={activeProject}
        allProjects={projects}
        onBack={() => navigateHome("#projects")}
        onNavigate={navigateProject}
      />
    );
  }

  return <HomePage onNavigate={navigateProject} onHomeNav={navigateHome} />;
}

function HomePage({ onNavigate, onHomeNav }) {
  return (
    <main className="site-shell">
      <Header onHomeNav={onHomeNav} />

      <section className="hero-section" id="home">
        <div className="page-width hero-layout">
          <div className="hero-copy">
            <p className="eyebrow">GAME DESIGN PORTFOLIO</p>
            <h1>叶鹏达</h1>
            <p className="hero-role">游戏策划 / 游戏设计师</p>
            <p className="hero-text">
              我关注玩家如何理解目标、进入循环、感受压力并获得反馈。希望用系统化拆解、关卡节奏和清晰表达，把一个想法推进到可玩的状态。
            </p>
            <div className="hero-actions">
              <button onClick={() => onHomeNav("#projects")}>查看项目</button>
              <a href="mailto:1366124796@qq.com">联系我</a>
            </div>
          </div>

          <aside className="profile-panel" aria-label="个人信息">
            <img src={asset("assets/profile.jpg")} alt="叶鹏达个人照片" />
            <div className="profile-meta">
              {profileStats.map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="section-block" id="experience">
        <div className="page-width split-heading">
          <SectionTitle index="01" title="个人经历" text="把学习、实习和活动组织经验整理成可迁移的策划能力。" />
          <div className="experience-list">
            {experiences.map((item) => (
              <article className="experience-item" key={item.title}>
                <div>
                  <span>{item.time}</span>
                  <b>{item.tag}</b>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block compact" id="games">
        <div className="page-width games-showcase">
          <p className="games-eyebrow">GAME DESIGN PORTFOLIO</p>
          <h2>游戏经历</h2>
          <div className="game-group-list">
            {gameGroups.map((group) => (
              <article className={group.summary ? "game-group summary" : "game-group"} key={group.type}>
                <span className={`game-type ${group.tone}`}>{group.type}</span>
                {group.summary ? (
                  <p className="game-summary">{group.summary}</p>
                ) : (
                  <div className="game-lines">
                    {group.items.map(([name, hours, note]) => (
                      <div className="game-line" key={name}>
                        <h3>{name}</h3>
                        {hours && <strong>{hours}</strong>}
                        {note && <p>{note}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block projects-block" id="projects">
        <div className="page-width">
          <SectionTitle index="03" title="精选项目" text="点击卡片进入单独项目页，查看更完整的项目说明、图像资料与报告。" />
          <div className="project-grid">
            {projects.map((project) => (
              <button
                className={project.featured ? "project-tile featured" : "project-tile"}
                key={project.slug}
                onClick={() => onNavigate(project.slug)}
              >
                <span className="project-year">{project.year}</span>
                <img src={project.cover} alt="" />
                <div className="project-info">
                  <p>{project.subtitle}</p>
                  <h3>{project.title}</h3>
                  <span>{project.summary}</span>
                  <ul>
                    {project.points.slice(0, 4).map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block compact" id="strengths">
        <div className="page-width">
          <SectionTitle index="04" title="个人优势" text="偏策划侧的能力结构，后续可以继续按岗位 JD 调整。" />
          <div className="strength-grid">
            {strengths.map(([title, text], index) => (
              <article className="strength-card" key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="contact-section" id="contact">
        <div className="page-width contact-layout">
          <div>
            <p className="eyebrow">CONTACT</p>
            <h2>期待把想法做成可以体验的游戏。</h2>
          </div>
          <div className="contact-list">
            {contacts.map((item) => (
              <a href={item.href} key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}

function ProjectDetail({ project, allProjects, onBack, onNavigate }) {
  const resourceLinks =
    project.article
      ? []
      : project.resources ||
    (project.pdf
      ? [
          {
            label: "打开完整 PDF",
            href: project.pdf,
          },
        ]
      : []);

  return (
    <main className={project.article ? "site-shell detail-shell article-mode" : "site-shell detail-shell"}>
      <header className="detail-topbar">
        <button onClick={onBack}>返回项目列表</button>
        <a href="mailto:1366124796@qq.com">联系我</a>
      </header>

      {project.article ? (
        <ArticleHero project={project} />
      ) : (
        <section className="detail-hero">
          <div className="page-width detail-hero-grid">
            <div>
              <p className="eyebrow">{project.subtitle}</p>
              <h1 className={project.title.length > 12 ? "compact-title" : undefined}>{project.title}</h1>
              <p>{project.summary}</p>
              <div className="detail-meta">
                <span>{project.year}</span>
                <span>{project.role}</span>
              </div>
              {resourceLinks.length > 0 && (
                <div className="resource-actions" aria-label="项目资料">
                  {resourceLinks.map((resource) => (
                    <a
                      className="detail-action"
                      href={resource.href}
                      target={resource.download ? undefined : "_blank"}
                      rel={resource.download ? undefined : "noreferrer"}
                      download={resource.download || undefined}
                      key={resource.label}
                    >
                      {resource.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <img src={project.cover} alt={`${project.title}封面`} />
          </div>
        </section>
      )}

      <section className="detail-content">
        <div className={project.article ? "page-width article-layout" : "page-width detail-section-list"}>
          {project.article ? (
            <ArticleBody article={project.article} />
          ) : (
            project.sections.map((section, index) => (
              <article className="detail-section" key={section.title}>
                <div className="detail-section-copy">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h2>{section.title}</h2>
                  <p>{section.text}</p>
                  {project.pdf && index === project.sections.length - 1 && (
                    <a className="inline-action" href={project.pdf} target="_blank" rel="noreferrer">
                      查看完整报告
                    </a>
                  )}
                </div>
                {section.video ? (
                  <video className="detail-video" src={section.video} controls preload="metadata" poster={project.cover} />
                ) : section.images ? (
                  <div className="detail-gallery">
                    {section.images.map((image) => (
                      <img src={image} alt={section.title} key={image} />
                    ))}
                  </div>
                ) : (
                  <img src={section.image} alt={section.title} />
                )}
              </article>
            ))
          )}
        </div>
      </section>

      <section className="related-projects">
        <div className="page-width">
          <SectionTitle index="NEXT" title="其他项目" text="继续查看其他作品详情。" />
          <div className="related-list">
            {allProjects
              .filter((item) => item.slug !== project.slug)
              .map((item) => (
                <button key={item.slug} onClick={() => onNavigate(item.slug)}>
                  <img src={item.cover} alt="" />
                  <span>{item.subtitle}</span>
                  <strong>{item.title}</strong>
                </button>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ArticleHero({ project }) {
  return (
    <section className="article-hero">
      <div className="page-width article-layout">
        <p className="article-kicker">{project.subtitle}</p>
        <h1>{project.article.title}</h1>
        <div className="article-meta">
          <span>原创</span>
          <strong>叶鹏达</strong>
          <span>{project.year}</span>
          <span>{project.role}</span>
        </div>
        <p className="article-summary">{project.summary}</p>
      </div>
    </section>
  );
}

function ArticleBody({ article }) {
  let figureIndex = 0;

  return (
    <article className="article-reader">
      {article.blocks.map((block, index) => {
        if (block.type === "heading") {
          const headingClass = getArticleHeadingClass(block.text);
          const HeadingTag = headingClass === "major" ? "h2" : "h3";
          return (
            <HeadingTag className={`article-heading-${headingClass}`} key={index}>
              {block.text}
            </HeadingTag>
          );
        }

        if (block.type === "paragraph") {
          return block.text.split(/\n+/).map((text, partIndex) => <p key={`${index}-${partIndex}`}>{text}</p>);
        }

        if (block.type === "image") {
          figureIndex += 1;
          const figureStyle = getArticleFigureStyle(block);
          return (
            <figure className="article-figure" style={figureStyle} key={index}>
              <img src={asset(block.src)} alt={block.alt || `${article.title}图示 ${figureIndex}`} />
            </figure>
          );
        }

        if (block.type === "imageTable") {
          return <ArticleImageTable block={block} article={article} key={index} />;
        }

        if (block.type === "table") {
          const columnCount = Math.max(...block.rows.map((row) => row.length));
          const isSingleCell = block.rows.length === 1 && columnCount === 1;

          if (isSingleCell) {
            return (
              <div className="article-callout" key={index}>
                {block.rows[0][0]}
              </div>
            );
          }

          return (
            <div className="article-table-wrap" key={index}>
              <table>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Array.from({ length: columnCount }).map((_, cellIndex) => {
                        const CellTag = rowIndex === 0 ? "th" : "td";
                        return <CellTag key={cellIndex}>{row[cellIndex] || ""}</CellTag>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return null;
      })}
    </article>
  );
}

function ArticleImageTable({ block, article }) {
  const columnCount = Math.max(...block.rows.map((row) => row.length));

  return (
    <div className="article-image-table" style={{ "--columns": columnCount }}>
      {block.rows.map((row, rowIndex) =>
        row.map((cell, cellIndex) => (
          <figure className="article-image-cell" key={`${rowIndex}-${cellIndex}`}>
            {cell.images.map((image, imageIndex) => (
              <img
                src={asset(image.src)}
                alt={image.alt || `${article.title}图示`}
                style={image.width ? { width: `${image.width}px` } : undefined}
                key={`${image.src}-${imageIndex}`}
              />
            ))}
            {cell.text && cell.images.length > 0 && <figcaption>{cell.text}</figcaption>}
            {cell.text && cell.images.length === 0 && <p>{cell.text}</p>}
          </figure>
        ))
      )}
    </div>
  );
}

function getArticleFigureStyle(block) {
  const style = {};
  if (block.width) {
    style.width = `${block.width}px`;
  }
  if (block.align === "center") {
    style.marginLeft = "auto";
    style.marginRight = "auto";
  } else if (block.align === "right") {
    style.marginLeft = "auto";
  } else {
    style.marginRight = "auto";
  }
  return style;
}

function getArticleHeadingClass(text) {
  const compact = text.replace(/\s+/g, "");
  if (/^[一二三四五六七八九十]+[、.．]/.test(compact)) return "major";
  if (/^\d+[.．、]/.test(compact)) return "minor";
  if (compact.length <= 10 && !/[。！？；;]$/.test(compact)) return "major";
  return "minor";
}

function Header({ onHomeNav }) {
  const links = [
    ["经历", "#experience"],
    ["游戏", "#games"],
    ["项目", "#projects"],
    ["优势", "#strengths"],
    ["联系", "#contact"],
  ];

  return (
    <header className="site-header">
      <button className="brand-button" onClick={() => onHomeNav("")}>
        YEPENGDA
      </button>
      <nav>
        {links.map(([label, href]) => (
          <button key={href} onClick={() => onHomeNav(href)}>
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}

function SectionTitle({ index, title, text }) {
  return (
    <div className="section-title">
      <span>{index}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function getSlugFromPath() {
  if (typeof window === "undefined") return null;
  let pathname = window.location.pathname;
  if (BASE_PATH && pathname.startsWith(BASE_PATH)) {
    pathname = pathname.slice(BASE_PATH.length) || "/";
  }
  const match = pathname.match(/^\/projects\/([^/]+)/);
  return match?.[1] || null;
}

export default App;
