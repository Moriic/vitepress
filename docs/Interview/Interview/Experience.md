# 实习面经

## 华为

### 笔试

公众号 万诺 coding 有

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

作息时间：最好比上班时间早，8.30 上班

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



## 秋招准备

### 复习笔试

题目三：找到内聚值最大的微服务群组

我们将形成 1 个环的多个微服务称为微服务群组，一个微服务群组的所有微服务数量为 L，能够访问到该微服务群组的微服务数量为 V, 这个微服务群组的内聚值 H = L - V.

已知提供的数据中有 1 个或多个微服务群组，请按照内聚值 H 的结果从大到小的顺序对所有微服务群组(（H 相等时，取环中最大的数进行比较)排序，输出排在第一的做服务群组，输出时每个微服务群组输出的起始编号为环中最小的数。

```java
import java.util.*;

public class C {
    class Node implements Comparable<Node> {
        public List<Integer> path = new ArrayList<>();  // 该环路径
        public int H;                                   // 内聚值
        public int maxNo;                               // 最大节点编号
        public int minNo;

        @Override
        public int compareTo(Node o) {
            if (!(this.H == o.H))
                return o.H - this.H;
            return o.maxNo - this.maxNo;
        }
    }

    class Solution {
        int n;
        int[] edges;
        // 存储入度
        int[] in;
        // 存储每个节点的子节点数目
        int[] nums;


        public void build() {
            Scanner sc = new Scanner(System.in);
            n = sc.nextInt();
            edges = new int[n];
            in = new int[n];
            nums = new int[n];
            for (int i = 0; i < n; i++) {
                edges[i] = sc.nextInt();
                in[edges[i]]++;
            }
        }

        public void solution() {
            // 构建图
            build();
            // 拓扑排序
            Queue<Integer> q = new LinkedList<>();
            for (int i = 0; i < n; i++) {
                if (in[i] == 0)
                    q.offer(i);
            }
            while (!q.isEmpty()) {
                int u = q.poll();
                int v = edges[u];
                in[v]--;
                nums[v] += nums[u] + 1;
                if (in[v] == 0)
                    q.offer(v);
            }

            // 存储所有环的信息
            PriorityQueue<Node> paths = new PriorityQueue<>();

            for (int i = 0; i < n; i++) {
                // 只遍历环内节点
                if (in[i] == 0) continue;
                // v 为连接节点数目
                // max_no 为环内最大节点值
                int cur = i, v = 0, max_no = i, min_no = Integer.MAX_VALUE;
                // 存储环路径
                Node node = new Node();
                while (in[cur] > 0) {
                    v += nums[cur];
                    node.path.add(cur);
                    in[cur] = 0;
                    cur = edges[cur];
                    max_no = Math.max(max_no, cur);
                    min_no = Math.min(min_no, cur);
                }
                // H = L - V
                node.H = node.path.size() - v;
                node.maxNo = max_no;
                // 添加环路径
                paths.add(node);
            }

            List<Integer> path = paths.peek().path;
            int start = paths.peek().minNo;
            for (int i = 0; i < path.size(); i++) {
                System.out.print(start);
                start = edges[start];
                if (i != path.size() - 1)
                    System.out.print(" ");
            }
        }
    }

    public static void main(String[] args) {
        Solution solution = new C().new Solution();
        solution.solution();
    }
}

/*
4
3 3 0 2
 */
```

### 外卖项目

订单整个流程：

1. 前端点击提交订单，请求后端接口 /user/order/submit
2. 后端生产订单信息(唯一 orderNO，OD/RF + 时间戳 + 10UUID)插入 orders 表，将购物车信息插入 orderDetail 表，并返回订单部分信息 orderNO, money
3. 前端获得订单信息后跳转到支付页面，点击支付后请求后端接口 /user/order/payment, 参数为 orderNO, money
4. 后端生成预支付订单信息 PrepayWithRequestPaymentResponse 返回

```java
WeChatPayUtil2.jsapi(
        "永达无界订单", // 商品描述
        ordersPaymentDTO.getOrderNumber(), // 商户订单号
        ordersPaymentDTO.getAmount(), // 支付金额，单位 元
        user.getOpenid() // 微信用户的openid
```

