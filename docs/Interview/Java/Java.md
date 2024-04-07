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

synchronized, transient, volatile

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

### 自动装箱和拆箱

- **装箱**：将基本类型用它们对应的引用类型包装起来；
- **拆箱**：将包装类型转换为基本数据类型；
- 装箱其实就是调用了包装类的 `valueOf()` 方法，拆箱其实就是调用了 `xxxValue()` 方法。

```java
Integer i = 10;  //装箱 等价于 Integer i = Integer.valueOf(10)
int n = i;   //拆箱  等价于 int n = i.intValue();
```

### 重载 vs 重写

- 重载就是同样的一个方法能够根据输入数据的不同，做出不同的处理
- 重写就是当子类继承自父类的相同方法，输入数据一样，但要做出有别于父类的响应时，你就要覆盖父类方法

**方法的重写要遵循“两同两小一大”**：

- “两同”即方法名相同、形参列表相同；
- “两小”指的是子类方法返回值类型应比父类方法返回值类型更小或相等，子类方法声明抛出的异常类应比父类方法声明抛出的异常类更小或相等；
- “一大”指的是子类方法的访问权限应比父类方法的访问权限更大或相等。

> 关于 **重写的返回值类型** 这里需要额外多说明一下，上面的表述不太清晰准确：如果方法的返回类型是 void 和基本数据类型，则返回值重写时不可修改。但是如果方法的返回值是引用类型，重写时是 **可以返回该引用类型的子类的**。

### 静态方法为什么不能调用非静态成员

- 静态方法属于类，**在类加载时就会分配内存**；非静态成员属于实例对象，**只有在对象实例化后才存在，** 需要通过类的实例对象去访问；
- **非静态成员不存在，不能调用**

### 对象实例 vs 对象引用

- new 创建对象实例(存放在 **堆内存** 中)，对象引用指向对象实例(存放在 **栈内存** 中)
- 对象相等：对象存放内容相等(==)；引用相等：指向的内存地址相等(equals)。

### 接口 vs 抽象类

**共同点**：

- 都不能被实例化。
- 都可以包含抽象方法。
- 都可以有默认实现的方法（Java 8 可以用 `default` 关键字在接口中定义默认方法）。

**区别**：

- 接口主要用于对类的行为进行约束，你实现了某个接口就具有了对应的行为。抽象类主要用于代码复用，强调的是所属关系。
- 一个类只能继承一个类，但是可以实现多个接口。
- 接口中的成员变量只能是 `public static final` 类型的，不能被修改且必须有初始值，而抽象类的成员变量默认 default，可在子类中被重新定义，也可被重新赋值。

### 引用拷贝 vs 浅拷贝 vs 深拷贝

- **引用拷贝**：两个不同的引用指向同一个对象。

- **浅拷贝**：浅拷贝会 **在堆上创建一个新的对象**（区别于引用拷贝的一点），不过，如果原对象内部的属性是引用类型的话，浅拷贝会直接复制内部对象的引用地址，也就是说 **拷贝对象和原对象共用同一个内部对象**。

- **深拷贝**：深拷贝会 **完全复制整个对象**，包括这个对象所包含的内部对象。

<img src="https://cdn.jsdelivr.net/gh/Moriic/picture@main/img/shallow&deep-copy.png" alt="shallow&deep-copy" style="zoom:50%;" />

### 面向对象三大特性

- 封装：封装是指把一个对象的状态信息（也就是属性）隐藏在对象内部，不允许外部对象直接访问对象的内部信息。但是可以提供一些可以被外界访问的方法来操作属性。
- 继承：不同类型的对象，相互之间经常有一定数量的共同点。
  - 子类拥有父类对象所有的属性和方法（包括私有属性和私有方法），但是父类中的私有属性和方法子类是无法访问，**只是拥有**。
  - 子类可以拥有自己属性和方法，即子类可以对父类进行扩展。
  - 子类可以用自己的方式实现父类的方法。
