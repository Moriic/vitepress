# 操作系统

## 硬件结构

### 冯诺依曼模型

**运算器、控制器、存储器、输入设备、输出设备**，称为 **冯诺依曼模型**。

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1713019868_0.webp" alt="冯诺依曼模型" style="zoom: 67%;" />

#### 中央处理器(CPU)

中央处理器也就是我们常说的 CPU，32 位和 64 位 CPU 最主要区别在于一次能计算多少字节数据：

- 32 位 CPU 一次可以计算 4 个字节；
- 64 位 CPU 一次可以计算 8 个字节；

这里的 32 位和 64 位，通常称为 CPU 的位宽，代表的是 CPU 一次可以计算（运算）的数据量。

CPU 内部还有一些组件，常见的有 **寄存器、控制单元和逻辑运算单元**

寄存器：*通用寄存器*，*程序计数器*，*指令寄存器*

#### 总线

总线是用于 CPU 和内存以及其他设备之间的通信，总线可分为 3 种：

- *地址总线*，用于指定 CPU 将要操作的内存地址；
- *数据总线*，用于读写内存的数据；
- *控制总线*，用于发送和接收信号，比如中断、设备复位等信号，CPU 收到信号后自然进行响应，这时也需要控制总线；

当 CPU 要读写内存数据的时候，一般需要通过下面这三个总线：

- 首先要通过「地址总线」来指定内存的地址；
- 然后通过「控制总线」控制是读或写命令；
- 最后通过「数据总线」来传输数据；

想要 CPU 操作 4G 大的内存，那么就需要 32 条地址总线，因为 `2 ^ 32 = 4G`。

#### 执行流程

取指 -> 译码 -> 执行 -> 取数 -> 写回

#### 32 位 vs 64 位

64 位和 32 位软件，实际上代表指令是 64 位还是 32 位的：

- 如果 32 位指令在 64 位机器上执行，需要一套兼容机制，就可以做到兼容运行了。但是 **如果 64 位指令在 32 位机器上执行，就比较困难了，因为 32 位的寄存器存不下 64 位的指令**；
- 操作系统其实也是一种程序，我们也会看到操作系统会分成 32 位操作系统、64 位操作系统，其代表意义就是操作系统中程序的指令是多少位，比如 64 位操作系统，指令也就是 64 位，因此不能装在 32 位机器上。

总之，硬件的 64 位和 32 位指的是 CPU 的位宽，软件的 64 位和 32 位指的是指令的位宽。

### 缓存

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1713020282_0.webp" alt="存储器成本的对比" style="zoom:50%;" />

#### 缓存一致性

- **写直达**：**把数据同时写入内存和 Cache 中**，这种方法称为 **写直达（\*Write Through\*）**。
- **写回**：，**当发生写操作时，新的数据仅仅被写入 Cache Block 里，只有当修改过的 Cache Block「被替换」时才需要写到内存中**，减少了数据写回内存的频率，这样便可以提高系统的性能。

#### 缓存一致性问题

如果这时旁边的 B 号核心尝试从内存读取 i 变量的值，则读到的将会是错误的值，因为刚才 A 号核心更新 i 值还没写入到内存中，内存中的值还依然是 0。**这个就是所谓的缓存一致性问题，A 号核心和 B 号核心的缓存，在这个时候是不一致，从而会导致执行结果的错误。**

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1713020509_0.webp" alt="缓存一致性问题例子2" style="zoom: 33%;" />

- 第一点，某个 CPU 核心里的 Cache 数据更新时，必须要传播到其他核心的 Cache，这个称为 **写传播（\*Write Propagation\*）**；
- 第二点，某个 CPU 核心里对数据的操作顺序，必须在其他核心看起来顺序是一样的，这个称为 **事务的串行化（\*Transaction Serialization\*）**。

#### MESI 协议

MESI 协议其实是 4 个状态单词的开头字母缩写，分别是：

- *Modified*，已修改
- *Exclusive*，独占
- *Shared*，共享
- *Invalidated*，已失效

这四个状态来标记 Cache Line 四个不同的状态。

