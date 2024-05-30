# JUC

## 基础

### 守护线程和用户线程

- 所谓 **守护线程**，是指在程序运行的时候在 **后台** 提供一种通用服务的线程，比如 **垃圾回收** 线程。因此，当所有的非守护线程结束时，程序也就终止了，同时会杀死进程中的所有守护线程。反过来说，只要任何非守护线程还在运行，程序就不会终止。
- 用户线程和守护线程两者几乎没有区别，唯一的不同之处就在于虚拟机的离开：**如果用户线程已经全部退出运行了，只剩下守护线程存在了，虚拟机也就退出了**。因为没有了被守护者，守护线程也就没有工作可做了，也就没有继续运行程序的必要了。
- 默认属于用户线程。使用 setDaemon() 方法将一个线程设置为守护线程。

### 线程状态

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1715481101_0.png" alt="ace830df-9919-48ca-91b5-60b193f593d2" style="zoom:50%;" />

1. **创建状态**：创建后未启动
2. **可运行：** 可能再运行，也可能正在等待 CPU 时间片，Running/Ready
3. **阻塞状态：** 等待获取一个排它锁
4. **无限期等待：** 等待其他线程显式唤醒

| 进入方法                                   | 退出方法                             |
| ------------------------------------------ | ------------------------------------ |
| 没有设置 Timeout 参数的 Object.wait() 方法 | Object.notify() / Object.notifyAll() |
| 没有设置 Timeout 参数的 Thread.join() 方法 | 被调用的线程执行完毕                 |

5. **限期等待：** 无需其他线程唤醒，在一定时间后系统自动唤醒

- 调用 Thread.sleep() 方法使线程进入限期等待状态时，常常用 **“使一个线程睡眠”** 进行描述。
- 调用 Object.wait() 方法使线程进入限期等待或者无限期等待时，常常用 **“挂起一个线程”** 进行描述。
- 睡眠和挂起是用来描述行为，而阻塞和等待用来描述状态。
- 阻塞和等待的区别在于，阻塞是被动的，它是在等待获取一个排它锁。而等待是主动的，通过调用 Thread.sleep() 和 Object.wait() 等方法进入。

| 进入方法                                 | 退出方法                                        |
| ---------------------------------------- | ----------------------------------------------- |
| Thread.sleep() 方法                      | 时间结束                                        |
| 设置了 Timeout 参数的 Object.wait() 方法 | 时间结束 / Object.notify() / Object.notifyAll() |
| 设置了 Timeout 参数的 Thread.join() 方法 | 时间结束 / 被调用的线程执行完毕                 |

6. **死亡**：线程结束/异常

### 线程使用方法

- 实现 Runnable 接口；
- 实现 Callable 接口；
- 继承 Thread 类。

实现 Runnable 和 Callable 接口的类只能当做一个可以在线程中运行的任务，不是真正意义上的线程，因此最后还需要通过 Thread 来调用。可以说任务是通过线程驱动从而执行的。

```java
import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;

class MyThread extends Thread {
    public void run(){
        System.out.println("Extend Thread");
    }
}

class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Runnable Thread");
    }
}

class MyCallable implements Callable<String> {
    @Override
    public String call() throws Exception {
        return "Callable Thread";
    }
}


public class tmp {
    public static void main(String[] args) throws Exception {
        new Thread(new MyRunnable()).start();

        FutureTask<String> futureTask = new FutureTask<>(new MyCallable());
        Thread t1 = new Thread(futureTask, "t1");
        t1.start();

        new Thread(() -> {
            System.out.println("Lambda Thread");
        }).start();

        new MyThread().start();
        
        System.out.println(futureTask.get());	// 阻塞
        System.out.println(futureTask.get(3, TimeUnit.SECONDS));
    } 
}
```

## CompleteFuture

Future 缺陷：get()方法会阻塞，isDone()轮询会耗费 CPU 资源

CompletableFuture 提供一种观察者模式类似的机制，让任务执行完成后通知监听的一方，同时实现 Future 和 CompletionStage 接口，避免阻塞

