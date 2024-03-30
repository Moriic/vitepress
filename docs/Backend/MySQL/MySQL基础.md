## 常用命令

启动：net start [mysql名字]

停止：net stop [mysql名字]

客户端连接：mysql [-h 127.0.0.1] [-P 3306] -uroot -p[密码]

退出：exit

查看数据库：show databases:(以分号结尾)

## 数据类型

### 数值类型

| 类型         | 大小   |
| ------------ | ------ |
| tinyint      | 1 byte |
| smallint     | 2 byte |
| mediumint    | 3 byte |
| int/interger | 4 byte |
| bigint       | 8 byte |
| float        | 4 byte |
| double       | 8 byte |
| decimal      |        |

### 字符串类型

| 类型          | 大小(bytes) | 说明               |
| ------------- | ----------- | ------------------ |
| char(size)    | 255         | 定长字符串，性能好 |
| varchar(size) | 65535       | 变长字符串，内存少 |
| tinyblob      | 255         | blob存放二进制数据 |
| tinytext      | 255         | text存放文本数据   |
| blob          | 65535       |                    |
| text          | 65535       |                    |
| mediumblob    | 16777215    |                    |
| mediumtext    | 16777215    |                    |
| longblob      | x           |                    |
| longtext      | x           |                    |

### 日期类型

| 类型      | 大小 | 格式                |
| --------- | ---- | ------------------- |
| date      | 3    | YYYY-MM-DD          |
| time      | 3    | HH:MM:SS            |
| year      | 1    | YYYY                |
| datetime  | 8    | YYYY-MM-DD HH:MM:SS |
| timestamp | 4    | YYYY-MM-DD HH:MM:SS |



## SQL分类

| 分类 | 全称                       | 说明                                                   |
| ---- | -------------------------- | ------------------------------------------------------ |
| DDL  | Data Definition Language   | 数据定义语言，用来定义数据库对象(数据库，表，字段)     |
| DML  | Data Manipulation Language | 数据操作语言，用来对数据库表中的数据进行增删改         |
| DQL  | Date Query Language        | 数据查询语言，用来查询数据库中的记录                   |
| DCL  | Date Control Language      | 数据控制语言，用来创建数据库用户、控制数据库的访问权限 |

### DDL

#### 数据库操作

- 查询所有数据库：`show databases;`
- 查询当前数据库：`select database();`
- 创建数据库：`create database [if not exists] 数据库名 [dafault charset 字符集] [collate 排序规则];`
- 删除数据库：`drop database[if exist]数据库名;`
- 使用指定数据库：`use 数据库名;`

#### 表操作

- 查询当前数据库所有表：`show tables;`
- 查询表结构：`desc 表名;`
- 查询指定表的建表语句：`show create table 表名;`
- 建表操作：

```sql
create table 表名(
	字段1 类型[comment 注释],
    ...
	字段2 类型[comment 注释]
)[comment 注释];

例如：
create table user(
    id int comment 'id',
    name varchar(50) comment 'name',
    age int unsigned comment 'age',
    gender char(1) comment 'gender'
) comment 'user table';
```

```sql
create table emp(
	id int,
    workno varchar(10),
    name varchar(10),
    gender char(1),
    age tinyint unsigned,
    idcard char(18),
    entrydate date
);
```

- 添加字段：`alter table 表名 add 字段名 类型(长度) [after 字段名] [comment 注释] [约束];`

  `alter table emp add nickname varchar(20) after workno;`

- 修改数据类型：`alter table 表名 modify 字段名 新数据类型(长度);`

  `alter table emp modify name varchar(20);`

- 修改字段名和类型：`alter table 表名 change 旧字段名 新字段名 新数据类型(长度); `

  ` alter table emp change name username varchar(10);`

- 删除字段：`alter table 表名 drop 字段名;`

  `alter table emp drop username`

- 修改表名：`alter table 表名 rename to 新表名`

  `alter table emp remame to employee`

- 删除表：`drop table [if exists] 表名;`
- 删除指定表并重新创建：`truncate table 表名;`

### DML

#### 添加数据

- 指定字段添加数据：`insert into 表名 (字段名1,字段名2,...) values(值1,值2,...);`

- 给全部字段添加数据：`insert into 表名 values(值1,值2,...)`

  批量添加数据：`insert into 表名 (字段名1,字段名2,...) values(值1,值2,...),(值1,值2,...);`

  `insert into employee values(1,'1','first','男',18,'123456789123456789','2000-11-11');`

