## 存储引擎

### 体系结构

MySQL Server 架构自顶向下大致可以分网络连接层、服务层、存储引擎层和系统文件层(存储层)。

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711786382_0.png" alt="20210712080321792" style="zoom:67%;" />

### 存储引擎操作

1. 查询支持的存储引擎：`show engines`
2. 创建表并指定存储引擎：`create table 表名(参数列表) engine = 存储引擎;`

### 存储引擎特点

InnoDB

- DML 操作遵循 ACID 模型，支持事务
- 行级锁，提高并发访问性能
- 支持外键 foreign key 约束
- 文件.ibd，存储表结构(frm, sdi)，数据，索引

MyISAM

- 不支持事务，不支持外键
- 支持表锁，不支持行锁
- 访问速度快
- 文件：.sdi 存储表结构信息,.MYD 存储数据,.MYI 存储索引

Memory

- 内存存放
- hash 索引

| 特点         | InnoDB            | MyISAM | Memory |
| ------------ | ----------------- | ------ | ------ |
| 存储限制     | 64TB              | 有     | 有     |
| 事务安全     | 支持              | -      | -      |
| 锁机制       | 行锁              | 表锁   | 表锁   |
| B+tree 索引   | 支持              | 支持   | 支持   |
| Hash 索引     | -                 | -      | 支持   |
| 全文索引     | 支持(5.6 版本之后) | 支持   | -      |
| 空间使用     | 高                | 低     | N/A    |
| 内存使用     | 高                | 低     | 中等   |
| 批量插入速度 | 低                | 高     | 高     |
| 支持外键     | 支持              | -      | -      |

## 索引

索引是帮助 MySQL 高效获取数据的数据结构(有序)

### 索引结构

| 索引结构            | 描述                                                         |
| ------------------- | ------------------------------------------------------------ |
| B+Tree 索引          | 最常见的索引类型, 大部分引擎都支持 B+树索引                    |
| Hash 索引            | 底层数据结构是用哈希表实现的, 只有精确匹配索引列的查询才有效, 不支持范围查询 |
| R-tree(空间索引)    | 空间索引是 MylSAM 引擎的一个特殊索引类型, 主要用于地理空间数据类型, 通常使用较少 |
| Full-text(全文索引) | 是一种通过建立倒排索引, 快速匹配文档的方式。类似于 Lucene, Solr, ES |

| 索引       | InnoDB          | MyISAM | Memory |
| ---------- | --------------- | ------ | ------ |
| B+tree 索引 | 支持            | 支持   | 支持   |
| Hash 索引   | 不支持          | 不支持 | 支持   |
| R-tree 索引 | 不支持          | 支持   | 不支持 |
| Full-text  | 5.6 版本之后支持 | 支持   | 不支持 |

### 索引分类

| 分类     | 含义                                                | 特点                    | 关键字   |
| -------- | --------------------------------------------------- | ----------------------- | -------- |
| 主键索引 | 针对于表中主键创建的索引                            | 默认自动创建, 只能有一个 | PRIMARY  |
| 唯一索引 | 避免同一个表中某数据列中的值重复                    | 可以有多个              | UNIQUE   |
| 常规索引 | 快速定位特定数据                                    | 可以有多个              |          |
| 全文索引 | 全文索引查找的是文本中的关键词, 而不是比较索引中的值 | 可以有多个              | FULLTEXT |

在 InnoDB 存储引擎中，根据索引的存储形式，又可以分为以下两种:

| 分类                      | 含义                                                      | 特点                |
| ------------------------- | --------------------------------------------------------- | ------------------- |
| 聚集索引(Clustered Index) | 将数据存储与索引放到了一块, 索引结构的叶子节点保存了行数据 | 必须有, 而且只有一个 |
| 二级索引(Secondary Index) | 将数据与索引分开存储, 索引结构的叶子节点关联的是对应的主键 | 可以存在多个        |

聚合索引(一定存在)选取规则：

- 如果存在主键，主键索引就是聚合索引
- 如果不存在主键，将使用第一个唯一索引(unique)作为聚集索引
- 如果表没有主键，或没有合适的唯一索引，则 InnoDB 会自动生成一个 rowid 作为隐藏的聚集索引

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711786383_1.png" alt="image-20230812165905514" style="zoom: 50%;" />

