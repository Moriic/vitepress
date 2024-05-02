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
- jclassliv 插件
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

- **验证**：检测 Java 字节码文件的规范约束
- **准备：为静态变量(static)分配内存并设置初始值，final 会直接赋值**
- **解析**：将常量池中的符号应用替换为 **直接引用(内存地址)**

### 初始化阶段

- **执行静态代码块中的代码，并为静态变量赋值**
- 执行字节码文件中 clinit 部分的字节码指令(按 java 编写顺序一致)

导致类的初始化：

- 访问一个类的静态变量或静态方法，注意变量是 final 修饰并且等号右边是常量不会触发初始化，在准备阶段初始化
- 调用 Class.forName(String className)
- new 一个该类的对象
- 执行 Main 方法的当前类

> -XX:+TraceClassLoading 参数可以打印出加载并初始化的类

注意：

- 直接访问父类的静态变量，触发父类的初始化，不会触发子类的初始化
- 子类的初始化调用之前，会先初始化父类
- 数组的创建不会导致数组中元素的类进行初始化
- final 修饰的变量如果赋值的内容需要执行指令才能得出结果，会在初始化阶段进行初始化，而不是在准备阶段，如 `Integer.valueOf(1)`

## 类加载器

### 类加载器的分类

- 虚拟机底层实现(C++ Hotspot)：加载程序运行时的基础类，如 java.lang.String，启动类加载器 BootStrap 
- 扩展类加载器(Java)：继承自抽象类 ClassLoader，扩展类加载器 Extension，应用程序类加载器 Application

- BootStrapClassLoader：加载 /jre/lib 下的文件，使用 `-Xbootclasspath/a:jar包目录/jar包名`

- ExtClassLoader：加载 /jre/lib/ext 下的文件，使用 `-Djava.ext.dirs=jar包目录`(; 分隔)

- AppClasssloader：加载 classpath 下的类文件

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



## JVM 结构

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1714200206_0.png" alt="image-20240427144325875" style="zoom: 67%;" />