#### 修改数据

`update 表名 set 字段名=值1,字段名=值2,...[where 字段名=条件值];`

`update employee set name = 'second' where id = 1;`

#### 删除数据

`delete from 表名 [where 条件]`

### DQL

- 语法顺序：`select 字段列表 from 表名列表 where 条件列表 group by 分组字段列表 having 分组后的过滤条件 order by 排序字段列表 limit 分页参数`
- 执行顺序：from -> where -> group by -> select -> having -> order by -> limit

#### 基本查询

- 查询多个字段：`select 字段1 [别名1],字段2 [别名2]... from 表名;`

- 查询所有字段：`select * from 表名`

- 去除重复记录：`select distinct 字段列表 [别名] from 表名`

#### 条件查询

`select 字段列表 from 表名 where 条件列表`

| 条件            | 说明                                  |
| --------------- | ------------------------------------- |
| >,>=,<,<=,=,!=  |                                       |
| between A and B | [A,B]                                 |
| in(值列表)      | 在列表值中                            |
| like '参数'     | 参数_代表单个字符,参数%代表任意个字符 |
| is null         | 为null                                |
| &&,\|\|,!       |                                       |

`select * from employee where idcard like '%X';`

#### 聚合函数

统计一列的函数值(不包括null)：`select 聚合函数(参数列表) from 表名 [where 条件]`

`select avg(age) from employee;`

| 函数    | 说明       |
| ------- | ---------- |
| count   | 统计数量   |
| max,min | 最大最小值 |
| avg     | 平均值     |
| sum     | 求和       |

#### 分组查询

`select 字段列表 from 表名列表 [where 条件列表] group by 分组字段列表 having [分组后的过滤条件]`

where和having区别

1. where在分组前过滤，having在分组后过滤
2. where不能使用聚合函数，having可用

例子：分组前选择age>=18进行过滤,以性别进行分组,并选择性别数量大于2的进行查询。

`select gender,count(*) gender_num from employee where age >= 18 group by gender having gender_num >= 2;`

#### 排序查询

`select 字段列表 from 表名 order by 字段1 排序方式1,字段2 排序方式2;`

排序方式：asc:升序(默认),desc(降序)

`select * from employee order by age,entrydate desc;`

#### 分页查询

`selece 字段列表 from 表名 limit 起始索引,查询记录数;`

1. 起始索引从0开始，起始索引 = (查询页码 - 1) \* 每页显示记录数
2. 第一页起始索引可省略，即 limit 10;

查询5条记录，去掉前3条，显示2条，即每页两条记录，显示第

`select * from employee limit 3,2;`

### DCL

#### 用户管理

- 查询用户：`use mysql` `select * from user`

- 创建用户：`create user '用户名'@'主机名' identified by '密码';` 

  当前主机：`create user 'cwc'@'localhost' identified by '123456';`

  任意主机：`create user 'cwc'@'%' identified by '123456';`

- 修改用户密码：`alter user '用户名'@'主机名' identified with mysql_native_password by '密码';`

- 删除用户：`drop user '用户名'@'主机名';`

#### 权限管理

| 权限   | 说明       |
| ------ | ---------- |
| all    | 所有权限   |
| select | 查询数据   |
| insert | 插入数据   |
| updata | 修改数据   |
| delete | 删除数据   |
| alter  | 修改表     |
| drop   | 删除数据库 |
| create | 创建数据库 |

- 查询权限：`show grants for '用户名'@'主机名';`
- 授予权限：`grant 权限列表 on 数据库名.表名 to '用户名'@'主机名';`

`grant all on test.* to 'cwc'@'localhost';`

撤销权限：`revoke 权限列表 on 数据库名.表名 from '用户名'@'主机名'; `

`revoke all on test.* from 'cwc'@'localhost';`

## 函数

### 字符串函数

| 函数                     | 说明                                    |
| ------------------------ | --------------------------------------- |
| concat(s1,s1,…,sn)       | 拼接字符串                              |
| lower(str)               | 将字符串转换为小写                      |
| upper(str)               | 将字符串转换为大写                      |
| lpad(str,n,pad)          | 用字符串pad对str进行左填充，直到长度为n |
| rpad(str,n,pad)          | 用字符串pad对str进行右填充，直到长度为n |
| trim(str)                | 去掉字符串头部和尾部的空格              |
| substring(str,start,len) | 截取str从start开始的len个长度的字符串   |

### 数值函数

