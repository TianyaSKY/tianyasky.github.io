const uploadFigure = {
  src: "/projects/sky-douyin/upload-and-indexing.png",
  caption: "从视频分片上传到 RabbitMQ 异步生成向量并写入 Milvus",
  kind: "diagram"
};

const recommendationFigure = {
  src: "/projects/sky-douyin/cold-start-and-feed.png",
  caption: "注册兴趣向量冷启动，以及热门与向量候选汇合进入 Feed",
  kind: "diagram"
};

export const skyDouyinDetail = {
  gallery: [uploadFigure, recommendationFigure],
  caseFigures: {
    method: uploadFigure,
    results: recommendationFigure
  },
  highlights: [
    "发布链路：支持前端计算文件哈希、分片上传与断点续传；创建视频元数据后异步生成向量，写入 Milvus 后更新发布状态",
    "行为反馈：Web 端与 Android 端统一上报播放、停留时长和点赞事件，驱动下一次推荐刷新",
    "冷启动处理：按分类标签预先聚合视频特征，新用户注册时根据所选兴趣计算均值作为初始画像",
    "服务解耦：业务服务（Spring Boot）、推荐服务（FastAPI）与底层存储分层部署，边界清晰"
  ],
  background: "不少推荐系统的实验项目往往只写了一个算法接口，或者直接从数据库查几条测试数据。但在实际场景中，从用户上传视频、后台转码与特征提取，到客户端播放、停留、点赞等行为数据的实时采集，再到下一次刷新时的召回与排序，整条链路是环环相扣的。做这个项目的初衷是完整实现一个短视频全栈原型（MVP），把从发布到基于用户行为做推荐的闭环切实跑顺。",
  method: "前端开发了 Web（React 18）与 Android 两个客户端，负责视频流播放与分片上传；业务后端采用 Spring Boot 3 + MySQL 维护用户、视频元数据及点赞关系，Redis 处理点赞计数与状态缓存。创建视频元数据后通过 RabbitMQ 发送异步事件，由 FastAPI 推荐服务调用模型生成内容向量并写入 Milvus 向量库，入库成功后更新待发布视频的状态。针对新用户冷启动，定期汇总各分类已有视频的标签向量，用户注册时勾选兴趣即可取均值作为初始偏好；整套环境可通过 Docker Compose 统一部署。",
  results: "目前跑通了用户注册登录、兴趣选择、视频分片上传、沉浸式刷视频、点赞与取消点赞、行为日志采集、以及基于向量相似度召回的推荐流程。Web 端和手机端均能正常交互，推荐服务和业务服务相互解耦，可以单独修改召回策略或接入新的模型进行实验。",
  reflection: "当前版本重点在于先把整套业务与数据链路打通，所以推荐逻辑主要以向量相似度召回加热门保底为主，还没有接入复杂的重排模型。后续如果继续演进，应该先把埋点上报的可靠性、消息重试与去重机制做扎实，再考虑补充离线评测集以及引入更细致的排序策略，把底层数据基础打牢更稳妥。",
  links: {
    github: "https://github.com/TianyaSKY/SKYDouyin"
  },
  featured: false
};

export default skyDouyinDetail;
