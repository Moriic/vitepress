import{_ as e,c as t,o as a,a4 as i}from"./chunks/framework.DpC1ZpOZ.js";const y=JSON.parse('{"title":"MySQL","description":"","frontmatter":{},"headers":[],"relativePath":"Interview/DataBase/MySQL.md","filePath":"Interview/DataBase/MySQL.md"}'),o={name:"Interview/DataBase/MySQL.md"},s=i(`<h1 id="mysql" tabindex="-1">MySQL <a class="header-anchor" href="#mysql" aria-label="Permalink to &quot;MySQL&quot;">​</a></h1><h2 id="mysql-基础" tabindex="-1">MySQL 基础 <a class="header-anchor" href="#mysql-基础" aria-label="Permalink to &quot;MySQL 基础&quot;">​</a></h2><h3 id="关系型数据库" tabindex="-1">关系型数据库 <a class="header-anchor" href="#关系型数据库" aria-label="Permalink to &quot;关系型数据库&quot;">​</a></h3><p>建立在关系模型上的数据库(一对一，一对多，多对多)</p><h2 id="mysql-字段类型" tabindex="-1">MySQL 字段类型 <a class="header-anchor" href="#mysql-字段类型" aria-label="Permalink to &quot;MySQL 字段类型&quot;">​</a></h2><ul><li><strong>数值类型</strong>：整型(tinyint, smallint, mediumint, int, bigint)，浮点型(float, double)，定点型(decimal)</li><li><strong>字符串类型</strong>：char, varchar, tinytext, text, mediumtext, longtext, tinyblob, blob, mediumblob, longblob</li><li><strong>日期类型</strong>：year, time, date, datetime, timestamp</li></ul><h3 id="char-vs-varchar" tabindex="-1">char vs varchar <a class="header-anchor" href="#char-vs-varchar" aria-label="Permalink to &quot;char vs varchar&quot;">​</a></h3><ul><li><p>char 是定长字符串，varchar 是变长字符串。</p></li><li><p>char 在存储时会在右边填充空格以达到指定的长度，检索时去掉空格，varchar 在存储时需要额外的 1 或 2 个字节记录字符串的长度，检索时不需要处理</p></li><li><p>char 更适合存储长度较短或长度差不多的字符串，varchar 适合存储长度不确定或差异大的字符串</p></li></ul><h3 id="datetime-vs-timestamp" tabindex="-1">datetime vs timestamp <a class="header-anchor" href="#datetime-vs-timestamp" aria-label="Permalink to &quot;datetime vs timestamp&quot;">​</a></h3><ul><li><p>datetime 没有时区信息，timestamp 与时区有关，会根据时区改变时间</p></li><li><p>datetime 需要 8 个字节，timestamp4 个字节</p></li></ul><h3 id="null-vs" tabindex="-1">NULL vs &#39;&#39; <a class="header-anchor" href="#null-vs" aria-label="Permalink to &quot;NULL vs &#39;&#39;&quot;">​</a></h3><ul><li><code>NULL</code> 代表一个不确定的值, 就算是两个 <code>NULL</code>, 它俩也不一定相等。例如，<code>SELECT NULL=NULL</code> 的结果为 false，但是在我们使用 <code>DISTINCT</code>, <code>GROUP BY</code>, <code>ORDER BY</code> 时, <code>NULL</code> 又被认为是相等的。</li><li><code>&#39;&#39;</code> 的长度是 0，是不占用空间的，而 <code>NULL</code> 是需要占用空间的。</li><li><code>NULL</code> 会影响聚合函数的结果。例如，<code>SUM</code>、<code>AVG</code>、<code>MIN</code>、<code>MAX</code> 等聚合函数会忽略 <code>NULL</code> 值。 <code>COUNT</code> 的处理方式取决于参数的类型。如果参数是 <code>*</code>(<code>COUNT(*)</code>)，则会统计所有的记录数，包括 <code>NULL</code> 值；如果参数是某个字段名(<code>COUNT(列名)</code>)，则会忽略 <code>NULL</code> 值，只统计非空值的个数。</li><li>查询 <code>NULL</code> 值时，必须使用 <code>IS NULL</code> 或 <code>IS NOT NULLl</code> 来判断，而不能使用 =、!=、 &lt;、&gt; 之类的比较运算符。而 <code>&#39;&#39;</code> 是可以使用这些比较运算符的</li></ul><h2 id="mysql-基础架构" tabindex="-1">MySQL 基础架构 <a class="header-anchor" href="#mysql-基础架构" aria-label="Permalink to &quot;MySQL 基础架构&quot;">​</a></h2><img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711774066_0.png" alt="13526879-3037b144ed09eb88" style="zoom:67%;"><ul><li><strong>连接器：</strong> 身份认证和权限相关(登录 MySQL 的时候)。</li><li><strong>查询缓存：</strong> 执行查询语句的时候，会先查询缓存(MySQL 8.0 版本后移除，因为这个功能不太实用)。</li><li><strong>分析器：</strong> 没有命中缓存的话，SQL 语句就会经过分析器，分析器说白了就是要先看你的 SQL 语句要干嘛，再检查你的 SQL 语句语法是否正确。</li><li><strong>优化器：</strong> 按照 MySQL 认为最优的方案去执行</li><li><strong>执行器：</strong> 执行语句，然后从存储引擎返回数据</li></ul><p><img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711785332_0.png" alt="13526879-3037b144ed09eb88"></p><ul><li><strong>连接器：</strong> 身份认证和权限相关(登录 MySQL 的时候)。</li><li><strong>查询缓存：</strong> 执行查询语句的时候，会先查询缓存(MySQL 8.0 版本后移除，因为这个功能不太实用)。</li><li><strong>分析器：</strong> 没有命中缓存的话，SQL 语句就会经过分析器，分析器说白了就是要先看你的 SQL 语句要干嘛，再检查你的 SQL 语句语法是否正确。</li><li><strong>优化器：</strong> 按照 MySQL 认为最优的方案去执行。</li><li><strong>执行器：</strong> 执行语句，然后从存储引擎返回数据。</li></ul><p>简单来说 MySQL 主要分为 Server 层和存储引擎层：</p><ul><li><strong>Server 层</strong>：主要包括连接器、查询缓存、分析器、优化器、执行器等，所有跨存储引擎的功能都在这一层实现，比如存储过程、触发器、视图，函数等，还有一个通用的日志模块 binlog 日志模块。</li><li><strong>存储引擎</strong>：主要负责数据的存储和读取，采用可以替换的插件式架构，支持 InnoDB、MyISAM、Memory 等多个存储引擎，其中 InnoDB 引擎有自有的日志模块 redolog 模块。<strong>现在最常用的存储引擎是 InnoDB，它从 MySQL 5.5 版本开始就被当做默认存储引擎了</strong></li></ul><h3 id="连接器" tabindex="-1">连接器 <a class="header-anchor" href="#连接器" aria-label="Permalink to &quot;连接器&quot;">​</a></h3><p>​ 主要 <strong>负责用户登录数据库，进行用户的身份认证，包括校验账户密码，权限等操作</strong>，如果用户账户密码已通过，连接器会到权限表中查询该用户的所有权限，之后在这个连接里的权限逻辑判断都是会依赖此时读取到的权限数据，也就是说，后续只要这个连接不断开 <strong>，即使管理员修改了该用户的权限，该用户也是不受影响的</strong>。</p><h3 id="查询缓存-8-0-后移除" tabindex="-1">查询缓存(8.0 后移除) <a class="header-anchor" href="#查询缓存-8-0-后移除" aria-label="Permalink to &quot;查询缓存(8.0 后移除)&quot;">​</a></h3><p>查询缓存主要用来缓存我们所执行的 SELECT 语句以及该语句的结果集。</p><p>连接建立后，执行查询语句的时候，会先查询缓存，MySQL 会先校验这个 SQL 是否执行过，以 Key-Value 的形式缓存在内存中，Key 是查询语句，Value 是结果集。如果缓存 key 被命中，就会直接返回给客户端，如果没有命中，就会执行后续的操作，完成后也会把结果缓存起来，方便下一次调用。当然在真正执行缓存查询的时候还是会校验用户的权限，是否有该表的查询条件。</p><p>MySQL 查询不建议使用缓存，因为查询缓存失效在实际业务场景中可能会非常频繁，假如你对一个表更新的话，这个表上的所有的查询缓存都会被清空。对于不经常更新的数据来说，使用缓存还是可以的。</p><h3 id="分析器" tabindex="-1">分析器 <a class="header-anchor" href="#分析器" aria-label="Permalink to &quot;分析器&quot;">​</a></h3><p>分析器主要是用来分析 SQL 语句是来干嘛的，分析器也会分为几步：</p><ol><li><strong>词法分析</strong>，一条 SQL 语句有多个字符串组成，首先要提取关键字，比如 select，提出查询的表，提出字段名，提出查询条件等等。做完这些操作后，就会进入第二步。</li><li><strong>语法分析</strong>，主要就是判断你输入的 SQL 是否正确，是否符合 MySQL 的语法。</li></ol><h3 id="优化器" tabindex="-1">优化器 <a class="header-anchor" href="#优化器" aria-label="Permalink to &quot;优化器&quot;">​</a></h3><p>化器的作用就是它认为的最优的执行方案去执行(有时候可能也不是最优)</p><h3 id="执行器" tabindex="-1">执行器 <a class="header-anchor" href="#执行器" aria-label="Permalink to &quot;执行器&quot;">​</a></h3><p>当选择了执行方案后，MySQL 就准备开始执行了，首先执行前会校验该用户有没有权限，如果没有权限，就会返回错误信息，如果有权限，就会去调用引擎的接口，返回接口执行的结果</p><h3 id="执行流程" tabindex="-1">执行流程 <a class="header-anchor" href="#执行流程" aria-label="Permalink to &quot;执行流程&quot;">​</a></h3><p><code>select * from tb_student A where A.age=&#39;18&#39; and A.name=&#39; 张三 &#39;;</code></p><ol><li>检查权限，检查缓存(8.0 前)</li><li>词法分析，提取 SQL 语句的关键元素，语法分析，是否有语法错误</li><li>优化器，选择最优的方案准备执行</li><li>权限校验，调用数据库引擎执行结果</li></ol><p><code>update tb_student A set A.age=&#39;19&#39; where A.name=&#39; 张三 &#39;;</code></p><p>执行更新要记录日志，日志模块 binlog(归档日志)，InnoDB 引擎还自带 redo log(重做日志)</p><ol><li>查询张三的数据</li><li>拿到查询的语句，把 age 改为 19，调用引擎写入这行数据，InnoDB 引擎把数据保存在内存中，同时记录 redo log，此时 redo log 进入 prepare 状态，然后告诉执行器，执行完成，随时可以提交</li><li>执行器收到通知后记录 binlog，调用引擎接口，提交 redo log 为提交状态</li></ol><p>为什么要两个日志：redo log 来支持事务</p><p>为什么 redo log 要引入 prepare 预提交状态：</p><ul><li>先写 redo log 直接提交，然后写 binlog：写完 redo log 后机器挂了，binlog 日志没写入，重启后，使用 redo log 恢复数据，binlog 没有该记录，后续备份会丢失该记录，主从同步也会丢失</li><li>先写 binlog，后写 redo log：写完 binlog 后机器异常重启，redo log 不会恢复，而 binlog 有记录，会数据不一致</li><li>两个阶段，redo log 处于 prepare 状态，写完 binlog 后，若异常重启，MySQL 判断 redo log 是否完整，则提交，如果 redo log 处于 prepare 状态，先判断 binlog 是否完整，完整则提交 redo log，不完整就回滚数据</li></ul><h3 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h3><ul><li>MySQL 主要分为 <strong>Server 层和引擎层</strong>，Server 层主要包括 <strong>连接器、查询缓存、分析器、优化器、执行器</strong>，同时还有一个日志模块(binlog)，这个日志模块所有执行引擎都可以共用，redolog 只有 InnoDB 有。</li><li>引擎层是插件式的，目前主要包括，MyISAM, InnoDB, Memory 等。</li><li><strong>查询语句</strong> 的执行流程如下：<strong>权限校验(如果命中缓存) ---&gt; 查询缓存 ---&gt; 分析器 ---&gt; 优化器 ---&gt; 权限校验 ---&gt; 执行器 ---&gt; 引擎</strong></li><li><strong>更新语句</strong> 执行流程如下：<strong>分析器 ---&gt; 权限校验 ---&gt; 执行器 ---&gt; 引擎 ---&gt; redo log(prepare 状态)---&gt; binlog ---&gt; redo log(commit 状态)</strong></li></ul><h2 id="mysql-存储引擎" tabindex="-1">MySQL 存储引擎 <a class="header-anchor" href="#mysql-存储引擎" aria-label="Permalink to &quot;MySQL 存储引擎&quot;">​</a></h2><p>MySQL 5.5.5 之前，MyISAM 是 MySQL 的默认存储引擎。5.5.5 版本之后，InnoDB 是 MySQL 的默认存储引擎。</p><img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711865530_0.png" alt="image-20240331141210191" style="zoom:67%;"><h3 id="mysql-存储引擎架构" tabindex="-1">MySQL 存储引擎架构 <a class="header-anchor" href="#mysql-存储引擎架构" aria-label="Permalink to &quot;MySQL 存储引擎架构&quot;">​</a></h3><p>采用插件式架构，支持多种存储引擎，基于表而不是数据库</p><h3 id="myisam-vs-innodb" tabindex="-1">MyISAM vs InnoDB <a class="header-anchor" href="#myisam-vs-innodb" aria-label="Permalink to &quot;MyISAM vs InnoDB&quot;">​</a></h3><ul><li>InnoDB 支持 <strong>行级别的锁粒度</strong>，MyISAM 不支持，只支持 <strong>表级别的锁粒度</strong>。</li><li>MyISAM 不提供事务支持。InnoDB 提供事务支持，实现了 SQL 标准定义了四个隔离级别，具有提交和回滚事务的能力，InnoDB 默认使用的 REPEATABLE-READ(可重读)隔离级别是可以解决幻读问题的(基于 MVCC 和 Next-Key Lock)</li><li>MyISAM 不支持外键，而 InnoDB 支持。</li><li>MyISAM 不支持 MVCC，而 InnoDB 支持。</li><li>虽然 MyISAM 引擎和 InnoDB 引擎都是使用 B+Tree 作为索引结构，但是两者的实现方式不太一样，<strong>InnoDB 中数据文件本身就是索引文件，B+树的叶节点保存了完整的数据，而 MyISAM 索引文件和数据文件分离。</strong></li><li>MyISAM 不支持数据库异常崩溃后的安全恢复，而 InnoDB 支持，依赖于 redo log。</li><li>InnoDB 的性能比 MyISAM 更强大</li></ul><blockquote><p>MyISAM 引擎中，B+Tree 叶节点的 data 域存放的是数据记录的地址。在索引检索的时候，首先按照 B+Tree 搜索算法搜索索引，如果指定的 Key 存在，则取出其 data 域的值，然后 <strong>以 data 域的值为地址读取相应的数据记录</strong>。这被称为“<strong>非聚簇索引（非聚集索引）</strong>”。</p><p>InnoDB 引擎中，其数据文件本身就是索引文件。相比 MyISAM，索引文件和数据文件是分离的，其表数据文件本身就是按 B+Tree 组织的一个索引结构，树的叶节点 data 域保存了完整的数据记录。这个索引的 key 是数据表的主键，因此 InnoDB 表数据文件本身就是主索引。这被称为“<strong>聚簇索引（聚集索引）</strong>”，而其余的索引都作为 <strong>辅助索引</strong> ，辅助索引的 data 域存储相应记录主键的值而不是地址，这也是和 MyISAM 不同的地方。在根据主索引搜索时，直接找到 key 所在的节点即可取出数据；在根据辅助索引查找时，则需要先取出主键的值，再走一遍主索引。 因此，在设计表的时候，不建议使用过长的字段作为主键，也不建议使用非单调的字段作为主键，这样会造成主索引频繁分裂。</p><p><strong>InnoDB 的 B+树主键索引的叶子节点就是数据文件，辅助索引的叶子节点是主键的值；而 MyISAM 的 B+树主键索引和辅助索引的叶子节点都是数据文件的地址指针。</strong></p></blockquote><h2 id="mysql-索引" tabindex="-1">MySQL 索引 <a class="header-anchor" href="#mysql-索引" aria-label="Permalink to &quot;MySQL 索引&quot;">​</a></h2><h3 id="介绍" tabindex="-1">介绍 <a class="header-anchor" href="#介绍" aria-label="Permalink to &quot;介绍&quot;">​</a></h3><p>索引是用于快速查询和检索数据的数据结构，常见的索引结构：B 树，B+树，Hash，红黑树。</p><p>InnoDB 和 MyISAM 都使用 B+树作为索引结构</p><h3 id="优缺点" tabindex="-1">优缺点 <a class="header-anchor" href="#优缺点" aria-label="Permalink to &quot;优缺点&quot;">​</a></h3><ul><li><strong>优点</strong>：<strong>加快检索速度</strong>，创建唯一性索引，<strong>保证每一行数据的唯一性</strong></li><li><strong>缺点</strong>：创建和维护索引 <strong>耗费时间</strong>，索引需要物理文件存储，<strong>耗费空间</strong></li></ul><h3 id="hash-索引" tabindex="-1">Hash 索引 <a class="header-anchor" href="#hash-索引" aria-label="Permalink to &quot;Hash 索引&quot;">​</a></h3><p>使用键值对存储，冲突一般使用链地址法/红黑树，<strong>速度快，但不支持范围查询/排序，每次 IO 只能取一个</strong></p><p>MySQL 的 InnoDB 存储引擎不直接支持常规的哈希索引，但是，InnoDB 存储引擎中存在一种特殊的“自适应哈希索引”（Adaptive Hash Index），自适应哈希索引并不是传统意义上的纯哈希索引，而是结合了 B+Tree 和哈希索引的特点，以便更好地适应实际应用中的数据访问模式和性能需求。自适应哈希索引的每个哈希桶实际上是一个小型的 B+Tree 结构。这个 B+Tree 结构可以存储多个键值对，而不仅仅是一个键。这有助于减少哈希冲突链的长度，提高了索引的效率。关于 Adaptive Hash Index 的详细介绍，可以查看 <a href="https://mp.weixin.qq.com/s/ra4v1XR5pzSWc-qtGO-dBg" target="_blank" rel="noreferrer">MySQL 各种“Buffer”之 Adaptive Hash Index</a></p><blockquote><p><strong>在 MySQL 运行的过程中，如果 InnoDB 发现，有很多寻路很长（比如 B+树层数太多、回表次数多等情况）的 SQL，并且有很多 SQL 会命中相同的页面（Page）的话，InnoDB 会在自己的内存缓冲区（Buffer Pool）里，开辟一块区域，建立自适应哈希索引（Adaptive Hash Index，AHI），以加速查询。</strong></p></blockquote><h3 id="二叉查找树" tabindex="-1">二叉查找树 <a class="header-anchor" href="#二叉查找树" aria-label="Permalink to &quot;二叉查找树&quot;">​</a></h3><ul><li>左节点 &lt; 根节点 &lt; 右节点</li><li>查询效率可能退化为 O(N)</li></ul><h3 id="平衡二叉树-avl" tabindex="-1">平衡二叉树(AVL) <a class="header-anchor" href="#平衡二叉树-avl" aria-label="Permalink to &quot;平衡二叉树(AVL)&quot;">​</a></h3><ul><li>二叉查找树 + 左右子树高度差不超过 1</li><li>查找、插入和删除在平均和最坏情况下的时间复杂度都是 O(logn)</li></ul><h3 id="b-树-和-b-树" tabindex="-1">B 树 和 B+树 <a class="header-anchor" href="#b-树-和-b-树" aria-label="Permalink to &quot;B 树 和 B+树&quot;">​</a></h3><p>B 树也称 B-树, 全称为 <strong>多路平衡查找树</strong> ，B+ 树是 B 树的一种变体</p><ul><li>B 树的所有节点 <strong>既存放键(key) 也存放数据(data)</strong>，而 B+树只 <strong>有叶子节点存放 key 和 data</strong>，其他内节点只存放 key。</li><li>B 树的叶子节点都是 <strong>独立</strong> 的; B+树的叶子节点是 <strong>双向链表</strong>。</li><li>B 树的检索的过程相当于对范围内的每个节点的关键字做二分查找，<strong>可能还没有到达叶子节点，检索就结束了</strong>。而 B+树的检索效率就很稳定了，<strong>任何查找都是从根节点到叶子节点的过程</strong>，叶子节点的顺序检索很明显。</li><li>在 B 树中进行范围查询时，<strong>首先找到要查找的下限，然后对 B 树进行中序遍历，直到找到查找的上限</strong>；而 B+树的范围查询，<strong>只需要对链表进行遍历即可</strong>。</li></ul><p>综上，B+树与 B 树相比，具备更少的 IO 次数、更稳定的查询效率和更适于范围查询这些优势。</p><h3 id="索引分类" tabindex="-1">索引分类 <a class="header-anchor" href="#索引分类" aria-label="Permalink to &quot;索引分类&quot;">​</a></h3><p>按照底层存储方式角度划分：</p><ul><li>聚簇索引（聚集索引）：索引结构和数据一起存放的索引，InnoDB 中的主键索引就属于聚簇索引。</li><li>非聚簇索引（非聚集索引）：索引结构和数据分开存放的索引，二级索引(辅助索引)就属于非聚簇索引。MySQL 的 MyISAM 引擎，不管主键还是非主键，使用的都是非聚簇索引。</li></ul><p>按照应用维度划分：</p><ul><li>主键索引：加速查询 + 列值唯一（不可以有 NULL）+ 表中只有一个。</li><li>普通索引：仅加速查询。</li><li>唯一索引：加速查询 + 列值唯一（可以有 NULL）。</li><li>覆盖索引：一个索引包含（或者说覆盖）所有需要查询的字段的值。</li><li>联合索引：多列值组成一个索引，专门用于组合搜索，其效率大于索引合并。</li><li>全文索引：对文本的内容进行分词，进行搜索。目前只有 <code>CHAR</code>、<code>VARCHAR</code> ，<code>TEXT</code> 列上可以创建全文索引。一般不会使用，效率较低，通常使用搜索引擎如 ElasticSearch 代替。</li></ul><h3 id="最左前缀匹配原则" tabindex="-1">最左前缀匹配原则 <a class="header-anchor" href="#最左前缀匹配原则" aria-label="Permalink to &quot;最左前缀匹配原则&quot;">​</a></h3><p>最左前缀匹配原则指的是在使用联合索引时，MySQL 会根据索引中的字段顺序，从左到右依次匹配查询条件中的字段。如果查询条件与索引中的最左侧字段相匹配，那么 MySQL 就会使用索引来过滤数据，这样可以提高查询效率。</p><p><strong>联合索引的最左匹配原则，在遇到范围查询（如 &gt;、&lt;）的时候，就会停止匹配，也就是范围查询的字段可以用到联合索引，但是在范围查询字段后面的字段无法用到联合索引。注意，对于 &gt; =、&lt;=、BETWEEN、like 前缀匹配的范围查询，并不会停止匹配。</strong></p><h2 id="mysql-事务" tabindex="-1">MySQL 事务 <a class="header-anchor" href="#mysql-事务" aria-label="Permalink to &quot;MySQL 事务&quot;">​</a></h2><ul><li><strong>原子性</strong>（<code>Atomicity</code>）：事务是最小的执行单位，不允许分割。事务的原子性确保 <strong>动作要么全部完成，要么完全不起作用；</strong></li><li><strong>一致性</strong>（<code>Consistency</code>）：执行 <strong>事务前后，数据保持一致</strong>，例如转账业务中，无论事务是否成功，转账者和收款人的总额应该是不变的；</li><li><strong>隔离性</strong>（<code>Isolation</code>）：并发访问数据库时，一个用户的事务不被其他事务所干扰，<strong>各并发事务之间数据库是独立</strong> 的；</li><li><strong>持久性</strong>（<code>Durability</code>）：一个事务被提交之后。它对数据库中数据的改变是持久的，<strong>即使数据库发生故障也不应该对其有任何影响</strong>。</li></ul><h3 id="并发事务问题" tabindex="-1">并发事务问题 <a class="header-anchor" href="#并发事务问题" aria-label="Permalink to &quot;并发事务问题&quot;">​</a></h3><h4 id="脏读" tabindex="-1">脏读 <a class="header-anchor" href="#脏读" aria-label="Permalink to &quot;脏读&quot;">​</a></h4><p>一个事务读取数据并且对数据进行了修改，这个修改对其他事务来说是可见的，即使当前事务没有提交。这时另外一个事务读取了这个还未提交的数据，但第一个事务突然回滚，导致数据并没有被提交到数据库，那第二个事务读取到的就是脏数据，这也就是脏读的由来。</p><p><img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711888508_0.png" alt="concurrency-consistency-issues-dirty-reading-tay_ZTbS"></p><h4 id="丢失修改" tabindex="-1">丢失修改 <a class="header-anchor" href="#丢失修改" aria-label="Permalink to &quot;丢失修改&quot;">​</a></h4><p>在一个事务读取一个数据时，另外一个事务也访问了该数据，那么在第一个事务中修改了这个数据后，第二个事务也修改了这个数据。这样第一个事务内的修改结果就被丢失，因此称为丢失修改。</p><p><img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711888550_0.png" alt="concurrency-consistency-issues-missing-modifications--KSMb8I4"></p><h4 id="不可重复读" tabindex="-1">不可重复读 <a class="header-anchor" href="#不可重复读" aria-label="Permalink to &quot;不可重复读&quot;">​</a></h4><p>指在一个事务内多次读同一数据。在这个事务还没有结束时，另一个事务也访问该数据。那么，在第一个事务中的两次读数据之间，由于第二个事务的修改导致第一个事务两次读取的数据可能不太一样。这就发生了在一个事务内两次读到的数据是不一样的情况，因此称为不可重复读。</p><p><img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711888590_0.png" alt="concurrency-consistency-issues-unrepeatable-read-EWLkE2b4"></p><h4 id="幻读" tabindex="-1">幻读 <a class="header-anchor" href="#幻读" aria-label="Permalink to &quot;幻读&quot;">​</a></h4><p>幻读与不可重复读类似。它发生在一个事务读取了几行数据，接着另一个并发事务插入了一些数据时。在随后的查询中，第一个事务就会发现多了一些原本不存在的记录，就好像发生了幻觉一样，所以称为幻读。</p><p><img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711888627_0.png" alt="concurrency-consistency-issues-phantom-read-_hE8nAqc"></p><h4 id="不可重复读-vs-幻读" tabindex="-1">不可重复读 vs 幻读 <a class="header-anchor" href="#不可重复读-vs-幻读" aria-label="Permalink to &quot;不可重复读 vs 幻读&quot;">​</a></h4><ul><li>不可重复读的重点是内容修改或者记录减少比如多次读取一条记录发现其中 <strong>某些记录的值被修改</strong>；</li><li>幻读的重点在于记录新增比如多次执行同一条查询语句（DQL）时，发现 <strong>查到的记录增加了</strong>。</li></ul><h3 id="并发事务控制" tabindex="-1">并发事务控制 <a class="header-anchor" href="#并发事务控制" aria-label="Permalink to &quot;并发事务控制&quot;">​</a></h3><p>MySQL 中并发事务的控制方式无非就两种：<strong>锁</strong> 和 <strong>MVCC</strong>。锁可以看作是悲观控制的模式，多版本并发控制（MVCC，Multiversion concurrency control）可以看作是乐观控制的模式。</p><h3 id="事务隔离级别" tabindex="-1">事务隔离级别 <a class="header-anchor" href="#事务隔离级别" aria-label="Permalink to &quot;事务隔离级别&quot;">​</a></h3><p>MySQL 标准定义了四个隔离级别：</p><ul><li><strong>READ-UNCOMMITTED(读取未提交)</strong> ：最低的隔离级别，<strong>允许读取尚未提交的数据变更</strong>，可能会导致脏读、幻读或不可重复读。</li><li><strong>READ-COMMITTED(读取已提交)</strong> ：允许读取并发事务已经提交的数据，<strong>可以阻止脏读</strong>，但是幻读或不可重复读仍有可能发生。</li><li><strong>REPEATABLE-READ(可重复读)</strong> ：对同一字段的 <strong>多次读取结果都是一致的</strong>，除非数据是被本身事务自己所修改，可以阻止脏读和不可重复读，但幻读仍有可能发生。</li><li><strong>SERIALIZABLE(可串行化)</strong> ：最高的隔离级别，完全服从 ACID 的隔离级别。所有的事务依次逐个执行，这样事务之间就完全不可能产生干扰，也就是说，该级别可以防止脏读、不可重复读以及幻读。</li></ul><table tabindex="0"><thead><tr><th style="text-align:center;">隔离级别</th><th style="text-align:center;">脏读</th><th style="text-align:center;">不可重复读</th><th style="text-align:center;">幻读</th></tr></thead><tbody><tr><td style="text-align:center;">READ-UNCOMMITTED</td><td style="text-align:center;">√</td><td style="text-align:center;">√</td><td style="text-align:center;">√</td></tr><tr><td style="text-align:center;">READ-COMMITTED</td><td style="text-align:center;">×</td><td style="text-align:center;">√</td><td style="text-align:center;">√</td></tr><tr><td style="text-align:center;">REPEATABLE-READ</td><td style="text-align:center;">×</td><td style="text-align:center;">×</td><td style="text-align:center;">√</td></tr><tr><td style="text-align:center;">SERIALIZABLE</td><td style="text-align:center;">×</td><td style="text-align:center;">×</td><td style="text-align:center;">×</td></tr></tbody></table><p>InnoDB 实现的 REPEATABLE-READ 隔离级别其实是可以解决幻读问题发生的，主要有下面两种情况：</p><ul><li><strong>快照读</strong>：由 MVCC 机制来保证不出现幻读。</li><li><strong>当前读</strong>：使用 Next-Key Lock 进行加锁来保证不出现幻读，Next-Key Lock 是行锁（Record Lock）和间隙锁（Gap Lock）的结合，行锁只能锁住已经存在的行，为了避免插入新行，需要依赖间隙锁。</li></ul><p>解决幻读：</p><ul><li><p>将事务隔离级别调整为 <code>SERIALIZABLE</code> 。</p></li><li><p>在可重复读的事务级别下，给事务操作的这张表添加表锁。</p></li><li><p>在可重复读的事务级别下，给事务操作的这张表添加 <code>Next-key Lock（Record Lock+Gap Lock）</code></p></li></ul><h2 id="mysql-锁" tabindex="-1">MySQL 锁 <a class="header-anchor" href="#mysql-锁" aria-label="Permalink to &quot;MySQL 锁&quot;">​</a></h2><h3 id="行级锁注意" tabindex="-1">行级锁注意 <a class="header-anchor" href="#行级锁注意" aria-label="Permalink to &quot;行级锁注意&quot;">​</a></h3><p>InnoDB 的 <strong>行锁是针对索引字段加的锁，表级锁是针对非索引字段加的锁</strong>。当我们执行 <code>UPDATE</code>、<code>DELETE</code> 语句时，如果 <code>WHERE</code> 条件中字段没有命中唯一索引或者索引失效的话，就会导致扫描全表对表中的所有行记录进行加锁。</p><h3 id="行锁分类" tabindex="-1">行锁分类 <a class="header-anchor" href="#行锁分类" aria-label="Permalink to &quot;行锁分类&quot;">​</a></h3><p>InnoDB 行锁是通过对索引数据页上的记录加锁实现的，MySQL InnoDB 支持三种行锁定方式：</p><ul><li><strong>记录锁（Record Lock）</strong>：也被称为记录锁，属于单个行记录上的锁。</li><li><strong>间隙锁（Gap Lock）</strong>：锁定一个范围，不包括记录本身。</li><li><strong>临键锁（Next-Key Lock）</strong>：Record Lock + Gap Lock，锁定一个范围，包含记录本身，主要目的是为了 <strong>解决幻读问题</strong>（MySQL 事务部分提到过）。记录锁只能锁住已经存在的记录 <strong>，为了避免插入新记录，需要依赖间隙锁</strong>。</li></ul><p>在 InnoDB 默认的隔离级别 REPEATABLE-READ 下，行锁默认使用的是 Next-Key Lock。但是，如果操作的索引是唯一索引或主键，InnoDB 会对 Next-Key Lock 进行优化，将其降级为 Record Lock，即仅锁住索引本身，而不是范围。</p><h3 id="共享锁和排它锁" tabindex="-1">共享锁和排它锁 <a class="header-anchor" href="#共享锁和排它锁" aria-label="Permalink to &quot;共享锁和排它锁&quot;">​</a></h3><p>不论是表级锁还是行级锁，都存在共享锁（Share Lock，S 锁）和排他锁（Exclusive Lock，X 锁）这两类：</p><ul><li><strong>共享锁（S 锁）</strong>：又称读锁，事务在读取记录的时候获取共享锁，允许多个事务同时获取（锁兼容）。</li><li><strong>排他锁（X 锁）</strong>：又称写锁/独占锁，事务在修改记录的时候获取排他锁，不允许多个事务同时获取。如果一个记录已经被加了排他锁，那其他事务不能再对这条事务加任何类型的锁（锁不兼容）。</li></ul><p>排他锁与任何的锁都不兼容，共享锁仅和共享锁兼容。</p><table tabindex="0"><thead><tr><th style="text-align:left;"></th><th style="text-align:left;">S 锁</th><th style="text-align:left;">X 锁</th></tr></thead><tbody><tr><td style="text-align:left;">S 锁</td><td style="text-align:left;">不冲突</td><td style="text-align:left;">冲突</td></tr><tr><td style="text-align:left;">X 锁</td><td style="text-align:left;">冲突</td><td style="text-align:left;">冲突</td></tr></tbody></table><p>由于 MVCC 的存在，对于一般的 <code>SELECT</code> 语句，InnoDB 不会加任何锁。不过， 你可以通过以下语句显式加共享锁或排他锁。</p><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># 共享锁 可以在 MySQL </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">7</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 和 MySQL </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 中使用</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">SELECT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ... LOCK </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">IN</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> SHARE MODE;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># 共享锁 可以在 MySQL </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 中使用</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">SELECT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ... </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">FOR</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> SHARE;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># 排他锁</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">SELECT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ... </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">FOR</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> UPDATE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><h3 id="意向锁" tabindex="-1">意向锁 <a class="header-anchor" href="#意向锁" aria-label="Permalink to &quot;意向锁&quot;">​</a></h3><p>如果需要 <strong>用到表锁的话，如何判断表中的记录没有行锁</strong> 呢，一行一行遍历肯定是不行，性能太差。我们需要用到一个叫做意向锁的东东来快速判断是否可以对某个表使用表锁。</p><p>意向锁是表级锁，共有两种：</p><ul><li><strong>意向共享锁（Intention Shared Lock，IS 锁）</strong>：事务有意向对表中的某些记录加共享锁（S 锁），加共享锁前必须先取得该表的 IS 锁。</li><li><strong>意向排他锁（Intention Exclusive Lock，IX 锁）</strong>：事务有意向对表中的某些记录加排他锁（X 锁），加排他锁之前必须先取得该表的 IX 锁。</li></ul><p><strong>意向锁是由数据引擎自己维护的，用户无法手动操作意向锁，在为数据行加共享/排他锁之前，InooDB 会先获取该数据行所在在数据表的对应意向锁。</strong></p><p>意向锁之间是互相兼容的。</p><table tabindex="0"><thead><tr><th></th><th>IS 锁</th><th>IX 锁</th></tr></thead><tbody><tr><td>IS 锁</td><td>兼容</td><td>兼容</td></tr><tr><td>IX 锁</td><td>兼容</td><td>兼容</td></tr></tbody></table><p>意向锁和共享锁和排它锁互斥（这里指的是 <strong>表级别的共享锁和排他锁</strong>，意向锁不会与行级的共享锁和排他锁互斥）。</p><table tabindex="0"><thead><tr><th></th><th>IS 锁</th><th>IX 锁</th></tr></thead><tbody><tr><td>S 锁</td><td>兼容</td><td>互斥</td></tr><tr><td>X 锁</td><td>互斥</td><td>互斥</td></tr></tbody></table><h3 id="当前读和快照读" tabindex="-1">当前读和快照读 <a class="header-anchor" href="#当前读和快照读" aria-label="Permalink to &quot;当前读和快照读&quot;">​</a></h3><p><strong>快照读</strong>（一致性非锁定读）就是单纯的 <code>SELECT</code> 语句，但不包括下面这两类 <code>SELECT</code> 语句：</p><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">SELECT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ... </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">FOR</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> UPDATE</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># 共享锁 可以在 MySQL </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">7</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 和 MySQL </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 中使用</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">SELECT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ... LOCK </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">IN</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> SHARE MODE;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># 共享锁 可以在 MySQL </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 中使用</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">SELECT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ... </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">FOR</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> SHARE;</span></span></code></pre></div><p>快照即记录的历史版本，每行记录可能存在多个历史版本（多版本技术）。</p><p>快照读的情况下，如果读取的记录正在执行 UPDATE/DELETE 操作，读取操作不会因此去等待记录上 X 锁的释放，而是会去读取行的一个快照。</p><p>只有在事务隔离级别 RC(读取已提交) 和 RR（可重读）下，InnoDB 才会使用一致性非锁定读：</p><ul><li>在 RC 级别下，对于快照数据，一致性非锁定读总是读取被锁定行的最新一份快照数据。</li><li>在 RR 级别下，对于快照数据，一致性非锁定读总是读取本事务开始时的行数据版本。</li></ul><p>快照读比较适合对于数据一致性要求不是特别高且追求极致性能的业务场景。</p><p><strong>当前读</strong> （一致性锁定读）就是给行记录加 X 锁或 S 锁。</p><p>当前读的一些常见 SQL 语句类型如下：</p><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># 对读的记录加一个X锁</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">SELECT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">...</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">FOR</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> UPDATE</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># 对读的记录加一个S锁</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">SELECT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">...LOCK </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">IN</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> SHARE MODE</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># 对读的记录加一个S锁</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">SELECT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">...</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">FOR</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> SHARE</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"># 对修改的记录加一个X锁</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">INSERT</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">...</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">UPDATE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">...</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">DELETE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">...</span></span></code></pre></div><h2 id="mysql-存储-ip-地址" tabindex="-1">MySQL 存储 IP 地址 <a class="header-anchor" href="#mysql-存储-ip-地址" aria-label="Permalink to &quot;MySQL 存储 IP 地址&quot;">​</a></h2><p>可以将 IP 地址转换成整形数据存储，性能更好，占用空间也更小。</p><p>MySQL 提供了两个方法来处理 ip 地址</p><ul><li><code>INET_ATON()</code>：把 ip 转为无符号整型 (4-8 位)</li><li><code>INET_NTOA()</code> : 把整型的 ip 转为地址</li></ul><p>插入数据前，先用 <code>INET_ATON()</code> 把 ip 地址转为整型，显示数据时，使用 <code>INET_NTOA()</code> 把整型的 ip 地址转为地址显示即可。</p><h2 id="mysql-日志" tabindex="-1">MySQL 日志 <a class="header-anchor" href="#mysql-日志" aria-label="Permalink to &quot;MySQL 日志&quot;">​</a></h2><ul><li>错误日志（error log） ：对 MySQL 的启动、运行、关闭过程进行了记录。</li><li>二进制日志（binary log，binlog） ：主要记录的是更改数据库数据的 SQL 语句。</li><li>一般查询日志（general query log） ：已建立连接的客户端发送给 MySQL 服务器的所有 SQL 记录，因为 SQL 的量比较大，默认是不开启的，也不建议开启。</li><li>慢查询日志（slow query log） ：执行时间超过 long_query_time秒钟的查询，解决 SQL 慢查询问题的时候会用到。</li><li>事务日志(redo log 和 undo log) ：redo log 是重做日志，undo log 是回滚日志。</li><li>中继日志(relay log) ：relay log 是复制过程中产生的日志，很多方面都跟 binary log 差不多。不过，relay log 针对的是主从复制中的从库。</li><li>DDL 日志(metadata log) ：DDL 语句执行的元数据操作</li></ul><h3 id="慢日志" tabindex="-1">慢日志 <a class="header-anchor" href="#慢日志" aria-label="Permalink to &quot;慢日志&quot;">​</a></h3><p>慢查询日志记录了执行时间超过 long_query_time（默认是 10s，通常设置为1s）的所有查询语句，在解决 SQL 慢查询（SQL 执行时间过长）问题的时候经常会用到。</p><p>找到慢 SQL 是优化 SQL 语句性能的第一步，然后再用EXPLAIN 命令可以对慢 SQL 进行分析，获取<a href="https://javaguide.cn/database/mysql/mysql-query-execution-plan.html" target="_blank" rel="noreferrer">执行计划</a>的相关信息。</p><p>你可以通过 show variables like &quot;slow_query_log&quot;;命令来查看慢查询日志是否开启，默认是关闭的。</p><h3 id="redo-log" tabindex="-1">redo log <a class="header-anchor" href="#redo-log" aria-label="Permalink to &quot;redo log&quot;">​</a></h3><p>redo logo 是 InnoDB 独有的，让 MySQL 有了崩溃恢复能力</p><p><code>MySQL</code> 中数据是以页为单位，你查询一条记录，会从硬盘把一页的数据加载出来，加载出来的数据叫数据页，会放入到 <code>Buffer Pool</code> 中。</p><p>后续的查询都是先从 <code>Buffer Pool</code> 中找，没有命中再去硬盘加载，减少硬盘 <code>IO</code> 开销，提升性能。</p><p>更新表数据的时候，也是如此，发现 <code>Buffer Pool</code> 里存在要更新的数据，就直接在 <code>Buffer Pool</code> 里更新。</p><p>然后会把“在某个数据页上做了什么修改”记录到重做日志缓存（<code>redo log buffer</code>）里，接着刷盘到 <code>redo log</code> 文件里。</p><img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711958650_0.png" alt="03" style="zoom:50%;"><p>理想情况，事务一提交就会进行刷盘操作，但实际上，刷盘的时机是根据策略来进行的。</p><blockquote><p>小贴士：每条 redo 记录由“表空间号+数据页号+偏移量+修改数据长度+具体修改的数据”组成</p></blockquote><h4 id="刷盘时机" tabindex="-1">刷盘时机 <a class="header-anchor" href="#刷盘时机" aria-label="Permalink to &quot;刷盘时机&quot;">​</a></h4><p>InnoDB 将 redo log 刷到磁盘上有几种情况：</p><ol><li>事务提交：当事务提交时，log buffer 里的 redo log 会被刷新到磁盘（可以通过 <code>innodb_flush_log_at_trx_commit</code> 参数控制，后文会提到）。</li><li>log buffer 空间不足时：log buffer 中缓存的 redo log 已经占满了 log buffer 总容量的大约一半左右，就需要把这些日志刷新到磁盘上。</li><li>事务日志缓冲区满：InnoDB 使用一个事务日志缓冲区（transaction log buffer）来暂时存储事务的重做日志条目。当缓冲区满时，会触发日志的刷新，将日志写入磁盘。</li><li>Checkpoint（检查点）：InnoDB 定期会执行检查点操作，将内存中的脏数据（已修改但尚未写入磁盘的数据）刷新到磁盘，并且会将相应的重做日志一同刷新，以确保数据的一致性。</li><li>后台刷新线程：InnoDB 启动了一个后台线程，负责周期性（每隔 1 秒）地将脏页（已修改但尚未写入磁盘的数据页）刷新到磁盘，并将相关的重做日志一同刷新。</li><li>正常关闭服务器：MySQL 关闭的时候，redo log 都会刷入到磁盘里去。</li></ol><img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711959020_0.png" alt="05" style="zoom:50%;"><p><strong>为什么使用 redo log 刷盘，不使用数据页刷盘？</strong></p><p>实际上，数据页大小是 <code>16KB</code>，刷盘比较耗时，可能就修改了数据页里的几 <code>Byte</code> 数据，有必要把完整的数据页刷盘吗？</p><p>而且数据页刷盘是随机写，因为一个数据页对应的位置可能在硬盘文件的随机位置，所以性能是很差。</p><p>如果是写 <code>redo log</code>，一行记录可能就占几十 <code>Byte</code>，只包含表空间号、数据页号、磁盘文件偏移 量、更新值，再加上是顺序写，所以刷盘速度很快。</p><p>所以用 <code>redo log</code> 形式记录修改内容，性能会远远超过刷数据页的方式，这也让数据库的并发能力更强。</p><h3 id="binlog" tabindex="-1">binlog <a class="header-anchor" href="#binlog" aria-label="Permalink to &quot;binlog&quot;">​</a></h3><p><code>redo log</code> 它是物理日志，记录内容是“在某个数据页上做了什么修改”，属于 <code>InnoDB</code> 存储引擎。</p><p>而 <code>binlog</code> 是逻辑日志，记录内容是语句的原始逻辑，类似于“给 ID = 2 这一行的 c 字段加 1”，属于 <code>MySQL Server</code> 层。</p><p>不管用什么存储引擎，只要发生了表数据更新，都会产生 <code>binlog</code> 日志。</p><p>那 <code>binlog</code> 到底是用来干嘛的？</p><p>可以说 <code>MySQL</code> 数据库的 <strong>数据备份、主备、主主、主从</strong> 都离不开 <code>binlog</code>，需要依靠 <code>binlog</code> 来同步数据，保证数据一致性。</p><img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711959241_0.png" alt="01-20220305234724956" style="zoom:50%;"><p><code>binlog</code> 日志有三种格式，可以通过 <code>binlog_format</code> 参数指定。</p><ul><li><strong>statement：</strong> SQL 原文，如 <code>update T set update_time=now() where id=1</code>，可能导致数据不一致 now()</li><li><strong>row</strong>：记录具体值和原始值，如 <code>update_time=1627112756247</code></li><li><strong>mixed</strong>：混合，判断这条 <code>SQL</code> 语句是否可能引起数据不一致，如果是，就用 <code>row</code> 格式，否则就用 <code>statement</code> 格式。</li></ul><h4 id="写入时机" tabindex="-1">写入时机 <a class="header-anchor" href="#写入时机" aria-label="Permalink to &quot;写入时机&quot;">​</a></h4><p><code>binlog</code> 的写入时机也非常简单，事务执行过程中，先把日志写到 <code>binlog cache</code>，事务提交的时候，再把 <code>binlog cache</code> 写到 <code>binlog</code> 文件中。</p><p>因为一个事务的 <code>binlog</code> 不能被拆开，无论这个事务多大，也要确保一次性写入，所以系统会给每个线程分配一个块内存作为 <code>binlog cache</code>。</p><p>我们可以通过 <code>binlog_cache_size</code> 参数控制单个线程 binlog cache 大小，如果存储内容超过了这个参数，就要暂存到磁盘（<code>Swap</code>）。</p><p><code>binlog</code> 日志刷盘流程如下</p><img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711959483_0.png" alt="04-20220305234747840" style="zoom:50%;"><h3 id="两阶段提交" tabindex="-1">两阶段提交 <a class="header-anchor" href="#两阶段提交" aria-label="Permalink to &quot;两阶段提交&quot;">​</a></h3><p><code>redo log</code>（重做日志）让 <code>InnoDB</code> 存储引擎拥有了崩溃恢复能力。</p><p><code>binlog</code>（归档日志）保证了 <code>MySQL</code> 集群架构的数据一致性。</p><p>虽然它们都属于持久化的保证，但是侧重点不同。</p><p>在执行更新语句过程，会记录 <code>redo log</code> 与 <code>binlog</code> 两块日志，以基本的事务为单位，<code>redo log</code> <strong>在事务执行过程中</strong> 可以不断写入，而 <code>binlog</code> 只有在 <strong>提交事务时</strong> 才写入，所以 <code>redo log</code> 与 <code>binlog</code> 的写入时机不一样。</p><h4 id="出现问题" tabindex="-1">出现问题 <a class="header-anchor" href="#出现问题" aria-label="Permalink to &quot;出现问题&quot;">​</a></h4><p>我们以 <code>update</code> 语句为例，假设 <code>id=2</code> 的记录，字段 <code>c</code> 值是 <code>0</code>，把字段 <code>c</code> 值更新成 <code>1</code>，<code>SQL</code> 语句为 <code>update T set c=1 where id=2</code>。</p><p><strong>假设执行过程中写完 <code>redo log</code> 日志后，<code>binlog</code> 日志写期间发生了异常，会出现什么情况呢？</strong></p><p>由于 <code>binlog</code> 没写完就异常，这时候 <code>binlog</code> 里面没有对应的修改记录。因此，之后用 <code>binlog</code> 日志恢复数据时，就会少这一次更新，恢复出来的这一行 <code>c</code> 值是 <code>0</code>，而原库因为 <code>redo log</code> 日志恢复，这一行 <code>c</code> 值是 <code>1</code>，最终数据不一致。</p><p>为了解决两份日志之间的逻辑一致问题，<code>InnoDB</code> 存储引擎使用 <strong>两阶段提交</strong> 方案。</p><p>原理很简单，将 <code>redo log</code> 的写入拆成了两个步骤 <code>prepare</code> 和 <code>commit</code>，这就是 <strong>两阶段提交</strong>。</p><img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711959859_0.png" alt="04-20220305234956774" style="zoom:50%;"><p>使用 <strong>两阶段提交</strong> 后，写入 <code>binlog</code> 时发生异常也不会有影响，因为 <code>MySQL</code> 根据 <code>redo log</code> 日志恢复数据时，发现 <code>redo log</code> 还处于 <code>prepare</code> 阶段，并且没有对应 <code>binlog</code> 日志，就会回滚该事务。</p><img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711959911_0.png" alt="05-20220305234937243" style="zoom:50%;"><p>再看一个场景，<code>redo log</code> 设置 <code>commit</code> 阶段发生异常，那会不会回滚事务呢？</p><img src="https://raw.githubusercontent.com/Moriic/picture/main/image/1711959979_0.png" alt="06-20220305234907651" style="zoom:50%;"><p>并不会回滚事务，它会执行上图框住的逻辑，虽然 <code>redo log</code> 是处于 <code>prepare</code> 阶段，但是能通过事务 <code>id</code> 找到对应的 <code>binlog</code> 日志，所以 <code>MySQL</code> 认为是完整的，就会提交事务恢复数据。</p><h3 id="undo-log" tabindex="-1">undo log <a class="header-anchor" href="#undo-log" aria-label="Permalink to &quot;undo log&quot;">​</a></h3><p>我们知道如果想要保证事务的原子性，就需要在异常发生时，对已经执行的操作进行 <strong>回滚</strong>，在 MySQL 中，恢复机制是通过 <strong>回滚日志（undo log）</strong> 实现的，所有事务进行的修改都会先记录到这个回滚日志中，然后再执行相关的操作。如果执行过程中遇到异常的话，我们直接利用 <strong>回滚日志</strong> 中的信息将数据回滚到修改之前的样子即可！并且，回滚日志会先于数据持久化到磁盘上。这样就保证了即使遇到数据库突然宕机等情况，当用户再次启动数据库的时候，数据库还能够通过查询回滚日志来回滚将之前未完成的事务。</p><p>另外，<code>MVCC</code> 的实现依赖于：<strong>隐藏字段、Read View、undo log</strong>。在内部实现中，<code>InnoDB</code> 通过数据行的 <code>DB_TRX_ID</code> 和 <code>Read View</code> 来判断数据的可见性，如不可见，则通过数据行的 <code>DB_ROLL_PTR</code> 找到 <code>undo log</code> 中的历史版本。每个事务读到的数据版本可能是不一样的，在同一个事务中，用户只能看到该事务创建 <code>Read View</code> 之前已经提交的修改和该事务本身做的修改</p><h3 id="总结-1" tabindex="-1">总结 <a class="header-anchor" href="#总结-1" aria-label="Permalink to &quot;总结&quot;">​</a></h3><p>MySQL InnoDB 引擎使用 <strong>redo log(重做日志)</strong> 保证事务的 <strong>持久性</strong>，使用 <strong>undo log(回滚日志)</strong> 来保证事务的 <strong>原子性</strong>。</p><p><code>MySQL</code> 数据库的 <strong>数据备份、主备、主主、主从</strong> 都离不开 <code>binlog</code>，需要依靠 <code>binlog</code> 来同步数据，保证数据一致性。</p><h2 id="mvcc" tabindex="-1">MVCC <a class="header-anchor" href="#mvcc" aria-label="Permalink to &quot;MVCC&quot;">​</a></h2><p>MVCC(多版本并发控制)，用于在多个并发事务同时读写数据库时保持数据的一致性和隔离性，通过维护多个版本的数据来实现。当一个事务要对数据库中的数据进行修改时，MVCC 会为该事务创建一个数据快照，而不是直接修改实际的数据行。</p><h2 id="explain" tabindex="-1">Explain <a class="header-anchor" href="#explain" aria-label="Permalink to &quot;Explain&quot;">​</a></h2><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">explain </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> select</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 查询语句</span></span></code></pre></div><table tabindex="0"><thead><tr><th><strong>列名</strong></th><th><strong>含义</strong></th></tr></thead><tbody><tr><td>id</td><td>SELECT 查询的序列标识符</td></tr><tr><td>select_type</td><td>SELECT 关键字对应的查询类型</td></tr><tr><td>table</td><td>用到的表名</td></tr><tr><td>partitions</td><td>匹配的分区，对于未分区的表，值为 NULL</td></tr><tr><td>type</td><td>表的访问方法</td></tr><tr><td>possible_keys</td><td>可能用到的索引</td></tr><tr><td>key</td><td>实际用到的索引</td></tr><tr><td>key_len</td><td>所选索引的长度</td></tr><tr><td>ref</td><td>当使用索引等值查询时，与索引作比较的列或常量</td></tr><tr><td>rows</td><td>预计要读取的行数</td></tr><tr><td>filtered</td><td>按表条件过滤后，留存的记录数的百分比</td></tr><tr><td>Extra</td><td>附加信息</td></tr></tbody></table>`,210),l=[s];function n(r,d,c,h,p,g){return a(),t("div",null,l)}const u=e(o,[["render",n]]);export{y as __pageData,u as default};
