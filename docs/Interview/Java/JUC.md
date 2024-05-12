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

