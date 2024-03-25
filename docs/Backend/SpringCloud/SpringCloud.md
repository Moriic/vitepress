## 远程调用

### OpenFeign

#### 使用

```xml
<!--openFeign-->
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
<!--负载均衡器-->
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>
```

**启动类添加注解：`@EnableFeignClients`**

```java
@FeignClient("item-service")
public interface ItemClient {
    @GetMapping("/items")
    List<ItemDTO> queryItemByIds(@RequestParam("ids") Collection<Long> ids);
}
```

```java
List<ItemDTO> items = itemClient.queryItemByIds(List.of(1,2,3));
```

#### 配置

| 类型                | 作用             | 说明                                                   |
| ------------------- | ---------------- | ------------------------------------------------------ |
| feign.Logger.Level  | 修改日志级别     | 包含四种不同的级别：NONE、BASIC、HEADERS、FULL         |
| feign.codec.Decoder | 响应结果的解析器 | http远程调用的结果做解析，例如解析json字符串为java对象 |
| feign.codec.Encoder | 请求参数编码     | 将请求参数编码，便于通过http请求发送                   |
| feign.Contract      | 支持的注解格式   | 默认是SpringMVC的注解                                  |
| feign.Retryer       | 失败重试机制     | 请求失败的重试机制，默认是没有，不过会使用Ribbon的重试 |

- NONE：不记录任何日志信息，这是默认值。
- BASIC：仅记录请求的方法，URL以及响应状态码和执行时间
- HEADERS：在BASIC的基础上，额外记录了请求和响应的头信息
- FULL：记录所有请求和响应的明细，包括头信息、请求体、元数据。

1. 局部生效：可以针对**单个服务**：

```yaml
feign:  
  client:
    config: 
      userservice: # 写具体服务名称,针对某个微服务的配置
        loggerLevel: FULL #  日志级别 
```

2. 全局生效：也可以针对**所有服务**：

```yaml
feign:  
  client:
    config: 
      default: # 使用default为全局配置
        loggerLevel: FULL #  日志级别 
```

#### 扫描包配置

```java
@EnableFeignClients(basePackages = "cn.itcast.feign.clients")
```

```java
@EnableFeignClients(clients = {UserClient.class})
```

#### 优化

- Feign底层发起http请求，依赖于其它的框架。其底层客户端实现包括：
  - URLConnection：默认实现，不支持连接池
  - Apache HttpClient ：支持连接池
  - OKHttp：支持连接池
- 因此提高Feign的性能主要手段就是**使用连接池**代替默认的URLConnection。
- 这里我们用Apache的HttpClient来演示。

```xml
<!--httpClient的依赖 -->
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-httpclient</artifactId>
</dependency>
```

```yml
feign:
  client:
    config:
      default: # default全局的配置
        loggerLevel: BASIC # 日志级别，BASIC就是基本的请求和响应信息
  httpclient:
    enabled: true # 开启feign对HttpClient的支持
    max-connections: 200 # 最大的连接数
    max-connections-per-route: 50 # 每个路径的最大连接数
```

## 注册中心

### 原理

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358913_0.png" alt="image-20230928161027276" style="zoom: 67%;" />

1. **三个角色**

- 服务提供者：暴露服务接口，供其他服务调用
- 服务消费者：调用其他服务提供的接口
- 注册中心：记录并监控微服务各实例状态，推送服务变更信息

2. **流程如下：**

- 服务启动时就会**注册自己的服务信息**（服务名、IP、端口）到**注册中心**
- 调用者可以**从注册中心订阅想要的服务**，获取服务对应的实例列表（1个服务可能多实例部署）

- 调用者自己对实例列表负载均衡，挑选一个实例
- **调用者向该实例发起远程调用**

3. **当服务提供者的实例宕机或者启动新实例时，调用者如何得知呢？**

- **服务提供者**会定期向注册中心**发送请求**，报告自己的健康状态（心跳请求）

- 当注册中心长时间收不到提供者的心跳时，会认为该实例宕机，将其**从服务的实例列表中剔除**
- 当服务有新实例启动时，会**发送注册服务请求**，其信息会被记录在注册中心的服务实例列表

- 当注册中心服务列表变更时，会主动通知微服务，更新本地服务列表

### Nacos注册中心

> https://nacos.io/zh-cn/docs/v2/quickstart/quick-start.html

#### 服务注册

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

```yml
spring:
  application: 
  	name: item-service	# 服务名
  cloud:
    nacos:
      server-addr: localhost:8848 # nacos服务端地址
```

> idea多个port：VM options：-Dserver.port=8083

#### 服务发现

```yml
spring:
  cloud:
    nacos:
      server-addr: 192.168.150.101
```

## 网关

网关的核心功能特性：

