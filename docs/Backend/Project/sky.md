> TODO：AOP，annotation, invoke, JWTUnits, HttpClientUnit

## 项目准备

### 项目结构

| pojo 包 | 说明                           |
| ------ | ------------------------------ |
| Entity | 实体，与数据库的表对应         |
| DTO    | 数据传输对象，接收前端数据对象 |
| VO     | 视图对象，返回前端数据对象     |

### 完善登录

将数据库的密码进行 md5 加密，登录时进行加密后再与数据库对比

```java
password = DigestUtils.md5DigestAsHex(password.getBytes());
if (!password.equals(employee.getPassword())) {
    //密码错误
    throw new PasswordErrorException(MessageConstant.PASSWORD_ERROR);
}
```

### knife4j 生成接口文档

```xml
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>knife4j-spring-boot-starter</artifactId>
    <version>${knife4j}</version>
</dependency>
```

```java
@Configuration
@Slf4j
public class WebMvcConfiguration extends WebMvcConfigurationSupport {
    /**
     * 通过knife4j生成接口文档
     * @return
     */
    @Bean
    public Docket docket() {
        ApiInfo apiInfo = new ApiInfoBuilder()
                .title("苍穹外卖项目接口文档")
                .version("2.0")
                .description("苍穹外卖项目接口文档")
                .build();
        Docket docket = new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.sky.controller"))
                .paths(PathSelectors.any())
                .build();
        return docket;
    }

    /**
     * 设置静态资源映射
     * @param registry
     */
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/doc.html").addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
    }
}
```

### 常用注解

| 注解              | 说明                                                   |
| ----------------- | ------------------------------------------------------ |
| @Api              | 用在类上，例如 Controller                               |
| @ApiOperation     | 用在方法上，例如 Controller 的方法，说明方法的用途，作用 |
| @ApiModel         | 用在类上，例如 entity, DTO, VO                            |
| @ApiModelProperty | 用在属性上，描述属性信息                               |

## 新增员工

### 拷贝属性

`BeanUtils.copyProperties(Object source,Object target);`

### 异常处理

员工用户名重复全局异常处理

```java
@ExceptionHandler
public Result exceptionHandler(SQLIntegrityConstraintViolationException ex){
    String message = ex.getMessage();
    if(message.contains("Duplicate entry")){
        String[] split = message.split(" ");
        String username = split[2];
        String msg = username + MessageConstant.ALREADY_EXISTS;
        return Result.error(msg);
    }else {
        return Result.error(MessageConstant.UNKNOWN_ERROR);
    }
}
```

### ThreadLocal

每个线程提供一份存储空间

| ThreadLocal 常用方法      | 说明                     |
| ------------------------ | ------------------------ |
| public void set(T value) | 设置当前线程局部变量的值 |
| public T get()           | 返回当前线程局部变量的值 |
| public void remove()     | 移除当前线程局部变量的值 |

```java
public class BaseContext {
    public static ThreadLocal<Long> threadLocal = new ThreadLocal<>();

    public static void setCurrentId(Long id) {
        threadLocal.set(id);
    }

    public static Long getCurrentId() {
        return threadLocal.get();
    }

    public static void removeCurrentId() {
        threadLocal.remove();
    }
}
```

检验令牌时将 id 存入：`BaseContext.*setCurrentId*(empId);`

再 server 层插入员工时设置 id：`employee.setCreateUser(BaseContext.*getCurrentId*());` 

### 日期格式化

1. 使用注解对属性值格式化

```java
@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
private LocalDateTime createTime;
```

2. 为 SpringMVC 扩展一个消息转换器

 JacksonObjectMapper 类