## 性能分析

### 查看执行频次

查看当前数据库的 INSERT, UPDATE, DELETE, SELECT 访问频次：`show global status like 'Com_______'`

### 慢查询日志

慢查询日志记录了所有执行时间超过指定参数（long_query_time，单位：秒，默认 10 秒）的所有 SQL 语句的日志。
MySQL 的慢查询日志默认没有开启，需要在 MySQL 的配置文件（/etc/my.cnf）中配置如下信息：

- 开启慢查询日志开关 `slow_query_log=1`

- 设置慢查询日志的时间为 2 秒，SQL 语句执行时间超过 2 秒，就会视为慢查询，记录慢查询日志 `long_query_time=2`
  更改后记得重启 MySQL 服务，日志文件位置：/var/lib/mysql/localhost-slow.log

- 查看慢查询日志开关状态：`show variables like 'slow_query_log';`

### profile

show profile 能在做 SQL 优化时帮我们了解时间都耗费在哪里。

- 查看当前 MySQL 是否支持 profile 操作：`select @@have_profiling;`

- 开启 profiling：`set profiling = 1;`

- 查看所有语句的耗时：`show profiles;`
- 查看指定 query_id 的 SQL 语句各个阶段的耗时：`show profile for query query_id;`
- 查看指定 query_id 的 SQL 语句 CPU 的使用情况：`show profile cpu for query query_id;`

### explain

EXPLAIN 或者 DESC 命令获取 MySQL 如何执行 SELECT 语句的信息，包括在 SELECT 语句执行过程中表如何连接和连接的顺序。
语法：`explain select 字段列表 from 表名 where 条件`

EXPLAIN 各字段含义：

- id：select 查询的序列号，表示查询中执行 select 子句或者操作表的顺序（id 相同，执行顺序从上到下；id 不同，值越大越先执行）
- select_type：表示 SELECT 的类型，常见取值有 SIMPLE（简单表，即不适用表连接或者子查询）、PRIMARY（主查询，即外层的查询）、UNION（UNION 中的第二个或者后面的查询语句）、SUBQUERY（SELECT/WHERE 之后包含了子查询）等
- type：表示连接类型，性能由好到差的连接类型为 NULL、system、const、eq_ref、ref、range、index、all
  - NULL：不查询表, 如 `select 'A'`
  - const/eq_ref：使用主键或唯一索引查询
  - ref：使用非唯一索引查询
- possible_key：可能应用在这张表上的索引，一个或多个
- Key：实际使用的索引，如果为 NULL，则没有使用索引
- Key_len：表示索引中使用的字节数，该值为索引字段最大可能长度，并非实际使用长度，在不损失精确性的前提下，长度越短越好
- rows：MySQL 认为必须要执行的行数，在 InnoDB 引擎的表中，是一个估计值，可能并不总是准确的
- filtered：表示返回结果的行数占需读取行数的百分比，filtered 的值越大越好

### 使用规则

#### 最左前缀法则

- 如果索引关联了多列（联合索引），要遵守最左前缀法则，最左前缀法则指的是查询从索引的最左列开始，并且不跳过索引中的列。如果跳跃某一列，索引将部分失效（后面的字段索引失效）。
- 联合索引中，出现范围查询（<, >），范围查询右侧的列索引失效。可以用 >= 或者 <= 来规避索引失效问题。


#### 索引失效情况

1. 在索引列上进行运算操作，索引将失效。如：`explain select * from tb_user where substring(phone, 10, 2) = '15';`
2. 字符串类型字段使用时，不加引号，索引将失效。如：`explain select * from tb_user where phone = 17799990015;`，此处 phone 的值没有加引号
3. 模糊查询中，如果仅仅是尾部模糊匹配，索引不会是失效；如果是头部模糊匹配，索引失效。如：`explain select * from tb_user where profession like '%工程';`，前后都有 % 也会失效。
4. 用 or 分割开的条件，如果 or 其中一个条件的列没有索引，那么涉及的索引都不会被用到。
5. 如果 MySQL 评估使用索引比全表更慢，则不使用索引。

#### SQL 提示

