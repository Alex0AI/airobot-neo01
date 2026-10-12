<div align="center">

# AIROBOT NEO-01 · NOVA
### Give intelligence a body. 让智能拥有身体。

面向 Physical AI 开发者的个人机器人平台

[产品官网](https://alex0ai.github.io/airobot-neo01/) · [开发者蓝图](https://alex0ai.github.io/airobot-neo01/developers.html) · [参与讨论](https://github.com/Alex0AI/airobot-neo01/issues) · [素材说明](https://alex0ai.github.io/airobot-neo01/media.html)

**阶段：Concept → Prototype · 网站与文档已发布 · 机器人 SDK 规划中**

</div>

---

AIROBOT / 爱宝智能正在探索面向 Physical AI 开发者的个人机器人平台。

产品网站：https://alex0ai.github.io/airobot-neo01/

## 当前状态

这是产品定义与开发架构蓝图，不是已发布的机器人 SDK。硬件、软件、价格和交付时间尚未定版。不要将参考视频解释为 AIROBOT 实机能力。

## 规划架构

| 模块 | 计划职责 | 状态 |
| --- | --- | --- |
| neo-core | 设备服务、遥测、运动安全与策略运行 | 规划中 |
| neo-sdk | Python 接口和 ROS 2 桥接 | 规划中 |
| neo-sim | 仿真模型、训练任务与评估 | 规划中 |
| neo-skills | 动作技能、策略和示例 | 规划中 |
| neo-hardware | 机构、电路、BOM 与装配文档 | 规划中 |

## 开发循环

定义任务 → 构建仿真 → 训练策略 → 硬件验证 → 采集反馈 → 迭代。

Agent 层表达任务意图，技能层处理动作组合，运动层负责有边界的执行。接口与安全机制将在样机验证后确定。

## 现在可以运行什么？

本仓库提供静态产品网站。网站不依赖第三方 JS 包。

```bash
python -m http.server 8000 --directory docs
```

打开 http://localhost:8000 。尚无可安装的 AIROBOT SDK；未提供虚构的 pip 安装命令。

## 路线图

- [x] 产品概念与网站
- [x] 开发者架构说明
- [ ] 首台样机验证
- [ ] 第一方实机图片与演示视频
- [ ] Python SDK alpha
- [ ] 仿真模型与评估任务
- [ ] ROS 2 桥接
- [ ] 硬件与装配文档

## 参考与媒体

参考项目：
- [XGO-Duck / 陆吾智能](https://www.xgorobot.com/duck.html)
- [Microduck / Pollen Robotics](https://pollen-robotics.com/microduck/)
- [Microduck 开源仓库](https://github.com/pollen-robotics/microduck)

网页图片与视频通过官方 URL 引用 Microduck 素材，非 AIROBOT 实机。素材权利属于原权利人，来源标注不构成授权或品牌背书。发布者应确认展示用途与权利条件。替换媒体仅需编辑 docs/media-config.js，并更新画面说明。

## 参与开发

当前优先方向：机械与硬件验证、运动控制、机器人仿真、开发者体验。提交变更时说明目标、验证方法与限制。请勿提交第三方受限素材、凭证或未经验证的性能宣称。

## 许可

AIROBOT 项目开源许可尚未确定；第三方项目及媒体保留各自许可。不要将本规划视为第三方代码的重新许可。
