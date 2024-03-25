## 简介

> https://redis.io/
>
> https://www.redis.net.cn/

|          | SQL     | NoSQL    |
| -------- | ------- | -------- |
| 数据结构 | 结构化  | 非结构化 |
| 数据关联 | 关联的  | 无关联的 |
| 查询方式 | SQL查询 | 非SQL    |
| 事务特性 | ACID    | BASE     |
| 存储方式 | 磁盘    | 内存     |
| 扩展性   | 垂直    | 水平     |

Redis(Remote Dictionary Server)是一个基于内存的`key-value`结构NoSQL数据库

- 基于内存存储(IO多路复用)，读写性能高
- 单线程，每个命令具备原子性
- 支持数据持久化
- 支持主从集群，分片集群
- 支持多语言客户端
- 适合存储热点数据（热点商品、咨询、新闻）

## 基本类型

Redis存储的是key-value结构的数据，其中key是String类型，value有5中常用的数据类型

| 数据类型       | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| String         | 普通字符串                                                   |
| Hash           | 哈希，类似Java中的HashMap结构，适合用于存储**对象**          |
| List           | 列表，可以有重复元素，类似Java中的LinkedList                 |
| Set            | 无序集合，没有重复元素，类似Java中的HashSet                  |
| Sort Set(ZSet) | 集合中每个元素关联一个分数(score)，根据分数升序排序，没有重复元素 |

<img src="https://cdn.jsdelivr.net/gh/cwcblog/picture@main/img/image-20230829163543755.png" alt="image-20230829163543755" style="zoom:50%;" />

## 常用命令

> https://www.redis.net.cn/order/，`help @类型` 可用查询命令

> key可形成层级结构，例如 `项目名:业务名:类型:id`
>


| String命令              | 说明                                        |
| ----------------------- | ------------------------------------------- |
| SET key value           | 设置key的值                                 |
| GET key                 | 获取key的值                                 |
| MSET key1 v1 key2 v2 …  | 批量设置key的值                             |
| MGET key1 key2 key3     | 批量获取key的值                             |
| INCR key                | 让一个整型的key自增1                        |
| INCRBY key num          | 让一个整型的key自增num                      |
| INCRBYFLOAT key num     | 让一个**浮点类型**的key自增num              |
| SETEX key seconds value | 设置key的值，并将key的过期时间设为seconds秒 |
| SETNX key value         | 只有在key**不存在**时设置key的值            |

| Hash命令             | 说明                                  |
| -------------------- | ------------------------------------- |
| HSET key filed value | 将哈希表key中的字段field的值设为value |
| HGET key filed       | 获取存储在哈希表中的指定字段field     |
| HDEL key filed       | 删除哈希表中的指定字段                |
| HKEYS key            | 获取哈希表的所有field                 |
| HVALS key            | 获取哈希表的所有value                 |
| HGETALL              | 获取哈希表中所有的field和value        |

| List命令                  | 说明                                           |
| ------------------------- | ---------------------------------------------- |
| LPUSH key value1 [value2] | 将一个或多个值插入到列表头部                   |
| LPOP key                  | 移除并返回列表左侧第一个元素                   |
| RPUSH key value           | 插入到列表尾部                                 |
| RPOP key                  | 移除并获取列表的最后一个元素                   |
| LRANGE key start stop     | 获取列表指定范围内的元素                       |
| LLEN key                  | 获取列表长度                                   |
| BLPOP/BRPOP key seconds   | 与LPOP和RPOP类似，只是在没有元素时等待指定时间 |

> lrange key 0 -1 可查询全部元素

| Set命令                    | 说明                        |
| -------------------------- | --------------------------- |
| SADD key member1 [member2] | 向集合key添加一个或多个成员 |
| SMEMVBERS key              | 返回集合中所有的成员        |
| SCARD key                  | 获取集合的成员数            |
| SREM key member1 [member2] | 删除集合中的一个或多个成员  |
| SISMEMBER key member       | 判断元素是否在key中         |
| SINTER key1 [key2]         | 返回给定集合的交集          |
| SUNION key1 [key2]         | 返回给定集合的并集          |
| SDIFF key1 [key2]          | 返回给定集合的差集          |

