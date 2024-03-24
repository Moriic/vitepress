# Java

## JDK vs JRE vs JVM

- JDK：包含 JRE 及 javac(编译器)，jdb(调试器)
- JRE：Java 运行时环境和必要的类库

- JVM：运行字节码的虚拟机

## 编译与解释并存

<img src="https://cdn.jsdelivr.net/gh/Moriic/picture@main/img/compiled-and-interpreted-languages.png" alt="compiled-and-interpreted-languages" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/Moriic/picture@main/img/java-code-to-machine-code-with-jit.png" alt="java-code-to-machine-code-with-jit" style="zoom:50%;" />

- 编译型：编译器将源代码一次性翻译成可被执行的机器码(C, C++, Go, Rust)
- 解释型：解释器将代码解释成机器码后执行(Python, JS, PHP)
- 编译与解释并存：Java 程序先编译生成字节码(.class)文件，字节码由解释器解释执行

- 解释器较慢，引进了 JIT 编译器，将热点代码字节码对应的机器码保存下来
- AOT 编译模式：在执行前编译成机器码(静态编译)，优点：

## Java vs C++

- Java 不提供指针访问内存，更安全
- Java 只支持单继承，接口多继承
- Java 自动内存管理垃圾回收机制(GC)
- Java 只支持方法重载，不支持操作符重载

## Java 语法

### 关键字

synchronized, transient, vilatile

### 移位

- 无符号右移：>>>
- 只支持 int, long, 其他转 int，大于 32/64 取余

### 基本类型

byte(1), short(2), int(4), long(8), char(2), float(4), double(8), boolean(1)

### 包装类型

Byte, Short, Integer, Long, Character, Float, Double, Boolean

**存储方式**：基本数据类型的 **局部变量** 存放在 Java **虚拟机栈中的局部变量表** 中，基本数据类型的 **成员变量**(未被 `static` 修饰)存放在 Java **虚拟机的堆** 中。包装类型属于对象类型，我们知道 **几乎所有对象实例都存在于堆中**。

```java
public class Test {
    // 成员变量，存放在堆中
    int a = 10;
    // 被 static 修饰，也存放在堆中，但属于类，不属于对象
    // JDK1.7 静态变量从永久代移动了 Java 堆中
    static int b = 20;

    public void method() {
        // 局部变量，存放在栈中
        int c = 30;
        static int d = 40; // 编译错误，不能在方法中使用 static 修饰局部变量
    }
}
```

### 缓存机制

- `Byte`, `Short`, `Integer`, `Long` 这 4 种包装类默认创建了数值 **[-128，127]** 的相应类型的缓存数据，`Character` 创建了数值在 **[0,127]** 范围的缓存数据，`Boolean` 直接返回 `True` or `False`。

- 两种浮点数类型的包装类 `Float`, `Double` 并没有实现缓存机制。

## 自动装箱和拆箱

- **装箱**：将基本类型用它们对应的引用类型包装起来；
- **拆箱**：将包装类型转换为基本数据类型；
- 装箱其实就是调用了包装类的 `valueOf()` 方法，拆箱其实就是调用了 `xxxValue()` 方法。

```java
Integer i = 10;  //装箱 等价于 Integer i = Integer.valueOf(10)
int n = i;   //拆箱  等价于 int n = i.intValue();
```

## 静态方法为什么不能调用非静态成员

- 静态方法属于类，在类加载时就会分配内存；非静态成员属于实例对象，只有在对象实例化后才存在，需要通过类的实例对象去访问；
- 非静态成员不存在，不能调用

## 对象实例 vs 对象引用

- new 创建对象实例(存放在堆内存中)，对象引用指向对象实例(存放在栈内存中)
- 对象相等：对象存放内容相等(==)；引用相等：指向的内存地址相等(equals)。

## 接口 vs 抽象类

**共同点**：

- 都不能被实例化。
- 都可以包含抽象方法。
- 都可以有默认实现的方法（Java 8 可以用 `default` 关键字在接口中定义默认方法）。

**区别**：

- 接口主要用于对类的行为进行约束，你实现了某个接口就具有了对应的行为。抽象类主要用于代码复用，强调的是所属关系。
- 一个类只能继承一个类，但是可以实现多个接口。
- 接口中的成员变量只能是 `public static final` 类型的，不能被修改且必须有初始值，而抽象类的成员变量默认 default，可在子类中被重新定义，也可被重新赋值。

## 引用拷贝 vs 浅拷贝 vs 深拷贝

- **引用拷贝**：两个不同的引用指向同一个对象。

- **浅拷贝**：浅拷贝会 **在堆上创建一个新的对象**（区别于引用拷贝的一点），不过，如果原对象内部的属性是引用类型的话，浅拷贝会直接复制内部对象的引用地址，也就是说 **拷贝对象和原对象共用同一个内部对象**。

- **深拷贝**：深拷贝会 **完全复制整个对象**，包括这个对象所包含的内部对象。

<img src="https://cdn.jsdelivr.net/gh/Moriic/picture@main/img/shallow&deep-copy.png" alt="shallow&deep-copy" style="zoom:50%;" />

## == vs equals

