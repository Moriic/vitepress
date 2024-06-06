# 面经

## 华为

### 笔试

公众号 万诺coding 有

### 技术面

1. 手撕：

给定一个可能包含重复元素的字符数组 chars，返回该数组所有可能的子集的排列组合数。

XXY： XX, XY, XYX, X, XXY, YXX, Y, YX	8

参数说明：String str [字符数组] 1 <= str.length() <= 7

输出说明：int num 所有可能的子集的排列组合数。

```java
public class Demo {
    private static Set<String> ans = new HashSet<>();
    private static StringBuilder stringBuilder = new StringBuilder();

    public static void backTrack(int cnt, String str, boolean[] vis) {
        if (cnt == str.length()) {
            if (!stringBuilder.toString().isEmpty())
                ans.add(stringBuilder.toString());
            return;
        }
        for (int i = 0; i < str.length(); i++) {
            if (!vis[i]) {
                vis[i] = true;
                stringBuilder.append(str.charAt(i));
                backTrack(cnt + 1, str, vis);
                vis[i] = false;
                stringBuilder.deleteCharAt(stringBuilder.length() - 1);
                backTrack(cnt + 1, str, vis);
            }
        }
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String str = sc.next();
        boolean[] vis = new boolean[str.length()];
        backTrack(0, str, vis);
        System.out.println(ans);
        System.out.println(ans.size());
    }
}
```

2. 问时间复杂度：当时没想出来，是 O(n!)，面试官说 O(n) ~ O( n^2^) 也有问题

3. spring：IOC AOP

4. 项目中 AOP 的应用：记录日志 @Aspect 当时说的 @Before 其实是 @Around

5. IOC 使用的设计模式，答了前两个就开始问后面了，查了下怎么感觉很多设计模式都有

   Singleton（单例模式）：Spring IOC 容器中管理的对象默认是单例的，即每个对象在整个应用程序中只有一个实例。这种设计模式可以节省系统资源，并且确保对象的一致性。

   Factory（工厂模式）：Spring IOC 容器充当了一个工厂角色，负责创建和管理对象的生命周期。使用工厂模式可以提供灵活的对象创建和管理方式，而不是直接在代码中使用 new 关键字来创建对象。

   Proxy（代理模式）：Spring  AOP（面向切面编程）的实现方式之一是使用动态代理。在运行时，Spring 动态地为目标对象生成代理类，将一些横切关注点（如日志记录、事务管理等）与目标对象的业务逻辑进行解耦。代理模式可以提供额外的功能，而不需要修改目标对象的代码。

   Template  Method（模板方法模式）：Spring 框架中的 JdbcTemplate 是一个典型的模板方法模式的应用。JdbcTemplate 定义了一系列的模板方法，其中一些方法是抽象的，需要在具体的子类中实现。这样，开发人员只需要关注具体实现的细节，而不必担心底层的操作逻辑。

   Observer（观察者模式）：Spring 的事件驱动机制是通过观察者模式实现的。在 Spring 中，事件被发布者发布，而订阅者可以监听并响应事件。这种设计模式可以提供松耦合的系统架构，允许不同模块之间的协作和通信。

   装饰器模式（Decorator Pattern）：Spring IOC 容器可以对对象进行装饰，给对象增加额外的功能。例如，在处理请求时，可以在对象前后添加日志记录、异常处理等功能，而不需要改变原有的代码。

   观察者模式（Observer Pattern）：Spring IOC 容器通过事件驱动机制来实现观察者模式。当发生特定的事件时，容器会通知相关的观察者进行相应的处理。

   策略模式（Strategy Pattern）：Spring IOC 容器在创建对象时可以根据配置文件或者注解的定义，选择不同的实现策略。这样可以在运行时根据不同的需求选择不同的策略，提高系统的灵活性。

6. 工厂模式有什么：简单，抽象，区别，忘记了个工厂方法

7. Java 内存结构：堆，方法区，虚拟机栈，本地方法栈，程序计数器

8. OOM 问题：堆溢出，栈溢出