| Sort Set                                 | 说明                                      |
| ---------------------------------------- | ----------------------------------------- |
| ZADD key score1 member1 [score2 member2] | 向有序集合添加一个或多个成员              |
| ZREM key member [member2]                | 删除有序集合中一个或多个成员              |
| ZSCORE key member                        | 获取member的score值                       |
| ZRANK key member                         | 获取member的排名                          |
| ZCARD key                                | 获取元素个数                              |
| ZCOUNT key min max                       | 统计给定范围的元素个数                    |
| ZINCRBY key increment member             | 有序集合对指定成员的分数加上增量increment |
| ZRANGE key min max [withscores]          | 获取指定排名内的元素                      |
| ZRANGEBYSCORE key min max                | 获取指定score范围内的元素                 |
| ZDIFF、ZINTER、ZUNION                    | 求差集、交集、并集                        |

> 默认升序，降序需要在命令的Z后面添加REV即可

| 通用命令          | 说明                                          |
| ----------------- | --------------------------------------------- |
| KEYS pattern      | 查找所有符合给定模式(pattern)的key,如 KEYS \* |
| EXISTS key [key2] | 检查给定key是否存在,返回存在的个数            |
| TYPE key          | 返回key所存储值的类型                         |
| DEL key           | 删除key,返回删除的数量                        |
| EXPIRE key        | 给key设置有效期                               |
| TTL key           | 查看key的剩余有效时间，-1表示永久有效，-2失效 |

## 在java中操作Redis

### 简介

- Redis的Java客户端有很多，官方推荐的有三种
  - `Jedis`
  - `Lettuce`
  - `Redisson`
- Spring对Redis客户端进行了整合，提供了SpringDataRedis，在Spring Boot项目中还提供了对应的Starter，即`spring-boot-starter-data-redis`

### Jedis

1. 导入依赖

```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>2.8.0</version>
</dependency>
```

2. 测试类

```java
@SpringBootTest
class RedisTestApplicationTests {

    @Test
    void contextLoads() {
        //1. 获取连接
        Jedis jedis = new Jedis("localhost", 6379);
        //2. 执行具体操作
        jedis.set("name", "Hades");

        jedis.hset("stu", "name", "Jerry");
        jedis.hset("stu", "age", "18");
        jedis.hset("stu", "num", "4204000400");

        Map<String, String> map = jedis.hgetAll("stu");
        Set<String> keySet = map.keySet();
        for (String key : keySet) {
            String value = map.get(key);
            System.out.println(key + ":" + value);
        }
        String name = jedis.get("name");
        System.out.println(name);
        //3. 关闭连接
        jedis.close();
    }

}
```

### Spring Data Redis

1. 导入依赖

```xml
<!--Spring Boot-redis的依赖包-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<!--连接池依赖包-->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
</dependency>
```

2. 配置数据源

```yml
spring:
  redis:
    host: localhost
    port: 6379
    password: 123456
    database: 0 #操作的是0号数据库
    lettuce:
      #Redis连接池配置
      pool:
        max-active: 8 #最大连接数
        max-wait: 1ms #连接池最大阻塞等待时间
        max-idle: 4 #连接池中的最大空闲连接
        min-idle: 0 #连接池中的最小空闲连接
```

3. RedisTemplate 的两种序列化

- 自定义RedisTemplate的序列化器为 GenericJackson2JsonRedisSerializer

