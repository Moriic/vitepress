# Redis

## Redis 概念

### Redis 快原因

- Redis 基于内存，内存访问速度比磁盘快很多
- Redis 基于 Reactor 模式开发了一套高效的事件处理模型，主要是单线程事件循环和 IO 多路复用
- Redis 内存了多种优化过后的数据类型/结构实现，性能高
- Redis 通信协议实现简单且解析高效

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711944925_0.jpg" alt="why-redis-so-fast-TbWX24ja" style="zoom: 33%;" />

### 为什么用 Redis

高性能，高并发，功能全面

### Redis vs Memcached(本地内存)

- Redis 支持的数据类型更丰富（String、Hash、List、Set、ZSet），而 Memcached 只支持最简单的 key-value 数据类型；
- Redis **支持数据的持久化**，可以将内存中的数据保持在磁盘中，重启的时候可以再次加载进行使用，而 Memcached 没有持久化功能，数据全部存在内存之中，Memcached 重启或者挂掉后，数据就没了；
- Redis **原生支持集群模式**，Memcached 没有原生的集群模式，需要依靠客户端来实现往集群中分片写入数据；
- Redis 支持发布订阅模型、Lua 脚本、事务等功能，而 Memcached 不支持；

## 常见的缓存读写策略

### 旁路缓存模式

**Cache Aside Pattern 是我们平时使用比较多的一个缓存读写模式，比较适合读请求比较多的场景。**

Cache Aside Pattern 中服务端需要同时维系 db 和 cache，并且是以 db 的结果为准。

**写：先更新 db -> 然后直接删除 cache 。**

**读**：从 cache 中读取数据，读取到就直接返回 -> cache 中读取不到的话，就从 db 中读取数据返回 -> 再把数据放到 cache 中。

**先删除 cache，后更新 db？**

答案：会造成 db 和 cache 不一致，

> 举例：请求 1 先写数据 A，请求 2 随后读数据 A
>
> 过程为：1 把 cache 中的 A 数据删除 -> 2 从 db 读取数据 -> 1 把 db 中的 A 数据更新

**在写数据的过程中，先更新 db，后删除 cache 就没有问题了么？**

答案：理论上来说还是可能会出现数据不一致性的问题，不过概率非常小，因为缓存的写入速度是比数据库的写入速度快很多。

> 举例：请求 1 先读数据 A，请求 2 随后写数据 A，并且数据 A 在请求 1 请求之前不在缓存中的话，也有可能产生数据不一致性的问题。
>
> 过程为：请求 1 从 db 读数据 A-> 请求 2 更新 db 中的数据 A(此时缓存中无数据 A ，故不用执行删除缓存操作 ) -> 请求 1 将数据 A 写入 cache

缺陷：

- 首次请求数据一定不在 cache(可预热)
- 写操作频繁的话导致 cache 中的数据会频繁删除，影响命中率
  - 数据库和缓存数据强一致场景：更新 db 的时候同样更新 cache，需要加锁/分布式锁保证更新 cache 不存在线程安全问题
  - 短暂允许数据库和缓存不一致的场景：更新 db 的时候同样更新 cache，但是给缓存加一个比较短的过期时间

### 读写穿透

Read/Write Through Pattern 中服务端把 cache 视为主要数据存储，从中读取数据并将数据写入其中。cache 服务负责将此数据读取和写入 db，从而减轻了应用程序的职责。

Redis 并没有提供 cache 将数据写入 db 的功能。

**写(Write Through)：**

- 先查 cache，cache 中不存在，直接更新 db。
- cache 中存在，则先更新 cache，然后 cache 服务自己更新 db(**同步更新 cache 和 db**)。

**读(Read Through)：**

- 从 cache 中读取数据，读取到就直接返回 。
- 读取不到的话，先从 db 加载，写入到 cache 后返回响应。

### 异步缓存写入

**Read/Write Through 是同步更新 cache 和 db，而 Write Behind 则是只更新缓存，不直接更新 db，而是改为异步批量的方式来更新 db。**

Write Behind Pattern 下 db 的写性能非常高，非常适合一些数据经常变化又对数据一致性要求没那么高的场景，比如浏览量、点赞量。

## Redis 应用