- 多态：表示一个对象具有多种的状态，具体表现为父类的引用指向子类的实例。
  - 对象类型和引用类型之间具有继承（类）/实现（接口）的关系；
  - 引用类型变量发出的方法调用的到底是哪个类中的方法，必须在程序运行期间才能确定；
  - 多态不能调用“只在子类存在但在父类不存在”的方法；
  - 如果子类重写了父类的方法，真正执行的是子类覆盖的方法，如果子类没有覆盖父类的方法，执行的是父类的方法。

### Object 类常见方法

| 方法        | 说明                                               |
| ----------- | -------------------------------------------------- |
| getClass()  | 返回当前运行时对象的 Class 对象                      |
| hashCode()  | 返回对象的哈希码                                   |
| equals()    | 比较内存地址释放相等，子类 String 重写比较字符串的值 |
| clone()     | 浅拷贝                                             |
| toString()  | 返回类字符串                                       |
| notify()    | 唤醒一个线程                                       |
| notifyAll() | 唤醒所有线程                                       |
| wait()      | 暂停线程的执行，释放锁                             |
| finalize()  | 垃圾回收器回收触发的操作                           |

### == vs equals

**`==`** 对于基本类型和引用类型的作用效果是不同的：

- 对于基本数据类型来说，`==` 比较的是值。
- 对于引用数据类型来说，`==` 比较的是对象的内存地址。

`equals()` 方法存在两种使用情况：

- **类没有重写 `equals()` 方法**：通过 `equals()` 比较该类的两个对象时，等价于通过“==”比较这两个对象，使用的默认是 `Object` 类 `equals()` 方法。
- **类重写了 `equals()` 方法**：一般我们都重写 `equals()` 方法来比较两个对象中的属性是否相等；若它们的属性相等，则返回 true(即，认为这两个对象相等)。

### hashCode vs equals

- 如果两个对象的 `hashCode` 值相等，那这两个对象不一定相等（哈希碰撞）。
- 如果两个对象的 `hashCode` 值相等并且 `equals()` 方法也返回 `true`，我们才认为这两个对象相等。
- 如果两个对象的 `hashCode` 值不相等，我们就可以直接认为这两个对象不相等。

## String 相关

### 可变性

- `String` 是不可变的（后面会详细分析原因）。
- `StringBuilder` 与 `StringBuffer` 都继承自 `AbstractStringBuilder` 类，在 `AbstractStringBuilder` 中也是使用字符数组保存字符串，不过没有使用 `final` 和 `private` 关键字修饰，最关键的是这个 `AbstractStringBuilder` 类还提供了很多修改字符串的方法比如 `append` 方法。

### 线程安全性

- `String` 中的对象是不可变的，也就可以理解为 **常量，线程安全**。

- `AbstractStringBuilder` 是 `StringBuilder` 与 `StringBuffer` 的公共父类，定义了一些字符串的基本操作，如 `expandCapacity`、`append`、`insert`、`indexOf` 等公共方法。
- `StringBuffer` 对方法加了同步锁或者对调用的方法 **加了同步锁**，所以是 **线程安全** 的。
- `StringBuilder` 并没有对方法进行加同步锁，所以是 **非线程安全** 的。

### 性能

- 每次对 `String` 类型进行改变的时候，都会生成一个新的 `String` 对象，然后将指针指向新的 `String` 对象。
- `StringBuffer` 每次都会对 `StringBuffer` 对象本身进行操作，而不是生成新的对象并改变对象引用。
- 相同情况下使用 `StringBuilder` 相比使用 `StringBuffer` 仅能获得 10%~15% 左右的性能提升，但却要冒多线程不安全的风险。

### 总结

- 操作少量的数据: 适用 `String`
- 单线程操作字符串缓冲区下操作大量数据: 适用 `StringBuilder`
- 多线程操作字符串缓冲区下操作大量数据: 适用 `StringBuffer`

### String 不可变