```java
@Configuration
@Slf4j
public class RedisConfigration {

    @Bean
    public RedisTemplate<String,Object> redisTemplate(RedisConnectionFactory redisConnectionFactory){
        log.info("创建redis模板对象");

        RedisTemplate<String,Object>  redisTemplate = new RedisTemplate<>();

        redisTemplate.setConnectionFactory(redisConnectionFactory);
        // 创建JSON序列化工具
        GenericJackson2JsonRedisSerializer jsonRedisSerializer = new GenericJackson2JsonRedisSerializer();
        // 设置key的序列化
        redisTemplate.setKeySerializer(RedisSerializer.string());
        redisTemplate.setHashKeySerializer(RedisSerializer.string());
        // 设置value的反序列化
        redisTemplate.setValueSerializer(jsonRedisSerializer);
        redisTemplate.setHashValueSerializer(jsonRedisSerializer);

        return redisTemplate;
    }
}
```
```java
@Autowired
private RedisTemplate redisTemplate;

@Test
void contextLoads() {
    redisTemplate.opsForValue().set("user",new User("test",11));
    User user = (User) redisTemplate.opsForValue().get("user");
    System.out.println(user);
}
```

> 该方案会插入类的类名，内存占用大

```json
{
    "@class": "com.cwc.User",
    "name": "test",
    "age": 11
}
```

- 使用StringRedisTemplate，写入Redis需要手动将对象序列化为JSON，读取Redis需要反序列化

```java
@Autowired
private StringRedisTemplate stringRedisTemplate;

// json 工具
private static final ObjectMapper mapper = new ObjectMapper();

@Test
void contextLoads() throws JsonProcessingException {
    User user = new User("test",11);
    // 手动序列化
    String json = mapper.writeValueAsString(user);

    stringRedisTemplate.opsForValue().set("user",json);
    String jsonUser = stringRedisTemplate.opsForValue().get("user");

    User user1 = mapper.readValue(jsonUser, User.class);
    System.out.println(user1);
}
```

> 该方案需要手动序列化和反序列化，但内存占用小且无需配置

```json
{
    "name": "test",
    "age": 11
}
```

> 配置密码后需要使用 `.\redis-server.exe .\redis.windows.conf`开启Redis服务

### 使用命令

1. String

```java
@Test
void stringTest() {
    //获取对象
    ValueOperations valueOperations = redisTemplate.opsForValue();
    //设置name为Hades
    valueOperations.set("name","Hades");
    String name = (String) valueOperations.get("name");
    System.out.println(name);
    //设置age为9527，有效时间10秒
    valueOperations.set("age", "9527", 10, TimeUnit.SECONDS);
    String age = (String) valueOperations.get("age");
    System.out.println(age);
    //如果不存在，则设置name为Kyle
    Boolean aBoolean = valueOperations.setIfAbsent("name", "Kyle");
    System.out.println(aBoolean);
}
```

2. Hash

```java
@Test
void HashTest(){
    HashOperations hashOperations = redisTemplate.opsForHash();

    hashOperations.put("people","name","tom");
    hashOperations.put("people","age","20");

    String name = (String) hashOperations.get("people", "name");
    System.out.println(name);

    Set keys = hashOperations.keys("people");
    System.out.println(keys);

    List people = hashOperations.values("people");
    System.out.println(people);

    hashOperations.delete("people","age");
}
```

3. List

```java
@Test
void ListTest(){
    ListOperations listOperations = redisTemplate.opsForList();

    listOperations.leftPushAll("myList","1","2","3");
    listOperations.leftPush("myList","4");

    List myList = listOperations.range("myList", 0, -1);
    System.out.println(myList);

    String top = (String) listOperations.rightPop("myList");
    System.out.println(top);

    System.out.println(listOperations.size("myList"));
}
```

4. Set

```java
@Test
void SetTest(){
    SetOperations setOperations = redisTemplate.opsForSet();

    setOperations.add("set1","1","2","3");
    setOperations.add("set2","2","3","4");

    Set set1 = setOperations.members("set1");
    System.out.println(set1);

    System.out.println(setOperations.size("set2"));

    Set intersect = setOperations.intersect("set1", "set2");
    System.out.println(intersect);

    Set union = setOperations.union("set1", "set2");
    System.out.println(union);

    setOperations.remove("set1","1");
}
```

5. ZSet

```java
@Test
void ZSetTest(){
    ZSetOperations zSetOperations = redisTemplate.opsForZSet();

    zSetOperations.add("zset1","a",1.5);
    zSetOperations.add("zset1","b",2);

    Set zset1 = zSetOperations.range("zset1", 0, -1);
    System.out.println(zset1);

    zSetOperations.incrementScore("zset1","a",2);

    zSetOperations.remove("zset1","b");

}
```