```java
/**
 * 对象映射器:基于jackson将Java对象转为json，或者将json转为Java对象
 * 将JSON解析为Java对象的过程称为 [从JSON反序列化Java对象]
 * 从Java对象生成JSON的过程称为 [序列化Java对象到JSON]
 */
public class JacksonObjectMapper extends ObjectMapper {

    public static final String DEFAULT_DATE_FORMAT = "yyyy-MM-dd";
    //public static final String DEFAULT_DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public static final String DEFAULT_DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm";
    public static final String DEFAULT_TIME_FORMAT = "HH:mm:ss";

    public JacksonObjectMapper() {
        super();
        //收到未知属性时不报异常
        this.configure(FAIL_ON_UNKNOWN_PROPERTIES, false);

        //反序列化时，属性不存在的兼容处理
        this.getDeserializationConfig().withoutFeatures(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

        SimpleModule simpleModule = new SimpleModule()
                .addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(DateTimeFormatter.ofPattern(DEFAULT_DATE_TIME_FORMAT)))
                .addDeserializer(LocalDate.class, new LocalDateDeserializer(DateTimeFormatter.ofPattern(DEFAULT_DATE_FORMAT)))
                .addDeserializer(LocalTime.class, new LocalTimeDeserializer(DateTimeFormatter.ofPattern(DEFAULT_TIME_FORMAT)))
                .addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(DateTimeFormatter.ofPattern(DEFAULT_DATE_TIME_FORMAT)))
                .addSerializer(LocalDate.class, new LocalDateSerializer(DateTimeFormatter.ofPattern(DEFAULT_DATE_FORMAT)))
                .addSerializer(LocalTime.class, new LocalTimeSerializer(DateTimeFormatter.ofPattern(DEFAULT_TIME_FORMAT)));

        //注册功能模块 例如，可以添加自定义序列化器和反序列化器
        this.registerModule(simpleModule);
    }
}
```

```java
@Configuration
@Slf4j
public class WebMvcConfiguration extends WebMvcConfigurationSupport {
    /**
     * 扩展Spring MVC消息转换器
     * @param converters
     */
  protected void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        //创建一个消息转换器对象
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        //为消息转换器设置一个对象转换器，对象转换器可以将Java对象转换为Json数据
        converter.setObjectMapper(new JacksonObjectMapper());
        //将消息转换器加入容器中
        converters.add(0,converter);
    }
}
```

## 启用禁用员工

创建实体类可以使用 build，Employee 类上添加注解@Build

```java
Employee employee = Employee.builder()
        .status(status)
        .id(id)
        .build();
```

update 使用动态 sql 以便后续都可以使用该接口进行更新

## 公共字段自动填充(AOP)

1. 自定义注解 AutoFill, 用于标识需要进行公共字段自动填充的方法

```java
// 自定义注解
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AutoFill {
    //数据库操作类型Insert,Update
    OperationType value();
}
```

2. 自定义切面类 AutoFillAspect, 统一拦截加入了 AutoFill 注解的方法，通过反射为公共字段赋值

```java
@Aspect
@Component
@Slf4j
public class AutoFillAspect {
    //切入点
    @Pointcut("execution(* com.sky.mapper.*.*(..)) && @annotation(com.sky.annotation.AutoFill)")
    public void autoFillPointCut(){}

    //前置通知，为公共字段赋值
    @Before("autoFillPointCut()")
    public void autoFill(JoinPoint joinPoint){
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        AutoFill autoFill = signature.getMethod().getAnnotation(AutoFill.class);
        OperationType operationType = autoFill.value();

        Object[] args = joinPoint.getArgs();
        if(args == null || args.length == 0){
            return;
        }

        Object entity = args[0];

        LocalDateTime now = LocalDateTime.now();
        Long currentId = BaseContext.getCurrentId();

        if(operationType == OperationType.INSERT){
            try {
                Method setCreateTime = entity.getClass().getDeclaredMethod(AutoFillConstant.SET_CREATE_TIME, LocalDateTime.class);
                Method setCreateUser = entity.getClass().getDeclaredMethod(AutoFillConstant.SET_CREATE_USER, Long.class);
                Method setUpdateTime = entity.getClass().getDeclaredMethod(AutoFillConstant.SET_UPDATE_TIME, LocalDateTime.class);
                Method setUpdateUser = entity.getClass().getDeclaredMethod(AutoFillConstant.SET_UPDATE_USER, Long.class);

                setCreateTime.invoke(entity,now);
                setCreateUser.invoke(entity,currentId);
                setUpdateTime.invoke(entity,now);
                setUpdateUser.invoke(entity,currentId);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        } else if (operationType == OperationType.UPDATE) {
            try {
                Method setUpdateTime = entity.getClass().getDeclaredMethod(AutoFillConstant.SET_UPDATE_TIME, LocalDateTime.class);
                Method setUpdateUser = entity.getClass().getDeclaredMethod(AutoFillConstant.SET_UPDATE_USER, Long.class);

                setUpdateTime.invoke(entity,now);
                setUpdateUser.invoke(entity,currentId);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
    }
}
```

