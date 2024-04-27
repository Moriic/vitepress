# 设计模式

## 设计原则

| 原则         | 简介                                                         | 描述                                                         |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 单一职责原则 | 一个类只有一个引起它变化的原因                               | 一个类承担的职责过多，耦合度太高                             |
| 开放封闭原则 | 一个实体应该对外扩展开放，对内修改关闭                       | 通过添加新的代码增强行为，而不是修改原有代码，提供一个固定接口，通过实现接口来改变 |
| 里氏替代原则 | 子类必须替换掉他们的父类                                     | 子类替代父类后，程序的行为不受影响                           |
| 依赖倒置原则 | 细节应该依赖于抽象，而抽象不应该依赖于细节                   | 面向接口编程，而不是面向实现编程，降低耦合度                 |
| 接口隔离原则 | 使用多个专门功能的接口，而不是使用单一的总接口               | 一个接口负责单个职责，接口分离                               |
| 合成复用原则 | 在一个新的对象里面使用一些已有的对象，使之称为新对象的一部分 | 尽量使用合成(委派型对象)，而不是使用继承                     |
| 最少知识原则 | 模块相对独立，易修改                                         |                                                              |

## 单例模式

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1714137286_0.webp" alt="944365-9981462dbf695c86" style="zoom: 50%;" />

> - 饿汉式：单例创建时机不可控，即类加载时 **自动创建** 单例
> - 懒汉式：单例创建时机可控，即有需要时，才 **手动创建** 单例

### 饿汉式-线程安全

采用直接实例化，但可能会浪费资源

```java
public class Singleton {
    private static Singleton instance = new Singleton();
    
    private Singleton() {}
    
    public static  Singleton newInstance() {
        return ourInstance;
    }
}
```
> 依赖 `JVM` 类加载机制，保证单例只会被创建 1 次，即 **线程安全**
>
> 1. `JVM` 在类的初始化阶段(即在 `Class` 被加载后、被线程使用前)，会执行类的初始化
> 2. 在执行类的初始化期间，JVM 会去获取一个锁。这个锁可以同步多个线程对同一个类的初始化

### 枚举实现