1. 当 A 号 CPU 核心从内存读取变量 i 的值，数据被缓存在 A 号 CPU 核心自己的 Cache 里面，此时其他 CPU 核心的 Cache 没有缓存该数据，于是标记 Cache Line 状态为「独占」，此时其 Cache 中的数据与内存是一致的；
2. 然后 B 号 CPU 核心也从内存读取了变量 i 的值，此时会发送消息给其他 CPU 核心，由于 A 号 CPU  核心已经缓存了该数据，所以会把数据返回给 B 号 CPU 核心。在这个时候， A 和 B 核心缓存了相同的数据，Cache Line  的状态就会变成「共享」，并且其 Cache 中的数据与内存也是一致的；
3. 当 A 号 CPU 核心要修改 Cache 中 i  变量的值，发现数据对应的 Cache Line 的状态是共享状态，则要向所有的其他 CPU 核心广播一个请求，要求先把其他核心的 Cache  中对应的 Cache Line 标记为「无效」状态，然后 A 号 CPU 核心才更新 Cache 里面的数据，同时标记 Cache Line  为「已修改」状态，此时 Cache 中的数据就与内存不一致了。
4. 如果 A 号 CPU 核心「继续」修改 Cache 中 i 变量的值，由于此时的 Cache Line 是「已修改」状态，因此不需要给其他 CPU 核心发送消息，直接更新数据即可。
5. 如果 A 号 CPU 核心的 Cache 里的 i 变量对应的  Cache Line 要被「替换」，发现  Cache Line 状态是「已修改」状态，就会在替换前先把数据同步到内存。

#### 伪共享

所谓的 Cache Line 伪共享问题就是，多个线程同时读写同一个 Cache Line 的不同变量时，而导致 CPU Cache  失效的现象。那么对于多个线程共享的热点数据，即经常会修改的数据，应该避免这些数据刚好在同一个 Cache Line 中，避免的方式一般有  **Cache Line 大小字节对齐，以及字节填充** 等方法。

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1713020690_0.webp" alt="分析伪共享4" style="zoom:50%;" />

### 调度

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1713020772_0.webp" alt="调度类" style="zoom:50%;" />

Deadline 和 Realtime 这两个调度类，都是应用于实时任务的，这两个调度类的调度策略合起来共有这三种，它们的作用如下：

- *SCHED_DEADLINE*：是按照 deadline 进行调度的，距离当前时间点最近的 deadline 的任务会被优先调度；
- *SCHED_FIFO*：对于相同优先级的任务，按先来先服务的原则，但是优先级更高的任务，可以抢占低优先级的任务，也就是优先级高的可以「插队」；
- *SCHED_RR*：对于相同优先级的任务，轮流着运行，每个任务都有一定的时间片，当用完时间片的任务会被放到队列尾部，以保证相同优先级任务的公平性，但是高优先级的任务依然可以抢占低优先级的任务；

而 Fair 调度类是应用于普通任务，都是由 CFS 调度器管理的，分为两种调度策略：

- *SCHED_NORMAL*：普通任务使用的调度策略；
- *SCHED_BATCH*：后台任务的调度策略，不和终端进行交互，因此在不影响其他需要交互的任务，可以适当降低它的优先级。

### 软中断

为了避免由于中断处理程序执行时间过长，而影响正常进程的调度，Linux 将中断处理程序分为上半部和下半部：

- 上半部，对应硬中断，由硬件触发中断，用来快速处理中断；
- 下半部，对应软中断，由内核触发中断，用来异步处理上半部未完成的工作；

Linux 中的软中断包括网络收发、定时、调度、RCU 锁等各种类型，可以通过查看 /proc/softirqs 来观察软中断的累计中断次数情况，如果要实时查看中断次数的变化率，可以使用 watch -d cat /proc/softirqs 命令。

每一个 CPU 都有各自的软中断内核线程，我们还可以用 ps 命令来查看内核线程，一般名字在中括号里面到，都认为是内核线程。

如果在 top 命令发现，CPU 在软中断上的使用率比较高，而且 CPU 使用率最高的进程也是软中断 ksoftirqd 的时候，这种一般可以认为系统的开销被软中断占据了。

这时我们就可以分析是哪种软中断类型导致的，一般来说都是因为网络接收软中断导致的，如果是的话，可以用 sar 命令查看是哪个网卡的有大量的网络包接收，再用 tcpdump  抓网络包，做进一步分析该网络包的源头是不是非法地址，如果是就需要考虑防火墙增加规则，如果不是，则考虑硬件升级等。

### ELF 文件

ELF 的意思是 **可执行文件链接格式**，它是 Linux 操作系统中可执行文件的存储格式

我们编写的代码，首先通过「编译器」编译成汇编代码，接着通过「汇编器」变成目标代码，也就是目标文件，最后通过「链接器」把多个目标文件以及调用的各种函数库链接起来，形成一个可执行文件，也就是 ELF 文件。

执行 ELF 文件的时候，会通过「装载器」把 ELF 文件装载到内存里，CPU 读取内存中的指令和数据，于是程序就被执行起来了。

### 功能

1. **进程和线程的管理**：进程的创建、撤销、阻塞、唤醒，进程间的通信等。
2. **存储管理**：内存的分配和管理、外存(磁盘等)的分配和管理等。
3. **文件管理**：文件的读、写、创建及删除等。
4. **设备管理**：完成设备(输入输出设备和外部存储设备等)的请求或释放，以及设备启动等功能。
5. **网络管理**：操作系统负责管理计算机网络的使用。网络是计算机系统中连接不同计算机的方式，操作系统需要管理计算机网络的配置、连接、通信和安全等，以提供高效可靠的网络服务。
6. **安全管理**：用户的身份认证、访问控制、文件加密等，以防止非法用户对系统资源的访问和操作。