1. 保存字符串的数组被 `final` 修饰且为私有的，并且 `String` 类没有提供/暴露修改这个字符串的方法。
2. `String` 类被 `final` 修饰导致其不能被继承，进而避免了子类破坏 `String` 不可变。

>  **Java 9 为何要将 `String` 的底层实现由 `char[]` 改成了 `byte[]` ?**
>
> 新版的 String 其实支持两个编码方案：Latin-1 和 UTF-16。如果字符串中包含的汉字没有超过 Latin-1 可表示范围内的字符，那就会使用 Latin-1 作为编码方案。Latin-1 编码方案下，`byte` 占一个字节(8 位)，`char` 占用 2 个字节（16），`byte` 相较 `char` 节省一半的内存空间。
>
> JDK 官方就说了绝大部分字符串对象只包含 Latin-1 可表示的字符。

### 字符串拼接 +/StringBuilder

Java 语言本身并不支持运算符重载，“+”和“+=”是专门为 String 类重载过的运算符，也是 Java 中仅有的两个重载过的运算符。

字符串对象通过“+”的字符串拼接方式，实际上是通过 `StringBuilder` 调用 `append()` 方法实现的，拼接完成之后调用 `toString()` 得到一个 `String` 对象 。

不过，在循环内使用“+”进行字符串的拼接的话，存在比较明显的缺陷：**编译器不会创建单个 `StringBuilder` 以复用，会导致创建过多的 `StringBuilder` 对象**。

### 字符串常量池

**字符串常量池** 是 JVM 为了提升性能和减少内存消耗针对字符串（String 类）专门开辟的一块区域，主要目的是为了避免字符串的重复创建。

**String s1 = new String("abc"); 这句话创建了几个字符串对象？**

会创建 1 或 2 个字符串对象。

- 如果字符串常量池中不存在字符串对象“abc”的引用，那么它会在堆上创建两个字符串对象，其中一个字符串对象的引用会被保存在字符串常量池中。
- 如果字符串常量池中已存在字符串对象“abc”的引用，则只会在堆中创建 1 个字符串对象“abc”。

### intern 方法

`String.intern()` 是一个 native（本地）方法，其作用是 **将指定的字符串对象的引用保存在字符串常量池中**，可以简单分为两种情况：

- 如果字符串常量池中保存了对应的字符串对象的引用，就直接返回该引用。
- 如果字符串常量池中没有保存了对应的字符串对象的引用，那就在常量池中创建一个指向该字符串对象的引用并返回。

## 异常

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1712489290_0.png" alt="types-of-exceptions-in-java" style="zoom: 67%;" />

### Exception vs Error

在 Java 中，所有的异常都有一个共同的祖先 `java.lang` 包中的 `Throwable` 类。`Throwable` 类有两个重要的子类:

- **`Exception`** : 程序本身可以处理的异常，可以通过 `catch` 来进行捕获。`Exception` 又可以分为 Checked Exception (受检查异常，必须处理) 和 Unchecked Exception (不受检查异常，可以不处理)。
- **`Error`**：`Error` 属于程序无法处理的错误 ，不建议通过 `catch` 捕获 。例如 Java 虚拟机运行错误（`Virtual MachineError`）、虚拟机内存不够错误(`OutOfMemoryError`)、类定义错误（`NoClassDefFoundError`）等 。这些异常发生时，Java 虚拟机（JVM）一般会选择线程终止。

### CheckedException vs UncheckedException

**Checked Exception** 即 受检查异常 ，Java 代码在编译过程中，如果受检查异常没有被 `catch` 或者 `throws` 关键字处理的话，就没办法通过编译。

除了 `RuntimeException` 及其子类以外，其他的 `Exception` 类及其子类都属于受检查异常 。常见的受检查异常有：IO 相关的异常、`ClassNotFoundException`、`SQLException`...。

**Unchecked Exception** 即 **不受检查异常** ，Java 代码在编译过程中 ，我们即使不处理不受检查异常也可以正常通过编译。