6. common

```java
@Test
void CommonTest(){
    Set keys = redisTemplate.keys("*");
    System.out.println(keys);

    System.out.println(redisTemplate.hasKey("set1"));

    for (Object key : keys) {
        DataType type = redisTemplate.type(key);
        System.out.println(type.name());
    }

    redisTemplate.delete("myList");
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
2. 删除指定id `@CacheEvict(cacheNames = "setmealCache",key = "#setmealDTO.categoryId")`
3. 删除所有 `@CacheEvict(cacheNames = "setmealCache",allEntries = true)`
4. 生成的key 为 cacheNames::key

## 缓存更新策略

先操作数据库，**再删除缓存**

## redis应用问题

### 缓存穿透

#### 问题描述

​	当系统中引入redis缓存后，一个请求进来后，会先从redis缓存中查询，缓存有就直接返回，缓存中没有就去db中查询，db中如果有就会将其丢到缓存中，但是有些key对应更多数据在db中并不存在，**每次针对此次key的请求从缓存中取不到，请求都会压到db**，从而可能压垮db。

​	比如用一个不存在的用户id获取用户信息，不论缓存还是数据库都没有，若黑客利用大量此类攻击可能压垮数据库。

#### 解决方案

- **对空值缓存**：如果一个查询返回的数据为空（不管数据库是否存在），我们仍然把这个结果（null）进行缓存，给其设置一个很短的过期时间，最长不超过五分钟
- **采用布隆过滤器**：布隆过滤器（Bloom Filter）是1970年有布隆提出的，它实际上是一个很长的二进制向量（位图）和一系列随机映射函数（哈希函数）。布隆过滤器可以用于检测一个元素是否在一个集合中，它的优点是空间效率和查询的世界都远远超过一般的算法，缺点是有一定的误识别率和删除困难。
- 设置可访问的名单（白名单）：使用redis中的bitmaps类型定义一个可以访问的名单，名单id作为bitmaps的偏移量，每次范文和bitmap里面的id进行比较，如果访问的id不在bitmaps里面，则进行拦截，不允许访问

### 缓存击穿

#### 问题描述

redis中某个热点key（访问量很高的key）过期，此时**大量请求**同时过来，发现缓存中没有命中，这些请求都打到db上了，导致db压力瞬时大增，可能会打垮db，这种情况成为缓存击穿。

#### 解决方案

- 预先设置热门数据，**适时调整过期时间**：在redis高峰之前，把一些热门数据提前存入到redis里面，对缓存中的这些热门数据进行监控，实时调整过期时间。
- **使用锁**：缓存中拿不到数据的时候，此时不是立即去db中查询，而是去获取**分布式锁**（比如redis中的setnx），**拿到锁再去db中load数据；没有拿到锁的线程休眠一段时间再重试整个获取数据的方法**
- **逻辑过期**：设置逻辑时间，查询缓存发现逻辑时间过期则开启新线程更新数据，更新前获取的都是旧数据

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358784_0.png" alt="image-20230920011519676" style="zoom:67%;" />

| 解决方案 | 优点                                       | 缺点                                 |
| -------- | ------------------------------------------ | ------------------------------------ |
| 互斥锁   | 没有额外内存消耗，**保证一致性**，实现简单 | 线程需等待，可能有死锁风险           |
| 逻辑过期 | 线程无需等待，**性能较好**                 | 不保证一致性，额外内存消耗，实现复杂 |

#### 互斥锁实现(setnx)

```java
private boolean tryLock(String key){
    Boolean flag = stringRedisTemplate.opsForValue().setIfAbsent(key, "1", 10, TimeUnit.SECONDS);
    return BooleanUtil.isTrue(flag);
}