- 前端调用 uni.requestPayment 参数为 预支付订单信息
- 支付成功后会回调接口 /notify/paySuccess，解密返回信息，支付成功会更新订单状态等操作，注意防止重复回调问题，并发使用 sychorized，分布式使用分布式锁
- 回调中使用 websocket 进行订单通知
- 使用 rabbitmq 延迟队列进行订单失效，会回调微信查询状态进行兜底

### OJ 系统

判题流程：

- 用户点击提交代码，使用 rabbitmq 异步调用给判题模块
- 判题模块远程调用代码沙箱，入参为代码和输入用例和限制时间，内存
- 代码沙箱流程：
  - 保存代码到文件中
  - process javac 编译代码
  - 创建 docker jdk 容器用来运行代码，获取输出，返回结果
  - 使用 StopWatch 获取超时时间，java stat 获取内存
  - 整理输出结果，删除代码







使用技术

设计模式

线程创建方式

介绍项目

**线程池使用场景**

redis 使用场景，**配置参数**

rabbitmq 使用场景，模式



手撕：全排列，

回顾机考

读书

遇到的问题

<<<<<<< HEAD


介绍 ISDP 系统:
ISDP 是一个数字化交付平台，主要有三大使用群体: 华为，分包商，客户，集成了项目管理、站点管理、资产管理、移动应用和专业工具，整个平台是以项目为中心的

在这个项目立项后，会有一个项目范围的管理，然后会基于这个交付目标会创建一个主计划，在这个主计划下就会有一些支撑计划: 比如人力计划，采购计划，经营计划有了主计划之后，就会细分出来实施计划(三大群体就可以根据这个计划去实施)，这里就可以设置这个计划的责任人，排期
整个实施计划: 现场勘测 -> 提交所需物料 -> 仓库审批后发送物料 -> 签收物料 -> 硬件安装 -> 质量质检 -> 完工验收
首先会进行现场勘测，然后提交这个安装所需的物料，仓库审批后会发送物料，后续签收物料后就可以进行基站的安装，在作业的过程也会进行监控和提醒，.保障这个作业的安全，安装完成后就会对他进行一个质检和验收



负责模块: 

我负责的是一个范围管理的模块，它主要是管理这个合同，包含这个合同清单，合同交底，评估这个合同的可交付性，合同的风险和问题



需求: 做这个合同指标的查看和管理，会从另外一个 ihub 系统，获取到合同编码，指标等数据保存到本地数据库，用户就可以查看和修改指标，基线值，备注等等，是否审批，来自这个 DRX 的系统



最开始了解整个项目的业务，然后开始便理解代码边优化，完善项目的单元测试，代码的瘦身，get，下降四万，做需求，



技术的提升：接触到这个单元测试，编写插件，做需求

对需求的理解和设计实现方案：实习接触到的都是真实的需求，在写需求之前都会设计一下方案，如何问一下倒是

合作能力：需求需要跟前端，测试，外部接口



反问：新人的培养方式和实习不同



redis 配置参数：

**bind：**配置可连接的ip地址，0.0.0.0代表任何地址都可以访问redis

**port：**连接端口

**protected-mode：**安全模式，3.2以后版本才有，需要公网访问的情况下才设置为no

**tcp-backlog：**此参数确定了TCP连接中已完成队列（完成三次握手之后）的长度，当然此值必须不大于Linux系统定义的/proc/sys/net/core/somaxconn值，默认是511，而Linux的默认参数值是128。当系统并发量大并且客户端速度缓慢的时候，可以将这二个参数一起参考设定

**timeout：**客户端超时时间，超过该时间就会断开连接，0代表不启用该功能

**tcp-keepalive：**每n秒进行一次心跳检测，0代表不启用该功能

**pidfile：**pid文件，一个redis实例就会生成一个pid文件

**logfile：**日志文件位置

**databases：**设置redis中数据库的数量

**save：**如果redis持久化方式为rdb，则需要配置，举个例子save 300 1，代表300秒内至少有一个key发生变化的情况下，才会报错rdb文件

**stop-writes-on-bgsave-error：**rdb持久化过程中发生错误时redis是否正常工作

