## Sring Framework系统架构

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358838_0.png" alt="image-20230719235037060" style="zoom:50%;" />

## IOC容器

- 高内聚，低耦合

- IOC(Inversion of Control) 控制反转：外部创建对象到IOC容器中，称为bean
- DI(Dependency Injection) 依赖注入：绑定依赖，从IOC容器中获取bean

### 配置bean

1. 创建Dao层和Service层的接口和实现类

```java
public interface BookDao {
    public void save();
}
public class BookDaoImpl implements BookDao {
    @Override
    public void save() {
        System.out.println("book dao save...");
    }
}
```

```java
public interface BookService {
    public void save();
}
public class BookServiceImpl implements BookService {
    private BookDao bookDao;
    @Override
    public void save() {
        System.out.println("book service save...");
        bookDao.save();
    }
    public void setBookDao(BookDao bookDao){
        this.bookDao = bookDao;
    }
}
```



1. 新建xml文件：applicationContext.xml
2. 其中bean的id属性为创建的bean对象的名称，class属性定义了bean的类型，使用类的全路径名
3. Dao层的bean可以直接创建，而由于Service层的bean需要依赖于Dao层，需要添加property，name属性为setxxx中的xxx小写，ref为依赖的bean名称

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
        <bean id="bookDao" class="com.cwc.exercise.dao.impl.BookDaoImpl"></bean>
        <bean id="bookService" class="com.cwc.exercise.service.impl.BookServiceImpl">
                <property name="bookDao" ref="bookDao"/>
        </bean>
</beans>
```

1. 在主函数中实例化一个IOC容器
2. 取出该容器的bean，并执行

```java
public static void main(String[] args) {
    ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");

    BookService bookService = ctx.getBean("bookService",BookService.class);
    bookService.save();
}
```

### bean相关属性

| 属性           | 说明                                   |
| -------------- | -------------------------------------- |
| id             | bean的名称                             |
| name           | bean的别名，用','分隔                  |
| scope          | singleton:单例(默认)，prototype:非单例 |
| init-method    | 指定初始化前的操作                     |
| destory-method | 指定销毁前的操作                       |
| autowire       | 自动依赖注入，byType和byName           |

### 实例化Bean

#### 静态工厂方法进行实例化

1. 创建一个获取对象的静态工厂类
2. 配置xml

```java
public class BookDaoFactory {
    public static BookDao getBookDao(){
        return new BookDaoImpl();
    }
}
```

```xml
<bean id="bookDao" class="com.cwc.exercise.factory.BookDaoFactory" factory-method="getBookDao"></bean>
```

#### 实例工厂进行实例化

1. 配置一个获取对象的实例工厂类
2. 配置xml：先配置实例工厂的bean，再使用该bean调用函数

```java
public class BookDaoFactory {
    public BookDao getBookDao(){
        return new BookDaoImpl();
    }
}
```

```xml
     <bean id="bookDaoFactory" class="com.cwc.exercise.factory.BookDaoFactory"/>
        <bean id="bookDao" factory-method="getBookDao" factory-bean="bookDaoFactory"></bean>
```

#### FactoryBean进行实例化

1. 实现FactoryBean接口
2. 配置xml

```java
public class BookDaoFactoryBean implements FactoryBean<BookDao> {
    //  创建bean对象
    @Override
    public BookDao getObject() throws Exception {
        return new BookDaoImpl();
    }
    //  指定类型
    @Override
    public Class<?> getObjectType() {
        return BookDao.class;
    }

}
```

```xml
 <bean id="bookDao" class="com.cwc.exercise.factory.BookDaoFactoryBean"></bean>
```

### Bean的生命周期

#### 控制生命周期

1. 配置bean的init-method和destory-method属性调用的函数
2. 或者再类中implements InitializingBean,DisposableBean,并重写afterPropertiesSet()和destroy()函数
3. 使用ClassPathXmlApplicationContext创建IOC容器，使用ctx.registerShutdownHook()或ctx.close()实现destory-method方法

#### 生命周期

- 初始化容器
  1. 创建对象(内存分配)
  2. 执行构造方法
  3. 执行属性注入(set操作)
  4. 执行bean初始化方法
- 使用bean，执行业务操作
- 销毁bean，执行销毁方法

## 依赖注入DI

#### 基于构造器的依赖注入

1. 实现类的构造函数
2. xml配置constructor-arg,其中name为构造器中的参数名称，引用类型使用ref，基本类型使用value

```xml
<bean id="bookDao" class="com.cwc.exercise.dao.impl.BookDaoImpl"></bean>
<bean id="bookService" class="com.cwc.exercise.service.impl.BookServiceImpl">
        <constructor-arg name="bookDao" ref="bookDao"/>
        <constructor-arg name="databaseName" value="mysql"/>