- **分布式锁**：通过 Redis 来做分布式锁是一种比较常见的方式。通常情况下，我们都是基于 Redisson 来实现分布式锁。关于 Redis 实现分布式锁的详细介绍，可以看我写的这篇文章：[分布式锁详解](https://javaguide.cn/distributed-system/distributed-lock.html)
- **限流**：一般是通过 Redis + Lua 脚本的方式来实现限流。如果不想自己写 Lua 脚本的话，也可以直接利用 Redisson 中的 `RRateLimiter` 来实现分布式限流，其底层实现就是基于 Lua 代码+令牌桶算法。
- **消息队列**：Redis 自带的 List 数据结构可以作为一个简单的队列使用。Redis 5.0 中增加的 Stream 类型的数据结构更加适合用来做消息队列。它比较类似于 Kafka，有主题和消费组的概念，支持消息持久化以及 ACK 机制。
- **延时队列**：Redisson 内置了延时队列(基于 Sorted Set 实现的)。
- **分布式 Session** ：利用 String 或者 Hash 数据类型保存 Session 数据，所有的服务器都可以访问。
- **复杂业务场景**：通过 Redis 以及 Redis 扩展(比如 Redisson)提供的数据结构，我们可以很方便地完成很多复杂的业务场景比如通过 Bitmap 统计活跃用户、通过 Sorted Set 维护排行榜。

## Redis 数据类型

- **5 种基础数据类型**：String(字符串)、List(列表)、Set(集合)、Hash(散列)、Zset(有序集合)。
- **3 种特殊数据类型**：HyperLogLog(基数统计)、Bitmap (位图)、Geospatial (地理位置)。

除了上面提到的之外，还有一些其他的比如 [Bloom filter(布隆过滤器)](https://javaguide.cn/cs-basics/data-structure/bloom-filter.html)

Redis 5 种基本数据类型对应的底层数据结构实现如下表所示：

| String | List                         | Hash          | Set          | Zset              |
| :----- | :--------------------------- | :------------ | :----------- | :---------------- |
| SDS    | LinkedList/ZipList/QuickList | Dict、ZipList | Dict、Intset | ZipList、SkipList |

Redis 3.2 之前，List 底层实现是 LinkedList 或者 ZipList。 Redis 3.2 之后，引入了 LinkedList 和 ZipList 的结合 QuickList，List 的底层实现变为 QuickList。从 Redis 7.0 开始， ZipList 被 ListPack 取代。

### String

虽然 Redis 是用 C 语言写的，但是 Redis 并没有使用 C 的字符串表示，而是自己构建了一种 **简单动态字符串**(Simple Dynamic String，**SDS**)。相比于 C 的原生字符串，Redis 的 SDS 不光可以保存文本数据还可以保存二进制数据，并且获取字符串长度复杂度为 O(1)(C 字符串为 O(N)), 除此之外，Redis 的 SDS API 是安全的，不会造成缓冲区溢出。

#### 应用场景

**需要存储常规数据的场景**

- 举例：缓存 Session、Token、图片地址、序列化后的对象(相比较于 Hash 存储更节省内存)。
- 相关命令：`SET`、`GET`。

**需要计数的场景**

- 举例：用户单位时间的请求数(简单限流可以用到)、页面单位时间的访问数。
- 相关命令：`SET`、`GET`、`INCR`、`DECR` 。

**分布式锁**

利用 `SETNX key value` 命令可以实现一个最简易的分布式锁(存在一些缺陷，通常不建议这样实现分布式锁)。

### List

Redis 的 List 的实现为一个 **双向链表**，即可以支持反向查找和遍历，更方便操作，不过带来了部分额外的内存开销。

`LRANGE key start end`：获取列表 start 和 end 之间 的元素，可以基于 List 实现分页查询，性能非常高！

#### 应用场景

**信息流展示**

- 举例：最新文章、最新动态。
- 相关命令：`LPUSH`、`LRANGE`。

**消息队列**

`List` 可以用来做消息队列，只是功能过于简单且存在很多缺陷，不建议这样做。

相对来说，Redis 5.0 新增加的一个数据结构 `Stream` 更适合做消息队列一些，只是功能依然非常简陋。和专业的消息队列相比，还是有很多欠缺的地方比如消息丢失和堆积问题不好解决。

### Hash

Redis 中的 Hash 是一个 String 类型的 field-value(键值对) 的映射表，特别适合用于存储对象，后续操作的时候，你可以直接修改这个对象中的某些字段的值。Hash 类似于 JDK1.8 前的 `HashMap`，内部实现也差不多(数组 + 链表)

#### 应用场景

**对象数据存储场景**

- 举例：用户信息、商品信息、文章信息、购物车信息。
- 相关命令：`HSET` (设置单个字段的值)、`HMSET`(设置多个字段的值)、`HGET`(获取单个字段的值)、`HMGET`(获取多个字段的值)。

### Set

Redis 中的 Set 类型是一种无序集合，集合中的元素没有先后顺序但都唯一，有点类似于 Java 中的 `HashSet` 。当你需要存储一个列表数据，又不希望出现重复数据时，Set 是一个很好的选择，并且 Set 提供了判断某个元素是否在一个 Set 集合内的重要接口，这个也是 List 所不能提供的。

你可以基于 Set 轻易实现交集、并集、差集的操作，比如你可以将一个用户所有的关注人存在一个集合中，将其所有粉丝存在一个集合。这样的话，Set 可以非常方便的实现如共同关注、共同粉丝、共同喜好等功能。这个过程也就是求交集的过程。

- `SINTER key1 key2 `：获取给定所有集合的交集
- `SUNION key1 key2 `：获取给定所有集合的并集
- `SDIFF key1 key2`：获取给定所有集合的差集

#### 应用场景

**需要存放的数据不能重复的场景**

- 举例：网站 UV 统计(数据量巨大的场景还是 `HyperLogLog` 更适合一些)、文章点赞、动态点赞等场景。
- 相关命令：`SCARD`(获取集合数量) 

**需要获取多个数据源交集、并集和差集的场景**

- 举例：共同好友(交集)、共同粉丝(交集)、共同关注(交集)、好友推荐(差集)、音乐推荐(差集)、订阅号推荐(差集+交集) 等场景。
- 相关命令：`SINTER`(交集)、`SINTERSTORE` (交集)、`SUNION` (并集)、`SUNIONSTORE`(并集)、`SDIFF`(差集)、`SDIFFSTORE` (差集)。

**需要随机获取数据源中的元素的场景**

- 举例：抽奖系统、随机点名等场景。
- 相关命令：`SPOP`(随机获取集合中的元素并移除，适合不允许重复中奖的场景)、`SRANDMEMBER`(随机获取集合中的元素，适合允许重复中奖的场景)。

### Sorted Set

Sorted Set 类似于 Set，但和 Set 相比，Sorted Set 增加了一个权重参数 `score`，使得集合中的元素能够按 `score` 进行有序排列，还可以通过 `score` 的范围来获取元素的列表。有点像是 Java 中 `HashMap` 和 `TreeSet` 的结合体。

- `ZRANGE key start end`：获取指定有序集合 start 和 end 之间的元素(score 从低到高)
- `ZREVRANGE key start end`：获取指定有序集合 start 和 end 之间的元素(score 从高到底)
- `ZREVRANK key member`：获取指定有序集合中指定元素的排名(score 从大到小排序)

#### 应用场景

**需要随机获取数据源中的元素根据某个权重进行排序的场景**

- 举例：各种排行榜比如直播间送礼物的排行榜、朋友圈的微信步数排行榜、王者荣耀中的段位排行榜、话题热度排行榜等等。
- 相关命令：`ZRANGE` (从小到大排序)、 `ZREVRANGE` (从大到小排序)、`ZREVRANK` (指定元素排名)。

### BitMap(位图)

Bitmap 存储的是连续的二进制数字(0 和 1)，通过 Bitmap, 只需要一个 bit 位来表示某个元素对应的值或者状态，key 就是对应元素本身 。我们知道 8 个 bit 可以组成一个 byte，所以 Bitmap 本身会极大的节省储存空间。

你可以将 Bitmap 看作是一个存储二进制数字(0 和 1)的数组，数组中每个元素的下标叫做 offset(偏移量)。

| 命令                                  | 介绍                                                         |
| ------------------------------------- | ------------------------------------------------------------ |
| SETBIT key offset value               | 设置指定 offset 位置的值                                     |
| GETBIT key offset                     | 获取指定 offset 位置的值                                     |
| BITCOUNT key start end                | 获取 start 和 end 之前值为 1 的元素个数                      |
| BITOP operation destkey key1 key2 ... | 对一个或多个 Bitmap 进行运算，可用运算符有 AND, OR, XOR 以及 NOT |

#### 应用场景

**需要保存状态信息(0/1 即可表示)的场景**

- 举例：用户签到情况、活跃用户情况、用户行为统计(比如是否点赞过某个视频)。
- 相关命令：`SETBIT`、`GETBIT`、`BITCOUNT`、`BITOP`

### HyperLogLog(基数统计)

HyperLogLog 是一种有名的基数计数概率算法 ，基于 LogLog Counting(LLC)优化改进得来，并不是 Redis 特有的，Redis 只是实现了这个算法并提供了一些开箱即用的 API。

Redis 提供的 HyperLogLog 占用空间非常非常小，只需要 12k 的空间就能存储接近 `2^64` 个不同元素。这是真的厉害，这就是数学的魅力么！并且，Redis 对 HyperLogLog 的存储结构做了优化，采用两种方式计数：

- **稀疏矩阵**：计数较少的时候，占用空间很小。
- **稠密矩阵**：计数达到某个阈值的时候，占用 12k 的空间。

基数计数概率算法为了节省内存并不会直接存储元数据，而是通过一定的概率统计方法预估基数值(集合中包含元素的个数)。因此， HyperLogLog 的计数结果并不是一个精确值，存在一定的误差(标准误差为 `0.81%` )。

| 命令                                      | 介绍                                                         |
| ----------------------------------------- | ------------------------------------------------------------ |
| PFADD key element1 element2 ...           | 添加一个或多个元素到 HyperLogLog 中                          |
| PFCOUNT key1 key2                         | 获取一个或者多个 HyperLogLog 的唯一计数。                    |
| PFMERGE destkey sourcekey1 sourcekey2 ... | 将多个 HyperLogLog 合并到 destkey 中，destkey 会结合多个源，算出对应的唯一计数。 |

#### 应用场景

**数量量巨大(百万、千万级别以上)的计数场景**

- 举例：热门网站每日/每周/每月访问 ip 数统计、热门帖子 uv 统计、
- 相关命令：`PFADD`、`PFCOUNT` 

### Geospatial(地理位置)

> [GEO 原理](https://juejin.cn/post/6844903966061363207)

Geospatial index(地理空间索引，简称 GEO) 主要用于存储地理位置信息，基于 Sorted Set 实现。

通过 GEO 我们可以轻松实现两个位置距离的计算、获取指定位置附近的元素等功能。

| 命令                                             | 介绍                                                         |
| ------------------------------------------------ | ------------------------------------------------------------ |
| GEOADD key longitude1 latitude1 member1 ...      | 添加一个或多个元素对应的经纬度信息到 GEO 中                  |
| GEOPOS key member1 member2 ...                   | 返回给定元素的经纬度信息                                     |
| GEODIST key member1 member2 M/KM/FT/MI           | 返回两个给定元素之间的距离                                   |
| GEORADIUS key longitude latitude radius distance | 获取指定位置附近 distance 范围内的其他元素，支持 ASC(由近到远)、DESC(由远到近)、Count(数量) 等参数 |
| GEORADIUSBYMEMBER key member radius distance     | 类似于 GEORADIUS 命令，只是参照的中心点是 GEO 中的元素       |

GEO 中存储的地理位置信息的经纬度数据通过 GeoHash 算法转换成了一个整数，这个整数作为 Sorted Set 的 score(权重参数)使用。

#### 应用场景

**需要管理使用地理空间数据的场景**

- 举例：附近的人。
- 相关命令: `GEOADD`、`GEORADIUS`、`GEORADIUSBYMEMBER` 。

## 持久化机制

使用缓存的时候，我们经常需要对内存中的数据进行持久化也就是将内存中的数据写入到硬盘中。大部分原因是为了之后重用数据(比如重启机器、机器故障之后恢复数据)，或者是为了做数据同步(比如 Redis 集群的主从节点通过 RDB 文件同步数据)。

Redis 不同于 Memcached 的很重要一点就是，Redis 支持持久化，而且支持 3 种持久化方式:

- 快照(snapshotting，RDB)
- 只追加文件(append-only file, AOF)
- RDB 和 AOF 的混合持久化(Redis 4.0 新增)

### RDB 持久化

Redis 可以通过创建快照来获得存储在内存里面的数据在 **某个时间点** 上的副本。Redis 创建快照之后，可以对快照进行备份，可以将快照复制到其他服务器从而创建具有相同数据的服务器副本(Redis 主从结构，主要用来提高 Redis 性能)，还可以将快照留在原地以便重启服务器的时候使用。

Redis 提供了两个命令来生成 RDB 快照文件：

- `save` : 同步保存操作，会阻塞 Redis 主线程；
- `bgsave` : fork 出一个子进程，子进程执行，不会阻塞 Redis 主线程，默认选项。

### AOF 持久化

与快照持久化相比，AOF 持久化的实时性更好。默认情况下 Redis 没有开启 AOF(append only file)方式的持久化(Redis 6.0 之后已经默认是开启了)，可以通过 `appendonly` 参数开启。

开启 AOF 持久化后每执行一条会更改 Redis 中的数据的命令，Redis 就会将该命令写入到 AOF 缓冲区 `server.aof_buf` 中，然后再写入到 AOF 文件中(此时还在系统内核缓存区未同步到磁盘)，最后再根据持久化方式( `fsync` 策略)的配置来决定何时将系统内核缓存区的数据同步到硬盘中的。

只有同步到磁盘中才算持久化保存了，否则依然存在数据丢失的风险，比如说：系统内核缓存区的数据还未同步，磁盘机器就宕机了，那这部分数据就算丢失了。

AOF 文件的保存位置和 RDB 文件的位置相同，都是通过 `dir` 参数设置的，默认的文件名是 `appendonly.aof`。

![aof-work-process](https://raw.githubusercontent.com/Moriic/picture/main/image/1712215946_0.png)

AOF 持久化功能的实现可以简单分为 5 步：

1. **命令追加(append)**：所有的写命令会追加到 AOF 缓冲区中。
2. **文件写入(write)**：将 AOF 缓冲区的数据写入到 AOF 文件中。这一步需要调用 `write` 函数(系统调用)，`write` 将数据写入到了系统内核缓冲区之后直接返回了(延迟写)。注意！！！此时并没有同步到磁盘。
3. **文件同步(fsync)**：AOF 缓冲区根据对应的持久化方式(`fsync` 策略)向硬盘做同步操作。这一步需要调用 `fsync` 函数(系统调用)， `fsync` 针对单个文件操作，对其进行强制硬盘同步，`fsync` 将阻塞直到写入磁盘完成后返回，保证了数据持久化。
4. **文件重写(rewrite)**：随着 AOF 文件越来越大，需要定期对 AOF 文件进行重写，达到压缩的目的。
5. **重启加载(load)**：当 Redis 重启时，可以加载 AOF 文件进行数据恢复。

- `write`：写入系统内核缓冲区之后直接返回（仅仅是写到缓冲区），不会立即同步到硬盘。虽然提高了效率，但也带来了数据丢失的风险。同步硬盘操作通常依赖于系统调度机制，Linux 内核通常为 30s 同步一次，具体值取决于写出的数据量和 I/O 缓冲区的状态。
- `fsync`：`fsync` 用于强制刷新系统内核缓冲区（同步到到磁盘），确保写磁盘操作结束才会返回。

#### AOF 持久化方式

在 Redis 的配置文件中存在三种不同的 AOF 持久化方式（ `fsync` 策略），它们分别是：

1. `appendfsync always`：主线程调用 `write` 执行写操作后，后台线程（ `aof_fsync` 线程）立即会调用 `fsync` 函数同步 AOF 文件（刷盘），`fsync` 完成后线程返回，这样会严重降低 Redis 的性能（`write` + `fsync`）。
2. `appendfsync everysec`：主线程调用 `write` 执行写操作后立即返回，由后台线程（ `aof_fsync` 线程）每秒钟调用 `fsync` 函数（系统调用）同步一次 AOF 文件（`write`+`fsync`，`fsync` 间隔为 1 秒）
3. `appendfsync no`：主线程调用 `write` 执行写操作后立即返回，让操作系统决定何时进行同步，Linux 下一般为 30 秒一次（`write` 但不 `fsync`，`fsync` 的时机由操作系统决定）。

#### AOF 在执行命令完后记录日志

关系型数据库（如 MySQL）通常都是执行命令之前记录日志（方便故障恢复），而 Redis AOF 持久化机制是在执行完命令之后再记录日志。

**为什么是在执行完命令之后记录日志呢？**

- 避免额外的检查开销，AOF 记录日志不会对命令进行语法检查；
- 在命令执行完之后再记录，不会阻塞当前的命令执行。

这样也带来了风险（我在前面介绍 AOF 持久化的时候也提到过）：

- 如果刚执行完命令 Redis 就宕机会导致对应的修改丢失；
- 可能会阻塞后续其他命令的执行（AOF 记录日志是在 Redis 主线程中进行的）。

#### AOF 重写

当 AOF 变得太大时，Redis 能够在后台自动重写 AOF 产生一个新的 AOF 文件，这个新的 AOF 文件和原有的 AOF 文件所保存的数据库状态一样，但体积更小。

#### AOF 校验

AOF 校验机制是 Redis 在启动时对 AOF 文件进行检查，以判断文件是否完整，是否有损坏或者丢失的数据。这个机制的原理其实非常简单，就是通过使用一种叫做 **校验和（checksum）** 的数字来验证 AOF 文件。这个校验和是通过对整个 AOF 文件内容进行 CRC64 算法计算得出的数字。如果文件内容发生了变化，那么校验和也会随之改变。因此，Redis  在启动时会比较计算出的校验和与文件末尾保存的校验和（计算的时候会把最后一行保存校验和的内容给忽略点），从而判断 AOF  文件是否完整。如果发现文件有问题，Redis 就会拒绝启动并提供相应的错误信息。AOF 校验机制十分简单有效，可以提高 Redis  数据的可靠性。

### 混合持久化

如果把混合持久化打开，AOF 重写的时候就直接把 RDB 的内容写到 AOF 文件开头。这样做的好处是可以结合 RDB 和 AOF 的优点,  快速加载同时避免丢失过多的数据。当然缺点也是有的， AOF 里面的 RDB 部分是压缩格式不再是 AOF 格式，可读性较差。

### RDB vs AOF

**RDB 比 AOF 优秀的地方**：

- RDB 文件存储的内容是经过压缩的二进制数据，  保存着某个时间点的数据集，文件很小，适合做数据的备份，灾难恢复。AOF 文件存储的是每一次写命令，类似于 MySQL 的 binlog  日志，通常会比 RDB 文件大很多。当 AOF 变得太大时，Redis 能够在后台自动重写 AOF。新的 AOF 文件和原有的 AOF  文件所保存的数据库状态一样，但体积更小。不过， Redis 7.0 版本之前，如果在重写期间有写入命令，AOF  可能会使用大量内存，重写期间到达的所有写入命令都会写入磁盘两次。
- 使用 RDB 文件恢复数据，直接解析还原数据即可，不需要一条一条地执行命令，速度非常快。而 AOF 则需要依次执行每个写命令，速度非常慢。也就是说，与 AOF 相比，恢复大数据集的时候，RDB 速度更快。

**AOF 比 RDB 优秀的地方**：

- RDB 的数据安全性不如 AOF，没有办法实时或者秒级持久化数据。生成 RDB 文件的过程是比较繁重的， 虽然 BGSAVE 子进程写入 RDB  文件的工作不会阻塞主线程，但会对机器的 CPU 资源和内存资源产生影响，严重的情况下甚至会直接把 Redis 服务干宕机。AOF  支持秒级数据丢失（取决 fsync 策略，如果是 everysec，最多丢失 1 秒的数据），仅仅是追加命令到 AOF 文件，操作轻量。
- RDB 文件是以特定的二进制格式保存的，并且在 Redis 版本演进中有多个版本的 RDB，所以存在老版本的 Redis 服务不兼容新版本的 RDB 格式的问题。
- AOF 以一种易于理解和解析的格式包含所有操作的日志。你可以轻松地导出 AOF 文件进行分析，你也可以直接操作 AOF 文件来解决一些问题。比如，如果执行 `FLUSHALL` 命令意外地刷新了所有内容后，只要 AOF 文件没有被重写，删除最新命令并重启即可恢复之前的状态。

## Redis 线程模型

对于读写命令来说，Redis 一直是单线程模型。不过，在 Redis 4.0 版本之后引入了多线程来执行一些大键值对的异步删除操作， Redis 6.0 版本之后引入了多线程来处理网络请求（提高网络 IO 读写性能）。

### Redis 单线程

Redis 单线程指的是「接收客户端请求-> 解析请求-> 进行数据读写等操作-> 发生数据给客户端」这个过程是由一个线程（主线程）来完成的，这也是我们常说 Redis 是单线程的原因。但是，**Redis 程序并不是单线程的，Redis 在启动的时候，是会启动后台线程**（BIO）的：

- Redis 在 2.6 版本，会启动 2 个后台线程，分别处理关闭文件、**AOF 刷盘** 这两个任务；
- Redis 在 4.0 版本之后，新增了一个新的后台线程，用来异步释放 Redis 内存，也就是 lazyfree 线程。

**Redis 基于 Reactor 模式设计开发了一套高效的事件处理模型** （Netty 的线程模型也基于 Reactor 模式，Reactor 模式不愧是高性能 IO 的基石），这套事件处理模型对应的是 Redis 中的文件事件处理器（file event handler）。由于文件事件处理器（file event handler）是单线程方式运行的，所以我们一般都说 Redis 是单线程模型。

> Redis 基于 Reactor 模式开发了自己的网络事件处理器：这个处理器被称为文件事件处理器（file event handler）。
>
> - 文件事件处理器使用 I/O 多路复用（multiplexing）程序来同时监听多个套接字，并根据套接字目前执行的任务来为套接字关联不同的事件处理器。
> - 当被监听的套接字准备好执行连接应答（accept）、读取（read）、写入（write）、关 闭（close）等操作时，与操作相对应的文件事件就会产生，这时文件事件处理器就会调用套接字之前关联好的事件处理器来处理这些事件。
>
> **虽然文件事件处理器以单线程方式运行，但通过使用 I/O 多路复用程序来监听多个套接字**，文件事件处理器既实现了高性能的网络通信模型，又可以很好地与 Redis 服务器中其他同样以单线程方式运行的模块进行对接，这保持了 Redis 内部单线程设计的简单性。

#### 单线程怎么监听大量客户端连接

Redis 通过 **IO 多路复用程序** 来监听来自客户端的大量连接（或者说是监听多个 socket），它会将感兴趣的事件及类型（读、写）注册到内核中并监听每个事件是否发生。

**I/O 多路复用技术的使用让 Redis 不需要额外创建多余的线程来监听客户端的大量连接，降低了资源的消耗**

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1712320692_0.png" alt="f88591230c1a02f74d3671d082bbb6a449871c" style="zoom:50%;" />

#### 为什么使用单线程

- 单线程编程容易并且更容易维护；
- Redis 的性能瓶颈不在 CPU ，主要在内存和网络；
- 多线程就会存在死锁、线程上下文切换等问题，甚至会影响性能。

### Redis 多线程

**Redis6.0 引入多线程主要是为了提高网络 IO 读写性能**

![640](https://raw.githubusercontent.com/Moriic/picture/main/image/1712327095_0.png)

**该设计有如下特点：**

1、IO 线程要么同时在读 socket，要么同时在写，不会同时读或写

2、IO 线程只负责读写 socket 解析命令，不负责命令处理

从上面的实现机制可以看出，Redis 的多线程部分只是用来处理网络数据的读写和协议解析，执行命令仍然是单线程顺序执行。所以我们不需要去考虑控制 key、lua、事务，LPUSH/LPOP 等等的并发及线程安全问题。

### Redis 后台线程

我们虽然经常说 Redis 是单线程模型（主要逻辑是单线程完成的），但实际还有一些后台线程用于执行一些比较耗时的操作：

- 通过 `bio_close_file` 后台线程来释放 AOF / RDB 等过程中产生的临时文件资源。
- 通过 `bio_aof_fsync` 后台线程调用 `fsync` 函数将系统内核缓冲区还未同步到到磁盘的数据强制刷到磁盘（ AOF 文件）。
- 通过 `bio_lazy_free` 后台线程释放大对象（已删除）占用的内存空间.

## Redis 内存管理

### 设置过期时间

注意：**Redis 中除了字符串类型有自己独有设置过期时间的命令 `setex` 外，其他方法都需要依靠 `expire` 命令来设置过期时间 。另外， `persist` 命令可以移除一个键的过期时间。**

### 判断数据过期

Redis 通过一个叫做过期字典（可以看作是 hash 表）来保存数据过期的时间。过期字典的键指向 Redis 数据库中的某个  key(键)，过期字典的值是一个 long long 类型的整数，这个整数保存了 key 所指向的数据库键的过期时间（毫秒精度的 UNIX  时间戳）

![redis-expired-dictionary](https://raw.githubusercontent.com/Moriic/picture/main/image/1712327340_0.png)

### 过期数据删除策略

用的过期数据的删除策略就两个（重要！自己造缓存轮子的时候需要格外考虑的东西）：

1. **惰性删除**：只会在取出 key 的时候才对数据进行过期检查。这样对 CPU 最友好，但是可能会造成太多过期 key 没有被删除。
2. **定期删除**：每隔一段时间抽取一批 key 执行删除过期 key 操作。并且，Redis 底层会通过限制删除操作执行的时长和频率来减少删除操作对 CPU 时间的影响。

定期删除对内存更加友好，惰性删除对 CPU 更加友好。两者各有千秋，所以 Redis 采用的是 **定期删除+惰性/懒汉式删除** 。

### Redis 内存淘汰机制

1. **volatile-lru（least recently used）**：从已设置过期时间的数据集（`server.db[i].expires`）中挑选最近最少使用的数据淘汰。
2. **volatile-ttl**：从已设置过期时间的数据集（`server.db[i].expires`）中挑选将要过期的数据淘汰。
3. **volatile-random**：从已设置过期时间的数据集（`server.db[i].expires`）中任意选择数据淘汰。
4. **allkeys-lru（least recently used）**：当内存不足以容纳新写入数据时，在键空间中，移除最近最少使用的 key（这个是最常用的）。
5. **allkeys-random**：从数据集（`server.db[i].dict`）中任意选择数据淘汰。
6. **no-eviction**：禁止驱逐数据，也就是说当内存不足以容纳新写入数据时，新写入操作会报错。这个应该没人使用吧！

## Redis 事务

Redis 可以通过 **`MULTI`，`EXEC`，`DISCARD` 和 `WATCH`** 等命令来实现事务(Transaction)功能。

[`MULTI`](https://redis.io/commands/multi) 命令后可以输入多个命令，Redis 不会立即执行这些命令，而是将它们放到队列，当调用了 [`EXEC`](https://redis.io/commands/exec) 命令后，再执行所有的命令。

这个过程是这样的：

1. 开始事务（`MULTI`）；
2. 命令入队(批量操作 Redis 的命令，先进先出（FIFO）的顺序执行)；
3. 执行事务(`EXEC`)。

你也可以通过 [`DISCARD`](https://redis.io/commands/discard) 命令取消一个事务，它会清空事务队列中保存的所有命令。

你可以通过 [`WATCH`](https://redis.io/commands/watch) 命令监听指定的 Key，当调用 `EXEC` 命令执行事务时，如果一个被 `WATCH` 命令监视的 Key 被 **其他客户端/Session** 修改的话，整个事务都不会被执行。

不过，如果 **WATCH** 与 **事务** 在同一个 Session 里，并且被 **WATCH** 监视的 Key 被修改的操作发生在事务内部，这个事务是可以被执行成功的

Redis 事务在运行错误的情况下，除了执行过程中出现错误的命令外，其他命令都能正常执行。并且，Redis 事务是不支持回滚（roll back）操作的。因此，Redis 事务其实是不满足原子性的。

### 解决缺陷

Redis 从 2.6 版本开始支持执行 Lua 脚本，它的功能和事务非常类似。我们可以利用 Lua 脚本来批量执行多条 Redis 命令，这些 Redis 命令会被提交到 Redis 服务器一次性执行完成，大幅减小了网络开销。

一段 Lua 脚本可以视作一条命令执行，一段 Lua 脚本执行过程中不会有其他脚本或 Redis 命令同时执行，保证了操作不会被其他指令插入或打扰。

不过，如果 Lua 脚本运行时出错并中途结束，出错之后的命令是不会被执行的。并且，出错之前执行的命令是无法被撤销的，无法实现类似关系型数据库执行失败可以回滚的那种原子性效果。因此， **严格来说的话，通过 Lua 脚本来批量执行 Redis 命令实际也是不完全满足原子性的。**

如果想要让 Lua 脚本中的命令全部执行，必须保证语句语法和命令都是对的。

## Redis 性能优化

一个 Redis 命令的执行可以简化为以下 4 步：

1. 发送命令
2. 命令排队
3. 命令执行
4. 返回结果

其中，第 1 步和第 4 步耗费时间之和称为 **Round Trip Time (RTT, 往返时间)** ，也就是数据在网络上传输的时间。

使用批量操作可以减少网络传输次数，进而有效减小网络开销，大幅减少 RTT。

另外，除了能减少 RTT 之外，发送一次命令的 socket I/O 成本也比较高（涉及上下文切换，存在 `read()` 和 `write()` 系统调用），批量操作还可以减少 socket I/O 成本。这个在官方对 pipeline 的介绍中有提到：https://redis.io/docs/manual/pipelining/

不过，在 Redis 官方提供的分片集群解决方案 Redis Cluster 下，使用这些原生批量操作命令可能会存在一些小问题需要解决。就比如说 `MGET` 无法保证所有的 key 都在同一个 **hash slot**（哈希槽）上，`MGET` 可能还是需要多次网络传输，原子操作也无法保证了。不过，相较于非批量操作，还是可以节省不少网络传输次数。

### pipeline

对于不支持批量操作的命令，我们可以利用 **pipeline（流水线)** 将一批 Redis 命令封装成一组，这些 Redis 命令会被一次性提交到 Redis 服务器，只需要一次网络传输。不过，需要注意控制一次批量操作的 **元素个数**(例如 500 以内，实际也和元素字节数有关)，避免网络传输的数据量过大。

与 `MGET`、`MSET` 等原生批量操作命令一样，pipeline 同样在 Redis Cluster 上使用会存在一些小问题。原因类似，无法保证所有的 key 都在同一个 **hash slot**（哈希槽）上。如果想要使用的话，客户端需要自己维护 key 与 slot 的关系。

原生批量操作命令和 pipeline 的是有区别的，使用的时候需要注意：

- 原生批量操作命令是原子操作，pipeline 是非原子操作。
- pipeline 可以打包不同的命令，原生批量操作命令不可以。
- 原生批量操作命令是 Redis 服务端支持实现的，而 pipeline 需要服务端和客户端的共同实现。

顺带补充一下 pipeline 和 Redis 事务的对比：

- 事务是原子操作，pipeline 是非原子操作。两个不同的事务不会同时运行，而 pipeline 可以同时以交错方式执行。
- Redis 事务中每个命令都需要发送到服务端，而 Pipeline 只需要发送一次，请求次数更少。

> 事务可以看作是一个原子操作，但其实并不满足原子性。当我们提到 Redis 中的原子操作时，主要指的是这个操作（比如事务、Lua  脚本）不会被其他操作（比如其他事务、Lua 脚本）打扰，并不能完全保证这个操作中的所有写命令要么都执行要么都不执行。这主要也是因为 Redis  是不支持回滚操作。

![redis-pipeline-vs-transaction](https://raw.githubusercontent.com/Moriic/picture/main/image/1712386368_0.png)

另外，pipeline 不适用于执行顺序有依赖关系的一批命令。就比如说，你需要将前一个命令的结果给后续的命令使用，pipeline 就没办法满足你的需求了。对于这种需求，我们可以使用 **Lua 脚本** 。

### Lua 脚本

Lua 脚本同样支持批量操作多条命令。一段 Lua 脚本可以视作一条命令执行，可以看作是 **原子操作** 。也就是说，一段 Lua 脚本执行过程中不会有其他脚本或 Redis 命令同时执行，保证了操作不会被其他指令插入或打扰，这是 pipeline 所不具备的。

并且，Lua 脚本中支持一些简单的逻辑处理比如使用命令读取值并在 Lua 脚本中进行处理，这同样是 pipeline 所不具备的。

不过， Lua 脚本依然存在下面这些缺陷：

- 如果 Lua 脚本运行时出错并中途结束，之后的操作不会进行，但是之前已经发生的写操作不会撤销，所以即使使用了 Lua 脚本，也不能实现类似数据库回滚的原子性。
- Redis Cluster 下 Lua 脚本的原子操作也无法保证了，原因同样是无法保证所有的 key 都在同一个 **hash slot**（哈希槽）上

### 大量 key 集中过期问题

我在前面提到过：对于过期 key，Redis 采用的是 **定期删除+惰性/懒汉式删除** 策略。

定期删除执行过程中，如果突然遇到大量过期 key 的话，客户端请求必须等待定期清理过期 key 任务线程执行完成，因为这个这个定期任务线程是在 Redis 主线程中执行的。这就导致客户端请求没办法被及时处理，响应速度会比较慢。

**如何解决呢？** 下面是两种常见的方法：

1. 给 key 设置随机过期时间。
2. 开启 lazy-free（惰性删除/延迟释放） 。lazy-free 特性是 Redis 4.0 开始引入的，指的是让 Redis 采用异步方式延迟释放 key 使用的内存，将该操作交给单独的子线程处理，避免阻塞主线程。

个人建议不管是否开启 lazy-free，我们都尽量给 key 设置随机过期时间。

### 大 key (bigkey)

如果一个 key 对应的 value 所占用的内存比较大，那这个 key 就可以看作是 bigkey。

![bigkey-criterion](https://raw.githubusercontent.com/Moriic/picture/main/image/1712386542_0.png)

#### 危害

bigkey 除了会消耗更多的内存空间和带宽，还会造成阻塞问题：

1. **客户端超时阻塞**：由于 Redis 执行命令是单线程处理，然后在操作大 key 时会比较耗时，那么就会阻塞 Redis，从客户端这一视角看，就是很久很久都没有响应。
2. **网络阻塞**：每次获取大 key 产生的网络流量较大，如果一个 key 的大小是 1 MB，每秒访问量为 1000，那么每秒会产生 1000MB 的流量，这对于普通千兆网卡的服务器来说是灾难性的。
3. **工作线程阻塞**：如果使用 del 删除大 key 时，会阻塞工作线程，这样就没办法处理后续的命令。

#### 查找 bigkey

1. 使用 Redis 自带的 `--bigkeys` 参数来查找：在线上执行该命令时，为了降低对 Redis 的影响，需要指定 `-i` 参数控制扫描的频率。`redis-cli -p 6379 --bigkeys -i 3` 表示扫描过程中每次扫描后休息的时间间隔为 3 秒。
2. 使用 Redis 自带的 SCAN 命令
3. 借助开源工具分析 RDB 文件

#### 解决 bigkey

- **分割 bigkey**：将一个 bigkey 分割为多个小 key。例如，将一个含有上万字段数量的 Hash 按照一定策略（比如二次哈希）拆分为多个 Hash。
- **手动清理**：Redis 4.0+ 可以使用 `UNLINK` 命令来异步删除一个或多个指定的 key。Redis 4.0 以下可以考虑使用 `SCAN` 命令结合 `DEL` 命令来分批次删除。
- **采用合适的数据结构**：例如，文件二进制数据不使用 String 保存、使用 HyperLogLog 统计页面 UV、Bitmap 保存状态信息（0/1）。
- **开启 lazy-free（惰性删除/延迟释放）** ：lazy-free 特性是 Redis 4.0 开始引入的，指的是让 Redis 采用异步方式延迟释放 key 使用的内存，将该操作交给单独的子线程处理，避免阻塞主线程。

### 热 key (hotkey)

如果一个 key 的访问次数比较多且明显多于其他 key 的话，那这个 key 就可以看作是 **hotkey（热 Key）**

#### 危害

处理 hotkey 会占用大量的 CPU 和带宽，可能会影响 Redis 实例对其他请求的正常处理。此外，如果突然访问 hotkey 的请求超出了 Redis 的处理能力，Redis 就会直接宕机。这种情况下，大量请求将落到后面的数据库上，可能会导致数据库崩溃。

因此，hotkey 很可能成为系统性能的瓶颈点，需要单独对其进行优化，以确保系统的高可用性和稳定性。

#### 查找 hotkey

1. 使用 Redis 自带的 `--hotkeys` 参数来查找：`redis-cli -p 6379 --hotkeys`，使用该方案的前提条件是 Redis Server 的 `maxmemory-policy` 参数设置为 LFU 算法
2. 使用 `MONITOR` 命令
3. 借助开源项目

#### 解决 hotkey

- **读写分离**：主节点处理写请求，从节点处理读请求。
- **使用 Redis Cluster**：将热点数据分散存储在多个 Redis 节点上。
- **二级缓存**：hotkey 采用二级缓存的方式进行处理，将 hotkey 存放一份到 JVM 本地内存中（可以用 Caffeine）。

### 慢查询命令

在 `redis.conf` 文件中，我们可以使用 `slowlog-log-slower-than` 参数设置耗时命令的阈值，并使用 `slowlog-max-len` 参数设置耗时命令的最大记录条数。

当 Redis 服务器检测到执行时间超过 `slowlog-log-slower-than` 阈值的命令时，就会将该命令记录在慢查询日志(slow log) 中，这点和 MySQL 记录慢查询语句类似。当慢查询日志超过设定的最大记录条数之后，Redis 会把最早的执行命令依次舍弃。

获取慢查询日志的内容很简单，直接使用 `SLOWLOG GET N` 命令即可

慢查询日志中的每个条目都由以下六个值组成：

1. 唯一渐进的日志标识符。
2. 处理记录命令的 Unix 时间戳。
3. 执行所需的时间量，以微秒为单位。
4. 组成命令参数的数组。
5. 客户端 IP 地址和端口。
6. 客户端名称。

## Redis 生产问题

### 缓存穿透

缓存穿透说简单点就是大量请求的 key 是不合理的，**根本不存在于缓存中，也不存在于数据库中** 。这就导致这些请求直接到了数据库上，根本没有经过缓存这一层，对数据库造成了巨大的压力，可能直接就被这么多请求弄宕机了。

![redis-cache-penetration](https://raw.githubusercontent.com/Moriic/picture/main/image/1712403893_0.png)

#### 解决方案

最基本的就是首先做好参数校验，一些不合法的参数请求直接抛出异常信息返回给客户端。比如查询的数据库 id 不能小于 0、传入的邮箱格式不对的时候直接返回错误消息给客户端等等。

1. **缓存无效 key**

如果缓存和数据库都查不到某个 key 的数据就写一个到 Redis 中去并设置过期时间，具体命令如下：`SET key value EX 10086` 。这种方式可以解决请求的 key 变化不频繁的情况，如果黑客恶意攻击，每次构建不同的请求 key，会导致 Redis 中缓存大量无效的 key 。很明显，这种方案并不能从根本上解决此问题。如果非要用这种方式来解决穿透问题的话，尽量将无效的 key 的过期时间设置短一点比如 1 分钟。

另外，这里多说一嘴，一般情况下我们是这样设计 key 的：`表名:列名:主键名:主键值` 。

```java
public Object getObjectInclNullById(Integer id) {
    // 从缓存中获取数据
    Object cacheValue = cache.get(id);
    // 缓存为空
    if (cacheValue == null) {
        // 从数据库中获取
        Object storageValue = storage.get(key);
        // 缓存空对象
        cache.set(key, storageValue);
        // 如果存储数据为空，需要设置一个过期时间(300秒)
        if (storageValue == null) {
            // 必须设置过期时间，否则有被攻击的风险
            cache.expire(key, 60 * 5);
        }
        return storageValue;
    }
    return cacheValue;
}
```

2. **布隆过滤器**

布隆过滤器是一个非常神奇的数据结构，通过它我们可以非常方便地判断一个给定数据是否存在于海量数据中。我们可以把它看作由二进制向量（或者说位数组）和一系列随机映射函数（哈希函数）两部分组成的数据结构。相比于我们平时常用的 List、Map、Set  等数据结构，它占用空间更少并且效率更高，但是缺点是其返回的结果是概率性的，而不是非常准确的。理论情况下添加到集合中的元素越多，误报的可能性就越大。并且，存放在布隆过滤器的数据不容易删除。

![bloom-filter-simple-schematic-diagram](https://raw.githubusercontent.com/Moriic/picture/main/image/1712404119_0.png)

Bloom Filter 会使用一个较大的 bit 数组来保存所有的数据，数组中的每个元素都只占用 1 bit ，并且每个元素只能是 0 或者  1（代表 false 或者 true），这也是 Bloom Filter 节省内存的核心所在。这样来算的话，申请一个 100w  个元素的位数组只占用 1000000Bit / 8 = 125000 Byte = 125000/1024 KB ≈ 122KB 的空间。

具体是这样做的：把所有可能存在的请求的值都存放在布隆过滤器中，当用户请求过来，先判断用户发来的请求的值是否存在于布隆过滤器中。不存在的话，直接返回请求参数错误信息给客户端，存在的话才会走下面的流程。

加入布隆过滤器之后的缓存处理流程图如下。

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1712404161_0.png" alt="redis-cache-penetration-bloom-filter" style="zoom: 67%;" />

3. **接口限流**

根据用户或者 IP 对接口进行限流，对于异常频繁的访问行为，还可以采取黑名单机制，例如将异常 IP 列入黑名单。

### 缓存击穿

缓存击穿中，请求的 key 对应的是 **热点数据** ，该数据 **存在于数据库中，但不存在于缓存中（通常是因为缓存中的那份数据已经过期）** 。这就可能会导致瞬时大量的请求直接打到了数据库上，对数据库造成了巨大的压力，可能直接就被这么多请求弄宕机了。

![redis-cache-breakdown](https://raw.githubusercontent.com/Moriic/picture/main/image/1712404502_0.png)

举个例子：秒杀进行过程中，缓存中的某个秒杀商品的数据突然过期，这就导致瞬时大量对该商品的请求直接落到数据库上，对数据库造成了巨大的压力

#### 解决方案

1. 预先设置热门数据，**适时调整过期时间**：在 redis 高峰之前，把一些热门数据提前存入到 redis 里面，对缓存中的这些热门数据进行监控，实时调整过期时间。
2. **使用锁**：缓存中拿不到数据的时候，此时不是立即去 db 中查询，而是去获取 **分布式锁**（比如 redis 中的 setnx），**拿到锁再去 db 中 load 数据；没有拿到锁的线程休眠一段时间再重试整个获取数据的方法**
3. **逻辑过期**：设置逻辑时间，查询缓存发现逻辑时间过期则开启新线程更新数据，更新前获取的都是旧数据

![1711358784_0](https://raw.githubusercontent.com/Moriic/picture/main/image/1712417891_0.png)

| 解决方案 | 优点                                       | 缺点                               |
| -------- | ------------------------------------------ | ---------------------------------- |
| 互斥锁   | 没有额外内存消耗，**保证一致性**，实现简单 | 线程需等待，可能有死锁风险         |
| 逻辑过期 | 线程无需等待，**性能较好**                 | 不保证一致性，额外内存消耗，实现复 |

### 缓存雪崩

实际上，缓存雪崩描述的就是这样一个简单的场景：**缓存在同一时间大面积的失效，导致大量的请求都直接落到了数据库上，对数据库造成了巨大的压力。**

![redis-cache-avalanche](https://raw.githubusercontent.com/Moriic/picture/main/image/1712422524_0.png)

#### 解决方案

**针对 Redis 服务不可用的情况：**

1. 采用 Redis 集群，避免单机出现问题整个缓存服务都没办法使用。
2. 限流，避免同时处理大量的请求。
3. **多级缓存**，例如本地缓存+Redis 缓存的组合，当 Redis 缓存出现问题时，还可以从本地缓存中获取到部分数据。

**针对热点缓存失效的情况：**

1. 设置不同的失效时间 **比如随机设置缓存的失效时间。**
2. 缓存永不失效（不太推荐，实用性太差）。
3. 缓存预热，也就是在程序启动后或运行过程中，主动将热点数据加载到缓存中。

### 实现预热

使用定时任务，比如 xxl-job，来定时触发缓存预热的逻辑，将数据库中的热点数据查询出来并存入缓存中。

使用消息队列，比如 Kafka，来异步地进行缓存预热，将数据库中的热点数据的主键或者 ID 发送到消息队列中，然后由缓存服务消费消息队列中的数据，根据主键或者 ID 查询数据库并更新缓存。

### 缓存雪崩 vs 缓存击穿

缓存雪崩和缓存击穿比较像，但缓存雪崩导致的原因是缓存中的大量或者所有数据失效，缓存击穿导致的原因主要是某个热点数据不存在与缓存中（通常是因为缓存中的那份数据已经过期）。

## Redis 实现延时任务

基于 Redis 实现延时任务的功能无非就下面两种方案：

1. Redis 过期事件监听
2. Redisson 内置的延时队列

### 过期事件监听

Redis 2.0 引入了发布订阅 (pub/sub) 功能。在 pub/sub 中，引入了一个叫做 **channel（频道）** 的概念，有点类似于消息队列中的 **topic（主题）**。

pub/sub 涉及发布者（publisher）和订阅者（subscriber，也叫消费者）两个角色：

- 发布者通过 `PUBLISH` 投递消息给指定 channel。
- 订阅者通过 `SUBSCRIBE` 订阅它关心的 channel。并且，订阅者可以订阅一个或者多个 channel。

![redis-pub-sub](https://raw.githubusercontent.com/Moriic/picture/main/image/1712461353_0.png)

在 pub/sub 模式下，生产者需要指定消息发送到哪个 channel 中，而消费者则订阅对应的 channel 以获取消息。

Redis 中有很多默认的 channel，这些 channel 是由 Redis 本身向它们发送消息的，而不是我们自己编写的代码。其中，`__keyevent@0__:expired` 就是一个默认的 channel，负责监听 key 的过期事件。也就是说，当一个 key 过期之后，Redis 会发布一个 key 过期的事件到 `__keyevent@<db>__:expired` 这个 channel 中。

我们只需要监听这个 channel，就可以拿到过期的 key 的消息，进而实现了延时任务功能。

这个功能被 Redis 官方称为 **keyspace notifications** ，作用是实时监控实时监控 Redis 键和值的变化。

#### 缺陷

1. **时效性差**

这段话的核心是：过期事件消息是在 Redis 服务器删除 key 时发布的，而不是一个 key 过期之后就会就会直接发布。

我们知道常用的过期数据的删除策略就两个：

1. **惰性删除**：只会在取出 key 的时候才对数据进行过期检查。这样对 CPU 最友好，但是可能会造成太多过期 key 没有被删除。
2. **定期删除**：每隔一段时间抽取一批 key 执行删除过期 key 操作。并且，Redis 底层会通过限制删除操作执行的时长和频率来减少删除操作对 CPU 时间的影响。

定期删除对内存更加友好，惰性删除对 CPU 更加友好。两者各有千秋，所以 Redis 采用的是 **定期删除+惰性/懒汉式删除** 。

因此，就会存在我设置了 key 的过期时间，但到了指定时间 key 还未被删除，进而没有发布过期事件的情况。

2. **丢消息**

Redis 的 pub/sub 模式中的消息并不支持持久化，这与消息队列不同。在 Redis 的 pub/sub 模式中，发布者将消息发送给指定的频道，订阅者监听相应的频道以接收消息。当没有订阅者时，消息会被直接丢弃，在 Redis 中不会存储该消息。

3. **多服务实例下重复消费**

Redis 的 pub/sub 模式目前只有广播模式，这意味着当生产者向特定频道发布一条消息时，所有订阅相关频道的消费者都能够收到该消息。

这个时候，我们需要注意多个服务实例重复处理消息的问题，这会增加代码开发量和维护难度。

### Redisson

Redisson 是一个开源的 Java 语言 Redis 客户端，提供了很多开箱即用的功能，比如多种分布式锁的实现、延时队列。

我们可以借助 Redisson 内置的延时队列 RDelayedQueue 来实现延时任务功能。

Redisson 的延迟队列 RDelayedQueue 是基于 Redis 的 SortedSet 来实现的。SortedSet  是一个有序集合，其中的每个元素都可以设置一个分数，代表该元素的权重。Redisson 利用这一特性，将需要延迟执行的任务插入到  SortedSet 中，并给它们设置相应的过期时间作为分数。

Redisson 使用 `zrangebyscore` 命令扫描 SortedSet 中过期的元素，然后将这些过期元素从 SortedSet 中移除，并将它们加入到就绪消息列表中。就绪消息列表是一个阻塞队列，有消息进入就会被监听到。这样做可以避免对整个 SortedSet 进行轮询，提高了执行效率。

相比于 Redis 过期事件监听实现延时任务功能，这种方式具备下面这些优势：

1. **减少了丢消息的可能**：DelayedQueue 中的消息会被持久化，即使 Redis 宕机了，根据持久化机制，也只可能丢失一点消息，影响不大。当然了，你也可以使用扫描数据库的方法作为补偿机制。
2. **消息不存在重复消费问题**：每个客户端都是从同一个目标队列中获取任务的，不存在重复消费的问题。

跟 Redisson 内置的延时队列相比，消息队列可以通过保障消息消费的可靠性、控制消息生产者和消费者的数量等手段来实现更高的吞吐量和更强的可靠性，实际项目中首选使用消息队列的延时消息这种方案。

## 常见阻塞原因

### 命令阻塞

Redis 中的大部分命令都是 O(1)时间复杂度，但也有少部分 O(n) 时间复杂度的命令，例如：

- `KEYS *`：会返回所有符合规则的 key。
- `HGETALL`：会返回一个 Hash 中所有的键值对。
- `LRANGE`：会返回 List 中指定范围内的元素。
- `SMEMBERS`：返回 Set 中的所有元素。
- `SINTER`/`SUNION`/`SDIFF`：计算多个 Set 的交集/并集/差集。

除了这些 O(n)时间复杂度的命令可能会导致阻塞之外， 还有一些时间复杂度可能在 O(N) 以上的命令，例如：

- `ZRANGE`/`ZREVRANGE`：返回指定 Sorted Set 中指定排名范围内的所有元素。时间复杂度为 O(log(n)+m)，n 为所有元素的数量， m 为返回的元素数量，当 m 和 n 相当大时，O(n) 的时间复杂度更小。
- `ZREMRANGEBYRANK`/`ZREMRANGEBYSCORE`：移除 Sorted Set 中指定排名范围/指定 score 范围内的所有元素。时间复杂度为 O(log(n)+m)，n 为所有元素的数量， m 被删除元素的数量，当 m 和 n 相当大时，O(n) 的时间复杂度更小。

### SAVE 创建 RDB 快照

Redis 提供了两个命令来生成 RDB 快照文件：

- `save` : 同步保存操作，会阻塞 Redis 主线程；
- `bgsave` : fork 出一个子进程，子进程执行，不会阻塞 Redis 主线程，默认选项。

默认情况下，Redis 默认配置会使用 `bgsave` 命令。如果手动使用 `save` 命令生成 RDB 快照文件的话，就会阻塞主线程。

### AOF 日志记录

**可能会阻塞后续其他命令的执行（AOF 记录日志是在 Redis 主线程中进行的）**。

**为什么是在执行完命令之后记录日志呢？**

- 避免额外的检查开销，AOF 记录日志不会对命令进行语法检查；
- 在命令执行完之后再记录，不会阻塞当前的命令执行。

### AOF 刷盘阻塞

当 Redis 直接记录 AOF 日志时，如果有大量的写操作，并且配置为同步持久化

```
appendfsync always
```

即每次发生数据变更会被立即记录到磁盘，因为写磁盘比较耗时，性能较差，所以有时会阻塞主线程。

### AOF 重写阻塞

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1712759585_0.png" alt="0o0n1wk8fe" style="zoom:50%;" />

1. fork 出一条子线程来将文件重写，在执行 `BGREWRITEAOF` 命令时，Redis 服务器会维护一个 AOF 重写缓冲区，该缓冲区会在子线程创建新 AOF 文件期间，记录服务器执行的所有写命令。
2. 当子线程完成创建新 AOF 文件的工作之后，服务器会将重写缓冲区中的所有内容追加到新 AOF 文件的末尾，使得新的 AOF 文件保存的数据库状态与现有的数据库状态一致。
3. 最后，服务器用新的 AOF 文件替换旧的 AOF 文件，以此来完成 AOF 文件重写操作。

阻塞就是出现在第 2 步的过程中，将缓冲区中新数据写到新文件的过程中会产生 **阻塞**。

### 大 key

大 key 并不是指 key 的值很大，而是 key 对应的 value 很大。

大 key 造成的阻塞问题如下：

- 客户端超时阻塞：由于 Redis 执行命令是单线程处理，然后在操作大 key 时会比较耗时，那么就会阻塞 Redis，从客户端这一视角看，就是很久很久都没有响应。
- 引发网络阻塞：每次获取大 key 产生的网络流量较大，如果一个 key 的大小是 1 MB，每秒访问量为 1000，那么每秒会产生 1000MB 的流量，这对于普通千兆网卡的服务器来说是灾难性的。
- 阻塞工作线程：如果使用 del 删除大 key 时，会阻塞工作线程，这样就没办法处理后续的命令。

### 查找大 key

当我们在使用 Redis 自带的 `--bigkeys` 参数查找大 key 时，最好选择在从节点上执行该命令，因为主节点上执行时，会 **阻塞** 主节点。

- 我们还可以使用 SCAN 命令来查找大 key；
- 通过分析 RDB 文件来找出 big key，这种方案的前提是 Redis 采用的是 RDB 持久化。网上有现成的工具：
  - redis-rdb-tools：Python 语言写的用来分析 Redis 的 RDB 快照文件用的工具
  - rdb_bigkeys：Go 语言写的用来分析 Redis 的 RDB 快照文件用的工具，性能更好

### 删除大 key

删除操作的本质是要释放键值对占用的内存空间。

释放内存只是第一步，为了更加高效地管理内存空间，在应用程序释放内存时，**操作系统需要把释放掉的内存块插入一个空闲内存块的链表**，以便后续进行管理和再分配。这个过程本身需要一定时间，而且会 **阻塞** 当前释放内存的应用程序。

所以，如果一下子释放了大量内存，空闲内存块链表操作时间就会增加，相应地就会造成 Redis **主线程的阻塞**，如果主线程发生了阻塞，其他所有请求可能都会超时，超时越来越多，会造成 Redis 连接耗尽，产生各种异常。

> 删除大 key 时建议采用分批次删除和异步删除的方式进行。

### 清空数据库

清空数据库和上面 bigkey 删除也是同样道理，flushdb、flushall 也涉及到删除和释放所有的键值对，也是 Redis 的阻塞点。

### 集群扩容

Redis 集群可以进行节点的动态扩容缩容，这一过程目前还处于 **半自动** 状态，需要人工介入。

在扩缩容的时候，需要进行数据迁移。而 Redis 为了保证迁移的一致性，迁移所有操作都是 **同步** 操作。

执行迁移时，两端的 Redis 均会进入时长不等的 **阻塞** 状态，对于小 Key，该时间可以忽略不计，但如果一旦 Key 的内存使用过大，严重的时候会触发集群内的故障转移，造成不必要的切换。

### Swap (内存交换)

**什么是 Swap？** Swap 直译过来是交换的意思，Linux 中的 Swap  常被称为内存交换或者交换分区。类似于 Windows  中的虚拟内存，就是当内存不足的时候，把一部分硬盘空间虚拟成内存使用，从而解决内存容量不足的情况。因此，Swap  分区的作用就是牺牲硬盘，增加内存，解决 VPS 内存不够用或者爆满的问题。

Swap 对于 Redis 来说是非常致命的，Redis 保证高性能的一个重要前提是所有的数据在内存中。如果操作系统把 Redis 使用的部分内存换出硬盘，由于内存与硬盘的读写速度差几个数量级，会导致发生交换后的 Redis 性能急剧下降。

预防内存交换的方法：

- 保证机器充足的可用内存
- 确保所有 Redis 实例设置最大可用内存(maxmemory)，防止极端情况 Redis 内存不可控的增长
- 降低系统使用 swap 优先级，如 `echo 10 > /proc/sys/vm/swappiness`

## Redis 集群

### Redis 主从复制

![2b7231b6aabb9a9a2e2390ab3a280b2d](https://raw.githubusercontent.com/Moriic/picture/main/image/1713185596_0.webp)

```text
replicaof <服务器 A 的 IP 地址> <服务器 A 的 Redis 端口号>
```

服务器 B 就会变成服务器 A 的「从服务器」，然后与主服务器进行第一次同步。

主从服务器间的第一次同步的过程可分为三个阶段：

- 第一阶段是建立链接、协商同步；
- 第二阶段是主服务器同步数据给从服务器；
- 第三阶段是主服务器发送新写操作命令给从服务器。

![ea4f7e86baf2435af3999e5cd38b6a26](https://raw.githubusercontent.com/Moriic/picture/main/image/1713185858_0.webp)

#### 建立连接

执行了 replicaof 命令后，从服务器就会给主服务器发送 `psync` 命令，表示要进行数据同步。

psync 命令包含两个参数，分别是 **主服务器的 runID** 和 **复制进度 offset**。

- runID，每个 Redis 服务器在启动时都会自动生产一个随机的 ID 来唯一标识自己。当从服务器和主服务器第一次同步时，因为不知道主服务器的 run ID，所以将其设置为 "?"。
- offset，表示复制的进度，第一次同步时，其值为 -1。

主服务器收到 psync 命令后，会用 `FULLRESYNC` 作为响应命令返回给对方。

并且这个响应命令会带上两个参数：主服务器的 runID 和主服务器目前的复制进度 offset。从服务器收到响应后，会记录这两个值。

FULLRESYNC 响应命令的意图是采用 **全量复制** 的方式，也就是主服务器会把所有的数据都同步给从服务器。

#### 主服务器全量复制

接着，主服务器会执行 bgsave 命令来生成 RDB 文件，然后把文件发送给从服务器。

从服务器收到 RDB 文件后，会先清空当前的数据，然后载入 RDB 文件。

这里有一点要注意，主服务器生成 RDB 这个过程是不会阻塞主线程的，因为 bgsave 命令是产生了一个子进程来做生成 RDB 文件的工作，是异步工作的，这样 Redis 依然可以正常处理命令。

但是，这期间的写操作命令并没有记录到刚刚生成的 RDB 文件中，这时主从服务器间的数据就不一致了。

那么为了保证主从服务器的数据一致性，**主服务器在下面这三个时间间隙中将收到的写操作命令，写入到 replication buffer 缓冲区里**：

- 主服务器生成 RDB 文件期间；
- 主服务器发送 RDB 文件给从服务器期间；
- 「从服务器」加载 RDB 文件期间；

#### 主服务器发送新写操作命令

在主服务器生成的 RDB 文件发送完，从服务器收到 RDB 文件后，丢弃所有旧数据，将 RDB 数据载入到内存。完成 RDB 的载入后，会回复一个确认消息给主服务器。

接着，主服务器将 replication buffer 缓冲区里所记录的写操作命令发送给从服务器，从服务器执行来自主服务器 replication buffer  缓冲区里发来的命令，这时主从服务器的数据就一致了。

#### 增量复制

主从服务器在完成第一次同步后，就会基于长连接进行命令传播。

- 从服务器在恢复网络后，会发送 psync 命令给主服务器，此时的 psync 命令里的 offset 参数不是 -1；
- 主服务器收到该命令后，然后用 CONTINUE 响应命令告诉从服务器接下来采用增量复制的方式同步数据；
- 然后主服务将主从服务器断线期间，所执行的写命令发送给从服务器，然后从服务器执行这些命令。

**主服务器怎么知道要将哪些增量数据发送给从服务器呢？**

- **repl_backlog_buffer**，是一个「**环形**」缓冲区，用于主从服务器断连后，从中找到差异的数据；
- **replication offset**，标记上面那个缓冲区的同步进度，主从服务器都有各自的偏移量，主服务器使用 master_repl_offset 来记录自己「*写*」到的位置，从服务器使用 slave_repl_offset 来记录自己「*读*」到的位置。

那 repl_backlog_buffer 缓冲区是什么时候写入的呢？

在主服务器进行命令传播时，不仅会将写命令发送给从服务器，还会将写命令写入到 repl_backlog_buffer 缓冲区里，因此 这个缓冲区里会保存着最近传播的写命令。

网络断开后，当从服务器重新连上主服务器时，从服务器会通过 psync 命令将自己的复制偏移量 slave_repl_offset 发送给主服务器，主服务器根据自己的  master_repl_offset 和 slave_repl_offset 之间的差距，然后来决定对从服务器执行哪种同步操作：

- 如果判断出从服务器要读取的数据还在 repl_backlog_buffer 缓冲区里，那么主服务器将采用 **增量同步** 的方式；
- 相反，如果判断出从服务器要读取的数据已经不存在 repl_backlog_buffer 缓冲区里，那么主服务器将采用 **全量同步** 的方式。

当主服务器在 repl_backlog_buffer 中找到主从服务器差异（增量）的数据后，就会将增量的数据写入到 replication buffer 缓冲区，这个缓冲区我们前面也提到过，它是缓存将要传播给从服务器的命令。

## 分布式锁

### Redis setnx 实现

![b4d2260f56b7412e94eefcee90127f98](https://raw.githubusercontent.com/Moriic/picture/main/image/1728826038_0.png)

![5b1a352a0ee24844ae0cf4347a7b515e](https://raw.githubusercontent.com/Moriic/picture/main/image/1728827477_0.webp)

### Redission

1. 可重复，A 获取锁，调用 B，B 也需要获取锁，允许一个线程在已经获取锁的情况下再次获取
2. 误删问题
3. 主从一致性
4. **可重试**：利用信号量和 PubSub 功能实现等待、唤醒，获取锁失败的重试机制
5. **超时续约**：利用 watchDog，每隔一段时间（releaseTime / 3），重置超时时间

获取锁实现：

- ARGV [1]：有效期
- ARGV [2]：标识当前线程，可重入

```lua
-- 判断锁是否存在
if (redis.call('exists', KEYS[1]) == 0) then
    -- 不存在，获取锁
    redis.call('hincrby', KEYS[1], ARGV[2], 1);
    -- 设置有效期
    redis.call('pexpire', KEYS[1], ARGV[1]);
    return nil;
end;
-- 锁已经存在，判断是否是自己？！
if (redis.call('hexists', KEYS[1], ARGV[2]) == 1) then
    -- 自增+1
    redis.call('hincrby', KEYS[1], ARGV[2], 1);
    -- 重置有效期
    redis.call('pexpire', KEYS[1], ARGV[1]);
    return nil;
end;
return redis.call('pttl', KEYS[1]);
```

释放锁实现：

- ARGV [1]：发送消息，通知其他锁

- ARGV [2]：有效期
- ARGV [3]：表示当前线程

```lua
-- 判断当前锁是否还是被自己持有
if (redis.call('hexists', KEYS[1], ARGV[3]) == 0) then
    -- 不是就就直接返回
    return nil;
    end;
-- 是自己，则重入次数 -1
local counter = redis.call('hincrby', KEYS[1], ARGV[3], -1);
-- 判断重入次数是否已经为0
if (counter > 0) then
    -- 大于0，说明不能释放，重置有效期即可
    redis.call('pexpire', KEYS[1], ARGV[2]);
    return 0;
else
    -- 等于0，说明可以直接删除
    redis.call('del', KEYS[1]);
    -- 发消息
    redis.call('publish', KEYS[2], ARGV[1]);
    return 1;
    end;
return nil;
```

锁重试实现：

**tryLock()** ：实现了 **重试机制**！通过 **消息订阅** 和 **信号量机制**，避免了 **while(true)** 让其一直无效尝试，避免了 **CPU 空转问题**！ 

```java
@Override
public boolean tryLock(long waitTime, long leaseTime, TimeUnit unit) throws InterruptedException {
    // 转成毫秒，后面都是以毫秒为单位
    long time = unit.toMillis(waitTime);
    // 当前时间
    long current = System.currentTimeMillis();
    // 线程ID-线程标识
    long threadId = Thread.currentThread().getId();

    // 尝试获取锁 tryAcquire() !!!
    Long ttl = tryAcquire(waitTime, leaseTime, unit, threadId);
        
    // 如果上面尝试获取锁返回的是null，表示成功；如果返回的是时间则表示失败。
    if (ttl == null) {
        return true;
    }

    // 剩余等待时间 = 最大等待时间 -（用现在时间 - 获取锁前的时间）
    time -= System.currentTimeMillis() - current;

    // 剩余等待时间 < 0 失败
    if (time <= 0) {
        acquireFailed(waitTime, unit, threadId);
        return false;
    }

    // 再次获取当前时间
    current = System.currentTimeMillis();
    // 重试逻辑，但不是简单的直接重试！
    // subscribe是订阅的意思
    RFuture<RedissonLockEntry> subscribeFuture = subscribe(threadId);
    // 如果在剩余等待时间内，收到了释放锁那边发过来的publish，则才会再次尝试获取锁
    if (!subscribeFuture.await(time, TimeUnit.MILLISECONDS)) {
        if (!subscribeFuture.cancel(false)) {
            subscribeFuture.onComplete((res, e) -> {
                if (e == null) {   
                    // 取消订阅
                    unsubscribe(subscribeFuture, threadId);
                }
            });
        }
        // 获取锁失败
        acquireFailed(waitTime, unit, threadId);
        return false;
    }

    try {
        // 又重新计算了一下，上述的等待时间
        time -= System.currentTimeMillis() - current;
        if (time <= 0) {
            acquireFailed(waitTime, unit, threadId);
            return false;
        }

        // 重试！
        while (true) {
            long currentTime = System.currentTimeMillis();
            ttl = tryAcquire(waitTime, leaseTime, unit, threadId);

            // 成功
            if (ttl == null) {
                return true;
            }
            
            // 又获取锁失败，再次计算上面的耗时
            time -= System.currentTimeMillis() - currentTime;
            if (time <= 0) {
                acquireFailed(waitTime, unit, threadId);
                return false;
            }

            currentTime = System.currentTimeMillis();
            // 采用信号量的方式重试！
            if (ttl >= 0 && ttl < time) {
                subscribeFuture.getNow().getLatch().tryAcquire(ttl, TimeUnit.MILLISECONDS);
            } else {
                subscribeFuture.getNow().getLatch().tryAcquire(time, TimeUnit.MILLISECONDS);
            }
            
            // 重新计算时间（充足就继续循环）
            time -= System.currentTimeMillis() - currentTime;
            if (time <= 0) {
                acquireFailed(waitTime, unit, threadId);
                return false;
            }
        }
    } finally {
        unsubscribe(subscribeFuture, threadId);
    }
}
```

### 锁续期

- watch dog 在当前节点存活时每 10s 给分布式锁的 key 续期 30s；
- watch dog 机制启动，且代码中没有释放锁操作时，watch dog 会不断的给锁续期；
- 如果程序释放锁操作时因为异常没有被执行，那么锁无法被释放，所以释放锁操作一定要放到 finally {} 中；
- 要使 watchLog 机制生效 ，lock 时 不要设置 过期时间
- watchlog 的延时时间 可以由 lockWatchdogTimeout 指定默认延时时间，但是不要设置太小。如 100
- watchdog 会每 lockWatchdogTimeout/3 时间，去延时。
- watchdog 通过 类似 netty 的 Future 功能来实现异步延时
- watchdog 最终还是通过 lua 脚本来进行延时

```java
private <T> RFuture<Long> tryAcquireAsync(long waitTime, long leaseTime, TimeUnit unit, long threadId) {
    RFuture<Long> ttlRemainingFuture;
    //如果指定了加锁时间，会直接去加锁
    if (leaseTime != -1) {
        ttlRemainingFuture = tryLockInnerAsync(waitTime, leaseTime, unit, threadId, RedisCommands.EVAL_LONG);
    } else {
        //没有指定加锁时间 会先进行加锁，并且默认时间就是 LockWatchdogTimeout的时间
        //这个是异步操作 返回RFuture 类似netty中的future
        ttlRemainingFuture = tryLockInnerAsync(waitTime, internalLockLeaseTime,
                TimeUnit.MILLISECONDS, threadId, RedisCommands.EVAL_LONG);
    }

    //这里也是类似netty Future 的addListener，在future内容执行完成后执行
    ttlRemainingFuture.onComplete((ttlRemaining, e) -> {
        if (e != null) {
            return;
        }

        // lock acquired
        if (ttlRemaining == null) {
            // leaseTime不为-1时，不会自动延期
            if (leaseTime != -1) {
                internalLockLeaseTime = unit.toMillis(leaseTime);
            } else {
                //这里是定时执行 当前锁自动延期的动作,leaseTime为-1时，才会自动延期
                scheduleExpirationRenewal(threadId);
            }
        }
    });
    return ttlRemainingFuture;
}
```

scheduleExpirationRenewal 中会调用 renewExpiration。 这里我们可以看到是, 启用了一个 timeout 定时，去执行延期动作

```java
private void renewExpiration() {
    ExpirationEntry ee = EXPIRATION_RENEWAL_MAP.get(getEntryName());
    if (ee == null) {
        return;
    }

    Timeout task = commandExecutor.getConnectionManager().newTimeout(new TimerTask() {
        @Override
        public void run(Timeout timeout) throws Exception {
            ExpirationEntry ent = EXPIRATION_RENEWAL_MAP.get(getEntryName());
            if (ent == null) {
                return;
            }
            Long threadId = ent.getFirstThreadId();
            if (threadId == null) {
                return;
            }

            RFuture<Boolean> future = renewExpirationAsync(threadId);
            future.onComplete((res, e) -> {
                if (e != null) {
                    log.error("Can't update lock " + getRawName() + " expiration", e);
                    EXPIRATION_RENEWAL_MAP.remove(getEntryName());
                    return;
                }

                if (res) {
                    //如果 没有报错，就再次定时延期
                    // reschedule itself
                    renewExpiration();
                } else {
                    cancelExpirationRenewal(null);
                }
            });
        }
        // 这里我们可以看到定时任务 是 lockWatchdogTimeout 的1/3时间去执行 renewExpirationAsync
    }, internalLockLeaseTime / 3, TimeUnit.MILLISECONDS);

    ee.setTimeout(task);
}
```

最终 scheduleExpirationRenewal 会调用到 renewExpirationAsync，执行下面这段 lua 脚本。他主要判断就是 这个锁是否在 redis 中存在，如果存在就进行 pexpire 延期。

```java
protected RFuture<Boolean> renewExpirationAsync(long threadId) {
    return evalWriteAsync(getRawName(), LongCodec.INSTANCE, RedisCommands.EVAL_BOOLEAN,
            "if (redis.call('hexists', KEYS[1], ARGV[2]) == 1) then " +
                    "redis.call('pexpire', KEYS[1], ARGV[1]); " +
                    "return 1; " +
                    "end; " +
                    "return 0;",
            Collections.singletonList(getRawName()),
            internalLockLeaseTime, getLockName(threadId));
}
```

