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

**bind：** 配置可连接的 ip 地址，0.0.0.0 代表任何地址都可以访问 redis

**port：** 连接端口

**protected-mode：** 安全模式，3.2 以后版本才有，需要公网访问的情况下才设置为 no

**tcp-backlog：** 此参数确定了 TCP 连接中已完成队列（完成三次握手之后）的长度，当然此值必须不大于 Linux 系统定义的/proc/sys/net/core/somaxconn 值，默认是 511，而 Linux 的默认参数值是 128。当系统并发量大并且客户端速度缓慢的时候，可以将这二个参数一起参考设定

**timeout：** 客户端超时时间，超过该时间就会断开连接，0 代表不启用该功能

**tcp-keepalive：** 每 n 秒进行一次心跳检测，0 代表不启用该功能

**pidfile：** pid 文件，一个 redis 实例就会生成一个 pid 文件

**logfile：** 日志文件位置

**databases：** 设置 redis 中数据库的数量

**save：** 如果 redis 持久化方式为 rdb，则需要配置，举个例子 save 300 1，代表 300 秒内至少有一个 key 发生变化的情况下，才会报错 rdb 文件

**stop-writes-on-bgsave-error：** rdb 持久化过程中发生错误时 redis 是否正常工作

**rdbcompression：** 是否开启 rdb 文件压缩，可以节省磁盘空间，redis 会采用 LZF 算法，需要消耗 cpu 资源

**rdbchecksum：** 是否校验 rdb 文件(默认值 yese)。在存储快照后，我们还可以让 redis 使用 CRC64 算法来进行数据校验，但是这样做会增加大约 10%的性能消耗，如果希望获取到最大的性能提升，可以关闭此功能。

**dbfilename：** rdb 文件名

**dir：** 数据文件存放目录

**slave-serve-stale-data：** 默认值为 yes。当一个 slave 和 master 失去联系，或者复制正在进行时，slave 可能会有两种表现：1. yes，slave 仍然会应答客户端请求，但返回的数据可能是过时，或者数据可能是空的在第一次同步的时，2. no，在你执行除了 info he slaveof 之外的其他命令时，slave 都将返回一个 "SYNC with master in progress" 的错误。

**slave-read-only：** 从节点是否只接收并处理读请求

**repl-diskless-sync：** 主从数据复制是否使用无硬盘复制功能。硬盘备份：redis 主站创建一个新的进程，用于把 rdb 文件写在硬盘上。过一会儿，其父进程递增地将文件传送给从节点。无硬盘备份：redis 主站创建一个新的进程，子进程直接把 rdb 文件推送给从节点，不需要用到硬盘。

**repl-diskless-sync-delay：** 当启用无硬盘备份时，服务器会等待一段时间后才开始推送 rdb 文件

**repl-disable-tcp-nodelay：** 同步之后是否禁用从站上的 TCP_NODELAY 如果你选择 yes，redis 会使用较少量的 TCP 包和带宽向从站发送数据。但这会导致在从站增加一点数据的延时。 Linux 内核默认配置情况下最多 40 毫秒的延时。如果选择 no，从站的数据延时不会那么多，但备份需要的带宽相对较多。默认情况下我们将潜在因素优化，但在高负载情况下或者在主从站都跳的情况下，把它切换为 yes 是个好主意。默认值为 no

**slave-priority：** 子节点晋升成主节点的优先级

**maxmemory：** 设置 redis 可以使用的内存量。一旦到达内存使用上限，redis 将试图移除内部数据，移除规则可以通过 maxmemory-policy 来指定

**maxmemory-policy：** redis 提供了 6 中移除规则：volatile-lru：使用 LRU 算法移除过期集合中的 key。allkeys-lru：使用 LRU 算法移除 key。allkeys-lru：使用 LRU 算法移除 key。allkeys-random：移除随机的 key。volatile-ttl：移除那些 TTL 值最小的 key，即那些最近才过期的 key。noeviction：不进行移除。针对写操作，只是返回错误信息。

**appendonly：** 开启 aof 持久化模式

**appendfsync：** 持久化策略，no：表示不执行 fsync，由操作系统保证数据同步到磁盘，速度最快。always：表示每次写入都执行 fsync，以保证数据同步到磁盘。always：表示每次写入都执行 fsync，以保证数据同步到磁盘。

**no-appendfsync-on-rewrite：** 是否重写 aof 文件，用于减小 aof 文件大小

