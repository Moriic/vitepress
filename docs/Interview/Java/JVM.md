# JVM

## 基础概念

### 功能

- **解释与运行**：对字节码文件中的指令，实时解释成机器码，让计算机执行
- **内存管理**：自动为对象，方法等分配内存，自动的垃圾回收机制
- **即时编译**：对热点代码进行优化，将热点代码的机器码存放到内存中(JIT)

### JDK vs JRE vs JVM

- **JRE**：Java 运行时环境和必要的类库
- **JDK**：包含 JRE 及 javac(编译器)，jdb(调试器)
- **JVM**：运行字节码的虚拟机

### JVM 组成

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1714635236_0.png" alt="image-20240502153355826" style="zoom: 50%;" />

## 字节码文件

### 组成

- **基本信息**：魔数、字节码文件对应的 Java 版本号，访问标识(public final 等)，父类和接口
- **常量池**：保存了字符串常量，类或接口名、字段名，主要在字节码指令中使用
- **字段**：当前类或接口声明的字段信息
- **方法**：当前类或接口声明的方法信息，字节码指令
- **属性**：类的属性，如源码的文件名，内部类的列表等

> 通过文件的头几个字节去校验文件的类型，如 Java 字节码文件的文件头为 CAFEBABE，称为 magic 魔数

### 工具


- javap：javap -v 字节码文件路径 > 输出路径 (jar -xvf 解压 jar 包)
- jclasslib 插件
- 阿里 arthas：https://arthas.aliyun.com/

  - dump -d 目标路径 字节码路径：查看字节码文件
  - jad 文件路径：反编译源代码


## 类的生命周期

加载 -> 连接 (验证 -> 准备 -> 解析) -> 初始化 -> 使用 -> 卸载

### 加载阶段

- 类加载器根据类的全限类名通过不同的渠道以二进制的方式 **加载字节码信息**
- 加载完后，JVM 将字节码中的信息保存在 **内存的方法区** 中，生成一个 **InstanceKlass** 对象，保存 **字节码文件的所有信息**，包含实现特定功能的信息如多态的信息(c++语言)
- JVM 还会在 **堆中** 生成一份与方法区中的数据类似的 **java.lang.Class 对象**，作用是在 Java 代码中去获取类的信息(反射)以及存储静态字段的数据(JDK8 及以后)，**字段/方法(静态字段)**

> - 推荐使用 JDK 自带的 hsdb 工具查看 Java 虚拟机内存信息。
>
> - 工具位于 JDK 安装目录下 lib 文件夹中的 sa-jdijar 中。启动命令：java -cp sa-jdi.jar sun.jvm.hotspot.HSDB
> - jps 查看运行进程 pid

### 连接阶段

- **验证**：检测 Java 字节码文件的 **规范约束**
- **准备：为静态变量(static)分配内存并设置初始值，final 会直接赋值**
- **解析**：将常量池中的符号应用替换为 **直接引用(内存地址)**

### 初始化阶段

- **执行静态代码块中的代码，并为静态变量赋值**
- 执行字节码文件中 clinit 部分的字节码指令(按 java 编写顺序一致)

导致类的初始化：

- 访问一个类的 **静态变量或静态方法**，注意变量是 final 修饰并且等号 **右边是常量** 不会触发初始化，在准备阶段初始化
- 调用 **Class.forName(String className)**
- **new** 一个该类的对象
- 执行 Main 方法的当前类

> -XX:+TraceClassLoading 参数可以打印出加载并初始化的类

注意：

- 直接访问父类的静态变量，触发父类的初始化，不会触发子类的初始化
- 子类的初始化调用之前，会 **先初始化父类**
- 数组的创建不会导致数组中元素的类进行初始化
- final 修饰的变量如果赋值的内容需要执行指令才能得出结果，会在初始化阶段进行初始化，而不是在准备阶段，如 `Integer.valueOf(1)`

## 类加载器

### 类加载器的分类

- **虚拟机底层实现(C++ Hotspot)**：加载程序运行时的基础类，如 java.lang.String，启动类加载器 BootStrap 
- **扩展类加载器(Java)**：继承自抽象类 ClassLoader，扩展类加载器 Extension，应用程序类加载器 Application

- **BootStrapClassLoader**：加载 /jre/lib 下的文件，使用 `-Xbootclasspath/a:jar包目录/jar包名`

- **ExtClassLoader**：加载 /jre/lib/ext 下的文件，使用 `-Djava.ext.dirs=jar包目录`(; 分隔)