是优化数据库的一个重要手段，简单来说，就是在 SQL 语句中加入一些人为的提示来达到优化操作的目的。

- 使用索引：`explain select * from tb_user use index(idx_user_pro) where profession="软件工程";`

- 不使用哪个索引：`explain select * from tb_user ignore index(idx_user_pro) where profession="软件工程";`
- 必须使用哪个索引：`explain select * from tb_user force index(idx_user_pro) where profession="软件工程";`

- use 是建议，实际使用哪个索引 MySQL 还会自己权衡运行速度去更改，force 就是无论如何都强制使用该索引。


#### 覆盖索引&回表查询

尽量使用覆盖索引（查询使用了索引，并且需要返回的列，在该索引中已经全部能找到），减少 select *。

explain 中 extra 字段含义：
`using index condition`：查找使用了索引，但是需要 **回表查询数据**
`using where; using index;`：查找使用了索引，但是需要的数据都在索引列中能找到，所以 **不需要回表查询**

如果在聚集索引中直接能找到对应的行，则直接返回行数据，只需要一次查询，哪怕是 select \*；如果在辅助索引中找聚集索引，如 `select id, name from xxx where name='xxx';`，也只需要通过辅助索引(name)查找到对应的 id，返回 name 和 name 索引对应的 id 即可，只需要一次查询；如果是通过辅助索引查找其他字段，则需要回表查询，如 `select id, name, gender from xxx where name='xxx';`

所以尽量不要用 `select *`，容易出现回表查询，降低效率，除非有联合索引包含了所有字段

面试题：一张表，有四个字段（id, username, password, status），由于数据量大，需要对以下 SQL 语句进行优化，该如何进行才是最优方案：
`select id, username, password from tb_user where username='itcast';`

解：给 username 和 password 字段建立联合索引，则不需要回表查询，直接覆盖索引

#### 前缀索引

当字段类型为字符串（varchar, text 等）时，有时候需要索引很长的字符串，这会让索引变得很大，查询时，浪费大量的磁盘 IO，影响查询效率，此时可以只降字符串的一部分前缀，建立索引，这样可以大大节约索引空间，从而提高索引效率。

语法：`create index idx_xxxx on table_name(columnn(n));`
前缀长度：可以根据索引的选择性来决定，而选择性是指不重复的索引值（基数）和数据表的记录总数的比值，索引选择性越高则查询效率越高，唯一索引的选择性是 1，这是最好的索引选择性，性能也是最好的。
求选择性公式：

```mysql
select count(distinct email) / count(*) from tb_user;
select count(distinct substring(email, 1, 5)) / count(*) from tb_user;
```

show index 里面的 sub_part 可以看到接取的长度

#### 单列索引&联合索引

单列索引：即一个索引只包含单个列
联合索引：即一个索引包含了多个列
在业务场景中，如果存在多个查询条件，考虑针对于查询字段建立索引时，建议建立联合索引，而非单列索引。

单列索引情况：
`explain select id, phone, name from tb_user where phone = '17799990010' and name = '韩信';`
这句只会用到 phone 索引字段

##### 注意事项

- 多条件联合查询时，MySQL 优化器会评估哪个字段的索引效率更高，会选择该索引完成本次查询

### 设计原则

1. 针对于数据量较大，且查询比较频繁的表建立索引
2. 针对于常作为查询条件（where）、排序（order by）、分组（group by）操作的字段建立索引
3. 尽量选择区分度高的列作为索引，尽量建立唯一索引，区分度越高，使用索引的效率越高
4. 如果是字符串类型的字段，字段长度较长，可以针对于字段的特点，建立前缀索引
5. 尽量使用 **联合索引**，减少单列索引，查询时，联合索引很多时候可以覆盖索引，节省存储空间，避免回表，提高查询效率
6. 要控制索引的数量，索引并不是多多益善，索引越多，维护索引结构的代价就越大，会影响增删改的效率
7. 如果索引列不能存储 NULL 值，请在创建表时使用 NOT NULL 约束它。当优化器知道每列是否包含 NULL 值时，它可以更好地确定哪个索引最有效地用于查询

## SQL 优化

### 插入数据

普通插入：