| 函数       | 说明                             |
| ---------- | -------------------------------- |
| ceil(x)    | 向上取整                         |
| floor(x)   | 向下取整                         |
| mod(x,y)   | 返回x/y的模                      |
| rand()     | 返回0~1的随机数，double          |
| round(x,y) | 求参数x的四舍五入值，保留y位小数 |

生成6位随机验证码：`select rpad(round(rand()*1000000,0),6,'0');`

### 日期函数

| 函数                              | 说明                         |
| --------------------------------- | ---------------------------- |
| curdate()                         | 获取当前日期                 |
| curtime()                         | 获取当前时间                 |
| now()                             | 获取当前日期和时间           |
| year/month/day(date)              | 获取date的年/月/日           |
| date_add(date,INTERVAL expr type) | 返回date加上间隔expr后的时间 |
| datediff(date1,date2)             | 返回时间间隔天数             |

### 流程函数

| 函数                                                     | 说明                                              |
| -------------------------------------------------------- | ------------------------------------------------- |
| if(value,t,f)                                            | 如果value为true，返回t，否则返回f                 |
| ifnull(value1,value2)                                    | 如果value1不为空，返回value1，否则返回value2      |
| case when [val1] then [res1] … else [default] end        | 如果val1为true返回res1，否则返回default默认值     |
| case [expr] when [val1] then [res1] … else [default] end | 如果expr值为val1，返回res1，否则返回default默认值 |

`select (case workaddress when '北京' then '一线城市' when '上海' then '一线城市' else '二线城市' end) from emp;`

`select if (workaddress in ('北京','上海'),'一线城市','二线城市') from emp; `

## 约束

约束作用于表中字段上的规则，用于限制存储在表中的数据。

#### 约束命令

| 约束     | 关键字         | 描述                     |
| -------- | -------------- | ------------------------ |
| 非空约束 | not null       | 非空                     |
| 唯一约束 | unique         | 唯一，不能重复           |
| 主键约束 | primary key    | 主键为唯一标识，非空唯一 |
| 默认约束 | default        | 指定默认值               |
| 检查约束 | check          | 保证字段满足一个条件     |
| 外键约束 | foreign key    | 两张表建立连接           |
| 自动增长 | auto_increment | 自动增长1                |

```sql
create table user
(
    id   int primary key auto_increment comment '主键',
    name varchar(20) not null unique comment '姓名',
    age  int check (age >= 0 && age <= 120) comment '年龄',
    status char(1) default '1' comment '状态',
    gender char(1) comment '性别',
    idcard int primary key, 
   	primary key(idcard)
)comment '用户';
```

#### 主键约束

主键只能由一个,主键建议使用int,bigint,char等定长类型。

- 单一主键：`idcard int primary key;`(列级方式),`primary key(idcard);`(表级方式)
- 复合主键：`primary key(id,name;)`
- 自然主键：`id int primary key auto_increment;`

#### 外键约束

添加外键：

- `create table 表名([constraint] [外键名字] foreign key(外键字段名) references 主表(主表列名)) [on update 更新行为 on delete 删除行为];` 
- `alter table 表名 add constraint 外键名字 foreign key(外键字段名) references 主表(主表列名)) [on update 更新行为 on delete 删除行为];`

```sql
-- 1
create table dept(
    id int primary key,
	dname varchar(20)
)

create table emp(
	id int primary key,
    dept_id int,
    foreign key (dept_id) references dept(id)
)

-- 2
alter table emp add constraint fk_emp_dept_id foreign key(dept_id) references dept(id);
```

删除外键：`alter table 表名 drop foreign key 外键名字 `

删除/更新行为：

- `no action/restrict(默认)`：当在父表中删除/更新记录时，首先检查该记录是否有对应外键，如果有则不允许删除/更新。
- `cascade`：当在父表中删除/更新记录时，首先检查该记录是否有对应外键，如果有则删除/更新外键在子表中的记录
- `set null`：当在父表中删除/更新记录时，首先检查该记录是否有对应外键，如果有则设置外键在子表的值为null
- `set default`：父表有变更时，子表将外键设置为一个默认的值

## 多表查询

### 内连接

查询两张表交集的部分

1. 隐式内连接：`select 字段列表 from 表1,表2 where条件;`
2. 显式内连接：`select 字段列表 from 表1 [inner] join 表2 on 连接条件`

例如：表emp表示员工对应的部门id，表dept表示部门id对应的名字，查询每个员工姓名对应的部门名字