3. 在 Mapper 方法上加入 AutoFill 注解

```java
@AutoFill(value = OperationType.UPDATE)
void update(Category category);

@AutoFill(value = OperationType.INSERT)
@Insert("insert into category(type, name, sort, status, create_time, update_time, create_user, update_user)" +
        " VALUES" +
        " (#{type}, #{name}, #{sort}, #{status}, #{createTime}, #{updateTime}, #{createUser}, #{updateUser})")
void insert(Category category);
```

## 文件上传

> https://help.aliyun.com/zh/oss/developer-reference/java

配置属性类表示配置类的属性：`@ConfigurationProperties(prefix = "sky.alioss")`

## 新增菜品

1. 开启事务：`@Transactional`
2. 插入时返回 id 属性

```xml
<insert id="insert" useGeneratedKeys="true" keyProperty="id">
</insert>
```

```java
@Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "id")
```

3. `@RequestParam List<Long> ids` 可以用来接收 ids = 1,2,3

## HttpClient

json 发送 http 请求

```java

@SpringBootTest
public class HttpClientTest {

    @Test
    public void testGET() throws IOException {
        CloseableHttpClient httpClient = HttpClients.createDefault();

        HttpGet httpGet = new HttpGet("http://localhost:8080/user/shop/status");

        CloseableHttpResponse response = httpClient.execute(httpGet);

        int statusCode = response.getStatusLine().getStatusCode();
        System.out.println("状态码:" + statusCode);

        HttpEntity entity = response.getEntity();
        String result = EntityUtils.toString(entity);
        System.out.println("返回结果：" + result);

        response.close();
        httpClient.close();
    }

    @Test
    public void testPost() throws IOException, JSONException {
        CloseableHttpClient httpClient = HttpClients.createDefault();

        HttpPost httpPost = new HttpPost("http://localhost:8080/admin/employee/login");

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("username","admin");
        jsonObject.put("password","123456");


        StringEntity entity = new StringEntity(jsonObject.toString());
        entity.setContentEncoding("utf-8");

        entity.setContentType("application/json");
        httpPost.setEntity(entity);

        CloseableHttpResponse response = httpClient.execute(httpPost);

        int statusCode = response.getStatusLine().getStatusCode();
        System.out.println("状态码:" + statusCode);

        HttpEntity entity1 = response.getEntity();
        String result = EntityUtils.toString(entity1);
        System.out.println("返回结果：" + result);

        response.close();
        httpClient.close();
    }
}
```

## Redis

### Redis 缓存菜品

```java
public Result<List<DishVO>> list(Long categoryId) {
    // 查询是否存在Redis 菜品数据
    String key = "dish_" + categoryId;
    List<DishVO> list = (List<DishVO>) redisTemplate.opsForValue().get(key);

    // 存在数据返回
    if(list != null && list.size() > 0){
        return Result.success(list);
    }
    Dish dish = new Dish();
    dish.setCategoryId(categoryId);
    dish.setStatus(StatusConstant.ENABLE);//查询起售中的菜品

    list = dishService.listWithFlavor(dish);
    // 放入Redis
    redisTemplate.opsForValue().set(key,list);

    return Result.success(list);
}
```

> 在修改菜品后需要清楚缓存

```java
private void cleanCache(String pattern){
    Set keys = redisTemplate.keys(pattern);
    redisTemplate.delete(keys);
}
```

## Spring Cache

基于注解的缓存功能

### 常用注解

| 注解           | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| @EnableCaching | 开启缓存注解功能，加在启动类上                               |
| @Cacheable     | 在方法执行前先查询缓存中是否有数据，如果有数据，则直接返回缓存数据；如果没有则调用方法并将方法返回值放到缓存中 |
| @CachePut      | 将方法的返回值放到缓存中                                     |
| @CacheEvict    | 将一条或多条数据从缓存中删除                                 |

参数说明：