```java
public static void main(String[] args) throws Exception {
    // runAsync 默认 Future + 内部线程池实现 参数为 Runnable
    CompletableFuture<Void> completableFuture = CompletableFuture.runAsync(() -> {
        System.out.println(Thread.currentThread().getName());
    });
    // 使用自身创建的线程池 参数为 Runnable 和 Executor
    ExecutorService threadPool = Executors.newFixedThreadPool(3);
    CompletableFuture<Void> completableFuture1 = CompletableFuture.runAsync(() -> {
        System.out.println(Thread.currentThread().getName());
    }, threadPool);
    // supplyAsync 具有返回值
    CompletableFuture<String> completableFuture2 = CompletableFuture.supplyAsync(() -> {
        System.out.println(Thread.currentThread().getName());
        return "supplyAsync";
    });

    // thenRun / thenApply / handle / whenComplete / exceptionally
    try {
        CompletableFuture.supplyAsync(() -> {
                    System.out.println(Thread.currentThread().getName());
                    return ThreadLocalRandom.current().nextInt();
                }, threadPool)
                .thenRun(()->{})
                .thenApply(v -> 1)      // 异常退出
                .handle((v, e) -> {         // 异常继续
                    System.out.println(v);
                    int x = v / 0;
                    return v * 2;
                })
                .handle((v, e) -> {         // 异常继续
                    System.out.println("handle");
                    return v * 2;
                })
                .thenAccept(System.out::println)
                .whenComplete((v, e) -> {
                    System.out.println(v);
                    if (e == null) {
                        System.out.println("执行结束" + v);
                    }
                })
                .exceptionally(e -> {
                    e.printStackTrace();
                    System.out.println("异常情况");
                    return null;
                });
    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        threadPool.shutdown();
    }

    System.out.println(completableFuture2.get());  // 抛出检查型异常，编译时
    System.out.println(completableFuture2.join()); // 不需抛出异常，运行时
    System.out.println(completableFuture2.getNow("default")); // 未完成返回默认值
    System.out.println(completableFuture2.complete("default")); // 主动完成并赋予默认值
}
```

## 锁

### 乐观锁和悲观锁

- 悲观锁认为自己在使用数据的时候一定有别的线程来修改数据，因此在获取数据的时候会先加锁，确保数据不会被别的线程修改。Java 中，synchronized 关键字和 Lock 的实现类都是悲观锁。

- 乐观锁认为自己在使用数据时不会有别的线程修改数据，所以不会添加锁，只是在更新数据的时候去判断之前有没有别的线程更新了这个数据。如果这个数据没有被更新，当前线程将自己修改的数据成功写入。如果数据已经被其他线程更新，则根据不同的实现方式执行不同的操作（例如报错或者自动重试）。

- 乐观锁在 Java 中是通过使用无锁编程来实现，最常采用的是 CAS 算法，Java 原子类中的递增操作就通过 CAS 自旋实现的。

- **悲观锁适合写操作多的场景**，先加锁可以保证写操作时数据正确。
- **乐观锁适合读操作多的场景**，不加锁的特点能够使其读操作的性能大幅提升。

```java
// ------------------------- 悲观锁的调用方式 -------------------------
// synchronized
public synchronized void testMethod() {
	// 操作同步资源
}
// ReentrantLock
private ReentrantLock lock = new ReentrantLock(); // 需要保证多个线程使用的是同一个锁
public void modifyPublicResources() {
	lock.lock();
	// 操作同步资源
	lock.unlock();
}

// ------------------------- 乐观锁的调用方式 -------------------------
private AtomicInteger atomicInteger = new AtomicInteger();  // 需要保证多个线程使用的是同一个AtomicInteger
atomicInteger.incrementAndGet(); //执行自增1
```

### 公平锁和非公平锁

- **公平锁** 是指多个线程 **按照申请锁的顺序来获取锁**，线程直接进入队列中排队，队列中的第一个线程才能获得锁。公平锁的优点是等待锁的 **线程不会饿死**。缺点是 **整体吞吐效率相对非公平锁要低**，等待队列中除第一个线程以外的所有线程都会阻塞，**CPU 唤醒阻塞线程的开销比非公平锁大。**
- **非公平锁** **是多个线程加锁时直接尝试获取锁，获取不到才会到等待队列的队尾等待**。但如果此时锁刚好可用，那么这个线程可以无需阻塞直接获取到锁，所以非公平锁有可能出现后申请锁的线程先获取锁的场景。非公平锁的优点是可以 **减少唤起线程的开销，整体的吞吐效率高，因为线程有几率不阻塞直接获得锁，CPU 不必唤醒所有线程**。缺点是处于 **等待队列中的线程可能会饿死，或者等很久才会获得锁。**

### 可重入锁 VS 非可重入锁

可重入锁又名递归锁，是指在 **同一个线程在外层方法获取锁的时候，再进入该线程的内层方法会自动获取锁**（前提锁对象得是同一个对象或者 class），不会因为之前已经获取过还没释放而阻塞。Java 中 ReentrantLock 和 synchronized 都是可重入锁，可重入锁的一个优点是可 **一定程度避免死锁**。

