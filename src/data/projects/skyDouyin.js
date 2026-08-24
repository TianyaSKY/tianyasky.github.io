export const skyDouyinDetail = {
  gallery: [
    "/projects/sky-douyin/01.svg",
    "/projects/sky-douyin/02.svg"
  ],
  highlights: [
    "上传发布链：前端计算文件哈希，依次完成初始化、分片、合并与元数据创建，再异步生成视频 Embedding 写入 Milvus",
    "推荐链路：热门候选与向量候选共同进入 Feed；React 页面与 Android 客户端统一上报播放、停留、点赞等用户行为",
    "冷启动建模：按已发布视频标签聚合向量并缓存到 Redis，新用户注册时对所选标签求均值，生成第一版兴趣向量",
    "一致性设计：点赞关系以 user_video_relations 真相表保证幂等，业务服务、推荐服务与消息消费各自保留清晰边界"
  ],
  background: "推荐系统最容易被简化成一个“猜你喜欢”接口，但真正的难点分散在上传、内容入库、行为采集、特征更新、候选召回和客户端反馈之间。这个项目以可运行的短视频 MVP 为目标，不跳过任何关键链路：先让一条视频可靠发布，再让一次用户行为可靠流动，最后让这些数据真正影响下一次 Feed。",
  method: "前端使用 React 18，Android 端负责移动播放与上传；Spring Boot 3 + MyBatis-Plus 维护用户、视频和关系数据，MySQL 保存业务真相，Redis 承担热点状态和标签向量缓存。视频发布后由 RabbitMQ 投递 event.video_embedding，消费者调用 FastAPI 推荐服务，经 PyTorch / DashScope 生成向量并写入 Milvus。注册冷启动则定时聚合管理员已发布视频的标签向量，用户勾选兴趣后取均值作为初始画像；Docker Compose 统一拉起 MySQL、Redis、RabbitMQ、Milvus 与 Attu。",
  results: "当前仓库已经打通注册与登录、兴趣选择、视频分片上传、审核发布、沉浸式 Feed、点赞幂等、个人主页、行为上报和向量入库等端到端路径，并同时保留 Web 与 Android 两类客户端。推荐服务、业务服务和基础设施可以分别启动和测试，使它不只是界面原型，而是一套可继续替换召回与排序策略的完整实验底座。",
  reflection: "该版本明确定位为 MVP：它先验证数据能否从客户端稳定流向画像和召回，而不是提前追求复杂排序模型。继续迭代时，优先级应是补齐离线评测集、曝光与转化归因、消费者幂等和失败重放，再比较多路召回权重或引入学习排序；否则模型指标很容易建立在不可靠的事件数据之上。",
  links: {
    github: "https://github.com/TianyaSKY/SKYDouyin"
  },
  featured: false
};

export default skyDouyinDetail;
