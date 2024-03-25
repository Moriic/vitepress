## 基础

### 读取配置

```java
@Value("${country}")
private String country1;

@Value("${likes[1].age}")
private String age;

// 使用自动装配可用读取所有数据到env中
@Autowired
private Environment env;

public String get(){
    env.getProperty("country");
}	
```

```yml
country: china

likes:
 -
  name: zhangsan
  age: 12
 -
  name: lisi
  age: 22
  
baseDir: c:\win10

tempDir: ${baseDir}\temp
# 使用引号，可用生成转义字符 \t 即 tab
tempDir: "${baseDir}\temp \t1 \t2 \t3"
```

### @ConfigurationProperties

定义配置类

```java
@Component
@ConfigurationProperties(prefix = "sky.jwt")
@Data
public class JwtProperties {
    private String adminSecretKey;
    private long adminTtl;
    private String adminTokenName;
}
```

```yml
sky:
  jwt:
	admin-secret-key: itcast
    admin-ttl: 7200000
    admin-token-name: token
```

@Autowire 获取配置

```java
@Autowire
private JwtProperties jwtProperties;
```