![944365-bdccdb7827be2eb8](https://raw.githubusercontent.com/Moriic/picture/main/image/1714137585_0.webp)

```java
public enum Singleton{
	instance;
}
```

### 懒汉式-线程不安全

多线程不安全，可能多次实例化 instance，没用到该类不会实例化

```java
public class Singleton{
	private static Singleton instance;
	
	private Singleton(){}
	
    public static Singleton getInstance(){
		if(instance == null){
			instance = new Singleton();
		}
	}
}
```

### 懒汉式-线程安全

加锁 synchronized，但其他线程必须等待，性能损耗

```java
public static synchronized Singleton getInstance(){
    if(instance == null){
        instance = new Singleton();
    }
}
```

### 双重校验锁-线程安全

1. 只有当 instance 没有实例化时才需要加锁，并使用双重校验保证只实例化一次
2. instance 使用 volatile 修饰，原因是：`uniqueInstance = new Singleton();` 这段代码其实是分为三步执行：分配内存空间 -> 初始化对象 -> 将 uniqueInstance 指向分配的内存地址，而 volatile 可以禁止指令重排
3. 假设一个线程 T1 执行了 1 和 3，此时线程 T2 调用 getInstance 会返回未初始化的实例 

```java
public class Singleton{
	private static Singleton instance;
	
	public static Singleton getInstance(){
		if(instance == null){
    		synchronized(Singleton.class){
    			if(instance == null){
    				instance = new Singleton();
    			}
    		}
		}
		return instance;
	}
}
```

### 静态内部类实现

当 Singleton 类加载时，静态内部类 SingletonHolder 没有被加载进内存。只有当调用 `getUniqueInstance()` 方法从而触发 `SingletonHolder.INSTANCE` 时 SingletonHolder 才会被加载，此时初始化 INSTANCE 实例。

这种方式不仅具有延迟初始化的好处，而且由虚拟机提供了对线程安全的支持。

```java
public class Singleton{
	private Singleton(){}
	// 静态内部类
	private static class SingletonHolder{
		private static final Singleton INSTANCE = new Singleton();
	}
	
	public static Singleton getInstance(){
		return SingletonHolder.INSTANCE;
	}
}
```

如果不使用枚举来实现单例模式，会出现反射攻击，因为通过 setAccessible() 方法可以将私有构造函数的访问级别设置为 public，然后调用构造函数从而实例化对象。如果要防止这种攻击，需要在构造函数中添加防止实例化第二个对象的代码。

从上面的讨论可以看出，解决序列化和反射攻击很麻烦，而枚举实现不会出现这两种问题，所以说枚举实现单例模式是最佳实践。

## 简单工厂

- 创建 **抽象产品类** & 定义具体产品的公共接口；
- 创建 **具体产品类**（继承抽象产品类） & 定义生产的具体产品；
- 创建 **工厂类**，通过创建静态方法根据传入不同参数从而创建不同具体产品类的实例；
- 外界通过调用工厂类的静态方法，**传入不同参数** 从而创建不同 **具体产品类的实例**

```java
public interface Produce{}

public class ConcreteProduce implements Produce{}
public class ConcreteProduce1 implements Produce{}
public class ConcreteProduce2 implements Produce{}
```

以下的 SimpleFactory 是简单工厂实现，它被所有需要进行实例化的客户类调用。

```java
public class SimpleFactory {
    public static Product createProduct(int type) {
        if (type == 1) {
            return new ConcreteProduct1();
        } else if (type == 2) {
            return new ConcreteProduct2();
        }
        return new ConcreteProduct();
    }
}
```

```java
public class Client {
    public static void main(String[] args) {
        SimpleFactory simpleFactory = new SimpleFactory();
        Product product = simpleFactory.createProduct(1);
    }
}
```

缺点：

- 工厂类集中了所有实例（产品）的创建逻辑，一旦这个工厂不能正常工作，整个系统都会受到影响；

- 违背“开放 - 关闭原则”，一旦添加新产品就不得不修改工厂类的逻辑，这样就会造成工厂逻辑过于复杂。

- 简单工厂模式由于使用了静态工厂方法，静态方法不能被继承和重写，会造成工厂角色无法形成基于继承的等级结构。

## 工厂方法

**在简单工厂中，创建对象的是另一个类，而在工厂方法中，是由子类来创建对象。**

**步骤 1：** 创建 **抽象工厂类**，定义具体工厂的公共接口

```csharp
abstract class Factory{
    public abstract Product Manufacture();
}
```

**步骤 2：** 创建 **抽象产品类** ，定义具体产品的公共接口；

```csharp
abstract class Product{
    public abstract void Show();
}
```

**步骤 3：** 创建 **具体产品类**（继承抽象产品类）， 定义生产的具体产品；

```java
//具体产品A类
class  ProductA extends  Product{
    @Override
    public void Show() {
        System.out.println("生产出了产品A");
    }
}

//具体产品B类
class  ProductB extends  Product{
    @Override
    public void Show() {
        System.out.println("生产出了产品B");
    }
}
```

**步骤 4：** 创建 **具体工厂类**（继承抽象工厂类），定义创建对应具体产品实例的方法；

```java
//工厂A类 - 生产A类产品
class  FactoryA extends Factory{
    @Override
    public Product Manufacture() {
        return new ProductA();
    }
}

//工厂B类 - 生产B类产品
class  FactoryB extends Factory{
    @Override
    public Product Manufacture() {
        return new ProductB();
    }
}
```

**步骤 5：** 外界通过调用具体工厂类的方法，从而创建不同 **具体产品类的实例**

```cpp
//生产工作流程
public class FactoryPattern {
    public static void main(String[] args){
        //客户要产品A
        FactoryA mFactoryA = new FactoryA();
        mFactoryA.Manufacture().Show();

        //客户要产品B
        FactoryB mFactoryB = new FactoryB();
        mFactoryB.Manufacture().Show();
    }
}
```

优点：

- 更符合开-闭原则，新增一种产品时，只需要增加相应的具体产品类和相应的工厂子类即可
- 符合单一职责原则，每个具体工厂类只负责创建对应的产品
- 不使用静态工厂方法，可以形成基于继承的等级结构

缺点：

- 增加了系统的复杂度；同时，有更多的类需要编译和运行，会给系统带来一些额外的开销；
- **一个具体工厂只能创建一种具体产品**

## 抽象工厂

抽象工厂模式与工厂方法模式最大的区别：抽象工厂中每个工厂可以创建多种类的产品；而工厂方法每个工厂只能创建一类

**步骤 1：** 创建 **抽象工厂类**，定义具体工厂的公共接口

```csharp
abstract class Factory{
    public abstract Product ManufactureContainer();
    public abstract Product ManufactureMould();
}
```

**步骤 2：** 创建 **抽象产品族类** ，定义具体产品的公共接口；

```csharp
abstract class AbstractProduct{
    public abstract void Show();
}
```

**步骤 3：** 创建 **抽象产品类** ，定义具体产品的公共接口；

```java
//容器产品抽象类
abstract class ContainerProduct extends AbstractProduct{
    @Override
    public abstract void Show();
}

//模具产品抽象类
abstract class MouldProduct extends AbstractProduct{
    @Override
    public abstract void Show();
}
```

**步骤 4：** 创建 **具体产品类**（继承抽象产品类）， 定义生产的具体产品；

```java
//容器产品A类
class ContainerProductA extends ContainerProduct{
    @Override
    public void Show() {
        System.out.println("生产出了容器产品A");
    }
}

//容器产品B类
class ContainerProductB extends ContainerProduct{
    @Override
    public void Show() {
        System.out.println("生产出了容器产品B");
    }
}

//模具产品A类
class MouldProductA extends MouldProduct{

    @Override
    public void Show() {
        System.out.println("生产出了模具产品A");
    }
}

//模具产品B类
class MouldProductB extends MouldProduct{

    @Override
    public void Show() {
        System.out.println("生产出了模具产品B");
    }
}
```

**步骤 5：** 创建 **具体工厂类**（继承抽象工厂类），定义创建对应具体产品实例的方法；

```java
//A厂 - 生产模具+容器产品
class FactoryA extends Factory{

    @Override
    public Product ManufactureContainer() {
        return new ContainerProductA();
    }

    @Override
    public Product ManufactureMould() {
        return new MouldProductA();
    }
}

//B厂 - 生产模具+容器产品
class FactoryB extends Factory{

    @Override
    public Product ManufactureContainer() {
        return new ContainerProductB();
    }

    @Override
    public Product ManufactureMould() {
        return new MouldProductB();
    }
}
```

**步骤 6：** 客户端通过实例化具体的工厂类，并调用其创建不同目标产品的方法创建不同具体产品类的实例

```php
//生产工作流程
public class AbstractFactoryPattern {
    public static void main(String[] args){
        FactoryA mFactoryA = new FactoryA();
        FactoryB mFactoryB = new FactoryB();
        //A厂当地客户需要容器产品A
        mFactoryA.ManufactureContainer().Show();
        //A厂当地客户需要模具产品A
        mFactoryA.ManufactureMould().Show();

        //B厂当地客户需要容器产品B
        mFactoryB.ManufactureContainer().Show();
        //B厂当地客户需要模具产品B
        mFactoryB.ManufactureMould().Show();

    }
}
```

缺点：抽象工厂模式很难支持新种类产品的变化。
这是因为抽象工厂接口中已经确定了可以被创建的产品集合，如果需要添加新产品，此时就必须去修改抽象工厂的接口，这样就涉及到抽象工厂类的以及所有子类的改变，这样也就违背了“开放——封闭”原则。