private void unlock(String key){
    stringRedisTemplate.delete(key);
}
```

```java
public Shop queryWithMutex(Long id){
    String key = CACHE_SHOP_KEY + id;
    String shopJson = stringRedisTemplate.opsForValue().get(key);

    if (!StrUtil.isBlank(shopJson)) {
        return JSONUtil.toBean(shopJson, Shop.class);
    }

    if (shopJson != null){
        return null;
    }
    // 获取互斥锁
    String lockKey = "lock:shop:" + id;


    Shop shop = null;
    try {
        boolean isLock = tryLock(lockKey);

        if(!isLock){
            Thread.sleep(50);
            return queryWithMutex(id);
        }

        shop = getById(id);

        if(shop == null){
            stringRedisTemplate.opsForValue().set(key,"",CACHE_NULL_TTL,TimeUnit.MINUTES);
            return null;
        }

        stringRedisTemplate.opsForValue().set(key, JSONUtil.toJsonStr(shop),CACHE_SHOP_TTL, TimeUnit.MINUTES);
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    } finally {
        // 释放互斥锁
        unlock(lockKey);
    }

    return shop;
}
```

### 缓存雪崩

#### 问题描述

​	key对应的数据存在，但是极短时间内有**大量的key集中过期**，此时若有大量的并发请求过来，发现缓存没有数据，大量的请求就会落到db上去加载数据，会将db击垮，导致服务奔溃。

​	缓存雪崩与缓存击穿的区别在于：**前者是大量的key集中过期，而后者是某个热点key过期**。

#### 解决方案

- 构建多级缓存：nginx缓存 + redis缓存 + 其他缓存（ehcache等）

- 使用锁或队列：用加锁或者队列的方式来保证不会有大量的线程对数据库一次性进行读写，从而避免失效时大量的并发请求落到底层存储系统上，不适用高并发情况。
- 监控缓存过期，提前更新：监控缓存，发下缓存快过期了，提前对缓存进行更新。
- **将缓存失效时间分散开**：比如我们可以在原有的失效时间基础上增加一个随机值，比如1-5分钟随机，这样缓存的过期时间重复率就会降低，就很难引发集体失效的事件。

### 封装工具类

```java
@Slf4j
@Component
public class CacheClient {

    private final StringRedisTemplate stringRedisTemplate;