`RuntimeException` 及其子类都统称为非受检查异常，常见的有（建议记下来，日常开发中会经常用到）：

- `NullPointerException`(空指针错误)
- `IllegalArgumentException`(参数错误比如方法入参类型错误)
- `NumberFormatException`（字符串转换为数字格式错误，`IllegalArgumentException` 的子类）
- `ArrayIndexOutOfBoundsException`（数组越界错误）
- `ClassCastException`（类型转换错误）
- `ArithmeticException`（算术错误）
- `SecurityException` （安全错误比如权限不够）
- `UnsupportedOperationException`(不支持的操作错误比如重复创建同一用户)

### Throwable 常用方法

- `String getMessage()`: 返回异常发生时的简要描述
- `String toString()`: 返回异常发生时的详细信息
- `String getLocalizedMessage()`: 返回异常对象的本地化信息。使用 `Throwable` 的子类覆盖这个方法，可以生成本地化信息。如果子类没有覆盖该方法，则该方法返回的信息与 `getMessage()` 返回的结果相同
- `void printStackTrace()`: 在控制台上打印 `Throwable` 对象封装的异常信息

### try-catch-finally

- `try` 块：用于捕获异常。其后可接零个或多个 `catch` 块，如果没有 `catch` 块，则必须跟一个 `finally` 块。
- `catch` 块：用于处理 try 捕获到的异常。
- `finally` 块：无论是否捕获或处理异常，`finally` 块里的语句都会被执行。当在 `try` 块或 `catch` 块中遇到 `return` 语句时，`finally` 语句块将在方法返回之前被执行。

```java
try {
    System.out.println("Try to do something");
    throw new RuntimeException("RuntimeException");
} catch (Exception e) {
    System.out.println("Catch Exception -> " + e.getMessage());
} finally {
    System.out.println("Finally");
}
```

**注意：不要在 finally 语句块中使用 return!** 当 try 语句和 finally 语句中都有  return 语句时，try 语句块中的 return 语句会被忽略。这是因为 try 语句中的 return  返回值会先被暂存在一个本地变量中，当执行到 finally 语句中的 return 之后，这个本地变量的值就变为了 finally 语句中的  return 返回值。

### try-with-resources

- **适用范围（资源的定义）：** 任何实现 `java.lang.AutoCloseable`或者 `java.io.Closeable` 的对象
- **关闭资源和 finally 块的执行顺序：** 在 `try-with-resources` 语句中，任何 catch 或 finally 块在声明的资源关闭后运行

> 面对必须要关闭的资源，我们总是应该优先使用 `try-with-resources` 而不是`try-finally`。随之产生的代码更简短，更清晰，产生的异常对我们也更有用。`try-with-resources`语句让我们更容易编写必须要关闭的资源的代码，若采用`try-finally`则几乎做不到这点

Java 中类似于`InputStream`、`OutputStream`、`Scanner`、`PrintWriter`等的资源都需要我们调用`close()`方法来手动关闭，一般情况下我们都是通过`try-catch-finally`语句来实现这个需求，如下

```java
//读取文本文件的内容
Scanner scanner = null;
try {
    scanner = new Scanner(new File("D://read.txt"));
    while (scanner.hasNext()) {
        System.out.println(scanner.nextLine());
    }
} catch (FileNotFoundException e) {
    e.printStackTrace();
} finally {
    if (scanner != null) {
        scanner.close();
    }
}
```

使用 Java 7 之后的 `try-with-resources` 语句改造上面的代码:

```java
try (
    BufferedInputStream bin = new BufferedInputStream(new FileInputStream(new File("test.txt")));
     BufferedOutputStream bout = new BufferedOutputStream(new FileOutputStream(new File("out.txt")))
) {
    int b;
    while ((b = bin.read()) != -1) {
        bout.write(b);
    }
}
catch (IOException e) {
    e.printStackTrace();
}
```

## 反射

通过反射你可以获取任意一个类的所有属性和方法，你还可以调用这些方法和属性。

