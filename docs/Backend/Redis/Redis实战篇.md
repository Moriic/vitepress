## 验证码登录

- 手机号校验：使用hutool的match进行校验
- 将生成的验证码存到Redis中，value格式为string,并设置有效期
- 获取用户填写的验证码与Redis中的验证码进行比较
- 验证码一致则将用户信息存到Redis中，格式为value格式为hash

> 此处需要将类的每个属性转为Map对象，可以使用BeanUtil的beanToMap进行转换

- 将使用UUID生成的token发给前端作为用户验证的凭证
- 前端每次访问都需要携带token进行校验，通过拦截器Interceptor实现，在Redis中查询token是否存在

>  在校验时需要将Redis中的Map对象转换为类来获取用户的信息，使用fillBeanWithMap实现

- 使用ThreadLocal来存储该线程下的用户信息

```java
public class RegexUtils {
    /**
     * 是否是无效手机格式
     * @param phone 要校验的手机号
     * @return true:符合，false：不符合
     */
    public static boolean isPhoneInvalid(String phone){
        return mismatch(phone, RegexPatterns.PHONE_REGEX);
    }
    // 校验是否不符合正则格式
    private static boolean mismatch(String str, String regex){
        if (StrUtil.isBlank(str)) {
            return true;
        }
        return !str.matches(regex);
    }
}
```

```java
String code = RandomUtil.randomNumbers(6);

stringRedisTemplate.opsForValue().set(LOGIN_CODE_KEY + phone, code, LOGIN_CODE_TTL, TimeUnit.MINUTES);
```

```java
@Override
public Result login(LoginFormDTO loginForm, HttpSession session) {
    // 校验手机号
    String phone = loginForm.getPhone();
    if(RegexUtils.isPhoneInvalid(phone)){
        return Result.fail("手机号格式错误");
    }

    String cacheCode = stringRedisTemplate.opsForValue().get(LOGIN_CODE_KEY + phone);
    String code = loginForm.getCode();
    if(cacheCode == null || !cacheCode.toString().equals(code)){
        return Result.fail("验证码错误");
    }

    User user = query().eq("phone", phone).one();
    if(user == null){
       user = createUserWithPhone(phone);
    }

    String token = UUID.randomUUID().toString();
    UserDTO userDTO = new UserDTO();
    BeanUtils.copyProperties(user,userDTO);

    Map<String, Object> userMap = BeanUtil.beanToMap(userDTO, new HashMap<>(),
            CopyOptions.create()
                    .setIgnoreNullValue(true)
                    .setFieldValueEditor((filedName,fieldValue) -> fieldValue.toString()));
    String tokenKey = LOGIN_USER_KEY + token;

    stringRedisTemplate.opsForHash().putAll(tokenKey, userMap);
    stringRedisTemplate.expire(tokenKey,30,TimeUnit.MINUTES);

    return Result.ok(token);
}
```

> 在配置拦截类时需要用到StringRedisTemplate，但由于该类不是Spring管理的Bean，因此需要使用构造器来创建Bean，`new LoginInterceptor(stringRedisTemplate)`

```java
public class LoginInterceptor implements HandlerInterceptor {

    private StringRedisTemplate stringRedisTemplate;

    public LoginInterceptor(StringRedisTemplate stringRedisTemplate){
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = request.getHeader("authorization");
        if(StrUtil.isBlank(token)){
            response.setStatus(401);
            return false;
        }

        String tokenKey = RedisConstants.LOGIN_USER_KEY + token;
        Map<Object, Object> userMap =
                stringRedisTemplate.opsForHash().entries(tokenKey);
        if(userMap.isEmpty()){
            response.setStatus(401);
            return false;
        }

        UserDTO userDTO = BeanUtil.fillBeanWithMap(userMap, new UserDTO(), false);
        UserHolder.saveUser(userDTO);

        stringRedisTemplate.expire(tokenKey,RedisConstants.LOGIN_USER_TTL, TimeUnit.MINUTES);

        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        UserHolder.removeUser();
    }
}
```

```java
@Configuration
public class MvcConfig implements WebMvcConfigurer {
    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginInterceptor(stringRedisTemplate))
                .excludePathPatterns(
                        "/user/login"
                );
    }
}
```

## 优惠券秒杀

### 全局唯一id

唯一性，高可用，高性能，递增性，安全性

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711358800_0.png" alt="image-20230920220753466" style="zoom:67%;" />