- **AppClasssloader**：加载 classpath 下的类文件

### 双亲委派机制

当一个类加载器接收到加载类的任务时，会 **自底向上查找是否加载过，再自顶向下进行加载**

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1714655278_0.png" alt="image-20240502210755475" style="zoom:50%;" />

使用指定类加载器加载：

```java
ClassLoader classLoader = Demo2.class.getClassLoader();
Class<?> stringClazz = classLoader.loadClass("java.lang.String");
```

> 1. 当一个类加载器去加载某个类的时候，会自底向上查找是否加载过，如果加载过就直接返回，如果一直到最顶层的类加载器都没有加载，再由顶向下进行加载。
>
> 2. 应用程序类加载器的父类加载器是扩展类加载器，扩展类加载器的父类加载器是启动类加载器。
>
> 3. 双亲委派机制的好处有两点：第一是避免恶意代码替换 JDK 中的核心类库，比如 java.lang.String，确保核心类库的完整性和安全性。第二是避免一个类重复地被加载。

### 打破双亲委派机制

自定义类加载器：Tomcat

重写 loadClass 方法，将双亲委派机制的代码去除

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1714659115_0.png" alt="image-20240502221155014" style="zoom:50%;" />

线程上下文类加载器(AppClassLoader)：JDBC

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1714659945_0.png" alt="image-20240502222545631" style="zoom:50%;" />

```java
ClassLoader c1 = Thread.currentThread().getContextClassLoader(); //获取
Thread.currentThread().setContextClassLoader(classLoader);       // 设置
```

## 运行时数据区

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1714200206_0.png" alt="image-20240427144325875" style="zoom: 67%;" />

### 程序计数器

PC 寄存器，记录下一条指令的地址，线程不共享，保证线程切换时能回到之前的位置

### Java 虚拟机栈

每个方法调用使用栈帧保存，随着线程创建而创建，销毁而销毁

### 栈帧

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1714707207_0.png" alt="image-20240503113327101" style="zoom:50%;" />

- **局部变量表**：对象 this，方法参数，局部变量
- **操作数栈**：存放执行指令过程中需要的临时数据
- **动态链接**：指向运行时常量池的方法引用
- **方法返回地址**：方法正常退出或异常退出的地址

