## 概念

1. 认证(Authentication)：相当于登录
2. 授权(authorization)：不同的用户授予不同的权限
3. RBAC(Role-Based Access Control)：基于角色的访问控制

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358946_0.png" alt="image-20230921222831934" style="zoom:50%;" />

- 把权限打包给角色(角色拥有一组权限)，分配给用户
- 数据库设计：最少包括五张表(用户表，角色表，用户角色表，权限表，角色权限表)

## 入门

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

### 配置用户信息及加密方式

```java
@Configuration
public class SecurityConfig {

    // 添加用户
    @Bean
    public UserDetailsService userDetailService(){
        UserDetails user = User.builder()
                .username("admin")
                .password(passwordEncoder().encode("123456"))
                .authorities("teacher:delete")
                .build();
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(user);
        return manager;
    }

    // 配置加密方式
    @Bean
    public static PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
```

### 获取用户信息

```java
@RequestMapping("/hello")
public Principal hello(){
    return SecurityContextHolder.getContext().getAuthentication();
}
```

## 认证

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358947_1.jpg" alt="a7" style="zoom:50%;" />

### 原理

SpringSecurity的原理其实就是一个过滤器链，内部包含了提供各种功能的过滤器。例如快速入门案例里面使用到的三种过滤器，如下图 **认证 -> 异常处理 -> 授权**

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358948_2.png" alt="a11" style="zoom: 67%;" />

- UsernamePasswordAuthenticationFilter: 负责处理我们在登陆页面填写了用户名密码后的登陆请求。入门案例的认证工作主要由它负责

- ExceptionTranslationFilter：处理过滤器链中抛出的任何AccessDeniedException和AuthenticationException

- FilterSecurityInterceptor：负责权限校验的过滤器

### 认证流程

![image-20230918002031145](https://raw.githubusercontent.com/Moriic/picture/main/image/1711358949_3.png)

- Authentication接口: 它的实现类，表示当前访问系统的用户，封装了用户相关信息
- AuthenticationManager接口：定义了认证Authentication的方法
- UserDetailsService接口：加载用户特定数据的核心接口。里面定义了一个根据用户名查询用户信息的方法
- UserDetails接口：提供核心用户信息。通过UserDetailsService根据用户名获取处理的用户信息要封装成UserDetails对象返回。然后将这些信息封装到Authentication对象中

### 自定义认证

1. 调用ProviderManager方法进行认证，认证通过生成jwt并将(token,用户信息)存入Redis
2. 自定义UserDetailService，从数据库中查询用户
3. 定义jwt认证过滤器，获取token中的userid，从redis获取信息，存入SecurityContextHolder



## 授权