# NetWork

## 基础



## HTTP

### HTTP/1.1

1. **长连接**：完成一次请求后保持连接
2. **管道网络传输**：不需要等待前一个请求的响应到达，可以发送第二次请求(不是默认开启)
3. **队头阻塞**：前一个请求被阻塞时，后面的请求会被阻塞(没有管道传输)

### HTTP/2.0

1. **头部压缩**：使用静态表, Huffman 编码和动态表替换固定字段
2. **二进制格式**：头信息和数据都是用二进制，称为帧，压缩长度
3. **并发传输**：

- 1 个 TCP 连接包含多个 Stream
- Stream 里可以包含 1 个或多个 Message，Message 对应 HTTP/1 中的请求或响应，由 HTTP 头部和包体构成
- Message 里包含一条或者多个 Frame，Frame 是 HTTP/2 最小单位，以二进制压缩格式存放
- 一个 HTTP 请求在同一个 Stream 中
- 不同 Stream 可以乱序发送，通过 StreamID 有序组装成 HTTP 消息，同一 Stream 内的帧必须有序

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1729610774_0.webp" alt="image-20240105143239921" style="zoom:50%;" />

4. **服务器主动推送资源**：在 Stream1 通知在哪个 Stream 中推送资源

5. **队头阻塞**：TCP 需要保证收到的字节数据是连续的，当前一个字节数据没有到达时，后一个字节数据只能存放在内核缓冲区中，应用层无法接收

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1729611079_0.webp" alt="http2阻塞" style="zoom:50%;" />

### HTTP/3.0

1. **无队头阻塞**：使用 QUIC 协议，某个流丢包时，只会阻塞这个流，其他流不会受到影响
2. **更快的建立连接**

### HTTP 状态码

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1729656042_0.webp" alt="6-五大类HTTP状态码" style="zoom:50%;" />

### HTTP 常见字段

- Host 字段：指定服务器的域名
- Content-Length 字段：指定数据长度，HTTP 通过设置回车作为 Header 的边界，通过 Content-Length 作为 HTTP body 的边界，解决粘包问题
- Connection：Keep-Alive 使用 HTTP 长连接

### GET / POST 区别

- GET 用来从服务器获取指定的资源
- POST 根据请求负载对指定的资源做出处理
- GET 方法是幂等的，POST 是不安全，不幂等的

### 缓存技术

分为强制缓存和协商缓存

### HTTP 和 HTTPS 区别

- HTTP 是明文传输，存在安全问题，HTTPS 在 TCP 和 HTTP 网络层之间加入了 SSL/TLS 安全协议，使报文加密传输
- HTTP 建立只需要 TCP 三次握手，HTTPS 三次握手后还需要 SSL/TLS 握手
- HTTP 端口是 80，HTTPS 是 443
- HTTPS 需要向 CA 申请数字证书，保证服务器身份可信

### HTTPS 过程

- 公钥加密，私钥解密：保证内容传输的安全
- 私钥加密，公钥解密：保证消息不会被冒充
- 通过哈希算法保证消息的完整性
- 通过数字签名(私钥加密，公钥解密)比对哈希值保证消息的来源可靠性
- 通过数字证书来保证服务器公钥的身份(确保公私钥不是伪造的)

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1729658111_0.webp" alt="数字签名" style="zoom:50%;" />

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1729658126_0.webp" alt="22-数字证书工作流程" style="zoom:50%;" />

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1729658230_0.webp" alt="23-HTTPS工作流程" style="zoom:50%;" />

### HTTP 和 RPC

HTTP 主要用于 B/S 架构，而 RPC 更多用于 C/S 架构，内部集群的微服务之间则采用 RPC 协议进行通讯

## 四次挥手

### TCP 连接除了四次挥手断开外，还有什么断开连接的方式？

- 如果主机需要尽快关闭连接（或连接超时，或端口、主机不可达）时，发送 RST 包（RST 表示复位）强制关闭 TCP 连接。

- 发送 RST 包关闭连接时，可以丢弃缓存区的包直接发送 RST 包，而接收端收到 RST 包后，也不必发送 ACK 包来确认。