### 死锁

死锁是指两个或两个以上的线程在执行过程中, 因争夺资源而造成的一种互相等待的现象。

```java
public static void main(String[] args) throws Exception {
    Object a = new Object();
    Object b = new Object();
    new Thread(()->{
        synchronized (a){
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            synchronized (b){
                System.out.println("aa");
            }
        }
    }).start();
    new Thread(()->{
        synchronized (b){
            synchronized (a){
                System.out.println("bb");
            }
        }
    }).start();
}
```

排查：jps 查看 pid，jstack pid 查看：Found 1 deadlock / jconsole

### Synchronized

- 修饰 **普通方法**，**对象锁**，当前实例的所有普通同步方法都公用一把锁，相当于 synchronized(this)
- 修饰 **静态方法**，**类 Class 锁**，静态同步方法公用一把锁，不管哪个实例
- 修饰 **代码块**，锁的是 synchronized **括号内的对象**
- 当一个线程试图访问同步代码时需要先获取锁，**正常退出或抛出异常** 时必须释放锁
- 普通同步方法和静态同步方法锁的是 **不同的对象，不会竞争**

#### 加锁和释放锁的原理

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1715516703_0.png" alt="java-thread-x-key-schronized-x1" style="zoom: 25%;" />

`Monitorenter` 和 `Monitorexit` 指令，会让对象在执行，使其锁计数器 **加 1 或者减 1**。每一个对象在同一时间只与一个 monitor(锁)相关联，而一个 monitor 在同一时间只能被一个线程获得，一个对象在尝试获得与这个对象相关联的 Monitor 锁的所有权的时候，monitorenter 指令会发生如下 3 中情况之一：

- monitor 计数器为 0，意味着目前还没有被获得，那这个线程就会立刻获得然后把锁计数器+1，一旦+1，别的线程再想获取，就需要等待
- 如果这个 monitor 已经拿到了这个锁的所有权，又重入了这把锁，那锁计数器就会累加，变成 2，并且随着重入的次数，会一直累加
- 这把锁已经被别的线程获取了，等待锁释放

`monitorexit指令`：释放对于 monitor 的所有权，释放过程很简单，就是讲 monitor 的计数器减 1，如果减完以后，计数器不是 0，则代表刚才是重入进来的，当前线程还继续持有这把锁的所有权，如果计数器变成 0，则代表当前线程不再拥有该 monitor 的所有权，即释放锁。第一个 **monitorexit** 指令是同步代码块正常释放锁的一个标志；如果同步代码块中出现 **Exception 或者 Error**，则会调用 **第二个 monitorexit** 指令来保证释放锁

## 中断

| 方法                                | 说明                                                         |
| ----------------------------------- | ------------------------------------------------------------ |
| public void interrupt()             | 设置线程的中断状态为 true，协商                               |
| public static boolean interrupted() | 静态方法，Thread.interrupted()，判断线程是否被中断并清除当前中断状态 |
| public boolean isInterrupted()      | 判断当前线程是否被中断                                       |

```java
//    static volatile boolean isStop = false;
//    static AtomicBoolean isStop = new AtomicBoolean(false);

public static void main(String[] args) {
    Thread t1 = new Thread(() -> {
        while (true) {
            if (Thread.interrupted()) {
                System.out.println("中断");
                break;
            }
            System.out.println("执行");
        }
    });
    t1.start();
    System.out.println(t1.isInterrupted());
    t1.interrupt();
    System.out.println(t1.isInterrupted());
}
```

> interrupted 的线程处于 join，wait，sleep 状态时，中断状态会被清除，并抛出 InterruptedException 异常

## 等待/唤醒

### wait/notify

需要包含在同步代码块中 synchronized

```java
public static void main(String[] args) {
    Object lock = new Object();
    new Thread(()->{
        synchronized (lock){
            try {
                lock.wait();
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }).start();

    new Thread(()->{
        synchronized (lock){
            lock.notify();
        }
    }).start();
}
```

### await/signal

需要创建 lock 和 condition

```java
public static void main(String[] args) {
    Lock lock = new ReentrantLock();
    Condition condition = lock.newCondition();

    new Thread(()->{
        lock.lock();
        try {
            condition.await();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        lock.unlock();
    }).start();

    new Thread(()->{
        lock.lock();
        condition.signal();
        lock.unlock();
    }).start();
}
```

