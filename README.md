# 🚀 英语逻辑 3D 认知空间引擎 (v1.0 稳定版)

这是一个基于**认知语言学 (Cognitive Linguistics)** 和 **生成语法 (Generative Grammar)** 理论开发的英语造句模拟器。它通过 3D/2D 视觉图形，还原英语母语者在大脑中 0.1 秒产生句子的认知建模过程。

## 🌟 核心特性

- **NLP 认知大脑**：通过 Python `spaCy` 深度学习模型，实时解析任意英语句子的语法结构。
- **5 步认知建模**：
    1. **确立原点 (Trajector)**：识别主语及其性质。
    2. **划定疆域 (Epistemic Domain)**：区分现实域 (Fact) 与非现实域 (Modality)。
    3. **打上时间戳 (Temporal Grounding)**：定位时间轴（过去 vs 现在）。
    4. **事件底色 (Action Chain)**：选择核心能量模式 (Be / Do / Have)。
    5. **空间界标 (Landmark)**：确定动作的落点或状态的依附。
- **稳定视觉引擎**：采用高性能 CSS 3D 渲染，确保在各种浏览器环境下都能平滑运行。
- **本地 Web 托管**：内置 FastAPI 服务器，一键启动。

## 🛠 快速开始

### 1. 环境准备

确保已安装 Python 3.8+，并安装依赖：

```bash
pip install fastapi uvicorn spacy pydantic
python -m spacy download en_core_web_sm
```

### 2. 启动程序

在项目根目录下运行：

```bash
python backend.py
```

### 3. 开始体验

浏览器访问：`http://localhost:8000`

## 📖 理论背景

本项目参考了 **乔姆斯基 (Noam Chomsky)** 的“普遍语法”和 **朗盖克 (Ronald Langacker)** 的“认知文法”模型，旨在通过视觉化手段降低英语学习者的认知负荷，建立直觉化的语感算法。

---
*Created by Antigravity AI*