- 请求路由、负载均衡：一切请求都必须**先经过**gateway网关，但网关不处理业务，而是根据某种规则，把请求转发到某个微服务，这个过程叫做路由。当然路由的目标服务同时部署多个时，还需要做负载均衡，也就是根据规则具体转发到某个服务。
- 身份认证和权限校验：网关作为微服务入口，需要校验用户是否有请求资格，如果没有则进行拦截。
- 请求限流：当请求流量过高时，在网关中按照下流的微服务能够接受的速度来放行请求，避免服务压力过大。
- 处理跨域：我们可以在网关中统一处理跨域问题，而不必单独在每个项目中处理。

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358914_1.png" alt="665bb74b47be47ed8f75f896d183bdbc" style="zoom:50%;" />

### 使用

```xml
<!--网关-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

```yml
server:
  port: 10010 # 网关端口
spring:
  application:
    name: gateway # 服务名称
  cloud:
    nacos:
      server-addr: localhost:8848 # nacos地址
    gateway:
      routes: # 网关路由配置
        - id: user-service # 路由id，自定义，只要唯一即可
          uri: lb://userservice # 第一种写法：路由的目标地址 lb是指负载均衡，后面跟服务名称
          predicates: # 路由断言，也就是判断请求是否符合路由规则的条件
            - Path=/user/**,/search/** # 这个是按照路径匹配，只要以/user/开头就符合要求
#        可以同时配置多个服务路由
        - id: baidu-demo
          uri: https://www.baidu.com  # 第二种写法：路由的目标地址 http就是固定地址
          predicates:
           - Path=/baidu/** # 注意使用本服务测试需要开启下面截取path，不然拼接的路径无效
#         filters: 
# path断言路由的请求格式默认为uri+path,如果不需要携带path可以截取掉
#           - StripPrefix=1    # 截取掉- Path中的第一级路径/baidu

# 初学期间为了方便调试与快速定位错误，可以将gateway打印日志级别调低
logging:
  level:
    org:
      springframework:
        cloud:
          gateway: trace
```

- 路由配置包括：
  - 路由（id）：路由的唯一标识
  - 路由目标（uri）：路由的目标地址，http代表固定地址，lb代表根据服务名负载均衡
  - 路由断言（predicates）：判断路由的规则
  - 路由过滤器（filters）：对请求或响应做处理

### 过滤器

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358915_2.png" alt="image-20230929161351141" style="zoom: 67%;" />

网关过滤器有两种：

- GatewayFilter：路由过滤器，作用范围灵活，作用于任意指定的路由
- GlobalFilter：全局过滤器，作用范围是所有路由

| **名称**             | **说明**                     |
| -------------------- | ---------------------------- |
| AddRequestHeader     | 给当前请求添加一个请求头     |
| RemoveRequestHeader  | 移除请求中的一个请求头       |
| AddResponseHeader    | 给响应结果中添加一个响应头   |
| RemoveResponseHeader | 从响应结果中移除有一个响应头 |
| RequestRateLimiter   | 限制请求的流量               |
| StripPrefix          | 去除请求中的前缀             |

#### **默认过滤器**

对所有路由都生效

```yml
spring:
  cloud:
    gateway:
      routes:
      - id: user-service 
        uri: lb://userservice 
        predicates: 
        - Path=/user/**
      default-filters: # 默认过滤器
      - AddRequestHeader=Truth, guanzhi is freaking awesome! 
```

#### **路由过滤器**

只对当前路由的请求生效

```yml
spring:
  cloud:
    gateway:
      routes:
      - id: user-service 
        uri: lb://userservice 
        predicates: 
        - Path=/user/** 
        filters: # 路由过滤器
        - AddRequestHeader=Truth, guanzhi is freaking awesome! # 添加请求头
```

####  全局过滤器

```java
@Order(-1)
@Component
public class AuthorizeFilter implements GlobalFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 1.获取请求参数
        MultiValueMap<String, String> params = exchange.getRequest().getQueryParams();
        // 2.获取authorization参数
        String auth = params.getFirst("authorization");
        // 3.校验
        if ("admin".equals(auth)) {
            // 放行
            return chain.filter(exchange);
        }
        // 4.拦截
        // 4.1.禁止访问，设置状态码
        exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
        // 4.2.结束处理
        return exchange.getResponse().setComplete();
    }
}
```

#### 执行顺序

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358916_3.png" alt="745bba7491784914b3579c6f5467e03f" style="zoom:50%;" />

- **order值越小，优先级越高，执行顺序越靠前**。
- 当过滤器的**order值一样时**，会按照 **defaultFilter > 路由过滤器 > GlobalFilter的顺序执行**。
- 继承Ordered接口实现

### 跨域配置

```yml
spring:
  cloud:
    gateway:
      globalcors: # 全局的跨域处理
        add-to-simple-url-handler-mapping: true # 解决options请求被拦截问题
        corsConfigurations:
          '[/**]':
            allowedOrigins: # 允许哪些网站的跨域请求 
              - "http://localhost:8090"
            allowedMethods: # 允许的跨域ajax的请求方式
              - "GET"
              - "POST"
              - "DELETE"
              - "PUT"
              - "OPTIONS"
            allowedHeaders: "*" # 允许在请求中携带的头信息
            allowCredentials: true # 是否允许携带cookie
            maxAge: 360000 # 这次跨域检测的有效期
```

## 配置管理

### 添加配置

通过后台添加配置：**Data ID：必须为 [服务名称]-[profile].[后缀名]**

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358917_4.png" alt="66b3e8f8610d4f9f94891122ead21b43" style="zoom: 67%;" />

### 拉取配置

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358917_5.png" alt="image-20231001171105491" style="zoom: 67%;" />

#### 引入配置

```xml
<!--nacos配置管理依赖-->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
```

#### 新建bootstrap.yaml

```yml
spring:
  application:
    name: userservice # 服务名称
  profiles:
    active: dev # 开发环境，这里是dev 
  cloud:
    nacos:
      server-addr: localhost:8848 # Nacos地址
      config:
        file-extension: yaml # 文件后缀名
```

这里会根据spring.cloud.nacos.server-addr获取nacos地址，再根据

`${spring.application.name}-${spring.profiles.active}.${spring.cloud.nacos.config.file-extension}`作为文件id，来读取配置。

#### 测试

```java
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Value("${pattern.dateformat}")
    private String dateformat;
    
    @GetMapping("now")
    public String now(){
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(dateformat));
    }
}
```

### 配置热更新

- 在@Value注入的变量所在类上添加注解`@RefreshScope`
- 使用`@ConfigurationProperties`注解代替@Value注解。

```java
@Component
@Data
@ConfigurationProperties(prefix = "pattern")
public class PatternProperties {
    private String dateformat;
}
```

## 雪崩问题

微服务调用链路中的某个服务故障，引起整个链路中的所有微服务都不可用

### 解决方案

- 请求限流：限制访问接口的请求的并发量，避免服务因流量激增而出现故障

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358918_6.png" alt="image-20231028201531579" style="zoom: 67%;" />

- 线程隔离：通过限定每个业务能使用的线程数量而将故障业务隔离，避免故障扩散

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358918_7.png" alt="image-20231028201636112" style="zoom: 67%;" />

- 服务熔断：由**断路器**统计请求的异常比例或慢调用比例，如果超出阈值则会**熔断**该业务，则拦截该接口的请求。熔断期间，所有请求快速失败，全都走fallback逻辑。



## Sentinel

> https://sentinelguard.io/zh-cn/

|          | Sentinel                                      | Hystrix                     |
| -------- | --------------------------------------------- | --------------------------- |
| 线程隔离 | 信号量隔离                                    | 线程池隔离/信号量隔离       |
| 熔断策略 | 基于慢调用比例或异常比例                      | 基于异常比率                |
| 限流     | 基于QPS,支持流量整形                          | 有限的支持                  |
| Fallback | 支持                                          | 支持                        |
| 控制台   | 开箱即用,可配置规则、查看秒级监控、机器发现等 | 不完善                      |
| 配置方式 | 基于控制台,重启后失效                         | 基于注解或配置文件,永久生效 |

### 配置安装

Sentinel 的使用可以分为两个部分:

- **核心库**（Jar包）：不依赖任何框架/库，能够运行于 Java 8 及以上的版本的运行时环境，同时对 Dubbo / Spring Cloud 等框架也有较好的支持。在项目中引入依赖即可实现服务限流、隔离、熔断等功能。
- **控制台**（Dashboard）：Dashboard 主要负责管理推送规则、监控、管理机器信息等。

#### 配置控制台

- 运行jar包：`java -Dserver.port=8090 -Dcsp.sentinel.dashboard.server=localhost:8090 -Dproject.name=sentinel-dashboard -jar sentinel-dashboard.jar`
- 访问 `http://localhost:8090/`，默认账号密码 sentinel

#### 微服务整合

```xml
<!--sentinel-->
<dependency>
    <groupId>com.alibaba.cloud</groupId> 
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>
```

```yml
spring:
  cloud: 
    sentinel:
      transport:
        dashboard: localhost:8090
      http-method-specify: true # 开启请求方式前缀
```

簇点链路，就是单机调用链路，是一次请求进入服务后经过的每一个被`Sentinel`监控的资源。默认情况下，`Sentinel`会监控`SpringMVC`的每一个`Endpoint`（接口）。

因此，我们看到`/carts`这个接口路径就是其中一个簇点，我们可以对其进行限流、熔断、隔离等保护措施。

### 请求限流

在簇点链路后面点击流控按钮，即可对其做限流配置：

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358919_8.png" alt="download_image" style="zoom: 50%;" />

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358920_9.png" alt="无标题" style="zoom:50%;" />

### 线程隔离

#### OpenFeign整合Sentinel

```yml
feign:
  sentinel:
    enabled: true # 开启feign对sentinel的支持
```

可以看到查询商品的FeignClient自动变成了一个簇点资源：

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358920_10.png" alt="无标题" style="zoom: 50%;" />

#### 配置线程隔离

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358921_11.png" alt="无标题" style="zoom:50%;" />

### Fallback

触发限流或熔断后的请求不一定要直接报错，也可以返回一些默认数据或者友好提示，用户体验会更好。

给FeignClient编写失败后的降级逻辑有两种方式：

- 方式一：FallbackClass，无法对远程调用的异常做处理
- 方式二：FallbackFactory，可以对远程调用的异常做处理，我们一般选择这种方式。

#### 配置实现

对于ItemClient的远程调用进行降级逻辑实现

```java
@Slf4j
public class ItemClientFallback implements FallbackFactory<ItemClient> {
    @Override
    public ItemClient create(Throwable cause) {
        return new ItemClient() {
            @Override
            public List<ItemDTO> queryItemByIds(Collection<Long> ids) {
                log.error("远程调用ItemClient#queryItemByIds方法出现异常，参数：{}", ids, cause);
                // 查询购物车允许失败，查询失败，返回空集合
                return CollUtils.emptyList();
            }

            @Override
            public void deductStock(List<OrderDetailDTO> items) {
                // 库存扣减业务需要触发事务回滚，查询失败，抛出异常
                throw new BizIllegalException(cause);
            }
        };
    }
}
```

配置DefaultFeignConfig类

![无标题](https://raw.githubusercontent.com/Moriic/picture/main/image/1711358922_12.png)

配置ItemClinet

![无标题](https://raw.githubusercontent.com/Moriic/picture/main/image/1711358923_13.png)

### 服务熔断

![image-20231029145821091](https://raw.githubusercontent.com/Moriic/picture/main/image/1711358924_14.png)

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358925_15.png" alt="无标题" style="zoom: 67%;" />

这种是按照慢调用比例来做熔断，上述配置的含义是：

- RT超过200毫秒的请求调用就是慢调用
- 统计最近1000ms内的最少5次请求，如果慢调用比例不低于0.5，则触发熔断
- 熔断持续时长20s

## 分布式事务

### senta

> https://seata.io/zh-cn/

Seata也不例外，在Seata的事务管理中有三个重要的角色：

-  **TC (Transaction Coordinator)-事务协调者：**维护全局和分支事务的状态，协调全局事务提交或回滚。 
-  **TM (Transaction Manager)-事务管理器：**定义全局事务的范围、开始全局事务、提交或回滚全局事务。 
-  **RM (Resource Manager)-资源管理器：**管理分支事务，与TC交谈以注册分支事务和报告分支事务的状态，并驱动分支事务提交或回滚。 

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358926_16.png" alt="无标题" style="zoom:67%;" />

其中，**TM**和**RM**可以理解为Seata的客户端部分，引入到参与事务的微服务依赖中即可。将来**TM**和**RM**就会协助微服务，实现本地分支事务与**TC**之间交互，实现事务的提交或回滚。

而**TC**服务则是事务协调中心，是一个独立的微服务，需要单独部署。

### 部署TC服务

### 微服务集成Seata

```xml
<!--统一配置管理-->
<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>
<!--读取bootstrap文件-->
<dependency>
  <groupId>org.springframework.cloud</groupId>
  <artifactId>spring-cloud-starter-bootstrap</artifactId>
</dependency>
<!--seata-->
<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-starter-alibaba-seata</artifactId>
</dependency>
<!--sentinel-->
<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>
```

### 改造配置

首先在nacos上添加一个共享的seata配置，命名为`shared-seata.yaml`

```yml
seata:
  registry: # TC服务注册中心的配置，微服务根据这些信息去注册中心获取tc服务地址
    type: nacos # 注册中心类型 nacos
    nacos:
      server-addr: 192.168.150.101:8848 # nacos地址
      namespace: "" # namespace，默认为空
      group: DEFAULT_GROUP # 分组，默认是DEFAULT_GROUP
      application: seata-server # seata服务名称
      username: nacos
      password: nacos
  tx-service-group: hmall # 事务组名称
  service:
    vgroup-mapping: # 事务组与tc集群的映射关系
      hmall: "default"
```