</bean>
```

#### 基于Setter的依赖注入

1. 实现成员遍历的set函数
2. xml配置property，对于引用类型提供ref="bean对象id"，对于普通类型提供value="val";

```java
public class BookServiceImpl implements BookService {
    private BookDao bookDao;
    private String databaseName;
    @Override
    public void save() {
        System.out.println("book service save...");
        bookDao.save();
    }
    public void setBookDao(BookDao bookDao){
        this.bookDao = bookDao;
    }

    public void setDatabaseName(String databaseName) {
        this.databaseName = databaseName;
    }
}
```

```xml
<bean id="bookDao" class="com.cwc.exercise.dao.impl.BookDaoImpl"></bean>
<bean id="bookService" class="com.cwc.exercise.service.impl.BookServiceImpl">
        <property name="bookDao" ref="bookDao"/>	
        <property name="databaseName" value="mysql"/>
</bean>
```

#### 自动依赖注入

在xml配置autowire属性,不支持基本类型

```xml
<bean id="bookDao" class="com.cwc.exercise.dao.impl.BookDaoImpl"></bean>
<bean id="bookService" class="com.cwc.exercise.service.impl.BookServiceImpl" autowire="byType"/>
```

#### 数据源对象管理

1. 在pom添加连接池的依赖dependency druid或c3po(需要mysql依赖)
2. 在xml中配置依赖property

```xml
<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
    <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
    <property name="url" value="jdbc:mysql://local:3306/"/>
    <property name="username" value="root"/>
    <property name="password" value="123456"/>
</bean>
```

## 注解开发

### 使用xml配置bean

1. 使用@Component(@Controller,@Service,@Repository)定义bean
2. 在xml中配置扫描组件
3. 有依赖关系的需要构造函数
4. 从容器中获取bean使用类型获取

```java
@Service
public class BookServiceImpl implements BookService {
    private BookDao bookDao;


    public BookServiceImpl(BookDao bookDao) {
        this.bookDao = bookDao;
    }

    @Override
    public void save() {
        System.out.println("book service save...");
        bookDao.save();
    }

}
```

```java
public static void main(String[] args) {
    ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");

    BookDao bookDao = ctx.getBean(BookDao.class);
    bookDao.save();

    BookService bookService = ctx.getBean(BookService.class);
    bookService.save();
}
```

```xml
<context:component-scan base-package="com.cwc.exercise"/>
```

### 使用注解开发bean

1. 新建配置类添加注解配置@Configuration和扫描@ComponentScan
2. 获取容器使用注解AnnotationConfigApplicationContext,参数为配置类

```java
@Configuration
@ComponentScan("com.cwc.exercise")
public class SpringConfig {
}
```

```java
public static void main(String[] args) {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(SpringConfig.class);
    BookDao bookDao = ctx.getBean(BookDao.class);
    bookDao.save();

    BookService bookService = ctx.getBean(BookService.class);
    bookService.save();
}
```

### 注解控制生命周期

1. @Scope("singleton")单例模式,@Scope("prototype")非单例模式
2. @PostConstruct初始化前操作,@PreDestory销毁前操作

### 注解依赖注入

1. 使用@Autowired根据类型注入，若有多个实现类不支持
2. 使用@Autowired+@Qualifier("bean's id")，支持指定名称的bean
3. 使用@Value(val)可以指定基本类型的注入，或创建jdbc.properties文件指定name，`在配置类中加入@PropertySource("jdbc.properties")`，使用@Value("${name}")指定

```java
@Service
public class BookServiceImpl implements BookService {
    @Autowired
    private BookDao bookDao;

//    @Value("test")
    @Value("${name}")
    private String name;

    @Override
    public void save() {
        System.out.println("book service save... " + name);
        bookDao.save();
    }
}
```

### 注解管理第三方bean

1. 定义配置类并添加注解@Bean
2. 在主配置类中@Import({xxx.class}),如`@Import({jdbcConfig.class})`

```java
public class jdbcConfig {
    @Bean
    public DataSource dataSource() {
        DruidDataSource ds = new DruidDataSource();
        ds.setDriverClassName("com.mysql.jdbc.Driver");
        ds.setUrl("jdbc:mysql://localhost:3306");
        ds.setUsername("root");
        ds.setPassword("123456");
        return ds;
    }
}
```

## AOP

OOP(Object Oriented Programming)：面向对象编程 

AOP(Aspect Oriented Programming)：面向切面编程

作用：在不惊动原始设计的基础上进行功能增强

Advice(通知),JoinPoint(连接点),PointCut(切入点),Aspect(切面)

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358840_1.png" alt="image-20230820123737457" style="zoom:50%;" />

### 案例

定义通知类MyAdvice

```java
@Component
@Aspect
public class MyAdvice {
    @Pointcut("execution(void com.cwc.dao.BookDao.update())")
    private void pt(){}