## 用户态和内核态

- **用户态(User Mode)**：用户态运行的进程可以直接读取用户程序的数据，拥有较低的权限，当应用程序需要执行某些特殊权限的操作，例如读写磁盘、网络通信等，就需要向操作系统发起系统调用请求，进入内核态。
- **内核态(Kernel Mode)**：内核态运行的进程几乎可以访问计算机的任何资源包括系统的内存空间、设备、驱动程序等，不受限制，拥有非常高的权限。当操作系统接收到进程的系统调用请求时，就会从用户态切换到内核态，执行相应的系统调用，并将结果返回给进程，最后再从内核态切换回用户态。

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711511059_0.png" alt="usermode-and-kernelmode" style="zoom: 67%;" />

### 为什么需要两个态

- 同时具有用户态和内核态主要是为了保证计算机系统的安全性、稳定性和性能。

- 如果计算机系统中只有一个内核态，那么所有程序或进程都必须共享系统资源，例如内存、CPU、硬盘等，这将导致系统资源的竞争和冲突，从而影响系统性能和效率。

### 切换方式

1. **系统调用(Trap)**：用户态进程主动切换到内核态，为了使用内核态才能做的事情，如读取磁盘资源。系统调用的机制其核心还是使用了中断
2. **中断(Interrupt)**：当外围设备完成用户请求的操作后，会向 CPU 发出相应的中断信号，CPU 会去执行要处理的程序，如果向前执行的指令是用户态下的程序，会切换到内核态，结束后切换会用户态
3. **异常(Exception)**：当 CPU 在执行运行在用户态的程序时，发生了异常，则会切换到处理该异常的内核态中，如缺页异常

## 系统调用

- 调用操作系统提供的内核态级别的功能(文件管理，进程控制，内存管理)
- 普通的库函数调用运行于用户态

### 过程

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711512021_0.png" alt="system-call-procedure" style="zoom: 67%;" />

1. 用户态程序发起系统调用，涉及内核态的指令，权限不足会中断执行 Trap
2. 发生中断后，CPU 程序会中断，跳转到中断处理程序，内核程序开始运行，处理系统调用
3. 系统调用处理完后，主动触发 Trap，再次发生中断，切换到用户态

## 进程和线程

- 进程(Process)：计算机正在运行的一个程序实例，如打开的微信
- 线程(Thread)：轻量级进程，多个线程可以在一个进程中同时执行，并且共享进程的资源如内存空间，文件句柄，网路连接等，如微信中有个线程专门拉取消息

### 区别

一个进程中可以有多个线程，多个线程共享进程的 **堆** 和 **方法区**(JDK1.8 之后的元空间)资源，但是每个线程有自己的 **程序计数器**、**虚拟机栈** 和 **本地方法栈**。

- **线程是进程划分成的更小的运行单位**，一个进程在其执行过程可以产生多个线程
- 线程和进程 **最大的不同在于各进程是独立的，而线程不一定，可能会相互影响**
- **线程执行开销小**，当不利于资源管理和保护

### 为什么需要线程

- **进程切换是个开销很大的操作，线程切换成本较低**
- 线程更轻量，一个进程可以创建多个线程
- 多个线程可以 **并发处理多个任务，** 有效利用了多处理器和多核计算机，而进程只能干一件事，**遇到 IO 等阻塞就会挂起**
- 同一进程内的 **线程共享内存和文件**，因此他们之间通信 **无需调用内核**

### 同步方式

1. 互斥锁(Mutex)：采用互斥对象机制，只有拥有互斥对象的线程才有访问公共资源的权限，因为互斥对象只有一个，所以可以保证公共资源不会被多个线程同时访问。Java 的 `synchronized` 和 `Lock`
2. 读写锁(Read-Write Lock)：允许多个线程同时读取共享资源，但只有一个线程可以对共享资源进行写操作
3. 信号量(Semaphore)：允许多个线程同时读取共享资源，但需要控制同一时刻访问此资源的最大线程数量
4. 屏障(Barrier)：屏障是一种同步原语，用于等待多个线程到达某个点再一起继续执行，当一个线程到达屏障时，他会停止执行并等待其他线程到达屏障，直到所有线程到达屏障后，它们才会一起继续执行。如 Java 中的 `CyclicBarrier`
5. 事件(Event)：Wait/Notify：通过通知操作的方式来保持多线程同步，还可以方便的实现多线程优先级的比较操作。

### PCB