1. 添加缓存 `@Cacheable(cacheNames = "setmealCache",key = "#categoryId")`
2. 删除指定 id `@CacheEvict(cacheNames = "setmealCache",key = "#setmealDTO.categoryId")`
3. 删除所有 `@CacheEvict(cacheNames = "setmealCache",allEntries = true)`
4. 生成的 key 为 cacheNames:: key

## JWT 令牌

配置 jwt 所需信息及配置类

```yml
sky:
  jwt:
    # 设置jwt签名加密时使用的秘钥
    admin-secret-key: itcast
    # 设置jwt过期时间
    admin-ttl: 7200000
    # 设置前端传递过来的令牌名称
    admin-token-name: token
```

```java
@Component
@ConfigurationProperties(prefix = "sky.jwt")
@Data
public class JwtProperties {

    /**
     * 管理端员工生成jwt令牌相关配置
     */
    private String adminSecretKey;
    private long adminTtl;
    private String adminTokenName;
}
```

配置 JWT 工具类加密和解密 jwtUnit

```java
public class JwtUtil {
    /**
     * 生成jwt
     * 使用Hs256算法, 私匙使用固定秘钥
     *
     * @param secretKey jwt秘钥
     * @param ttlMillis jwt过期时间(毫秒)
     * @param claims    设置的信息
     * @return
     */
    public static String createJWT(String secretKey, long ttlMillis, Map<String, Object> claims) {
        // 指定签名的时候使用的签名算法，也就是header那部分
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;

        // 生成JWT的时间
        long expMillis = System.currentTimeMillis() + ttlMillis;
        Date exp = new Date(expMillis);

        // 设置jwt的body
        JwtBuilder builder = Jwts.builder()
                // 如果有私有声明，一定要先设置这个自己创建的私有的声明，这个是给builder的claim赋值，一旦写在标准的声明赋值之后，就是覆盖了那些标准的声明的
                .setClaims(claims)
                // 设置签名使用的签名算法和签名使用的秘钥
                .signWith(signatureAlgorithm, secretKey.getBytes(StandardCharsets.UTF_8))
                // 设置过期时间
                .setExpiration(exp);

        return builder.compact();
    }

    /**
     * Token解密
     *
     * @param secretKey jwt秘钥 此秘钥一定要保留好在服务端, 不能暴露出去, 否则sign就可以被伪造, 如果对接多个客户端建议改造成多个
     * @param token     加密后的token
     * @return
     */
    public static Claims parseJWT(String secretKey, String token) {
        // 得到DefaultJwtParser
        Claims claims = Jwts.parser()
                // 设置签名的秘钥
                .setSigningKey(secretKey.getBytes(StandardCharsets.UTF_8))
                // 设置需要解析的jwt
                .parseClaimsJws(token).getBody();
        return claims;
    }

}
```

获取 token

```java
//登录成功后，生成jwt令牌
Map<String, Object> claims = new HashMap<>();
claims.put(JwtClaimsConstant.EMP_ID, employee.getId());
String token = JwtUtil.createJWT(
        jwtProperties.getAdminSecretKey(),
        jwtProperties.getAdminTtl(),
        claims);
```

以后每次都会携带 token 来进行验证，通过拦截器实现

```java
@Component
@Slf4j
public class JwtTokenAdminInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtProperties jwtProperties;

	//校验jwt
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //判断当前拦截到的是Controller的方法还是其他资源
        if (!(handler instanceof HandlerMethod)) {
            //当前拦截到的不是动态方法，直接放行
            return true;
        }

        //1、从请求头中获取令牌
        String token = request.getHeader(jwtProperties.getAdminTokenName());

        //2、校验令牌
        try {
            log.info("jwt校验:{}", token);
            Claims claims = JwtUtil.parseJWT(jwtProperties.getAdminSecretKey(), token);
            Long empId = Long.valueOf(claims.get(JwtClaimsConstant.EMP_ID).toString());
            log.info("当前员工id：", empId);
         	// threadLocal 存储用户id
            BaseContext.setCurrentId(empId);
            //3、通过，放行
            return true;
        } catch (Exception ex) {
            //4、不通过，响应401状态码
            response.setStatus(401);
            return false;
        }
    }
}
```

