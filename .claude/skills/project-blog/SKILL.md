---
name: project-blog
description: 给定一个代码项目路径和主题，阅读项目内容并为本博客撰写一篇图文并茂的技术博客（含流程图、算法、图片、视频 demo），验证渲染后发布。当用户说"给 XX 项目写篇博客"、"把这个项目整理成博客"、"写一篇关于 <项目> 的文章"时使用。
---

# 项目博客撰写

输入：**项目路径** + **主题/切入点**（若用户没给主题，先读完项目再向用户提议 2-3 个切入点让其选择）。

## 第一步：读懂项目

1. 读 README、目录结构、入口文件、核心模块（围绕主题读，不必通读）。
2. 找现成素材：`assets/`、`docs/`、`results/`、`figures/` 里的图片、视频、实验结果、benchmark 表格——**项目自带的真实素材优先于生成的示意素材**。
3. 若项目可低成本运行（有 demo 脚本/notebook），运行并截取真实输出；不确定是否该跑时问用户。

## 第二步：规划内容（先列大纲给用户过目）

大纲要标注每一节配什么非文字元素。**硬性要求：全文至少 3 种非纯文字元素**，从下面选：

| 元素 | 实现方式 |
|---|---|
| 流程图/架构图 | 首选 ` ```mermaid ` 代码块（构建时渲染成双主题内联 SVG，支持 flowchart/sequence/state 等）；简单框图也可用站点风格的 ASCII 图（box-drawing 字符 + 箭头） |
| 算法 | 伪代码放代码块，或真实核心代码节选（删减到 <30 行，保留灵魂）+ KaTeX 公式 |
| 图片 | 项目自带图 > 运行截图 > matplotlib 生成的示意图/曲线图；生成图前先加载 dataviz skill |
| 视频 demo | 项目自带 demo 视频；或用 ffmpeg 从运行输出的帧序列合成 mp4；屏幕录制需要用户配合时直接开口要 |
| GIF | 短循环演示适用；markdown 图片语法引用，构建时自动转动画 webp |
| 表格 | 实验对比、参数说明（站点自动渲染为三线表） |

## 第三步：按博客约定撰写

- 落位：`assets/<category>/<subtopic>/<english-slug>.md`（category: cv/robotics/blogs）。先 `ls assets/` 看现有子目录，能复用就复用，没有合适的就新建（宁可新建也不硬塞）。
- frontmatter 必填 `title`、`date`、`description`，加 3-6 个 `tags`。
- 媒体文件与 md 同目录：图片/GIF 用相对路径 `![](./fig.png)`；视频用 `<video src="/assets/<category>/<subtopic>/demo.mp4" controls muted playsinline></video>`。
- 图/视频下一行写 `*Figure N. 说明文字*`（独立一行、纯斜体）→ 自动渲染为居中图注。
- 块级公式必须 `$$` 独占一行（单行 `$$x$$` 会被渲染成行内公式，这是已知坑）。
- 不写 H1、不写手工目录（站点自动生成题头和侧边 TOC）。
- 行文风格参考已发布文章：讲清动机 → 机制 → 取舍，多用对比表格，节末给一句话结论。

## 第四步：渲染验证（不可跳过）

```bash
cd web-app && npx astro build
grep -c "katex-error" dist/posts/<路径>/index.html   # 必须为 0
npx astro dev --background   # 若 dev server 已在跑且是旧进程，先 astro dev stop
```

用 playwright 截图检查（chromium 用 `channel: 'chrome'` 免下载；脚本模板在 scratchpad 建）：
桌面浅色 + 深色 + 390px 移动端，逐项确认：公式居中、图片显示、视频可加载、宽 ASCII 图在代码块内横向滚动不撑破版面、图注居中。

## 第五步：交付与发布

1. 先把本地预览截图和改动摘要给用户看，**等用户确认后再 push**（写作类内容必须过目，这一点与普通 bugfix 不同）。
2. 确认后：`git add assets/... && git commit && git push`，push 后 `gh run watch` 盯到部署成功，`curl` 验证线上 URL 返回 200，把线上链接交给用户。