1. 采用批量插入（一次插入的数据不建议超过 1000 条）
2. 手动提交事务
3. 主键顺序插入

大批量插入：
如果一次性需要插入大批量数据，使用 insert 语句插入性能较低，此时可以使用 MySQL 数据库提供的 **load 指令** 插入。

```mysql
# 客户端连接服务端时，加上参数 --local-infile（这一行在bash/cmd界面输入）
mysql --local-infile -u root -p
# 设置全局参数local_infile为1，开启从本地加载文件导入数据的开关
set global local_infile = 1;
select @@local_infile;
# 执行load指令将准备好的数据，加载到表结构中
load data local infile '/root/sql1.log' into table 'tb_user' fields terminated by ',' lines terminated by '\n';
```

### 主键优化

1. 数据组织方式：在 InnoDB 存储引擎中，表数据都是根据主键顺序组织存放的，这种存储方式的表称为索引组织表（Index organized table, IOT）

   <img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711786384_2.png" alt="image-20230820112934288" style="zoom:50%;" />

2. 页分裂：页可以为空，也可以填充一般，也可以填充 100%，每个页包含了 2-N 行数据（如果一行数据过大，会行溢出），根据主键排列。

   <img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711786385_3.png" alt="image-20230820113015857" style="zoom:50%;" />

3. 页合并：当删除一行记录时，实际上记录并没有被物理删除，只是记录被标记（flaged）为删除并且它的空间变得允许被其他记录声明使用。当页中删除的记录到达 MERGE_THRESHOLD（默认为页的 50%），InnoDB 会开始寻找最靠近的页（前后）看看是否可以将这两个页合并以优化空间使用。

<img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711786385_4.png" alt="image-20230820113041554" style="zoom:50%;" />

MERGE_THRESHOLD：合并页的阈值，可以自己设置，在创建表或创建索引时指定

> 文字说明不够清晰明了，具体可以看视频里的 PPT 演示过程：https://www.bilibili.com/video/BV1Kr4y1i7ru?p = 90

主键设计原则：

- 满足业务需求的情况下，尽量降低主键的长度
- 插入数据时，尽量选择顺序插入，选择使用 AUTO_INCREMENT 自增主键
- 尽量不要使用 UUID 做主键或者是其他的自然主键，如身份证号
- 业务操作时，避免对主键的修改

### order by 优化

1. Using filesort：通过表的索引或全表扫描，读取满足条件的数据行，然后在排序缓冲区 sort buffer 中完成排序操作，所有不是通过索引直接返回排序结果的排序都叫 FileSort 排序
2. Using index：通过有序索引顺序扫描直接返回有序数据，这种情况即为 using index，不需要额外排序，操作效率高

- order by 字段全部使用升序排序或者降序排序，则都会走索引
- 如果一个字段升序排序，另一个字段降序排序，则不会走索引，explain 的 extra 信息显示的是 `Using index, Using filesort`
- 如果要优化掉 Using filesort，则需要另外再创建一个索引，如：`create index idx_user_age_phone_ad on tb_user(age asc, phone desc);`，此时使用 `select id, age, phone from tb_user order by age asc, phone desc;` 会全部走索引

总结：

- 根据排序字段建立合适的索引，多字段排序时，也遵循最左前缀法则
- 尽量使用覆盖索引
- 多字段排序，一个升序一个降序，此时需要注意联合索引在创建时的规则（ASC/DESC）
- 如果不可避免出现 filesort，大数据量排序时，可以适当增大排序缓冲区大小 sort_buffer_size（默认 256k）

### group by 优化

- 在分组操作时，可以通过索引来提高效率
- 分组操作时，索引的使用也是满足最左前缀法则的

如索引为 `idx_user_pro_age_stat`，则句式可以是 `select ... where profession order by age`，这样也符合最左前缀法则

### limit 优化

常见的问题如 `limit 2000000, 10`，此时需要 MySQL 排序前 2000000 条记录，但仅仅返回 2000000 - 2000010 的记录，其他记录丢弃，查询排序的代价非常大。
优化方案：一般分页查询时，通过创建覆盖索引能够比较好地提高性能，可以通过覆盖索引加子查询形式进行优化

例如：