![0082zybply1gca4k4gndgj31d20o2td0](https://raw.githubusercontent.com/Moriic/picture/main/image/1714708013_0.jpg)

### 栈内存溢出

- 栈帧过多，导致 StackOverflow 错误
- -Xss 栈大小(默认 1M)

### 堆

- 创建的对象存在于堆中
- 栈上的局部变量表，可以存放堆上的对象的引用，静态变量也可以存放堆对象的引用，线程共享

- 堆溢出 OutOfMemory，-Xmx(max 最大值) -Xms(初始 total)

### 方法区

- 类的基本信息：InstanceKlass，加载阶段完成
- 运行时常量池（Runtime Constant Pool）是方法区的一部分。Class 文件中除了有类的版本/字段/方法/接口等描述信息外，还有一项信息是常量池（Constant Pool Table），用于存放编译期生成的各种字面量和符号引用，这部分内容将类在加载后进入方法区的运行时常量池中存放。运行期间也可能将新的常量放入池中，这种特性被开发人员利用得比较多的是 `String.intern()` 方法。受方法区内存的限制，当常量池无法再申请到内存时会抛出 `OutOfMemoryError` 异常。
- JDK7-永久代(堆中，-XX: MaxPermSize =?)，JDK8-元空间(操作系统直接内存，-XX: MaxMetaspaceSize =?)

## 垃圾回收器

### 方法区的回收

类可以被回收，需要满足三个条件：

1. 此类所有实例对象都已经被回收，在堆中不存在任何该类的实例对象以及子类对象。

2. 加载该类的类加载器已经被回收
3. 该类对应的 java.lang.Class 对象没有在任何地方被引用

```java
URLClassLoader loader = new URLClassLoader(new URL[]{new URL("file:D:\\lib\\")});
Class<?> clazz = loader.loadclass("com.itheima.my.A");
Object o = clazz.newInstance();
```

### 引用计数法

- 为每个对象维护一个引用计数器，引用时加 1，取消引用时减 1
- 循环引用会导致无法回收

### 可达性分析法

- 将对象分为两类：垃圾回收的根对象(GC Root) 和 普通对象
- 如果从某个对象到某个 GC Root 可达，则不可回收

GC Root 对象：

- 线程 Thread 对象，引用线程栈帧中的方法参数，局部变量
- 系统类加载器加载的 java.lang.Class 对象，引用类中的静态变量
- 监视器对象，用来保存同步锁 synchronized 关键词持有的对象
- 本地方法调用时使用的全局对象

### 五种对象引用

- **强引用**：到 GC Root 可达
- **软引用**：常用于缓存中，SoftReference 引用的对象，当内存不足会回收

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1714810438_0.png" alt="image-20240504161356296" style="zoom:50%;" />

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1714810830_0.png" alt="image-20240504162029761" style="zoom:50%;" />

- **弱引用**：在垃圾回收时，不管内存够不够都会回收，主要用于 ThreadLocal，WeekReference
- **虚引用**：不能通过虚引用对象获取到包含的对象，唯一用途是当对象被垃圾回收时可以接收到对应的通知，直接内存回收
- **终结器引用**：在对象需要被回收时，终结器引用会关联对象并放置在 Finalizer 类的引用队列中，执行 finalize 方法后二次回收

### 垃圾回收算法

垃圾回收通过单独的 GC 线程完成，会有部分阶段需要停止所有的用户线程，这个过程被称之为 STW(Stop The World)

> -verbose: gc 打印垃圾回收日志

#### 标记 - 清除算法

1. **标记阶段**：将所有存活的对象进行标记，Java 使用可达性分析算法，从 GC Root 通过引用链遍历出所有存活对象
2. **清除阶段**：从内存中删除没有被标记的对象

**缺点**：碎片化，分配速度慢(需要维护空闲链表指向碎片空间)

#### 复制算法

1. 准备两块对象 From 和 To 空间，对象分配阶段，创建对象到 From 空间
2. GC 阶段开始，将 GC Root 及其关联对象搬运到 To 空间
3. 清理 From 空间，并将名称互换

**优点**：吞吐量高，但不如标记清除算法，不会发生碎片化

**缺点**：内存效率低，只有一半

#### 标记 - 整理算法

标记压缩算法，对内存碎片化进行优化：

1. 标记阶段：将所有存活对象进行标记
2. 整理阶段：将存活对象移动到内存的一端，清理掉非存活对象的空间

**优点**：内存使用效率高，不会发生碎片化

**缺点**：整理效率低

#### 分代算法

组合使用上面算法，将整个内存划分为年轻代(Eden, s0, s1)和老年代

- 新生代使用: 复制算法
- 老年代使用: 标记 - 清除 或者 标记 - 整理 算法

- 创建对象，首先放入 Eden 区，当 Eden 区满时，触发 Minor GC
- Minor GC 将 Eden 和 From 区需要回收的对象回收，没有回收的放入 To 区，并名称互换
- 每次 Minor GC 会将对象的年龄 +1，初始为 0，当达到阈值(最大 15)时，会将对象放入老年代
- 当老年代区满时，触发 Full GC
- 如果 Minor GC 和 Full GC 都无法回收空间，且需要放入新对象，会 OutOfMemory，两个都会 STW

### 垃圾回收器

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1714829660_0.png" alt="image-20240504213417894" style="zoom:50%;" />

#### 年轻代-Serial / 老年代-SerialOld 垃圾回收器

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1714829808_0.png" alt="image-20240504213647924" style="zoom:50%;" />

> -XX:+UseSerialGC，新生代，老年代都使用串行回收器

一种单线程串行回收年轻代的垃圾回收器，复制算法

- 优点：当 CPU 处理器吞吐量出色

- 缺点：多 CPU 吞吐量不如其他垃圾回收器，堆偏大会导致 STW 时间过长

#### 年轻代-ParNew / 老年代-CMS 垃圾回收器

ParNew 使用多线程进行垃圾回收

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1714830171_0.png" alt="image-20240504214250930" style="zoom:67%;" />

- 优点：多 CPU 处理器停顿时间短
- 缺点：吞吐量和停顿时间不如 G1 回收器

CMS 关注系统的暂停时间，允许用户线程和回收线程同时执行，标记-清除算法，内存碎片会在 Full GC 处理

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1714830228_0.png" alt="image-20240504214348467" style="zoom:50%;" />

1. **初始标记**：标记 GC Root 直接关联的对象
2. **并发标记**：标记所有的对象，并发
3. **重新标记**：标记并发标记中的对象
4. **并发清理**：清理未标记的对象

- 优点：同时执行，用户体验好
- 缺点：内存碎片，浮动垃圾(并发时产生的垃圾)
