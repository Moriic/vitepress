> https://mybatis.net.cn/getting-started.html

## 基础配置

1. 引入依赖并连接数据库application.yml

```yml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/tree
    username: root
    password: 123456
    type: com.alibaba.druid.pool.DruidDataSource
```

2. 编写SQL语句

```java
@Mapper
public interface UserMapper{
    @Select("select * from user")
    public List<User> list();
}
```

3. 执行SQL语句

```java
@Autowired
private UserMapper userMapper;

@Test
void contextLoads() {
    System.out.println(userMapper.list());
}
```

## 常用注解

1. @Delete

```java
@Delete("delete from emp where id = #{id}")
public void delete(Integer id);
```

2. @Insert

```java
@Insert("insert into emp(username,name,gender)" + 
	"values(#{username},#{name},#{gender})")
public void insert(Emp emp);
```

3. @Options

插入时将生成的id值赋值给emp的id属性，从而可以通过emp.getId()得到主键值

```java
@Options(keyProperty="id",useGeneratedKeys=true)
@Insert("insert into emp(username,name,gender)" + 
	"values(#{username},#{name},#{gender})")
public void insert(Emp emp);
```

4. @Update

```java
@Update("update emp set username=#{username},name=#{name},gender=#{gender} where id =#{id}")
public void update(Emp emp);
```

5. 条件查询concat

```java
@Select("select * from user where name like concat('%',#{name},'%')")
public List<User> list(String name);
```

## 属性映射

对于属性值与数据库名称不同的解决方案：

1. 在SQL语句中，对不同的列起别名

```java
@Select("select id,name,dept_id deptId,create_time createTime from user")
public List<User> list();
```

2. 开启驼峰命名

```xml
mybatis.configuration.map-underscore-to-camel-case=true
```

## XML映射

### 基础配置

> https://mybatis.net.cn/getting-started.html

1. XML文件的名称与Mapper接口名称一致，并放在同包同名下
2. Mapper中的namespace为Mapper接口的包名
3. sql语句的id与Mapper接口



<img src="https://cdn.jsdelivr.net/gh/cwcblog/picture@main/img/image-20230827120143716.png" alt="image-20230827120143716" style="zoom:50%;" />

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
  PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
  
<mapper namespace="ocom.itheima.mapper.EmpMapper">
  <select id="list" resultType="com.itheima.pojo.Emp">
    select * from emp where id = #{id}
  </select>
</mapper>
```

### 动态SQL

1. `<where>,<if>`

```xml
<select id="list" resultType="com.itheima.pojo.Emp">
	select id,username,name,gender from emp
	<where>
		<if test="name != null">
			name like concat('%',#{name},'%')
		</if>
		<if test="gender != null">
			and gender = #{gender}
		</if>
	</where>
</select>
```

2. `<set>,<if>`

```xml
<update id="update">
	update emp
	<set>
		<if test="name != null">
			name = #{name},
		</if>
		<if test="gender != null">
			gender = #{gender}
		</if>
	</set>
	where id = #{id}
</select>
```

3. `<foreach>`

- SQL语句：`delete from emp where id in(1,2,3)`
- 接口方法：`public void deleteByIds(List<Integer> ids);`

`<froeach>`属性

- collection：集合名称
- item：集合遍历的元素名称
- separator：每个元素的分隔符
- open：遍历开始的符号
- close：遍历结束的符号

```xml
<delete id=deleteByIds>
	delete from emp where id in
	<foreach collection="ids" item="id" separator="," open="(" close=")">
		#{id}
	</foreach>
</delete>
```

4. `<sql>,<include>`

```xml
<sql id="conmmonSelect">
	select id,username,name,gender from emp
</sql>
<select id="list" resultType="com.itheima.pojo.Emp">
	<include refid="commonSelect"/>
	<where>
		<if test="name != null">
			name like concat('%',#{name},'%')
		</if>
		<if test="gender != null">
			and gender = #{gender}
		</if>
	</where>
</select>
```

## 分页查询

1. Controller

```java
@GetMapping("/emps")
public Result page(@RequestParam(defaultValue = "1") Integer page,
				@RequestParam(defaultValue = "10") Integer pageSize){
    PageBean pageBean = empService.page(page,pageSize);
    return Result.success(pageBean);
}
```

2. Service

```java
@Override
public PageBean page(Integer page,Integer pageSize){
	Integer count = empMapper.count();
	Integer start = (page - 1) * pageSize;
	List<Emp> empList = empMapper.page(start,pageSize);
	PageBean pageBean = new PageBean(count,empList);
	return pageBean;
}
```

3. Mapper

```java
@Select("select count(*) from emp")
public Integer count();

@Select("select * from emp limit #{start},#{pageSize}")
public List<Emp> page(Integer start,Integer pageSize);
```

### 分页插件PageHelper

依赖

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>1.4.6</version>
</dependency>
```

2. Service

```java
@Override
public PageBean page(Integer page,Integer pageSize){
	PageHelper.startPage(page,pageSize);
	
	List<Emp> empList = empMapper.list();
	Page<Emp> p = (Page<Emp>) empList;
	PageBean pageBean = new PageBean(p.getTotal(),p.getResult());
	return pageBean;
}
```

3. Mapper

```java
@Select("select * from emp")
public List<Emp> list();
```

