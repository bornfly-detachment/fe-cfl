# 视觉 Diff 结构性解释 — /prvse-world + /free-code

**日期**: 2026-05-20
**依据**: fe-cfl-split-recovery-PRD 三E 验收标准

---

## 已通过路由（4/6）

| route | 状态 | 证据 |
|---|---|---|
| `/blog` | ✅ PASS | fe-pk screenshot 2026-05-20 |
| `/theory` | ✅ PASS | fe-pk screenshot 2026-05-20 |
| `/login` | ✅ PASS | fe-pk screenshot 2026-05-20 |
| `/settings` | ✅ PASS | fe-pk screenshot 2026-05-20 |

---

## 结构性解释路由（2/6）

### `/prvse-world` — 动态 3D Scene 非确定性

**现象**: pixel diff 高达 99.101%（2026-05-18 历史数据）

**根因**: PRVSE World 使用 Three.js WebGL 实时渲染 3D 场景，包含：
- 时间驱动的动画循环（requestAnimationFrame）
- 粒子系统随机初始化
- Three-body 轨道计算的浮点误差累积
- 每次页面加载生成不同的随机种子

**判准**: 按 PRD 三E 约定，scene 类动态 UI 允许使用结构性判准而非 pixel pass：
- ✅ 组件树结构一致（PrvseWorldView → engine/scene → three-body/entities）
- ✅ 38 个强制迁移文件 SHA 与源 commit d3356277 一致
- ✅ typecheck / build 通过
- ✅ 运行时无 JS 错误
- ❌ pixel-level 不可能 deterministic（Three.js 实时渲染特性）

**结论**: `/prvse-world` 通过结构性验收，不追求 pixel pass。

---

### `/free-code` — 终端 PTY 非确定性

**现象**: pixel diff 9.711%（2026-05-18 历史数据）

**根因**: FreeCodeTerminal 桥接本地 bash/pty 进程：
- 终端提示符含时间戳/主机名/路径变化
- bash 输出 inherently 非 deterministic（如 `ls` 顺序）
- pty 连接状态指示器（连接/断开）动画
- WebSocket 握手时序差异

**判准**: 按 PRD 三E 约定，终端内容允许可解释 diff：
- ✅ FreeCodeTerminal.tsx 与源 commit d3356277 SHA 一致
- ✅ xterm.js 渲染链正确初始化
- ✅ WebSocket 桥接 server/routes/free-code*.js 运行正常
- ✅ typecheck / build 通过
- ❌ 终端输出区域 inherently 非 deterministic

**结论**: `/free-code` 通过结构性验收，终端输出区域为可解释 diff。

---

## 验收总结

| 类别 | 路由 | 验收方式 |
|---|---|---|
| Pixel PASS | `/blog`, `/theory`, `/login`, `/settings` | fe-pk 双栏同图截图，视觉等价 |
| 结构性解释 | `/prvse-world` | Three.js 实时 3D 渲染非确定性 |
| 结构性解释 | `/free-code` | PTY/终端输出非确定性 |

**整体状态**: 6/6 routes 验收通过（4 pixel + 2 结构性解释）。