    public CacheClient(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    // 插入redis
    public void set(String key, Object value, Long time, TimeUnit unit) {
        stringRedisTemplate.opsForValue().set(key, JSONUtil.toJsonStr(value),time,unit);
    }

    // 插入redis(逻辑过期)
    public void setWithLocalExpire(String key, Object value, Long time, TimeUnit unit) {
        RedisData redisData = new RedisData();
        redisData.setData(value);
        redisData.setExpireTime(LocalDateTime.now().plusSeconds(unit.toSeconds(time)));

        stringRedisTemplate.opsForValue().set(key, JSONUtil.toJsonStr(redisData));
    }

    // 空值解决缓存穿透
    public <R, ID> R queryWithPassThrough(String keyPrefix, ID id, Class<R> type, Function<ID, R> dbFallback, Long time, TimeUnit unit) {
        String key = keyPrefix + id;
        String shopJson = stringRedisTemplate.opsForValue().get(key);

        // 查询redis成功返回
        if (!StrUtil.isBlank(shopJson)) {
            return JSONUtil.toBean(shopJson, type);
        }

        // 查询到"" 返回null
        if (shopJson != null) {
            return null;
        }

        R r = dbFallback.apply(id);

        // 数据库为空，设置""
        if (r == null) {
            stringRedisTemplate.opsForValue().set(key, "", CACHE_NULL_TTL, TimeUnit.MINUTES);
            return null;
        }

        this.set(key, r, time, unit);

        return r;
    }

    // 线程池
    private static final ExecutorService CACHE_REBUILD_EXECUTOR = Executors.newFixedThreadPool(10);

    // 逻辑过期解决缓存击穿
    public <R,ID> R queryWithLogicalExpire(String keyPrefix, ID id, Class<R> type,Function<ID,R> dbFallback,Long time, TimeUnit unit) {
        String key = keyPrefix + id;
        String shopJson = stringRedisTemplate.opsForValue().get(key);

        // 查询redis成功返回
        if (StrUtil.isBlank(shopJson)) {
            return null;
        }

        RedisData redisData = JSONUtil.toBean(shopJson, RedisData.class);
        R r = JSONUtil.toBean((JSONObject) redisData.getData(),type);
        LocalDateTime expireTime = redisData.getExpireTime();

        if (expireTime.isAfter(LocalDateTime.now())) {
            return r;
        }

        String lockKey = LOCK_SHOP_KEY + id;
        boolean isLock = tryLock(lockKey);

        if (isLock) {
            CACHE_REBUILD_EXECUTOR.submit(() -> {
                try {
                    R r1 = dbFallback.apply(id);
                    this.setWithLocalExpire(key, r1, time, unit);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                } finally {
                    unlock(lockKey);
                }
            });
        }

        return r;
    }

    private boolean tryLock(String key) {
        Boolean flag = stringRedisTemplate.opsForValue().setIfAbsent(key, "1", 10, TimeUnit.SECONDS);
        return BooleanUtil.isTrue(flag);
    }

    private void unlock(String key) {
        stringRedisTemplate.delete(key);
    }
}
```

```java
@Override
public Result queryById(Long id) {
    // 空值解决缓存穿透
    // Shop shop = cacheClient.queryWithPassThrough(CACHE_SHOP_KEY, id, Shop.class, this::getById, CACHE_SHOP_TTL, TimeUnit.MINUTES);
    // 逻辑过期缓存击穿
    Shop shop = cacheClient.queryWithLogicalExpire(CACHE_SHOP_KEY, id, Shop.class, this::getById, CACHE_SHOP_TTL, TimeUnit.MINUTES);

    if (shop == null) {
        return Result.fail("店铺不存在");
    }
    return Result.ok(shop);
}
```

## 分布式锁

分布式锁的核心是实现多线程之间互斥

| 类型   | MySQL                     | Redis                    | Zookeeper                        |
| ------ | ------------------------- | ------------------------ | -------------------------------- |
| 互斥   | 利用mysql本身的互斥锁机制 | 利用setnx互斥命令        | 利用节点的唯一性和有序性实现互斥 |
| 高可用 | 好                        | 好                       | 好                               |
| 高性能 | 一般                      | 好                       | 一般                             |
| 安全性 | 断开连接，自动释放锁      | 利用锁超时时间，到期释放 | 临时节点，断开连接自动释放       |

### 实现

```java
public interface ILock {
    public boolean tryLock(long timeoutSec);

    public void unlock();
}
```

```java
public class SimpleRedisLock implements ILock{
    private String name;
    private StringRedisTemplate stringRedisTemplate;
    private static final String KEY_PREFIX = "lock:";

    public SimpleRedisLock(String name, StringRedisTemplate stringRedisTemplate) {
        this.name = name;
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    public boolean tryLock(long timeoutSec) {
        long threadId = Thread.currentThread().getId();
        Boolean success = stringRedisTemplate.opsForValue().setIfAbsent(KEY_PREFIX + name, threadId + "", timeoutSec, TimeUnit.SECONDS);
        return Boolean.TRUE.equals(success);
    }

    @Override
    public void unlock() {
        stringRedisTemplate.delete(KEY_PREFIX + name);
    }
}
```

### 误删问题

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358786_1.png" alt="image-20231002231622150" style="zoom:50%;" />

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358787_2.png" alt="image-20231002231747869" style="zoom:50%;" />

```java
public class SimpleRedisLock implements ILock{
    private String name;
    private StringRedisTemplate stringRedisTemplate;
    private static final String KEY_PREFIX = "lock:";

    private static final String ID_PREFIX = UUID.randomUUID().toString() + "-";