**auto-aof-rewrite-percentage：** 当 aof 文件超过上次大小的百分比，会重写文件

**auto-aof-rewrite-min-size：** 设置重写的最小的文件大小，防止文件较小但是又执行了重写操作

**aof-load-truncated：** aof 文件可能在尾部是不完整的，当 redis 启动的时候，aof 文件的数据被载入内存。重启可能发生在 redis 所在的主机操作系统宕机后，尤其在 ext4 文件系统没有加上 data = ordered 选项，出现这种现象 redis 宕机或者异常终止不会造成尾部不完整现象，可以选择让 redis 退出，或者导入尽可能多的数据。如果选择的是 yes，当截断的 aof 文件被导入的时候，会自动发布一个 log 给客户端然后 load。如果是 no，用户必须手动 redis-check-aof 修复 AOF 文件才可以。默认值为 yes。

**lua-time-limit：** lua 脚本最大运行时间

**cluster-enabled：** 是否启用集群

**cluster-config-file：** 集群配置文件，由 redis 自动生成

**cluster-node-timeout：** 节点互连的超时时间

**cluster-slave-validity-factor：** 可以配置值为 10。在进行故障转移的时候，全部 slave 都会请求申请为 master，但是有些 slave 可能与 master 断开连接一段时间了， 导致数据过于陈旧，这样的 slave 不应该被提升为 master。该参数就是用来判断 slave 节点与 master 断线的时间是否过长。判断方法是：比较 slave 断开连接的时间和(node-timeout * slave-validity-factor) + repl-ping-slave-period 如果节点超时时间为三十秒, 并且 slave-validity-factor 为 10, 假设默认的 repl-ping-slave-period 是 10 秒，即如果超过 310 秒 slave 将不会尝试进行故障转移

**cluster-require-full-coverage：** 当节点故障时，如果由 hash 槽没有被分配，配置为 yes 时，不会对外提供服务，配置为 no 时仍然能提供服务

**slowlog-log-slower-than：** 当 redis 命令执行时间超过此时间会被记录到 slowlog 中，单位为微秒

**slowlog-max-len：** 慢日志最大长度

**latency-monitor-threshold：** 延迟监控，0 为关闭

**hash-max-ziplist-entries：** hash 类型的数据结构在编码上可以使用 ziplist 和 hashtable。hash 类型的数据结构在编码上可以使用 ziplist 和 hashtable。因此 redis 对 hash 类型默认采取 ziplist。如果 hash 中条目的条目个数或者 value 长度达到阀值, 将会被重构为 hashtable。因此 redis 对 hash 类型默认采取 ziplist。如果 hash 中条目的条目个数或者 value 长度达到阀值，将会被重构为 hashtable。这个参数指的是 ziplist 中允许存储的最大条目个数，默认为 512，建议为 128

**hash-max-ziplist-value：** ziplist 中允许条目 value 值最大字节数，默认为 64，建议为 1024

**list-max-ziplist-siz：** 当取正值的时候，表示按照数据项个数来限定每个 quicklist 节点上的 ziplist 长度。比如，当这个参数配置成 5 的时候，表示每个 quicklist 节点的 ziplist 最多包含 5 个数据项。当取负值的时候，表示按照占用字节数来限定每个 quicklist 节点上的 ziplist 长度。这时，它只能取-1 到-5 这五个值，每个值含义如下：-5: 每个 quicklist 节点上的 ziplist 大小不能超过 64 Kb。（注：1kb => 1024 bytes）。-4: 每个 quicklist 节点上的 ziplist 大小不能超过 32 Kb。-3: 每个 quicklist 节点上的 ziplist 大小不能超过 16 Kb。-2: 每个 quicklist 节点上的 ziplist 大小不能超过 8 Kb。（-2 是 Redis 给出的默认值）-1: 每个 quicklist 节点上的 ziplist 大小不能超过 4 Kb。

**activerehashing：** 是否需要再 hash，配置为 yes 的情况下，redis 会每 100ms 花费 1ms 对 hash 的数据结构做再 hash，可以降低内存使用量

**aof-rewrite-incremental-fsync：** aof 重写时，每 32MB 进行一次 fsync，避免写入磁盘时较大延迟

**requirepass：** 设置密码


线程池使用场景：处理网络请求任务，redis？