- 符号位：1bit，为0
- 时间戳：31bit，以秒为单位，可用69年
- 序列号：32bit，秒内的计数器，支持每秒产生 2^32^ 个不同id

```java
@Component
public class RedisIdWorker {

    private static final long BEGIN_TIMESTAMP = 1640995200L;

    private static final int COUNT_BITS = 32;

    private StringRedisTemplate stringRedisTemplate;

    public RedisIdWorker(StringRedisTemplate stringRedisTemplate){
        this.stringRedisTemplate = stringRedisTemplate;
    }

    public long nextId(String keyPrefix){
        LocalDateTime now = LocalDateTime.now();
        long nowSecond = now.toEpochSecond(ZoneOffset.UTC);
        long timmestamp = nowSecond - BEGIN_TIMESTAMP;

        String date = now.format(DateTimeFormatter.ofPattern("yyyy:MM:dd"));

        long count = stringRedisTemplate.opsForValue().increment("icr:" + keyPrefix + ":" + date);

        return timmestamp << COUNT_BITS | count;
    }

}
```

### 并发问题

- 超卖问题：通过乐观锁解决
- 一人一单：使用synchronized对用户id加锁
- spring事务失效：调用自身函数会导致事务失效，需要获取代理对象再调用

```java
@Service
public class VoucherOrderServiceImpl extends ServiceImpl<VoucherOrderMapper, VoucherOrder> implements IVoucherOrderService {

    @Resource
    private ISeckillVoucherService seckillVoucherService;

    @Resource
    private RedisIdWorker redisIdWorker;

    @Override
    public Result seckill(Long voucherId) {

        SeckillVoucher voucher = seckillVoucherService.getById(voucherId);

        if (voucher.getBeginTime().isAfter(LocalDateTime.now())) {
            return Result.fail("秒杀尚未开始！");
        }

        if (voucher.getEndTime().isBefore(LocalDateTime.now())) {
            return Result.fail("秒杀已经开始");
        }

        if (voucher.getStock() < 1) {
            return Result.fail("库存不足");
        }

        Long userId = UserHolder.getUser().getId();

        synchronized (userId.toString().intern()) {
            IVoucherOrderService proxy = (IVoucherOrderService) AopContext.currentProxy();
            return proxy.createVoucherOrder(voucherId);
        }
    }

    @Transactional
    public Result createVoucherOrder(Long voucherId) {
        Long userId = UserHolder.getUser().getId();

        // 查询用户订单数
        Long count = query()
                .eq("user_id", userId)
                .eq("voucher_id", voucherId)
                .count();

        if (count > 0) {
            return Result.fail("用户已经购买过一次！");
        }

        // 乐观锁解决超卖问题
        boolean success = seckillVoucherService.update()
                .setSql("stock = stock -1")
                .eq("voucher_id", voucherId)
                .gt("stock", 0)     //乐观锁
                .update();

        if (!success) {
            return Result.fail("库存不足");
        }

        // 保存订单
        VoucherOrder voucherOrder = new VoucherOrder();

        long orderId = redisIdWorker.nextId("order");

        voucherOrder.setId(orderId);
        voucherOrder.setVoucherId(voucherId);
        voucherOrder.setUserId(UserHolder.getUser().getId());
        save(voucherOrder);

        return Result.ok(orderId);
    }
}
```

```xml
<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
</dependency>
```

启动类添加 `@EnableAspectJAutoProxy(exposeProxy = true)`

> 在集群模式下，有可能两个请求都会进入锁，出现并发问题

```java
public Result seckill(Long voucherId) {

    SeckillVoucher voucher = seckillVoucherService.getById(voucherId);

    if (voucher.getBeginTime().isAfter(LocalDateTime.now())) {
        return Result.fail("秒杀尚未开始！");
    }

    if (voucher.getEndTime().isBefore(LocalDateTime.now())) {
        return Result.fail("秒杀已经开始");
    }

    if (voucher.getStock() < 1) {
        return Result.fail("库存不足");
    }

    Long userId = UserHolder.getUser().getId();

    SimpleRedisLock lock = new SimpleRedisLock("order:" + userId, stringRedisTemplate);

    boolean isLock = lock.tryLock(1200);

    if(!isLock){
        return Result.fail("不允许重复下单");
    }
    try {
        IVoucherOrderService proxy = (IVoucherOrderService) AopContext.currentProxy();
        return proxy.createVoucherOrder(voucherId);
    }finally {
        lock.unlock();
    }
}
```