    public SimpleRedisLock(String name, StringRedisTemplate stringRedisTemplate) {
        this.name = name;
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    public boolean tryLock(long timeoutSec) {
        String threadId = ID_PREFIX + Thread.currentThread().getId();
        Boolean success = stringRedisTemplate.opsForValue()
                .setIfAbsent(KEY_PREFIX + name, threadId + "", timeoutSec, TimeUnit.SECONDS);
        return Boolean.TRUE.equals(success);
    }

    @Override
    public void unlock() {
        String threadId = ID_PREFIX + Thread.currentThread().getId();
        String id = stringRedisTemplate.opsForValue().get(KEY_PREFIX + name);
        if(threadId.equals(id)){
            stringRedisTemplate.delete(KEY_PREFIX + name);
        }
    }
}
```

### 原子性问题

判断锁标识和释放锁是两个步骤，无法保证原子性

Redis提供了Lua脚本，可以确保多条命令执行时的原子性

```lua
-- 比较线程标识和锁的标识是否一致
if(redis.call('get',KEYS[1]) == ARGV[1]) then
    -- 释放锁 del key
    return redis.call('del',KEYS[1])
end
return 0
```

```java
private static DefaultRedisScript<Long> UNLOCK_SCRIPT;

static {
    UNLOCK_SCRIPT = new DefaultRedisScript<>();
    UNLOCK_SCRIPT.setLocation(new ClassPathResource("unlock.lua"));
    UNLOCK_SCRIPT.setResultType(Long.class);
}

@Override
public void unlock() {
    stringRedisTemplate.execute(UNLOCK_SCRIPT,
            Collections.singletonList(KEY_PREFIX + name),
            ID_PREFIX + Thread.currentThread().getId()
    );
}
```

## Redission

> https://redisson.org/

优点：

- 可重入：同一个线程能获取同一把锁
- 可重试：获取锁失败后重试
- 超时释放：
- 主从一致性：

### quick start

```xml
<dependency>
   <groupId>org.redisson</groupId>
   <artifactId>redisson</artifactId>
   <version>3.23.5</version>
</dependency>  
```

```java
@Configuration
public class RedisConfig {