rabbitmq 模式：
简单模式
一个生产者，一个消费者，一个队列，采用默认交换机。可以理解为生产者 P 发送消息到队列 Q，一个消费者 C 接收。

工作模式
一个生产者，多个消费者，一个队列，采用默认交换机。可以理解为生产者 P 发送消息到队列 Q，可以由多个消费者 C1、C2 进行接收。

发布/订阅模式（fanout）
功能：一个生产者、一个 fanout 类型的交换机、多个队列、多个消费者。一个生产者发送的消息会被多个消费者获取。其中 fanout 类型就是发布订阅模式，只有订阅该生产者的消费者会收到消息。


路由模式（direct）
功能：一个生产者，一个 direct 类型的交换机，多个队列，交换机与队列之间通过 routing-key 进行关联绑定，多个消费者。生产者发送消息到交换机并且要指定 routing-key，然后消息根据这交换机与队列之间的 routing-key 绑定规则进行路由被指定消费者消费。

主题模式（topic)
说明：一个生产者，一个 topic 类型的交换机，多个队列，交换机与队列之间通过 routing-key 进行关联绑定，多个消费者。生产者发送消息到交换机并且要指定 routing-key，然后消息根据这交换机与队列之间的 routing-key 绑定规则进行路由被指定消费者消费。与路由模式不同是 routing-key 有指定的队则，可以更加的通用，满足更过的场景。routing-key 的规则如下：

#：匹配一个或者多个词，例如 lazy.# 可以匹配 lazy.xxx 或者 lazy.xxx.xxx
*：只能匹配一个词，例如 lazy.* 只能匹配 lazy.xxx

### Java 抽象类和接口的区别是什么？

**两者的特点：**

- 抽象类用于描述类的共同特性和行为，可以有成员变量、构造方法和具体方法。适用于有明显继承关系的场景。
- 接口用于定义行为规范，可以多实现，只能有常量和抽象方法（Java 8 以后可以有默认方法和静态方法）。适用于定义类的能力或功能。

**两者的区别：**

- 实现方式：实现接口的关键字为 implements，继承抽象类的关键字为 extends。一个类可以实现多个接口，但一个类只能继承一个抽象类。所以，使用接口可以间接地实现多重继承。
- 方法方式：接口只有定义，不能有方法的实现，java 1.8 中可以定义 default 方法体，而抽象类可以有定义与实现，方法可在抽象类中实现。
- 访问修饰符：接口成员变量默认为 public static final，必须赋初值，不能被修改；其所有的成员方法都是 public、abstract 的。抽象类中成员变量默认 default，可在子类中被重新定义，也可被重新赋值；抽象方法被 abstract 修饰，不能被 private、static、synchronized 和 native 等修饰，必须以分号结尾，不带花括号。
- 变量：抽象类可以包含实例变量和静态变量，而接口只能包含常量（即静态常量）

### Linux 的交换分区

**交换分区**（Swap Partition）是一种用于 **虚拟内存管理** 的机制，它在物理内存（RAM）不足时，为系统提供额外的临时内存空间。交换分区的作用是将不活跃的内存页面临时存放到硬盘中，从而释放物理内存给其他更活跃的进程使用。

### Https 的证书包含哪些内容

1. 证书的持有者的信息：域名
2. 证书颁发机构 CA 的信息
3. 服务器公钥
4. 证书的有效期
5. 证书的指纹，他会通过哈希进行运算，保证证书的完整性

#### http 请求报文主要包括什么

请求行：

- 请求方法
- 请求 URL
- HTTP 版本

请求头部：

- HOST
- Content-Type

请求体：

- POST 存储数据



## 睿联

静态多态：一个类有多个重载的方法

动态多态：子类重写方法，调用不同对象

装饰器模式：

代理模式：

怎么让 token 失效：

数字证书：

标识长度：

优化：数据量达到 2.几 





throw:

1. 抛出异常：throw 用在方法内，用来手动抛出一个异常，后面跟一个异常实例

```java
public void divide(int dividend, int divisor) {
    if (divisor == 0) {
        throw new ArithmeticException("除数不能为0");
    }
    // 执行除法操作
}
```

throws：

1. 异常声明：声明方法可能抛出的异常类型，后面跟一个异常类型
2. 编译时检查：调用者需要捕获或者进一步声明抛出异常

```java
public void readFile(String path) throws FileNotFoundException {
    // 文件读取操作，可能会抛出FileNotFoundException
    FileReader file = new FileReader(path);
    // ...
}
```