- PCB(Process Control Block)：进程控制块，是操作系统中用来管理和跟踪进程的数据结构，每个进程都对应着一个独立的 PCB
- 当操作系统创建一个新进程时，会为进程分配一个唯一的进程 ID，并且为该进程创建一个对应的进程控制块 PCB，当进程执行时，PCB 的信息会不断变化，存储系统会根据这些信息来管理和调度进程
- PCB 包含以下内容：
  - 进程的描述信息，包括进程的名称、标识符等等；
  - 进程的调度信息，包括进程阻塞原因、进程状态(就绪、运行、阻塞等)、进程优先级(标识进程的重要程度)等等；
  - 进程对资源的需求情况，包括 CPU 时间、内存空间、I/O 设备等等。
  - 进程打开的文件信息，包括文件描述符、文件类型、打开模式等等。
  - 处理机的状态信息(由处理机的各种寄存器中的内容组成的)，包括通用寄存器、指令计数器、程序状态字 PSW、用户栈指针。
  - ……

### 进程的状态

- **创建状态(new)**：进程正在被创建，尚未到就绪状态
- **就绪状态(ready)**：进程已处于准备运行状态，即进程获得了除了处理器之外的一切所需资源，一旦得到处理器资源(处理器分配的时间片)即可运行
- **运行状态(running)**：进程正在处理器上运行
- **阻塞状态(waiting)**：等待状态，进程正在等待某一事件而暂停运行如等待某资源为可用或等待 IO 操作完成，即使处理器空闲，该进程也不能运行。
- **结束状态(terminated)**：进程正在从系统中消失。可能是进程正常结束或其他原因中断退出运行。

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711546709_0.png" alt="state-transition-of-process" style="zoom: 67%;" />

### 进程间的通信方式