```mysql
-- 此语句耗时很长
select * from tb_sku limit 9000000, 10;
-- 通过覆盖索引加快速度，直接通过主键索引进行排序及查询
select id from tb_sku order by id limit 9000000, 10;
-- 下面的语句是错误的，因为 MySQL 不支持 in 里面使用 limit
-- select * from tb_sku where id in (select id from tb_sku order by id limit 9000000, 10);
-- 通过连表查询即可实现第一句的效果，并且能达到第二句的速度
select * from tb_sku as s, (select id from tb_sku order by id limit 9000000, 10) as a where s.id = a.id;
```

### count 优化

MyISAM 引擎把一个表的总行数存在了磁盘上，因此执行 count(\*) 的时候会直接返回这个数，效率很高（前提是不适用 where）；
InnoDB 在执行 count(\*) 时，需要把数据一行一行地从引擎里面读出来，然后累计计数。
优化方案：自己计数，如创建 key-value 表存储在内存或硬盘，或者是用 redis

count 的几种用法：

- 如果 count 函数的参数（count 里面写的那个字段）不是 NULL（字段值不为 NULL），累计值就加一，最后返回累计值
- 用法：count(\*)、count(主键)、count(字段)、count(1)
- count(主键)跟 count(\*)一样，因为主键不能为空；count(字段)只计算字段值不为 NULL 的行；count(1)引擎会为每行添加一个 1，然后就 count 这个 1，返回结果也跟 count(\*)一样；count(null)返回 0

各种用法的性能：

- count(主键)：InnoDB 引擎会遍历整张表，把每行的主键 id 值都取出来，返回给服务层，服务层拿到主键后，直接按行进行累加（主键不可能为空）
- count(字段)：没有 not null 约束的话，InnoDB 引擎会遍历整张表把每一行的字段值都取出来，返回给服务层，服务层判断是否为 null，不为 null，计数累加；有 not null 约束的话，InnoDB 引擎会遍历整张表把每一行的字段值都取出来，返回给服务层，直接按行进行累加
- count(1)：InnoDB 引擎遍历整张表，但不取值。服务层对于返回的每一层，放一个数字 1 进去，直接按行进行累加
- count(\*)：InnoDB 引擎并不会把全部字段取出来，而是专门做了优化，不取值，服务层直接按行进行累加

按效率排序：**count(字段) < count(主键) < count(1) < count(\*)**，所以尽量使用 count(\*)

### update 优化（避免行锁升级为表锁）

InnoDB 的行锁是针对索引加的锁，不是针对记录加的锁，并且该索引不能失效，否则会从行锁升级为表锁。

如以下两条语句：
`update student set no = '123' where id = 1;`，这句由于 id 有主键索引，所以只会锁这一行；
`update student set no = '123' where name = 'test';`，这句由于 name 没有索引，所以会把整张表都锁住进行数据更新，解决方法是给 name 字段添加索引

## 视图

一种虚拟存在的表, 根据创建时的命令动态生成的表

### 常用命令

+ 创建/修改：`create [or replace] view 视图名称[(列名列表)] as select 语句 [with [cascaded | local] check option];`
+ 查询创建视图的语句：`show create view 视图名称;`
+ 删除：`drop view [if exists] 视图名称;`
+ 视图的增删改查与普通表一致，且数据会保持到基表中

> with check option 会检测命令是否符合视图的定义 where …
>
> with cascaded(默认) 会检查该视图及其依赖的视图的定义
>
> 视图和基表的行必须一对一，否则视图不是动态的

## 存储过程

存储过程是 SQL 命令集合的封装和重用

### 常用命令

+ 创建

```sql
create procedure 存储过程名称([参数列表])
begin 
	-- SQL 语句
end$$
```

> 由于 SQL 语句中存在分号，需要指定指定结束的符号(如\$\$) delimiter \$\$

+ 调用：`call 名称([参数]);`
+ 查看

```sql
-- 查询指定数据库的存储过程及状态信息
select * from information_schema.routines where routine_schema = '数据库名称';
-- 查询某个存储过程的定义
show create procedure 存储过程名称;
```

+ 删除：`drop procedure [if exists] 存储过程名称;`

### 变量

#### 系统变量