```java
public class BaseContext {

    public static ThreadLocal<Long> threadLocal = new ThreadLocal<>();

    public static void setCurrentId(Long id) {
        threadLocal.set(id);
    }

    public static Long getCurrentId() {
        return threadLocal.get();
    }

    public static void removeCurrentId() {
        threadLocal.remove();
    }

}
```

## Spring Task

spring task 是 spring 提供的定时任务框架

### cron 表达式

- 一个字符串，用来定义任务触发的时间
- 构成规则：分为 6 或 7 个域，由空格分开，每个域分别为：秒 分钟 小时 日 月 周 年(可选)

> https://cron.qqe2.com/

### 使用

启动类添加 `@EnableScheduling`

```java
@Component
public class MyTask{
    @Scheduled(cron = "0 * * * * ?") // 每分钟触发一次
    public void executeTask(){
        System.out.print("test");
    }
}
```

## WebSocket

WebSocket 是基于 TCP 的一种新的 **网络协议**，实现了浏览器和服务器的 **全双工通信**，一次握手，创建持久性的连接，并进行 **双向数据通信**。

应用场景：视频弹幕，网页聊天，实时更新

### 服务端

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

#### WebSocket 配置类

```java
/**
 * WebSocket配置类，用于注册WebSocket的Bean
 */
@Configuration
public class WebSocketConfiguration {
    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }
}
```

#### WebSocket 操作类

```java
@Component
@ServerEndpoint("/ws/{sid}")
public class WebSocketServer {

    //存放会话对象
    private static Map<String, Session> sessionMap = new HashMap();

    /**
     * 连接建立成功调用的方法
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("sid") String sid) {
        System.out.println("客户端：" + sid + "建立连接");
        sessionMap.put(sid, session);
    }

    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息
     */
    @OnMessage
    public void onMessage(String message, @PathParam("sid") String sid) {
        System.out.println("收到来自客户端：" + sid + "的信息:" + message);
    }

    /**
     * 连接关闭调用的方法
     *
     * @param sid
     */
    @OnClose
    public void onClose(@PathParam("sid") String sid) {
        System.out.println("连接断开:" + sid);
        sessionMap.remove(sid);
    }

    /**
     * 群发
     *
     * @param message
     */
    public void sendToAllClient(String message) {
        Collection<Session> sessions = sessionMap.values();
        for (Session session : sessions) {
            try {
                //服务器向客户端发送消息
                session.getBasicRemote().sendText(message);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

}

```

#### 发送消息

```java
@Component
public class WebSocketTask {
    @Autowired
    private WebSocketServer webSocketServer;

    /**
     * 通过WebSocket每隔5秒向客户端发送消息
     */
    @Scheduled(cron = "0/5 * * * * ?")
    public void sendMessageToClient() {
        webSocketServer.sendToAllClient("这是来自服务端的消息：" + DateTimeFormatter.ofPattern("HH:mm:ss").format(LocalDateTime.now()));
    }
}
```

### 客户端

```html
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8">
    <title>WebSocket Demo</title>
</head>
<body>
    <input id="text" type="text" />
    <button onclick="send()">发送消息</button>
    <button onclick="closeWebSocket()">关闭连接</button>
    <div id="message">
    </div>
</body>
<script type="text/javascript">
    var websocket = null;
    var clientId = Math.random().toString(36).substr(2);

    //判断当前浏览器是否支持WebSocket
    if('WebSocket' in window){
        //连接WebSocket节点
        websocket = new WebSocket("ws://localhost:8080/ws/"+clientId);
    }
    else{
        alert('Not support websocket')
    }

    //连接发生错误的回调方法
    websocket.onerror = function(){
        setMessageInnerHTML("error");
    };

    //连接成功建立的回调方法
    websocket.onopen = function(){
        setMessageInnerHTML("连接成功");
    }

    //接收到消息的回调方法
    websocket.onmessage = function(event){
        setMessageInnerHTML(event.data);
    }

    //连接关闭的回调方法
    websocket.onclose = function(){
        setMessageInnerHTML("close");
    }

    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function(){
        websocket.close();
    }

    //将消息显示在网页上
    function setMessageInnerHTML(innerHTML){
        document.getElementById('message').innerHTML += innerHTML + '<br/>';
    }

    //发送消息
    function send(){
        var message = document.getElementById('text').value;
        websocket.send(message);
    }
	
	//关闭连接
    function closeWebSocket() {
        websocket.close();
    }
</script>
</html>
```