**rdbcompression：**是否开启rdb文件压缩，可以节省磁盘空间，redis会采用LZF算法，需要消耗cpu资源

**rdbchecksum：**是否校验rdb文件(默认值yese)。在存储快照后，我们还可以让redis使用CRC64算法来进行数据校验，但是这样做会增加大约10%的性能消耗，如果希望获取到最大的性能提升，可以关闭此功能。

**dbfilename：**rdb文件名

**dir：**数据文件存放目录

**slave-serve-stale-data：**默认值为yes。当一个slave和master失去联系，或者复制正在进行时，slave可能会有两种表现：1. yes，slave仍然会应答客户端请求，但返回的数据可能是过时，或者数据可能是空的在第一次同步的时，2. no，在你执行除了info he slaveof之外的其他命令时，slave都将返回一个"SYNC with master in progress"的错误。

**slave-read-only：**从节点是否只接收并处理读请求

**repl-diskless-sync：**主从数据复制是否使用无硬盘复制功能。硬盘备份：redis主站创建一个新的进程，用于把rdb文件写在硬盘上。过一会儿，其父进程递增地将文件传送给从节点。无硬盘备份：redis主站创建一个新的进程，子进程直接把rdb文件推送给从节点，不需要用到硬盘。

**repl-diskless-sync-delay：**当启用无硬盘备份时，服务器会等待一段时间后才开始推送rdb文件

**repl-disable-tcp-nodelay：**同步之后是否禁用从站上的TCP_NODELAY 如果你选择yes，redis会使用较少量的TCP包和带宽向从站发送数据。但这会导致在从站增加一点数据的延时。 Linux内核默认配置情况下最多40毫秒的延时。如果选择no，从站的数据延时不会那么多，但备份需要的带宽相对较多。默认情况下我们将潜在因素优化，但在高负载情况下或者在主从站都跳的情况下，把它切换为yes是个好主意。默认值为no

**slave-priority：**子节点晋升成主节点的优先级

**maxmemory：**设置redis可以使用的内存量。一旦到达内存使用上限，redis将试图移除内部数据，移除规则可以通过maxmemory-policy来指定

**maxmemory-policy：**redis提供了6中移除规则：volatile-lru：使用LRU算法移除过期集合中的key。allkeys-lru：使用LRU算法移除key。allkeys-lru：使用LRU算法移除key。allkeys-random：移除随机的key。volatile-ttl：移除那些TTL值最小的key，即那些最近才过期的key。noeviction：不进行移除。针对写操作，只是返回错误信息。

**appendonly：**开启aof持久化模式

**appendfsync：**持久化策略，no：表示不执行fsync，由操作系统保证数据同步到磁盘，速度最快。always：表示每次写入都执行fsync，以保证数据同步到磁盘。always：表示每次写入都执行fsync，以保证数据同步到磁盘。

**no-appendfsync-on-rewrite：**是否重写aof文件，用于减小aof文件大小

**auto-aof-rewrite-percentage：**当aof文件超过上次大小的百分比，会重写文件

**auto-aof-rewrite-min-size：**设置重写的最小的文件大小，防止文件较小但是又执行了重写操作

**aof-load-truncated：**aof文件可能在尾部是不完整的，当redis启动的时候，aof文件的数据被载入内存。重启可能发生在redis所在的主机操作系统宕机后，尤其在ext4文件系统没有加上data=ordered选项，出现这种现象 redis宕机或者异常终止不会造成尾部不完整现象，可以选择让redis退出，或者导入尽可能多的数据。如果选择的是yes，当截断的aof文件被导入的时候，会自动发布一个log给客户端然后load。如果是no，用户必须手动redis-check-aof修复AOF文件才可以。默认值为 yes。

**lua-time-limit：**lua脚本最大运行时间

**cluster-enabled：**是否启用集群

**cluster-config-file：**集群配置文件，由redis自动生成

**cluster-node-timeout：**节点互连的超时时间