**系统变量** 是 MySQL 服务器提供的，分为 **全局变量**(global), **会话变量**(session);

+ 查看系统变量(默认 session)
  + 查看所有系统变量：`show [session|global] variables;`
  + 模糊匹配系统变量：`show [session|global] variables like '...';`
  + 查看指定变量的值：`show @@[session|global] 系统变量名;`
+ 设置系统变量：`set [session|global] 系统变量名 = 值;`

> 重启 MySQL 服务器会使重置配置，持久化需要修改配置文件

#### 用户变量

用户变量不需要提前声明，在用时使用 "@变量名" 即可，作用域为当前连接

- 赋值：`set/select @var_name = expr [,@var_name = expr...];` (= 可用 :=)
- 赋值：`select 字段名 into @var_name from 表名;`
- 使用：`select @var_name;`

#### 局部变量

局部变量范围在 begin - end 块

+ 声明：`declare 变量名 变量类型[default ...];`
+ 赋值：`set 变量名 = 值; select 字段名 into 变量名 from 表名;`

### 控制语句

```sql
if 条件1 then
	...
elseif 条件2 then
	...
else
	...
end if;
```

```sql
create procedure 存储过程名称([in/out/inout 参数名 参数类型])	--  入参/返回值
begin
	-- SQL语句
end;

-- 例子
create procedure cal(in score int,out result varchar(10))
begin
	if score >= 85 then
		set result := '优秀';
	...
end;

call cal(18,@result);
```

```sql
CASE case_value
	WHEN when_value THEN statement_list1
	[WHEN when_value2 THEN statement_list2]...
	[ELSE statement_list]
END CASE;

CASE
	WHEN search_condition1 THEN statement_list1
	[WHEN search_condition2 THEN statement_list2]...
	[ELSE statement_list]
END CASE;

-- 例子
create procedure judge(in month int)
begin
	declare result varchar(10);
	
	case
		when month >= 1 and month <= 3 then
			set result = '第一季度'；
		when ...
		else
			set result = '非法参数';
	end case;
	
	select concat('输入月份所属季度wei为',result);
end;
```

```sql
-- while先判断条件，为true执行，否则不执行
WHILE 条件 DO
	SQL 语句;
END WHILE;

-- 例子
create procedure cal_sum(in n int)
begin
	declare sum int default 0;

	while n > 0 do
		set sum = sum + n;
		set n = n - 1;
	end while;
	select sum;
end;
```

```sql
-- repeat 先执行一次，再判断条件，为true退出，否则执行
repeat 
	SQL 逻辑
	UNTIL 条件
END repeat;
```

```sql
-- loop 相当于 while(true),leave相当于break,iterate相当于continue
[BEGIN_LABEL:]LOOP
	SQL语句;
	LEAVE label;
	ITERATE label;
END LOOP[END_LABEL];

-- 例子
sum:loop
	if n <= 0 then
		leave sum;
	end if;
	
	if n % 2 = 1 then
		set n = n - 1;
		iterate sum;
	end if;
	
	set total = total + n;
	set n = n - 1;
end loop sum;
```

### 游标

游标(cursor)是存储查询结果集的数据类型，可对游标进行循环的处理

- 声明游标 `declare 游标名称 cursor for 查询语句;`
- 打开游标 `open 游标名称;`
- 获取游标记录 `fetch 游标名称 into 变量[,变量];`
- 关闭游标 `close 游标名称;`

### 条件处理程序

条件处理程序(handler) 用来定义在流程控制结构中遇到问题时处理相应的步骤

`DECLARE handler_action HANDLER FOR condition_value [,condition_value]... statement;`

- handler_action
  - CONTINUE
  - EXIT
- condition_value
  - SQLSTATE sqlstate_value: 状态码，如 02000
  - SQLWARNING：所有以 01 开头的 SQLSTATE 代码的简写
  - NOT FOUND：所有以 02 开头的 SQLSTATE 代码的简写
  - SQLEXCEPTION：没有被 SQLWARNING 和 NOT FOUND 捕获的代码的简写