## Apache Echarts

### Controller

```java
@GetMapping("/top10")
@ApiOperation("销量排名top10")
public Result<SalesTop10ReportVO> top10(
        @DateTimeFormat(pattern = "yyyy-MM-dd")  LocalDate begin,
        @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate end){
    log.info("销量排名top10：{},{}",begin,end);
    return Result.success(reportService.getSalesTop10(begin,end));
}
```

### service

```java
public SalesTop10ReportVO getSalesTop10(LocalDate begin, LocalDate end) {
    LocalDateTime beginTime = LocalDateTime.of(begin, LocalTime.MIN);
    LocalDateTime endTime = LocalDateTime.of(end, LocalTime.MAX);

    List<GoodsSalesDTO> salesTop10 = orderMapper.getSalesTop10(beginTime, endTime);
    List<String> names = salesTop10.stream().map(GoodsSalesDTO::getName).collect(Collectors.toList());
    String nameList = StringUtils.join(names, ",");

    List<Integer> numbers = salesTop10.stream().map(GoodsSalesDTO::getNumber).collect(Collectors.toList());
    String numberList = StringUtils.join(numbers, ",");

    //封装返回结果数据
    return SalesTop10ReportVO
            .builder()
            .nameList(nameList)
            .numberList(numberList)
            .build();
}
```

### Mapper

```xml
<select id="getSalesTop10" resultType="com.sky.dto.GoodsSalesDTO">
    select od.name, sum(od.number) number
    from order_detail od,orders o
    where od.order_id = o.id and o.status = 5
    <if test="begin != null">
        and o.order_time &gt; #{begin}
    </if>
    <if test="end != null">
        and o.order_time &lt; #{end}
    </if>
    group by od.name
    order by number desc
    limit 0,10
</select>
```

## Apache POI

使用 java 对 excel 进行操作

### 使用

```xml
<!-- poi -->
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi</artifactId>
</dependency>
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
</dependency>
```

```java
public static void write() throws Exception{
    //在内存中创建一个Excel文件
    XSSFWorkbook excel = new XSSFWorkbook();
    //在Excel文件中创建一个Sheet页
    XSSFSheet sheet = excel.createSheet("info");
    //在Sheet中创建行对象,rownum编号从0开始
    XSSFRow row = sheet.createRow(1);
    //创建单元格并且写入文件内容
    row.createCell(1).setCellValue("姓名");
    row.createCell(2).setCellValue("城市");

    //创建一个新行
    row = sheet.createRow(2);
    row.createCell(1).setCellValue("张三");
    row.createCell(2).setCellValue("北京");

    row = sheet.createRow(3);
    row.createCell(1).setCellValue("李四");
    row.createCell(2).setCellValue("南京");

    //通过输出流将内存中的Excel文件写入到磁盘
    FileOutputStream out = new FileOutputStream(new File("D:\\info.xlsx"));
    excel.write(out);

    //关闭资源
    out.close();
    excel.close();
}


/**
 * 通过POI读取Excel文件中的内容
 * @throws Exception
 */
public static void read() throws Exception{
    InputStream in = new FileInputStream(new File("D:\\info.xlsx"));

    //读取磁盘上已经存在的Excel文件
    XSSFWorkbook excel = new XSSFWorkbook(in);
    //读取Excel文件中的第一个Sheet页
    XSSFSheet sheet = excel.getSheetAt(0);

    //获取Sheet中最后一行的行号
    int lastRowNum = sheet.getLastRowNum();

    for (int i = 1; i <= lastRowNum ; i++) {
        //获得某一行
        XSSFRow row = sheet.getRow(i);
        //获得单元格对象
        String cellValue1 = row.getCell(1).getStringCellValue();
        String cellValue2 = row.getCell(2).getStringCellValue();
        System.out.println(cellValue1 + " " + cellValue2);
    }

    //关闭资源
    in.close();
    excel.close();
}
```