## 商家搜索

### 数据预热

```java
@Test
void loadShopData() {
    List<Shop> list = shopService.list();

    Map<Long, List<Shop>> map = list.stream().collect(Collectors.groupingBy(Shop::getTypeId));

    map.forEach((k, v) -> {
        String key = "shop:geo:" + k;

        List<RedisGeoCommands.GeoLocation<String>> locations = new ArrayList<>();

        for (Shop shop : v) {
            locations.add(new RedisGeoCommands.GeoLocation<>(
                            shop.getId().toString(),
                            new Point(shop.getX(), shop.getY()))
            );
        }
        stringRedisTemplate.opsForGeo().add(key, locations);
    });

}
```

### 搜索操作

```java
@Override
public Result queryShopByType(Integer typeId, Integer current, Double x, Double y) {
    if (x == null || y == null) {
        Page<Shop> page = query().eq("type_id", typeId)
                .page(new Page<>(current, SystemConstants.DEFAULT_PAGE_SIZE));
        return Result.ok(page.getRecords());
    }

    int from = (current - 1) * SystemConstants.DEFAULT_PAGE_SIZE;
    int end = current * SystemConstants.DEFAULT_PAGE_SIZE;

    String key = SHOP_GEO_KEY + typeId;

    GeoResults<RedisGeoCommands.GeoLocation<String>> results = stringRedisTemplate.opsForGeo()
            .search(key,
                    GeoReference.fromCoordinate(x, y),
                    new Distance(5000),
                    RedisGeoCommands.GeoSearchCommandArgs.newGeoSearchArgs().includeDistance().limit(end));

    if (results == null)
        return Result.ok(Collections.emptyList());

    List<GeoResult<RedisGeoCommands.GeoLocation<String>>> list = results.getContent();
    if(list.size() <= from){
        return Result.ok(Collections.emptyList());
    }

    List<Long> ids = new ArrayList<>(list.size());
    Map<String,Distance> distanceMap = new HashMap<>(list.size());

    list.stream().skip(from).forEach(result -> {
        String shopIdStr = result.getContent().getName();
        ids.add(Long.valueOf(shopIdStr));
        Distance distance = result.getDistance();
        distanceMap.put(shopIdStr,distance);
    });


    String idStr = StringUtil.join(ids, ",");
    List<Shop> shops = query().in("id", ids).last("ORDER BY FIELD(id," + idStr + ")").list();

    for (Shop shop : shops) {
        shop.setDistance(distanceMap.get(shop.getId().toString()).getValue());
    }

    return Result.ok(shops);
}
```

## 签到功能

### 签到

```java
@Override
public Result sign() {
    Long userId = UserHolder.getUser().getId();

    LocalDateTime now = LocalDateTime.now();

    String format = now.format(DateTimeFormatter.ofPattern(":yyyyMM"));
    String key = USER_SIGN_KEY + userId + format;

    int dayOfMonth = now.getDayOfMonth();

    stringRedisTemplate.opsForValue().setBit(key, dayOfMonth - 1, true);

    return Result.ok();
}
```

### 统计

```java
public Result signCount() {
    Long userId = UserHolder.getUser().getId();

    LocalDateTime now = LocalDateTime.now();

    String format = now.format(DateTimeFormatter.ofPattern(":yyyyMM"));
    String key = USER_SIGN_KEY + userId + format;

    int dayOfMonth = now.getDayOfMonth();

    List<Long> result = stringRedisTemplate.opsForValue().bitField(
            key,
            BitFieldSubCommands.create()
                    .get(BitFieldSubCommands.BitFieldType.unsigned(dayOfMonth)).valueAt(0)
    );
    if (result == null || result.isEmpty())
        return Result.ok(0);

    Long num = result.get(0);
    if (num == null || num == 0)
        return Result.ok(0);

    int count = 0;
    while ((num & 1) != 0) {
        count++;
        num >>>= 1;
    }

    return Result.ok(count);
}
```

## 实现UV统计

```java
@Test
void testHyperLogLog(){
    stringRedisTemplate.opsForHyperLogLog().add("hl","user1","user2");
    stringRedisTemplate.opsForHyperLogLog().size("hl");
}
```