    @Before("pt()")
    public void method(){
        System.out.println(System.currentTimeMillis());
    }

    @After("pt()")
    public void method2(){
        System.out.println(System.currentTimeMillis());
    }
}
```

定义连接点类

```java
@Component
public class BookDaoImpl implements BookDao {
    @Override
    public void save() {
        System.out.println(System.currentTimeMillis());
        System.out.println("save");
    }

    @Override
    public void update() {
        System.out.println("update");
    }
}
```

### 切入点表达式

格式：动作关键字(访问修饰符(public,private可省略) 返回值 路径)

使用通配符：

- \*：单个独立的任意符号 例：匹配com下的任意一级包中以Service结尾的类或接口中以find开头的带有一个参数的方法`execution (public * com.*.*Service.find*(*))`
- ..：0个或多个连续的任意符号
- +：专用于匹配子类类型

### 通知类型

五种类型：Before，After，Around，AfterRuturning,AfterThrowing

```java
@Component
@Aspect
public class MyAdvice {
    @Pointcut("execution(int com.cwc.dao.BookDao.select())")
    private void pt(){}

    
    /
    @Before("pt()")
    public void before(){
        System.out.println("before");
    }

    @After("pt()")
    public void after(){
        System.out.println("after");
    }

    @Around("pt()")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("before");
        Integer ret = (Integer) pjp.proceed();
        System.out.println("after");
        return ret;
    }
}
```

### 通知获取数据

任何 advice method 都可以声明一个`org.aspectj.lang.JoinPoint`类型的参数作为其第一个参数。请注意，around advice 方法需要声明一个`ProceedingJoinPoint`类型的第一个参数，它是`JoinPoint`的一个子类。

`JoinPoint` 接口提供了许多有用的方法。

- `getArgs()`: 返回方法的参数。
- `getThis()`: 返回代理对象。
- `getTarget()`: 返回目标对象。
- `getSignature()`: 返回正在被 advice 的方法的描述。
- `toString()`: 打印对所 advice 的方法的有用描述。

## 事务

在业务层接口上添加注解

```java
public interface AccountService(){
    @Transational
    public void transfer(String out,String in,Double money);
}
```

### @Transactional属性

1. **propagation**: 指定事务的传播行为，即在方法被调用时，当前方法的事务如何与已存在的事务进行交互。常见选项包括：
   - `REQUIRED`（默认）：如果当前已存在事务，则使用当前事务；如果没有事务，则创建新事务。
   - `REQUIRES_NEW`：不论是否已存在事务，都创建一个新的事务，如果当前有事务，则将其挂起。
   - `SUPPORTS`：如果当前已存在事务，则使用当前事务；如果没有事务，则以非事务方式执行。
   - `NOT_SUPPORTED`：以非事务方式执行，如果当前有事务，则将其挂起。
   - `NESTED`：如果当前已存在事务，则在当前事务的嵌套事务中运行；如果没有事务，则创建新事务。
2. **isolation**: 指定事务的隔离级别，即多个事务同时运行时的相互影响程度。常见选项包括：
   - `DEFAULT`（默认）
   - `READ_UNCOMMITTED`
   - `READ_COMMITTED`
   - `REPEATABLE_READ`
   - `SERIALIZABLE`
3. **timeout**: 指定事务的超时时间（以秒为单位）。如果事务在指定时间内没有完成，将会被回滚。
4. **readOnly**: 指定事务是否只读。如果设置为`true`，表示事务只会读取数据，不会对数据进行修改。
5. **rollbackFor** 和 **noRollbackFor**: 指定在哪些异常情况下回滚事务或不回滚事务。您可以指定异常类或其子类。
6. **rollbackForClassName** 和 **noRollbackForClassName**: 类似于上述的 `rollbackFor` 和 `noRollbackFor`，但是可以通过指定异常类名的方式。
7. **value** 和 **transactionManager**: 指定要使用的事务管理器的名称。如果存在多个事务管理器，可以通过此属性来选择。

## SpringMVC

SpringMVC是一种基于Java实现MVC模型的轻量级Web框架(表现层框架,Controller)

### 实现流程

创建Controller了类

```java
//定义Controller，使用@Controller定义Bean
@Controller
public class UserController {
    //设置当前访问路径，使用@RequestMapping
    @RequestMapping("/save")
    //设置当前对象的返回值类型
    @ResponseBody
    public String save(){
        System.out.println("user save ...");
        return "{'module':'SpringMVC'}";
    }
}
```

配置环境

```java
//创建SpringMVC的配置文件，加载controller对应的bean
@Configuration
@ComponentScan("com.cwc.controller")
public class SpringMvcConfig {
}
```

初始化Servlet容器，加载SpringMVC环境，并设置SpringMVC技术处理的请求

```java
//定义一个servlet容器的配置类，在里面加载Spring的配置，继承AbstractDispatcherServletInitializer并重写其方法
public class ServletContainerInitConfig extends AbstractDispatcherServletInitializer {
    //加载SpringMvc容器配置
    protected WebApplicationContext createServletApplicationContext() {
        AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
        context.register(SpringMvcConfig.class);
        return context;
    }
    //设置哪些请求归SpringMvc处理
    protected String[] getServletMappings() {
        //所有请求都交由SpringMVC处理
        return new String[]{"/"};
    }

