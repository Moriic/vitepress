## 字节 一面

1. 双 token 优点
2. 前端轮询方法，websocket
3. 优化大量数据
4. Redis：
   1. 缓存一致性
   2. db是分布式的话如何保证一致性
   3. 缓存击穿：分布式锁
5. Rabbitmq：场景，消息失败ack，一直回调问题
6. Mysql：索引最左匹配：a=0&&b=0 / a=0&&b>0
7. 订单库存分布式，事务

8. 计算机网络：
   1. TCP可靠：序列号
   2. 第二次握手失效
   3. 第三次传完后会立马发送数据吗

## oppo 一面

深挖项目：

1. docker 判题：只支持输出流，只支持java包，不支持第三方包
2. 外卖：宕机后无法支付回调怎么解决
3. 同步/异步
4. 支付并发问题：sychronized，分布式锁 setnx
5. 使用 websocket 通知，如果是多机器如何保证通知到所有 Session
6. JVM内存模型，问了什么JMM，happen-before
7. IO 多路复用：epoll 和 select，边缘触发，水平触发
8. 快速排序，归并排序，时间空间复杂度，稳定性