9. Java：基本类型 **byte、short、int、long、float、double、boolean、char**，int 和 Integer，Integer 怎么比较，说了自动拆箱，面试官说 Compare

10. 项目问题：支付回调，并发加 synchornized，加方法/代码块？

### 主管面

纯聊天，但也踩了不少坑：

背下核心价值观：以客户为中心，以奋斗者为本

作息时间：最好比上班时间早，8.30上班

## 微众

1. 微信支付的流程

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1715528384_0.png" alt="6_2" style="zoom: 33%;" />

- 前端点击提交订单，请求后端接口 /user/order/submit
- 后端将订单信息插入 orders 表，将购物车信息插入 orderDetail 表，并返回订单部分信息 orderNO, money
- 前端获得订单信息后跳转到支付页面，点击支付后请求后端接口 /user/order/payment, 参数为 orderNO, money
- 后端生成预支付订单信息 PrepayWithRequestPaymentResponse 返回

```java
WeChatPayUtil2.jsapi(
        "永达无界订单", // 商品描述
        ordersPaymentDTO.getOrderNumber(), // 商户订单号
        ordersPaymentDTO.getAmount(), // 支付金额，单位 元
        user.getOpenid() // 微信用户的openid
```

- 前端调用 uni.requestPayment 参数为 预支付订单信息
- 支付成功后会回调接口 /notify/paySuccess，解密返回信息，支付成功会更新订单状态等操作，注意防止重复回调问题

2. oss：流程，访问权限

3. @Transactional 注解的两个参数，事务传播，传播什么时候会失效

4. Websocket 参数，传递了商家 id，用来标识 

5. Websocket 最大连接数：Tomcat 默认 10000，可以通过设置参数 maxConnections 属性来调整， 

6. Websocket 断连检测，默认一分钟内未通信会自动断开连接，可以使用心跳机制，客户端每隔 60s 向服务器发送一条 ping 信息，服务端收到消息后返回





### 主管面 自我准备

自我介绍：

面试官你好，我叫陈伟朝，目前是深圳大学计算机专业大三学生，我要面试的岗位是后端开发，在校期间，我的绩点是 4.0，排名前 5%，获得过广东省蓝桥杯一等奖，广东省计算机设计大赛三等级，学习之星，在项目经历方面，我加入了华为智能基座社团，与团队共同开发了无界送外卖平台，该项目真实落地于深圳富士康园区，为商家，用户提供外卖服务，同时，我在课余时间开发了一个 OJ 系统，主要是对提交的代码进行评判，我的介绍完毕，谢谢。

项目的困难：

我们项目测试的过程中发现订单的状态会被异常更新，发现微信支付成功和退款会触发回调函数，但即使这些回调函数正常执行，也可能会多次回调，导致订单状态异常更新，因此就需要在回调时首先判断订单的状态来确认是否继续执行，比如支付成功回调需要先判断订单状态是否处于未支付状态。

企业文化：我有了解过，华为强调以客户为中心、以奋斗者为本，我也很希望能在这样的环境下成长

狼性文化：强调艰苦奋斗，团队合作，

担任角色：主要是做开发的工作，由于我们这个项目有多个端，可能经常需要与团队的其他成员沟通

解决矛盾：我觉得沟通非常重要，找出矛盾点，一起探讨解决的方案

优点：比较上进努力，善于团队合作，能够在团队中很好地沟通合作，共同完成项目。

缺点：缺乏自信，我可能需要不断地取得一些成绩来肯定自己

加班看法：我不排斥加班，因为项目难免有紧急或突发情况需要加班处理，我也很愿意和团队一起去完成它，日常工作我也会提高自己的工作效率，尽量避免不必要的加班

计设：这个项目主要是对数据进行可视化的展示，然后可以对可视化后的图表进行提问，给出答案，我主要做的是前端和后端的部分接口

项目背景：主要是一个创业团队来找我们合作，因为他们的园区比较大，像美团这些外卖平台的骑手不能进去，所以他们就想开发一个这样的平台

优化：很多逻辑都是串行执行的，目前数据量比较小，后续在数据量比较大的时候可能需要进行优化



