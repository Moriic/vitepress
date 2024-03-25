## Eureka

### 简介

实现服务调用、负载均衡、容错等，实现服务发现和注册

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358871_0.png" alt="d3f8be3d316a4b5fa8a154f95dc7d856" style="zoom:50%;" />

- 各个微服务节点启动后，会在EurekaServer中进行注册，保存了服务名称到服务实例地址的映射关系
- ServiceConsumer根据服务名称，向Eureka拉取实例地址，有多个实例地址时，会使用负载均衡来选择
- ServiceProvider间隔30秒会向EurekaServer发送心跳，若多个心跳周期未收到会移除该实例地址

### 使用

1. 搭建Eureka：引入依赖 -> 配置启动类 -> 编写配置文件
2. 服务注册：引入依赖 -> 配置文件
3. 服务发现：引入依赖 -> 配置文件

**eureka-server**

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>

```

```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaApplication.class, args);
    }
}
```

```yml
server:
  port: 10086 # 服务端口
spring:
  application:
    name: eureka-server # eureka的服务名称 
eureka:
  client:
    service-url:  # eureka的地址信息
      defaultZone: http://127.0.0.1:10086/eureka
```

**ServiceProvider**

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

```yml
spring:
  application:
    name: userservice # user服务的服务名称
eureka:
  client:
    service-url: # euraka的地址信息
      defaultZone: http://127.0.0.1:10086/eureka
```

> 启动多个服务可用，复制 Configuration 并在 VM options 中配置 -Dserver.port = 8082

**ServiceConsumer**

前两步同样为引入依赖 + 配置文件

服务拉取,远程调用

```java
// "http://localhost:8081/user/" + id
String url = "http://userservice/user/" + Id;
User user = restTemplate.getForObject(url,User.class);
```

负载均衡 @LoadBalanced

```java
@Bean
@LoadBalanced
public RestTemplate restTemplate() {
    return new RestTemplate();
}
```

## Ribbon负载均衡