```sql
-- 查询表中 age <= uage 的用户的姓名和专业
-- 将查询结果插入创建的新表 (id,name,profession)中

create procedure test(in uage int)
begin
	declare uname varchar(100);
	declare upro varchar(100);
	declare u_cursor cursor for select name,profession from tb_user where age <= uage;
	declare exit handler for NOT FOUND close u_cursor;
	
	drop table if exists tb_user_pro;
	create table if not exists tb_user_pro(
    	id int primary key auto_increment;
        name varchar(100),
        profession varchar(100)
    )
    
	open u_cursor;
	while true do
		fetch u_cursor into uname,upro;
		insert into tb_user_pro values(null,uname,upro);
	end while;
	close u_cursor;
end;
```

## 存储函数

存储函数时有返回值的存储函数，参数只能是 IN 类型

characteristic:

- DETERMINISTIC: 相同的输入参数总是产生相同的结果
- NO SQL：不包含 SQL 语句
- READS SQL DATA：包含读取数据的语句，但不包含写入数据的语句

```sql
CREATE FUNCTION 存储函数名称([参数列表])
RETURNS type [characteristic...]
BEGIN
	SQL 语句
	RETURN ...;
END;

-- 例子
create function fun1(n int) 
returns int deterministic
begin
	declare total int default 0;
	
	while n > 0 do
		set total = total = n;
		set n = n - 1;
	end while;
	return total;
end;

select fun1(100);
```

## 触发器

- 触发器是数据表在 insert/update/delete 之前或之后，除法并执行触发器中定义的 SQL 语句集合；

- 可以在数据库端保障数据库的完整性，日记记录，数据校验等操作；
- 别名 OLD 和 NEW 用来数据库内容的变化
- 只支持行级触发，即每一行改变都会触发一次，而不是一堆 SQL 语句集合触发一次

| 触发器类型 | NEW 和 OLD                            |
| ---------- | ------------------------------------- |
| insert     | new 为插入的数据                      |
| update     | new 为更新后的数据，old 为更新前的数据 |
| delete     | old 为删除的数据                      |

### 语法

- 创建

```mysql
CREATE TRIGGER trigger_name
BEFORE/AFTER INSERT/UPDATE/DELETE
ON tbl_name FOR EACH ROW --行级触发器
BEGIN
	trigger_stmt;
END
```

- 查看：`SHOW TRIGGERS;`
- 删除：`DROP TRIGGER [schema_name.]trigger_name;`(默认当前数据库)

```mysql
-- 需求：通过触发器记录user表的数据变更日志(user_logs)
create table user_logs(
	id int(11) primary key auto_increment,
    operation varchar(20) not null,
    operate_time datetime not null,
    operate_id int(11) not null,
    operate_params varchar(500)
)engine=innodb default charset=utf8;


create trigger tb_user_insert_trigger
	after insert on tb_user for each row
begin
	insert into user_logs(id,operation,operate_time,operate_id,operate_params) 
	VALUES (null,'insert',now(),new.id,concat('插入数据：id=',new.id,',name=',new.name,',phone',new.phone));
end;

show triggers;

drop trigger tb_user_insert_trigger;
```

## 锁

### 全局锁

整个数据库加锁，后续的 DML，DDL 语句，已经更新操作的事务提交语句都会阻塞，查询可用

应用场景：做全库的逻辑备份

- 加锁：`flush tables with read lock;`
- 解锁：`unlock tables;`
- 备份(win 命令)：`mysqldump -uroot -p123456 [table_name] > [path.sql];`

> 在 InnoDB 引擎中，备份可以使用下面命令来实现数据一致性备份：
>
> `mysqldump --single-transaction -uroot -p123456 [table_name] > [path.sql];`

### 表级锁

#### 表锁

- 表共享读锁(read lock)：当前客户端 **只读不写**，其他客户端 **可读**，**写** 操作会 **阻塞** 到 unlock
- 表独占写锁(write lock)：当前客户端 **可写可读**，其他客户端 **读写** 操作都会 **阻塞** 到 unlock

语法：

- 加锁：`lock tables 表名... read/write;`
- 解锁：`unlock tables; / 客户端断开连接`

#### 元数据锁

元数据锁((meta data lock/MDL)加锁是系统自动控制，在访问表时自动加上，保证表有事务时不能改变表的结构，即 **避免 DML 和 DDL 的冲突**。

#### 意向锁