#### 主要区别

- `throw` 是抛出一个具体的异常实例, 后面跟的是异常对象，而 `throws` 是声明方法可能会抛出的异常类型, 后面跟的是异常类型。
- `throw` 用在代码块中，可以在任何地方使用（只要在方法体内部），而 `throws` 是方法声明的一部分，用在方法签名后面。
- 使用 `throw` 抛出的异常不需要在方法签名中声明，但必须在方法体内处理；而使用 `throws` 声明的异常，调用者必须处理或声明抛出。

为什么要抛出异常：

1. 异常必须由容器来处理，异常时容器做出不同处理的依据和触发；

   例如：有事务处理的方法中，事务相关的逻辑必须抛出异常，而不能捕获异常，否则会导致事务不回滚。

2. 本地方法不知道如何处理，只有调用方才可能知道如何处理异常；

   例如：双 Token 机制，AccessToken 和 RefreshToken，对于 AccessToken 过期会验证 RefreshToken 的有效性，如何返回一个新的 AccessToken，而对于 AccessToken 验证失败会进行重新登录

   例如：一些底层的方法，其可能出现多种异常，且调用方可能根据不同的异常做出不同的处理，只能抛出异常，而且必须是具体的异常类型，而不能是笼统的 Exception 类型。



线程池：

参数：

```java
public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              RejectedExecutionHandler handler)
```

1. 核心线程数：这些线程处于空闲状态也不会销毁
2. 最大线程数：当新任务到来，有空闲线程就处理，没有且小于核心线程数，则创建新的线程去处理，否则任务加到阻塞队列，阻塞队列满的时候会从头部取出一个线程来处理，加入尾部，大于最大线程数则拒绝
3. keepAliveTime：线程大于核心线程数时，空闲线程的保留时间
4. unit：时间单位
5. 工作队列
6. 线程工程，名称
7. 拒绝策略：使用调用线程的线程去处理，抛出异常，拒绝任务，抛弃最老的

- CallerRunsPolicy，使用线程池的调用者所在的线程去执行被拒绝的任务，除非线程池被停止或者线程池的任务队列已有空缺。
- AbortPolicy，直接抛出一个任务被线程池拒绝的异常。
- DiscardPolicy，不做任何处理，静默拒绝提交的任务。
- DiscardOldestPolicy，抛弃最老的任务，然后执行该任务。
- 自定义拒绝策略，通过实现接口可以自定义任务拒绝策略。

种类：

newFixedThreadPool

```java
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>());
}
```

##### newSingleThreadExecutor

```java
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService
        (new ThreadPoolExecutor(1, 1,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>()));
}
```

##### newCachedThreadPool

```java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                    60L, TimeUnit.SECONDS,
                                    new SynchronousQueue<Runnable>());
}
```



对于执行计划，参数有：

- possible_keys 字段表示可能用到的索引；
- key 字段表示实际用的索引，如果这一项为 NULL，说明没有使用索引；
- key_len 表示索引的长度；
- rows 表示扫描的数据行数。
- type 表示数据扫描类型，我们需要重点看这个。

type 字段就是描述了找到所需数据时使用的扫描方式是什么，常见扫描类型的执行效率从低到高的顺序为：

- All（全表扫描）：在这些情况里，all 是最坏的情况，因为采用了全表扫描的方式。
- index（全索引扫描）：index 和 all 差不多，只不过 index 对索引表进行全扫描，这样做的好处是不再需要对数据进行排序，但是开销依然很大。所以，要尽量避免全表扫描和全索引扫描。
- range（索引范围扫描）：range 表示采用了索引范围扫描，一般在 where 子句中使用 < 、>、in、between 等关键词，只检索给定范围的行，属于范围查找。从这一级别开始，索引的作用会越来越明显，因此我们需要尽量让 SQL 查询可以使用到 range 这一级别及以上的 type 访问方式。
- ref（非唯一索引扫描）：ref 类型表示采用了非唯一索引，或者是唯一索引的非唯一性前缀，返回数据返回可能是多条。因为虽然使用了索引，但该索引列的值并不唯一，有重复。这样即使使用索引快速查找到了第一条数据，仍然不能停止，要进行目标值附近的小范围扫描。但它的好处是它并不需要扫全表，因为索引是有序的，即便有重复值，也是在一个非常小的范围内扫描。
- eq_ref（唯一索引扫描）：eq_ref 类型是使用主键或唯一索引时产生的访问方式，通常使用在多表联查中。比如，对两张表进行联查，关联条件是两张表的 user_id 相等，且 user_id 是唯一索引，那么使用 EXPLAIN 进行执行计划查看的时候，type 就会显示 eq_ref。
- const（结果只有一条的主键或唯一索引扫描）：const 类型表示使用了主键或者唯一索引与常量值进行比较，比如 select name from product where id = 1。需要说明的是 const 类型和 eq_ref 都使用了主键或唯一索引，不过这两个类型有所区别，const 是与常量进行比较，查询效率会更快，而 eq_ref 通常用于多表联查中。