1. 隐式内连接：`select emp.name,dept.name from emp,dept where emp.dept_id = dept.id`
2. 使用别名：`select e.name,d.name from emp e,dept d where e.dept_id = d.id`
3. 显式内连接：`select e.name,d.name from emp e inner join dept d on e.det_id = d.id`

### 外连接

- 左外连接：查询左表和交集的部分

  `select 字段列表 from 表1 left [outer] join 表2 on 条件; `

- 右外连接：查询右表和交集的部分

  `select 字段列表 from 表1 right [outer] join 表2 on 条件`

例如：

- 查询emp表的所有数据和对应的部门名字

  `select e.*,d.name from emp e left outer join dept d e.dept_id = d.id`

- 查询dept表的所有数据和对应的员工信息

  `select d.*,e.* from emp e right outer join dept d e.dept_id = d.id`

### 自连接

一张表看成两张表，起两个别名，使用内连接或外连接

`select 字段列表 from 表1 别名1 join 表1 别名2 on 条件`

例如：表emp中包含自身id和所属领导id

查询员工及其所属领导信息:

`select e.name,m.name from emp e,emp m where e.id = m.manager.id`

`select e.name,m.name from emp e join emp m on e.id = m.manager.id`

查询员工的所有信息及其领导的信息：

`select a.name,b.name from emp a left join emp b on a.manager.id = b.id `

### 联合查询

将多次查询的结果合并起来,union会去重,字段列表需要一致

`select 字段列表 from 表1 union[all] select 字段列表 from 表2; `

### 子查询

SQL语句中嵌套select语句

`select * from t1 where column1 = (select column1 from t2)`

#### 标量子查询

子查询返回单个值,操作符一般为 = > < >= <=

`select * from emp where dept_id = (select id from dept where name = "销售部")`

#### 列子查询

子查询返回一列

| 操作符   | 说明                       |
| -------- | -------------------------- |
| in       | 在指定的集合范围内，多选一 |
| not in   | 不在指定的集合范围内       |
| any/some | 有任何一个满足即可         |
| all      | 所有值都需要满足           |

`select * from emp where dept_id = (select id from dept where name = '销售部' or name = '市场部')`

#### 行子查询

子查询返回一行，操作符一般为： = > < in not in

例如：查询与张三的工资和领导相同的员工信息

`select * from emp where (salary,managerid) = (select salary,managerid from emp where name = '张三')`

#### 表子查询

子查询返回多行多列，常用操作符：in

`select * from emp where (job,salary) in (select job,salary from emp where name = '张三' ) or name = '李四'`

## 事务

事务是一组操作的集合，作为一个整体交给系统，要么同时成功，要么同时失败。

### 事务操作

1. 查看事务提交方式：`select @@autocommit;`,为1是自动提交
2. 设置事务提交方式：`set @@autocommit = 0; `,设为手动提交
3. 开启事务：`start transaction 或 begin`
4. 提交事务：`commit;`
5. 回滚事务：`rollback;`

### 事务四大特性(ACID)

1. 原子性(Atomicity):事务是不可分割的最小操作单元，要么全部成功，要么全部失败
2. 一致性(Consistency):事务完成时，必须使所有的数据保存一致状态
3. 隔离性(Isolation):数据库系统提供的隔离机制，保证事务在不受外部并发操作影响的独立环境下运行
4. 持久性(Durability):事务一旦提交后或回滚，它对数据库中的数据的改变就是永久的

### 并发事务问题

| 问题       | 描述                                                         |
| ---------- | ------------------------------------------------------------ |
| 脏读       | 一个事务读取到了另一个事务还没提交的数据                     |
| 不可重复读 | 一个事务先后读取同一条记录，但两次读取的数据不同(读取了另一个事务提交更新后的数据) |
| 幻读       | 一个事务按照条件查询数据时，没有对应的数据行，但是在插入数据时，数据又存在(另一个事务插入) |

### 事务隔离级别

| 隔离级别             | 脏读 | 不可重复读 | 幻读 |
| -------------------- | ---- | ---------- | ---- |
| Read uncommited      | √    | √          | √    |
| Read commited        | x    | √          | √    |
| Repeated read(默认)  | x    | x          | √    |
| Serializable(最严格) | x    | x          | x    |

1. 查看事务隔离级别：`select @@transaction_isolation`
2. 设置事务隔离级别：`set [session|global] transaction isolation 事务级别`
3. serializable：表锁，只允许同时一个事务执行