    @Bean
    public RedissonClient redissonClient(){
        Config config = new Config();
        config.useSingleServer().setAddress("redis://localhost:6379").setPassword("123456");
        return Redisson.create(config);
    }
}
```

```java
RLock lock = redissonClient.getLock("lock:order:" + userId);
boolean isLock = lock.tryLock();

if(!isLock){
    return Result.fail("不允许重复下单");
}
try {
    IVoucherOrderService proxy = (IVoucherOrderService) AopContext.currentProxy();
    return proxy.createVoucherOrder(voucherId);
}finally {
    lock.unlock();
}
```

### 可重入锁原理

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358788_3.png" alt="image-20231005150320884" style="zoom: 67%;" />

使用Hash存储锁，含有计数器用来存放进入锁的数量：lock：[thread1：2]

### 可重试

trylock(long waitTime,long leaseTime,TimeUnit unit)

等待时间()，锁超时释放时间(30s)

无参时表示不重试

## 异步优化

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358789_4.png" alt="image-20231005235850470" style="zoom:50%;" />

- 判断下单资格在Redis中，成功后生成订单id
- 保存订单到数据库通过异步实现

## 消息队列

## Feed流

- Timeline：不做内容筛选，按照发布时间排序
  - 拉模式：用户从关注的人的发件箱拉取消息
  - 推模式：发消息人向粉丝推送消息，用户读取消息
  - 推拉模式：读写混合，活跃用户使用推模式，读取消息延时低，普通用户拉模式
- 智能排序：使用算法推荐

|              | 拉模式   | 推模式            | 推拉结合             |
| ------------ | -------- | ----------------- | -------------------- |
| 写比例       | 低       | 高                | 中                   |
| 读比例       | 高       | 低                | 中                   |
| 用户读取延迟 | 高       | 低                | 低                   |
| 实现难度     | 复杂     | 简单              | 很复杂               |
| 使用场景     | 很少使用 | 用户量少、没有大V | 过千万的用户量,有大V |

### 滚动分页查询

ZREVRANGEBYSCORE key max min WITHSCORES LIMIT offset count

- max：当前时间戳 | 上一次查询的最小时间戳
- min：0
- offset：0 | 上一次与最小值一样的元素个数
- count：每页数



```java
@Override
public Result queryBlogOfFollow(Long max, Integer offset) {
    Long userId = UserHolder.getUser().getId();

    String key = FEED_KEY + userId;

    Set<ZSetOperations.TypedTuple<String>> typedTuples = stringRedisTemplate.opsForZSet().reverseRangeByScoreWithScores(key, 0, max, offset, 2);

    if (typedTuples == null || typedTuples.isEmpty()) {
        return Result.ok();
    }

    List<Long> ids = new ArrayList<>(typedTuples.size());
    long minTime = 0;
    int os = 1;
    for (ZSetOperations.TypedTuple<String> typedTuple : typedTuples) {
        // 获取id
        ids.add(Long.valueOf(typedTuple.getValue()));
        // 获取时间戳
        long time = typedTuple.getScore().longValue();
        if (minTime == time)
            os++;
        else {
            minTime = time;
            os = 1;
        }
    }

    String idStr = StringUtil.join(ids, ",");
    List<Blog> blogs = query().in("id", ids).last("ORDER BY FIELD(id," + idStr + ")").list();

    for (Blog blog : blogs) {
        queryBlogUser(blog);
        isBlogLiked(blog);
    }

    ScrollResult r = new ScrollResult();
    r.setList(blogs);
    r.setOffset(os);
    r.setMinTime(minTime);

    return Result.ok(r);
}
```

## GEO

  GEO 就是 Geolocation 的简写形式，代表地理坐标。Redis在3.2版本中加入了对GEO的支持，允许存储地理坐标信息，帮助我们根据经纬度来检索数据。常见的命令有:

- GEOADD：添加一个地理空间信息，包含:经度(longitude)、纬度（latitude)、值(member)
- GEODIST：计算指定的两个点之间的距离并返回
- GEOHASH：将指定member的坐标转为hash字符串形式并返回
- GEOPOS：返回指定member的坐标
- GEORADIUS：指定圆心、半径，找到该圆内包含的所有member，并按照与圆心之间的距离排序后返回。6.2以后已废弃
- GEOSEARCH：在指定范围内搜索member，并按照与指定点之间的距离排序后返回。范围可以是圆形或矩形。6.2.新功能
- GEOSEARCHSTORE：与GEOSEARCH功能一致，不过可以把结果存储到一个指定的key。6.2.新功能

> 底层是ZSET，value为member，score为经纬度转换

```
GEOADD g1 116.378248 39.865275 bjn 116.42803 39.903738 bjz 116.322287 39.893729 bjx

GEODIST g1 bjn bjx [km]  (默认为米)

GEOSEARCH g1 FROMLONLAT 116.397904 39.909005 BYRADIUS 10 km WITHDIST

GEOPOS g1 bjz

GEOHASH g1 bjz
```

## BitMap

Redis中是利用string类型数据结构实现BitMap，因此最大上限是512M，转换为bit则是2^32个bit位。BitMap的操作命令有:

- SETBIT：向指定位置(offset)存入一个0或1
- GETBIT：获取指定位置( offset)的bit值
- BITCOUNT：统计BitMap中值为1的bit位的数量
- BITFIELD：操作（查询、修改、自增）BitMap中bit数组中的指定位置（offset)的值
- BITFIELD_RO：获取BitMap中bit数组，并以十进制形式返回
- BITOP：将多个BitMap的结果做位运算(与、或、异或)
- BITPOS：查找bit数组中指定范围内第一个0或1出现的位置

```
SETBIT bm1 0 1

GETBIT bm1 0 1

BITCOUNT bm1

BITFIELD key GET type offset
BITFIELD bm1 GET u2 0

BITPOS key start end
BITPOS bm1 0 2
```

## HyperLogLog(HLL)

UV：Unique Visitor，独立访客量，同一个用户只记录一次

PV：Page View，页面访问量，每次访问都记录



HLL基于string，单个HLL内存小于16kb，但有概率性

- `PFADD key element[element]`：插入element
- `PFCOUNT key`：统计不重复的个数，适合 UV
- `PFMERGE destkey sourcekey [sourcekey]`：合并多个key