    //加载Spring容器配置
    protected WebApplicationContext createRootApplicationContext() {
        return null;
    }
}
```



### 启动服务器初始化过程

1. 服务器启动，执行ServletContainersInitConfig类，初始化web容器
2. 执行createServletApplicationContext方法，创建了webApplicationContext对象
3. 加载SpringMvcConfig
4. 执行@Componentscan加载对应的bean
5. 加载UserController，每个@RequestMapping的名称对应一个具体的方法
6. 执行getServletMappings方法，定义所有的请求都通过SpringMVC

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358841_2.png" alt="image-20230821001148644" style="zoom:50%;" />

### 单次请求过程

1. 发送请求`http://localhost:8080/save`
2. web容器发现该请求满足SpringMVC拦截规则，将请求交给SpringMVC处理
3. 解析请求路径/save
4. 由/save匹配执行对应的方法save()
   - 上面的第5步已经将请求路径和方法建立了对应关系，通过`/save`就能找到对应的`save()`方法
5. 执行`save()`
6. 检测到有`@ResponseBody`直接将`save()`方法的返回值作为响应体返回给请求方

### Bean加载控制

由于Spring和SpringMVC会把controller、service、dao三层的Bean都加载到，需要区分两个环境

- 解决方案一：修改Spring配置类，设定扫描范围为精准范围

  ```java
  @Configuration
  @ComponentScan({"com.cwc.dao","com.cwc.service"})
  public class SpringConfig {
  }
  ```

- 解决方案二：修改Spring配置类，设定扫描范围为com.cwc，排除掉controller包中的bean

  ```java
  @Configuration
  @ComponentScan(value = "com.blog",
      excludeFilters = @ComponentScan.Filter(
              type = FilterType.ANNOTATION,
              classes = Controller.class
      ))
  public class SpringConfig {
  }
  ```

修改Servlet容器

```java
public class ServletContainerInitConfig extends AbstractDispatcherServletInitializer {
    //加载SpringMvc配置
    protected WebApplicationContext createServletApplicationContext() {
        AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
        context.register(SpringMvcConfig.class);
        return context;
    }
    //设置哪些请求归SpringMvc处理
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }

    //加载Spring容器配置
    protected WebApplicationContext createRootApplicationContext() {
        AnnotationConfigWebApplicationContext context = new AnnotationConfigWebApplicationContext();
        context.register(SpringConfig.class);
        return context;
    }
}
```

简化方式

```java
public class ServletContainerInitConfig extends AbstractAnnotationConfigDispatcherServletInitializer {

    protected Class<?>[] getRootConfigClasses() {
        return new Class[]{SpringConfig.class};
    }

    protected Class<?>[] getServletConfigClasses() {
        return new Class[]{SpringMvcConfig.class};
    }

    protected String[] getServletMappings() {
        return new String[]{"/"};
    }
}
```

### Rest风格

```java
@RestController
@RequestMapping("/users")
public class UserController {
    @PostMapping
    public String save(@RequestBody User user) {
        System.out.println("user save ..." + user);
        return "{'module':'user save'}";
    }

    @DeleteMapping("/{id}/{name}")
    public String delete(@PathVariable("id") Integer userId, @PathVariable String name) {
        System.out.println("user delete ..." + userId + ":" + name);
        return "{'module':'user delete'}";
    }

    @PutMapping()
    public String update(@RequestBody User user) {
        System.out.println("user update ..." + user);
        return "{'module':'user update'}";
    }

    @GetMapping("/{id}")
    public String getById(@PathVariable Integer id) {
        System.out.println("user getById ..." + id);
        return "{'module':'user getById'}";
    }

    @GetMapping
    public String getAll() {
        System.out.println("user getAll ...");
        return "{'module':'user getAll'}";
    }
}
```

