# MySQL

## MySQL 基础

### 关系型数据库

建立在关系模型上的数据库(一对一，一对多，多对多)

## MySQL 字段类型

- **数值类型**：整型(tinyint, smallint, mediumint, int, bigint)，浮点型(float, double)，定点型(decimal)
- **字符串类型**：char, varchar, tinytext, text, mediumtext, longtext, tinyblob, blob, mediumblob, longblob
- **日期类型**：year, time, date, datetime, timestamp

### char vs varchar

- char 是定长字符串，varchar 是变长字符串。

- char 在存储时会在右边填充空格以达到指定的长度，检索时去掉空格，varchar 在存储时需要额外的 1 或 2 个字节记录字符串的长度，检索时不需要处理

- char 更适合存储长度较短或长度差不多的字符串，varchar 适合存储长度不确定或差异大的字符串

### datetime vs timestamp 

- datetime 没有时区信息，timestamp 与时区有关，会根据时区改变时间

- datetime 需要 8 个字节，timestamp4 个字节

### NULL vs ''

- `NULL` 代表一个不确定的值, 就算是两个 `NULL`, 它俩也不一定相等。例如，`SELECT NULL=NULL` 的结果为 false，但是在我们使用 `DISTINCT`, `GROUP BY`, `ORDER BY` 时, `NULL` 又被认为是相等的。
- `''` 的长度是 0，是不占用空间的，而 `NULL` 是需要占用空间的。
- `NULL` 会影响聚合函数的结果。例如，`SUM`、`AVG`、`MIN`、`MAX` 等聚合函数会忽略 `NULL` 值。 `COUNT` 的处理方式取决于参数的类型。如果参数是 `*`(`COUNT(*)`)，则会统计所有的记录数，包括 `NULL` 值；如果参数是某个字段名(`COUNT(列名)`)，则会忽略 `NULL` 值，只统计非空值的个数。
- 查询 `NULL` 值时，必须使用 `IS NULL` 或 `IS NOT NULLl` 来判断，而不能使用 =、!=、 <、> 之类的比较运算符。而 `''` 是可以使用这些比较运算符的

### MySQL 基础架构