> [《进程间通信 IPC (InterProcess Communication)》](https://www.jianshu.com/p/c1015f5ffa74) 

1. **管道/匿名管道(Pipes)**：用于具有亲缘关系的**父子进程间或者兄弟进程**之间的通信。
2. **有名管道(Named Pipes)** : 匿名管道由于没有名字，只能用于亲缘关系的进程间通信。为了克服这个缺点，提出了有名管道。有名管道严格遵循 **先进先出(First In First Out)** 。有名管道以磁盘文件的方式存在，可以实现本机任意两个进程通信。
3. **信号(Signal)**：信号是一种比较复杂的通信方式，用于通知接收进程某个事件已经发生；
4. **消息队列(Message Queuing)**：消息队列是消息的链表, 具有特定的格式, 存放在内存中并由消息队列标识符标识。管道和消息队列的通信数据都是先进先出的原则。与管道(无名管道：只存在于内存中的文件；命名管道：存在于实际的磁盘介质或者文件系统)不同的是消息队列存放在内核中，只有在内核重启(即，操作系统重启)或者显式地删除一个消息队列时，该消息队列才会被真正的删除。消息队列可以实现消息的随机查询, 消息不一定要以先进先出的次序读取, 也可以按消息的类型读取.比 FIFO 更有优势。**消息队列克服了信号承载信息量少，管道只能承载无格式字 节流以及缓冲区大小受限等缺点。**
5. **信号量(Semaphores)**：信号量是一个计数器，用于多进程对共享数据的访问，信号量的意图在于进程间同步。这种通信方式主要用于解决与同步相关的问题并避免竞争条件。
6. **共享内存(Shared memory)**：使得多个进程可以访问同一块内存空间，不同进程可以及时看到对方进程中对共享内存中数据的更新。这种方式需要依靠某种同步操作，如互斥锁和信号量等。可以说这是最有用的进程间通信方式。
7. **套接字(Sockets)** : 此方法主要用于在客户端和服务器之间通过网络进行通信。套接字是支持 TCP/IP 的网络通信的基本操作单元，可以看做是不同主机之间的进程进行双向通信的端点，简单的说就是通信的两方的一种约定，用套接字中的相关函数来完成通信过程。

### 进程的调度算法

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711547075_0.png" alt="scheduling-algorithms-of-process" style="zoom:67%;" />

- **先到先服务调度算法(FCFS，First Come, First Served)** : 从就绪队列中选择一个最先进入该队列的进程为之分配资源，使它立即执行并一直执行到完成或发生某事件而被阻塞放弃占用 CPU 时再重新调度。
- **短作业优先的调度算法(SJF，Shortest Job First)**: 从就绪队列中选出一个估计运行时间最短的进程为之分配资源，使它立即执行并一直执行到完成或发生某事件而被阻塞放弃占用 CPU 时再重新调度。
- **时间片轮转调度算法(RR，Round-Robin)**: 时间片轮转调度是一种最古老，最简单，最公平且使用最广的算法。每个进程被分配一个时间段，称作它的时间片，即该进程允许运行的时间。
- **多级反馈队列调度算法(MFQ，Multi-level Feedback Queue)**：前面介绍的几种进程调度的算法都有一定的局限性。如 **短进程优先的调度算法，仅照顾了短进程而忽略了长进程** 。多级反馈队列调度算法既能使高优先级的作业得到响应又能使短作业(进程)迅速完成。，因而它是目前 **被公认的一种较好的进程调度算法**，UNIX 操作系统采取的便是这种调度算法。
- **优先级调度算法(Priority)**：为每个流程分配优先级，首先执行具有最高优先级的进程，依此类推。具有相同优先级的进程以 FCFS 方式执行。可以根据内存要求，时间要求或任何其他资源要求来确定优先级。

### 僵尸进程和孤儿进程

- **僵尸进程**：子进程已经终止，但是其父进程仍在运行，且父进程没有调用 wait()或 waitpid()等系统调用来获取子进程的状态信息，释放子进程占用的资源，导致子进程的 PCB 依然存在于系统中，但无法被进一步使用。这种情况下，子进程被称为“僵尸进程”。避免僵尸进程的产生，父进程需要及时调用 wait()或 waitpid()系统调用来回收子进程。

- **孤儿进程**：一个进程的父进程已经终止或者不存在，但是该进程仍在运行。这种情况下，该进程就是孤儿进程。孤儿进程通常是由于父进程意外终止或未及时调用 wait()或 waitpid()等系统调用来回收子进程导致的。为了避免孤儿进程占用系统资源，操作系统会将孤儿进程的父进程设置为 init 进程（进程号为 1），由 init 进程来回收孤儿进程的资源

## 死锁

死锁（Deadlock）描述的是这样一种情况：多个进程/线程同时被阻塞，它们中的一个或者全部都在等待某个资源被释放。由于进程/线程被无限期地阻塞，因此程序不可能正常终止。

### 产生死锁的四个条件

1. **互斥**：资源必须处于非共享模式，即一次只有一个进程可以使用。如果另一进程申请该资源，那么必须等待直到该资源被释放为止。
2. **占有并等待**：一个进程至少应该占有一个资源，并等待另一资源，而该资源被其他进程所占有。
3. **非抢占**：资源不能被抢占。只能在持有资源的进程完成任务后，该资源才会被释放。
4. **循环等待**：有一组等待进程 `{P0, P1,..., Pn}`， `P0` 等待的资源被 `P1` 占有，`P1` 等待的资源被 `P2` 占有，……，`Pn-1` 等待的资源被 `Pn` 占有，`Pn` 等待的资源被 `P0` 占有。

### 模拟死锁代码

```java
public class DeadLockDemo {
    private static Object resource1 = new Object();//资源 1
    private static Object resource2 = new Object();//资源 2

    public static void main(String[] args) {
        new Thread(() -> {
            synchronized (resource1) {
                System.out.println(Thread.currentThread() + "get resource1");
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread() + "waiting get resource2");
                synchronized (resource2) {
                    System.out.println(Thread.currentThread() + "get resource2");
                }
            }
        }, "线程 1").start();

        new Thread(() -> {
            synchronized (resource2) {
                System.out.println(Thread.currentThread() + "get resource2");
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread() + "waiting get resource1");
                synchronized (resource1) {
                    System.out.println(Thread.currentThread() + "get resource1");
                }
            }
        }, "线程 2").start();
    }
}
```

### 解决死锁的方法

- **预防**：采用某种策略，**限制并发进程对资源的请求**，从而使得死锁的必要条件在系统执行的任何时间上都不满足。
- **避免**：系统在分配资源时，根据资源的使用情况 **提前做出预测**，从而 **避免死锁的发生**
- **检测**：系统设有 **专门的机构**，当死锁发生时，该机构能够检测死锁的发生，并精确地确定与死锁有关的进程和资源。
- **解除**：与检测相配套的一种措施，用于 **将进程从死锁状态下解脱出来**。

### 预防死锁

1. **静态分配策略(第二个条件)：** 一个进程必须在执行前就申请到它所需要的全部资源，并且知道它所要的资源都得到满足之后才开始执行。**进程要么占有所有的资源然后开始执行，要么不占有资源**，不会出现占有一些资源等待一些资源的情况。
2. **层次分配策略(第四个条件)**：所有的资源被分成了多个层次，一个进程得到某一次的一个资源后，它只能再申请较高一层的资源；当一个进程要释放某层的一个资源时，必须先释放所占用的较高层的资源，按这种策略，是不可能出现循环等待链的，因为那样的话，就出现了已经申请了较高层的资源，反而去申请了较低层的资源，不符合层次分配策略，证明略

### 避免死锁

​    我们将系统的状态分为 **安全状态** 和 **不安全状态** ，每当在为申请者分配资源前先测试系统状态，若把系统资源分配给申请者会产生死锁，则拒绝分配，否则接受申请，并为它分配资源。

### 检测死锁

系统定时运行一个 "死锁检测" 的程序，判断是否产生死锁。

进程-资源分配图：用一个方框表示每一个资源类，方框中的黑点表示该资源类中的各个资源，每个键进程用一个圆圈表示，用 **有向边** 来表示 **进程申请资源和资源被分配的情况**。

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711685626_0.jpg" alt="process-resource-allocation-diagram" style="zoom:50%;" />

1. 无环路，没有死锁
2. 有环路，且每个资源类仅有一个资源，则发生死锁
3. 有环路，如果能在进程-资源分配图中找出一个 **既不阻塞又非独立的进程** ，该进程能够在有限的时间内归还占有的资源，也就是把边给消除掉了，重复此过程，直到能在有限的时间内 **消除所有的边** ，则不会发生死锁，否则会发生死锁。(消除边的过程类似于 **拓扑排序**)

### 解除死锁

1. 结束所有进程，重启操作系统
2. 撤销涉及死锁的进程，解除死锁后继续运行
3. 逐个撤销涉及死锁的进程，回收资源直到死锁解除
4. 抢占资源

## 内存管理

操作系统的内存管理非常重要，主要负责下面这些事情：

- **内存的分配与回收**：对进程所需的内存进行分配和释放，malloc 函数：申请内存，free 函数：释放内存。
- **地址转换**：将程序中的虚拟地址转换成内存中的物理地址。
- **内存扩充**：当系统没有足够的内存时，利用虚拟内存技术或自动覆盖技术，从逻辑上扩充内存。
- **内存映射**：将一个文件直接映射到进程的进程空间中，这样可以通过内存指针用读写内存的办法直接存取文件内容，速度更快。
- **内存优化**：通过调整内存分配策略和回收算法来优化内存使用效率。
- **内存安全**：保证进程之间使用内存互不干扰，避免一些恶意程序通过修改内存来破坏系统的安全性。

### 内存碎片

- 内部内存碎片：已经分配给进程但未被使用的内存，主要原因是分配内存为 2 的幂次方，大于进程需要的内存
- 外部内存碎片：为分配但无法分配的内存，主要原因是由于未分配的连续内存区域太小，以至于不能满足任意进程所需要的内存分配请求，

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711721279_0.png" alt="internal-and-external-fragmentation" style="zoom:50%;" />

### 内存管理方式

- 连续内存管理：为一个用户程序分配一个连续的内存空间，内存利用率一般不高
- 非连续内存管理：允许一个程序使用的内存分布在离散或者不相邻的内存中，相对更加灵活

### 连续内存管理

**块式管理**，存在严重的内存碎片问题，将内存分为几个固定大小的块，每个块只包含一个进程。如果程序需要内存，就分配一块，可能会浪费空间，内部内存碎片。

**伙伴系统算法**：有效解决 **外部内存碎片**，将内存按 2 的幂次方划分，并将相邻的内存块合成一对伙伴，当进行内存分配时，伙伴系统会尝试找到大小最合适的内存块，如果过大则一分为二，直到合适大小。如果相邻的内存块都被释放，则会合并，减少内存碎片。

### 非连续内存管理

- **段式管理**：以段(一段连续的物理内存)的形式管理/分配物理内存。虚拟地址空间被分为大小不等的段，每个段定义了一组逻辑信息，如主程序段 MAIN，子程序段 X、数据段 D 及栈段 S 等。
- **页式管理**：把物理内存分为连续等长的物理页，虚拟地址空间也被划分为连续等长的虚拟页。
- **段页式管理机制**：先分段，段再分为等长的页

### 内存分段

程序是由若干个逻辑分段组成的，如可由代码分段、数据分段、栈段、堆段组成。**不同的段是有不同的属性的，所以就用分段（\*Segmentation\*）的形式把这些段分离出来。**

分段机制下的虚拟地址由两部分组成，**段选择因子** 和 **段内偏移量**。

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1713024233_0.webp" alt="a9ed979e2ed8414f9828767592aadc21" style="zoom:50%;" />

段选择因子和段内偏移量：

- **段选择子** 就保存在段寄存器里面。段选择子里面最重要的是 **段号**，用作段表的索引。**段表** 里面保存的是这个 **段的基地址、段的界限和特权等级** 等。
- 虚拟地址中的 **段内偏移量** 应该位于 0 和段界限之间，如果段内偏移量是合法的，就将段基地址加上段内偏移量得到物理内存地址。

在上面，知道了虚拟地址是通过 **段表** 与物理地址进行映射的，分段机制会把程序的虚拟地址分成 4 个段，每个段在段表中有一个项，在这一项找到段的基地址，再加上偏移量，于是就能找到物理内存中的地址，如下图：

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1713024247_0.webp" alt="c5e2ab63e6ee4c8db575f3c7c9c85962" style="zoom:50%;" />

如果要访问段 3 中偏移量 500 的虚拟地址，我们可以计算出物理地址为，段 3 基地址 7000 + 偏移量 500 = 7500。

分段的办法很好，解决了程序本身不需要关心具体的物理内存地址的问题，但它也有一些不足之处：

- 第一个就是 **内存碎片** 的问题。
- 第二个就是 **内存交换的效率低** 的问题。

### 内存分页

**分页是把整个虚拟和物理内存空间切成一段段固定尺寸的大小**。这样一个连续并且尺寸固定的内存空间，我们叫 **页**（*Page*）。在 Linux 下，每一页的大小为 `4KB`。

虚拟地址与物理地址之间通过 **页表** 来映射，如下图：

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1713024439_0.webp" alt="08a8e315fedc4a858060db5cb4a654af" style="zoom:50%;" />

页表是存储在内存里的，**内存管理单元** （*MMU*）就做将虚拟内存地址转换成物理地址的工作。

而当进程访问的虚拟地址在页表中查不到时，系统会产生一个 **缺页异常**，进入系统内核空间分配物理内存、更新进程页表，最后再返回用户空间，恢复进程的运行。

如果内存空间不够，操作系统会把其他正在运行的进程中的「最近没被使用」的内存页面给释放掉，也就是暂时写在硬盘上，称为 **换出**（*Swap Out*）。一旦需要的时候，再加载进来，称为 **换入**（*Swap In*）。所以，一次性写入磁盘的也只有少数的一个页或者几个页，不会花太多时间，**内存交换的效率就相对比较高。**

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1713024535_0.webp" alt="388a29f45fe947e5a49240e4eff13538-20230309234651917" style="zoom: 33%;" />

> 分页机制下，虚拟地址和物理地址是如何映射的？

在分页机制下，虚拟地址分为两部分，**页号** 和 **页内偏移**。页号作为页表的索引，**页表** 包含物理页每页所在 **物理内存的基地址**，这个基地址与页内偏移的组合就形成了物理内存地址，见下图。

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1713024568_0.webp" alt="7884f4d8db4949f7a5bb4bbd0f452609" style="zoom:50%;" />

总结一下，对于一个内存地址转换，其实就是这样三个步骤：

- 把虚拟内存地址，切分成页号和偏移量；
- 根据页号，从页表里面，查询对应的物理页号；
- 直接拿物理页号，加上前面的偏移量，就得到了物理内存地址。

#### 多级页表

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1713024988_0.webp" alt="19296e249b2240c29f9c52be70f611d5" style="zoom: 33%;" />

#### TLB

专门存放程序最常访问的页表项的 Cache，这个 Cache 就是 TLB（*Translation Lookaside Buffer*） ，通常称为页表缓存、转址旁路缓存、快表等。

有了 TLB 后，那么 CPU 在寻址时，会先查 TLB，如果没找到，才会继续查常规的页表。

### 虚拟内存作用

虚拟内存作用时作为进程访问主存(物理内存)的桥梁并简化内存管理

- **隔离进程**：物理内存通过虚拟地址空间访问，虚拟地址空间与进程一一对应。每个进程都认为自己拥有了整个物理内存，进程之间彼此隔离，一个进程中的代码无法更改正在由另一进程或操作系统使用的物理内存。
- **提升物理内存利用率**：有了虚拟地址空间后，操作系统只需要将进程当前正在使用的部分数据或指令加载入物理内存。
- **简化内存管理**：进程都有一个一致且私有的虚拟地址空间，程序员不用和真正的物理内存打交道，而是借助虚拟地址空间访问物理内存，从而简化了内存管理。
- **多个进程共享物理内存**：进程在运行过程中，会加载许多操作系统的动态库。这些库对于每个进程而言都是公用的，它们在内存中实际只会加载一份，这部分称为共享内存。
- **提高内存使用安全性**：控制进程对物理内存的访问，隔离不同进程的访问权限，提高系统的安全性。
- **提供更大的可使用内存空间**：可以让程序拥有超过系统物理内存大小的可用内存空间。这是因为当物理内存不够用时，可以利用磁盘充当，将物理内存页（通常大小为 4 KB）保存到磁盘文件（会影响读写速度），数据或代码页会根据需要在物理内存与磁盘之间移动

> - 第一，虚拟内存可以使得进程对运行内存超过物理内存大小，因为程序运行符合局部性原理，CPU 访问内存会有很明显的重复访问的倾向性，对于那些没有被经常使用到的内存，我们可以把它换出到物理内存之外，比如硬盘上的 swap 区域。
> - 第二，由于每个进程都有自己的页表，所以每个进程的虚拟内存空间就是相互独立的。进程也没有办法访问其他进程的页表，所以这些页表是私有的，这就解决了多进程之间地址冲突的问题。
> - 第三，页表里的页表项中除了物理地址之外，还有一些标记属性的比特，比如控制一个页的读写权限，标记该页是否存在等。在内存访问方面，操作系统提供了更好的安全性。

#### 虚拟地址 vs 物理地址

**物理地址（Physical Address）** 是真正的物理内存中地址，更具体点来说是内存地址寄存器中的地址。程序中访问的内存地址不是物理地址，而是 **虚拟地址（Virtual Address）**

操作系统一般通过 CPU 芯片中的一个重要组件 **MMU(Memory Management Unit，内存管理单元)** 将虚拟地址转换为物理地址，这个过程被称为 **地址翻译/地址转换（Address Translation）**。

MMU 将虚拟地址翻译为物理地址的主要机制有两种: **分段机制** 和 **分页机制** 。

### malloc 分配内存

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1713025410_0.webp" alt="32 位虚拟内存布局" style="zoom: 33%;" />

malloc 申请内存的时候，会有两种方式向操作系统申请堆内存。

- 方式一：通过 brk() 系统调用从堆分配内存
- 方式二：通过 mmap() 系统调用在文件映射区域分配内存；

方式一实现的方式很简单，就是通过 brk() 函数将「堆顶」指针向高地址移动，获得新的内存空间。如下图：

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1713067174_0.webp" alt="brk 申请" style="zoom:33%;" />

方式二通过 mmap() 系统调用中「私有匿名映射」的方式，在文件映射区分配一块内存，也就是从文件映射区“偷”了一块内存。如下图：

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1713067179_0.webp" alt="mmap 申请" style="zoom:33%;" />

**malloc() 分配的是虚拟内存**

- malloc 通过 **brk()** 方式申请的内存，free 释放内存的时候，**并不会把内存归还给操作系统，而是缓存在 malloc 的内存池中，待下次使用**；
- malloc 通过 **mmap()** 方式申请的内存，free 释放内存的时候，**会把内存归还给操作系统，内存得到真正的释放**。

### 内存分配流程

应用程序通过 malloc 函数申请内存的时候，实际上申请的是虚拟内存，此时并不会分配物理内存。

当应用程序读写了这块虚拟内存，CPU 就会去访问这个虚拟内存， 这时会发现这个虚拟内存没有映射到物理内存， CPU 就会产生 **缺页中断**，进程会从用户态切换到内核态，并将缺页中断交给内核的 Page Fault Handler （缺页中断函数）处理。

缺页中断处理函数会看是否有空闲的物理内存，如果有，就直接分配物理内存，并建立虚拟内存与物理内存之间的映射关系。

如果没有空闲的物理内存，那么内核就会开始进行 **回收内存** 的工作，回收的方式主要是两种：直接内存回收和后台内存回收。

- **后台内存回收**（kswapd）：在物理内存紧张的时候，会唤醒 kswapd 内核线程来回收内存，这个回收内存的过程 **异步** 的，不会阻塞进程的执行。
- **直接内存回收**（direct reclaim）：如果后台异步回收跟不上进程内存申请的速度，就会开始直接回收，这个回收内存的过程是 **同步** 的，会阻塞进程的执行。

如果直接内存回收后，空闲的物理内存仍然无法满足此次物理内存的申请，那么内核就会放最后的大招了 ——**触发 OOM （Out of Memory）机制**。

OOM Killer 机制会根据算法选择一个占用物理内存较高的进程，然后将其杀死，以便释放内存资源，如果物理内存依然不足，OOM Killer 会继续杀死占用物理内存较高的进程，直到释放足够的内存位置。

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1713067463_0.webp" alt="2f61b0822b3c4a359f99770231981b07" style="zoom: 33%;" />

### Swap 分区

Swap 就是把一块磁盘空间或者本地文件，当成内存来使用，它包含换出和换入两个过程：

- **换出（Swap Out）** ，是把进程暂时不用的内存数据存储到磁盘中，并释放这些数据占用的内存；
- **换入（Swap In）**，是在进程再次访问这些内存的时候，把它们从磁盘读到内存中来；



- 在 32 位操作系统，因为进程理论上最大能申请 3 GB 大小的虚拟内存，所以直接申请 8G 内存，会申请失败。
- 在 64位 位操作系统，因为进程理论上最大能申请 128 TB 大小的虚拟内存，即使物理内存只有 4GB，申请 8G 内存也是没问题，因为申请的内存是虚拟内存。如果这块虚拟内存被访问了，要看系统有没有 Swap 分区：
  - 如果没有 Swap 分区，因为物理空间不够，进程会被操作系统杀掉，原因是 OOM（内存溢出）；
  - 如果有 Swap 分区，即使物理内存只有 4GB，程序也能正常使用 8GB 的内存，进程可以正常运行；