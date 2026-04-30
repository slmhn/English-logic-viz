# 英语逻辑 3D 认知空间引擎

> 用视觉化手段重建英语母语者的认知建模过程——从情态思维到现实凝固的完整创世流程。

---

## 🆕 v2.3 — 英语创世流程 (English Creation Flow)

**路径：** `creation_flow/`  
**启动：** `python -m http.server 7788` 然后访问 `http://localhost:7788`

### 核心理论

英语时态-情态系统被建模为一个**二维拓扑空间**中的"创世流程"：

| 轴 | 含义 |
|---|---|
| **X 轴** | 时间：Past ← NOW → Future |
| **Y 轴** | 现实度：↓ Realis/已坍缩 · ↑ Irrealis/未坍缩 |

**5步创世流程：**
1. **混沌** — 情态空间 (might / could / may)，事件悬浮于可能性中
2. **评估可行性** — can / must / should，条件门是否敞开
3. **意志锚定** — will / be going to，从可能中抓取未来
4. **降临现实** — is doing / NOW，事件穿越坍缩边界
5. **历史凝固** — made / had made，结晶为不可更改的历史地层

**关键洞见：** 情态过去式形态（would / could have / might have）是**垂直于 NOW 的上方空间**，而非水平时间轴上的"过去"——它们标记的是说话者与命题之间的心理距离，不是时间距离。

### 交互功能
- 🖱 拖拽旋转 / 滚轮缩放 / 右键平移
- 点击底部 5 步流程按钮，摄像机平滑移动到对应区域
- 悬停任意节点，弹出详情卡（含中英解释）

---

## v2.0 — 3D 四象限逻辑空间

**路径：** `3d_room/`

基于 Three.js 的四象限模型，以 Subject/Trajector（主语原点）为中心，在四个空间象限中展示英语时态的认知维度。

---

## v1.0 — NLP 认知引擎（稳定版）

**路径：** 根目录 (`index.html` + `backend.py`)

基于 **认知语言学** 和 **生成语法** 理论的英语造句模拟器，通过 `spaCy` 深度学习模型实时解析句子，还原 5 步认知建模过程。

### 快速开始

```bash
pip install fastapi uvicorn spacy pydantic
python -m spacy download en_core_web_sm
python backend.py
# 访问 http://localhost:8000
```

---

## 📖 理论背景

本项目参考：
- **乔姆斯基 (Noam Chomsky)** — 普遍语法
- **朗盖克 (Ronald Langacker)** — 认知文法
- **可能世界语义学 (Possible World Semantics)** — 情态动词的形式化分析框架

---
*Created by Antigravity AI*
