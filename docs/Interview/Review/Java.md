# Java

## 序列化和反序列化

序列化：将对象转为字节流，可通过网络传输、持久化存储和缓存，implements Serializable

反序列化：字节流转为对象，从存储中读取数据并重新创建对象

transient：标记不需要序列化的字段，如敏感数据

serialVersionUID：控制版本是否兼容，向后兼容则不变

序列化不包含静态变量

## 不可变类

创建后不能被修改

- 声明类为 final，无法继承
- 字段为 private final，初始化后无法修改
- 不暴露 set 方法，修改时返回新对象
- 不可变类有：String，Integer，BigDecimal，LocalDate

优点：

- 线程安全
- 缓存友好：如 String 的字符串常量池
- 防止状态不一致

缺点：

- 性能问题：每次状态变化都需要创建新的对象，如 String 的频繁拼接

### Exception 和 Error

Exception：程序可以处理的异常，又分为 编译器异常 和 运行时异常

Error：无法通过代码处理，如OOM，SOF

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1729587286_0.png" alt="image-20241022165445535" style="zoom: 50%;" />

## 多态

对象可以通过父类或接口进行多态性调用，不同对象运行时执行不同的行为

编译时多态：静态多态，方法重载，同一个类存在多个同名方法

运行时多态：动态多态，方法重写，继承/实现接口时子类重写父类的方法，父类的引用指向子类的对象

## 按值传递

Java 使用按值传递

- 基本数据类型：传递数值本身
- 引用数据类型：传递对象引用的内存地址，可以修改对象的内容

## 多重继承

多重继承会出现菱形继承的问题，D 要调用 A 中的方法，无法知道调用 B 还是 C 的实现

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1729587882_0.png" alt="image-20241022170442584" style="zoom:33%;" />

接口的多实现：

- 子类必须实现接口中的所有方法，即只会调用自身方法
- 对于 default 默认方法，如果接口有相同的默认方法，子类必须重写