**cluster-slave-validity-factor：**可以配置值为10。在进行故障转移的时候，全部slave都会请求申请为master，但是有些slave可能与master断开连接一段时间了， 导致数据过于陈旧，这样的slave不应该被提升为master。该参数就是用来判断slave节点与master断线的时间是否过长。判断方法是：比较slave断开连接的时间和(node-timeout * slave-validity-factor) + repl-ping-slave-period 如果节点超时时间为三十秒, 并且slave-validity-factor为10,假设默认的repl-ping-slave-period是10秒，即如果超过310秒slave将不会尝试进行故障转移

**cluster-require-full-coverage：**当节点故障时，如果由hash槽没有被分配，配置为yes时，不会对外提供服务，配置为no时仍然能提供服务

**slowlog-log-slower-than：**当redis命令执行时间超过此时间会被记录到slowlog中，单位为微秒

**slowlog-max-len：**慢日志最大长度

**latency-monitor-threshold：**延迟监控，0为关闭

**hash-max-ziplist-entries：**hash类型的数据结构在编码上可以使用ziplist和hashtable。hash类型的数据结构在编码上可以使用ziplist和hashtable。因此redis对hash类型默认采取ziplist。如果hash中条目的条目个数或者value长度达到阀值,将会被重构为hashtable。因此redis对hash类型默认采取ziplist。如果hash中条目的条目个数或者value长度达到阀值，将会被重构为hashtable。这个参数指的是ziplist中允许存储的最大条目个数，默认为512，建议为128

**hash-max-ziplist-value：**ziplist中允许条目value值最大字节数，默认为64，建议为1024

**list-max-ziplist-siz：**当取正值的时候，表示按照数据项个数来限定每个quicklist节点上的ziplist长度。比如，当这个参数配置成5的时候，表示每个quicklist节点的ziplist最多包含5个数据项。当取负值的时候，表示按照占用字节数来限定每个quicklist节点上的ziplist长度。这时，它只能取-1到-5这五个值，每个值含义如下：-5: 每个quicklist节点上的ziplist大小不能超过64 Kb。（注：1kb => 1024 bytes）。-4: 每个quicklist节点上的ziplist大小不能超过32 Kb。-3: 每个quicklist节点上的ziplist大小不能超过16 Kb。-2: 每个quicklist节点上的ziplist大小不能超过8 Kb。（-2是Redis给出的默认值）-1: 每个quicklist节点上的ziplist大小不能超过4 Kb。

**activerehashing：**是否需要再hash，配置为yes的情况下，redis会每100ms花费1ms对hash的数据结构做再hash，可以降低内存使用量

**aof-rewrite-incremental-fsync：**aof重写时，每32MB进行一次fsync，避免写入磁盘时较大延迟

**requirepass：**设置密码


线程池使用场景：处理网络请求任务，redis？

rabbitmq 模式：
简单模式
一个生产者，一个消费者，一个队列，采用默认交换机。可以理解为生产者P发送消息到队列Q，一个消费者C接收。

工作模式
一个生产者，多个消费者，一个队列，采用默认交换机。可以理解为生产者P发送消息到队列Q，可以由多个消费者C1、C2进行接收。

发布/订阅模式（fanout）
功能：一个生产者、一个 fanout 类型的交换机、多个队列、多个消费者。一个生产者发送的消息会被多个消费者获取。其中 fanout 类型就是发布订阅模式，只有订阅该生产者的消费者会收到消息。


路由模式（direct）
功能：一个生产者，一个 direct 类型的交换机，多个队列，交换机与队列之间通过 routing-key 进行关联绑定，多个消费者。生产者发送消息到交换机并且要指定routing-key，然后消息根据这交换机与队列之间的 routing-key 绑定规则进行路由被指定消费者消费。

主题模式（topic)
说明：一个生产者，一个 topic 类型的交换机，多个队列，交换机与队列之间通过 routing-key 进行关联绑定，多个消费者。生产者发送消息到交换机并且要指定 routing-key，然后消息根据这交换机与队列之间的 routing-key 绑定规则进行路由被指定消费者消费。与路由模式不同是 routing-key 有指定的队则，可以更加的通用，满足更过的场景。routing-key 的规则如下：

#：匹配一个或者多个词，例如lazy.# 可以匹配 lazy.xxx 或者 lazy.xxx.xxx
*：只能匹配一个词，例如lazy.* 只能匹配 lazy.xxx
