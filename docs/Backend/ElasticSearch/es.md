## 基础概念

### 倒排索引

**相关概念**：

- 文档：用来搜索的数据，其中每一条数据就是一个文档，例如一个商品信息
- 词条：对文档数据或用户搜索数据进行分词，例如我是中国人分词为我，是，中国人…

**创建倒排索引**：

- 将每一个文档数据进行分词，得到一个个词条
- 创建表，每行数据包括词条，词条所在的文档 id，位置等信息
- 词条唯一性，可以给词条创建正向索引

| 正向索引       |                |           | 倒排索引         |            |
| -------------- | -------------- | --------- | ---------------- | ---------- |
| **id（索引）** | **title**      | **price** | **词条（索引）** | **文档 id** |
| 1              | 小米手机       | 3499      | 小米             | 1，3，4    |
| 2              | 华为手机       | 4999      | 手机             | 1，2       |
| 3              | 华为小米充电器 | 49        | 华为             | 2，3       |
| 4              | 小米手环       | 49        | 充电器           | 3          |
| ...            | ...            | ...       | 手环             | 4          |

**搜索流程**：

- 对搜索数据进行分词，得到每个词条
- 搜索词条的文档 id，由于词条有索引，查询效率高
- 根据 id 到正向索引中查找具体文档

**正向索引**：

- 优点： 
  - 可以给多个字段创建索引
  - 根据索引字段搜索、排序速度非常快

- 缺点：
  - 根据非索引字段，或者索引字段中的部分词条查找时，只能全表扫描。

**倒排索引**：

- 优点： 
  - 根据词条搜索、模糊搜索时，速度非常快
- 缺点： 
  - 只能给词条创建索引，而不是字段
  - 无法根据字段做排序

### 概念

| **MySQL** | **Elasticsearch** | **说明**                                                     |
| --------- | ----------------- | ------------------------------------------------------------ |
| Table     | Index             | 索引(index)，就是文档的集合，类似数据库的表(table)           |
| Row       | Document          | 文档（Document），就是一条条的数据，类似数据库中的行（Row），文档都是 JSON 格式 |
| Column    | Field             | 字段（Field），就是 JSON 文档中的字段，类似数据库中的列（Column） |
| Schema    | Mapping           | Mapping（映射）是索引中文档的约束，例如字段类型约束。类似数据库的表结构（Schema） |
| SQL       | DSL               | DSL 是 elasticsearch 提供的 JSON 风格的请求语句，用来操作 elasticsearch，实现 CRUD |

## 部署 es

### 安装 es

```shell
docker run -d \
  --name es \
  -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
  -e "discovery.type=single-node" \
  -v es-data:/usr/share/elasticsearch/data \
  -v es-plugins:/usr/share/elasticsearch/plugins \
  --privileged \
  --network hmall \
  -p 9200:9200 \
  -p 9300:9300 \
  elasticsearch:7.12.1
```

安装完成后，访问 9200 端口，即可看到响应的 Elasticsearch 服务的基本信息

### 安装 Kibanna

```shell
docker run -d \
--name kibana \
-e ELASTICSEARCH_HOSTS=http://es:9200 \
--network=hmall \
-p 5601:5601  \
kibana:7.12.1
```

安装完成后，直接访问 5601 端口，即可看到控制台页面

### 安装 IK 分词器

```shell
docker exec -it es ./bin/elasticsearch-plugin  install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.12.1/elasticsearch-analysis-ik-7.12.1.zip
```

```shell
docker restart es
```

### 使用 IK 分词器

IK 分词器包含两种模式：

-  `ik_smart`：智能语义切分 

-  `ik_max_word`：最细粒度切分 

```http
POST /_analyze
{
  "analyzer": "ik_smart",
  "text": "黑马程序员学习java太棒了"
}
```

#### 拓展词典

- 打开 IK 分词器 config 目录
- 在 IKAnalyzer.cfg.xml 配置文件内容添加：

```XML
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
        <comment>IK Analyzer 扩展配置</comment>
        <!--用户可以在这里配置自己的扩展字典 *** 添加扩展词典-->
        <entry key="ext_dict">ext.dic</entry>
</properties>
```

- 在 IK 分词器的 config 目录新建一个 `ext.dic`，可以参考 config 目录下复制一个配置文件进行修改

```
传智播客
泰裤辣
```

- 重启 elasticsearch

## 索引库操作

Index 类似数据库表，Mapping 映射类似表的结构，因此需要先创建 Index 和 Mapping

### Mapping 映射属性

- type：字段数据类型
  - 字符串：text(可分词的文本)，keyword(精确值)
  - 数值：long，integer，short，byte，double，float
  - 布尔：boolean
  - 日期：date
  - 对象：object
- index：是否创建索引，默认 true
- analyzer：使用哪种分词器
- properties：该字段的子字段

### 索引库 CRUD

- 格式：`请求方式 请求路径 请求参数`

- 创建：`PUT /索引库名 mapping映射`
- 查询：`GET /索引库名`
- 修改：**不支持修改已有的字段，但允许添加新字段** `PUT /索引库名/_mapping mapping映射`
- 删除：`DELETE /索引库名`

```JSON
PUT /heima
{
  "mappings": {
    "properties": {
      "info":{
        "type": "text",
        "analyzer": "ik_smart"
      },
      "email":{
        "type": "keyword",
        "index": "false"
      },
      "name":{
        "properties": {
          "firstName": {
            "type": "keyword"
          }
        }
      }
    }
  }
}
```

```JSON
PUT /heima/_mapping
{
  "properties": {
    "age":{
      "type": "integer"
    }
  }
}
```

## 文档操作

- 新增：`POST /索引库名/_doc/文档id`
- 查询：`GET /索引库名/_doc/文档id`
- 删除：`DELETE /索引库名/_doc/文档id`
- 修改：分为全局修改(直接覆盖原来的文档)，局部修改(修改文档的部分字段)
  - 全局修改：`PUT /索引库名/_doc/文档id`
  - 局部修改：`POST /索引库名/_update/文档id`

```JSON
POST /heima/_doc/1
{
    "info": "黑马程序员Java讲师",
    "email": "zy@itcast.cn",
    "name": {
        "firstName": "云",
        "lastName": "赵"
    }
}
```

### 批处理

批处理采用 POST 请求，基本语法如下：

- `index` 代表新增操作

  - `_index`：指定索引库名
  - `id` 指定要操作的文档 id
  - `{ "field1" : "value1" }`：则是要新增的文档内容

- `delete` 代表删除操作

  - `_index`：指定索引库名

  - `_id` 指定要操作的文档 id

- `update` 代表更新操作

  - `_index`：指定索引库名

  - `_id` 指定要操作的文档 id

  - `{ "doc" : {"field2" : "value2"} }`：要更新的文档字段

```JSON
POST _bulk
{ "index" : { "_index" : "test", "_id" : "1" } }
{ "field1" : "value1" }
{ "delete" : { "_index" : "test", "_id" : "2" } }
{ "create" : { "_index" : "test", "_id" : "3" } }
{ "field1" : "value3" }
{ "update" : {"_id" : "1", "_index" : "test"} }
{ "doc" : {"field2" : "value2"} }
```

## RestClient

### 初始化

```xml
<dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>elasticsearch-rest-high-level-client</artifactId>
</dependency>
```

```xml
<properties>
    <elasticsearch.version>7.12.1</elasticsearch.version>
</properties>
```

```java
RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
    HttpHost.create("http://192.168.150.101:9200")
));
```