-  互斥 **条件**：一个资源每次只能被一个进程使用；
-  请求与保持 **条件**：一个进程因请求资源而阻塞时，对已获得的资源保持不放；
-  不剥夺 **条件**：进程已获得的资源，在没使用完之前，不能强行剥夺；
-  循环等待 **条件**：多个进程之间形成一种互相循环等待资源的关系。





注解@interface 是一个实现了 Annotation 接口的 接口，  然后在调用 getDeclaredAnnotations()方法的时候，返回一个代理$Proxy 对象，这个是使用 jdk 动态代理创建，使用 Proxy 的 newProxyInstance 方法时候，传入接口 和 InvocationHandler 的一个实例(也就是 AnotationInvocationHandler) ，最后返回一个代理实例。

// Map 保存了注解的成员属性的名称和值的映射，注解成员属性的名称实际上就对应着接口中抽象方法的名称





1. 用户发送请求至前端控制器DispatcherServlet
2. DispatcherServlet收到请求调用处理器映射器HandlerMapping。
3. 处理器映射器根据请求url找到具体的处理器，生成处理器执行链HandlerExecutionChain(包括处理器对象和处理器拦截器)一并返回给DispatcherServlet。
4. DispatcherServlet根据处理器Handler获取处理器适配器HandlerAdapter执行HandlerAdapter处理一系列的操作，如：参数封装，数据格式转换，数据验证等操作
5. 执行处理器Handler(Controller，也叫页面控制器)。
6. Handler执行完成返回ModelAndView
7. HandlerAdapter将Handler执行结果ModelAndView返回到DispatcherServlet
8. DispatcherServlet将ModelAndView传给ViewReslover视图解析器
9. ViewReslover解析后返回具体View
10. DispatcherServlet对View进行渲染视图（即将模型数据model填充至视图中）。
11. DispatcherServlet响应用户。



项目难点：外卖平台是第一个落地的项目，所以他就需要去学习很多新的知识以及这种团队协作，比如上线的整个流程，需要网站域名的备案，小程序的备案和开发，以及服务器的部署，还有在做支付这块，因为之前学习的都是这种虚拟项目，就不会涉及到真实支付的场景，就需要去学习微信支付的整个流程，以及如何确保他的可靠性，当时我们在实际测试的过程就遇到了支付方面相关的 bug，

OJ 系统，他就偏向技术方面，如何保证代码在你服务器上运行而不会被恶意代码破坏宿主机，使用了docker去运行，使用额外的线程去监控他的 内存，运行时间，防止他内存过大，超时等问题，来保证他的安全性

优点：自律，学习能力强，合作能力强

缺点：

做半导体设备相关的



介绍 ISDP 系统:
ISDP 是一个数字化现场作业平台，主要有三大使用群体: 华为，分包商，客户，集成了项目管理、站点管理、资产管理、移动应用和专业工具，整个平台是以项目为中心的

在这个项目立项后，会有一个项目范围的管理，然后会基于这个交付目标会创建一个主计划，在这个主计划下就会有一些支撑计划: 比如人力计划，采购计划，经营计划有了主计划之后，就会细分出来实施计划(三大群体就可以根据这个计划去实施)，这里就可以设置这个计划的责任人，排期
整个实施计划: 现场勘测 -> 提交所需物料 -> 仓库审批后发送物料 -> 签收物料 -> 硬件安装 -> 质量质检 -> 完工验收
首先会进行现场勘测，然后提交这个安装所需的物料，仓库审批后会发送物料，后续签收物料后就可以进行基站的安装，在作业的过程也会进行监控和提醒，.保障这个作业的安全，安装完成后就会对他进行一个质检和验收
