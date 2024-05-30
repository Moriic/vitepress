# Spring

## 组件

![spring-framework-introduce-8](https://raw.githubusercontent.com/Moriic/picture/main/image/1715926509_0.png)







## 事务

### @Transactional

在私有方法上添加@Transactional 注解不能生效

两个参数：

`propagation`: 这个参数指定了事务的传播行为。它定义了一个方法执行时所处的事务上下文如何与已经存在的事务进行交互。可能的取值包括(假设有 ServiceA.MethodA()，在其内部调用 ServiceB.MethodB())：

- `REQUIRED`: 如果当前存在事务，则加入该事务；如果当前没有事务，则创建一个新的事务，当 ServiceA.MethodA()运行时，开启一个事务，此时 ServiceB.MethodB()方法发现已经存在一个事务，就不会再开启事务，因此不管哪一个方法报错，都会回滚。
- `REQUIRES_NEW`: 每次调用都会创建一个新的事务。如果当前存在事务，则将当前事务挂起，当 ServiceA.MethodA()运行时，开启一个事务 A。当运行 ServiceB.MethodB()时，把事务 A 挂起，然后开启事务 B。就算事务 A 发生回滚，事务 B 依然能正常提交。总结起来就是：外部事务不会影响内部事务的提交和回滚。
- `SUPPORTS`: 如果当前存在事务，则加入该事务；如果当前没有事务，则以非事务的方式执行。
- `NOT_SUPPORTED`: 以非事务方式执行，并挂起任何存在的事务。
- `NEVER`: 以非事务方式执行，如果当前存在事务则抛出异常。
- `NESTED`：如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，则进行与 PROPAGATION_REQUIRED 类似的操作。当 ServiceA.MethodA()运行时，开启一个事务 A。当运行 ServiceB.MethodB()时，开启一个子事务 B，它将取得一个  savepoint. 如果这个事务 B 失败, 将回滚到此  savepoint，而不会影响整个事务。总结一句话就是内部事务不会影响外部事务的提交和回滚。

`isolation`: 这个参数指定了事务的隔离级别。它定义了事务的操作与其他事务的隔离程度。可能的取值包括：

- `DEFAULT`: 使用底层数据存储的默认隔离级别。
- `READ_UNCOMMITTED`: 允许读取其他事务尚未提交的数据，脏读/不可重复读/幻读。
- `READ_COMMITTED`: 仅允许读取其他事务已经提交的数据，不可重复度/幻读。
- `REPEATABLE_READ`: 确保在同一事务中多次读取相同数据时，结果保持一致，幻读。
- `SERIALIZABLE`: 最高的隔离级别，确保事务可以完全隔离，避免并发问题。

@Transactional 失效：

- 修饰非 public 方法
- 在类的内部调用事务方法
- 捕获异常后未抛出
