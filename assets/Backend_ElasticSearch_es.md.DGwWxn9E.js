import{_ as s,c as i,o as a,a4 as t}from"./chunks/framework.DpC1ZpOZ.js";const c=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Backend/ElasticSearch/es.md","filePath":"Backend/ElasticSearch/es.md"}'),n={name:"Backend/ElasticSearch/es.md"},l=t(`<h2 id="基础概念" tabindex="-1">基础概念 <a class="header-anchor" href="#基础概念" aria-label="Permalink to &quot;基础概念&quot;">​</a></h2><h3 id="倒排索引" tabindex="-1">倒排索引 <a class="header-anchor" href="#倒排索引" aria-label="Permalink to &quot;倒排索引&quot;">​</a></h3><p><strong>相关概念</strong>：</p><ul><li>文档：用来搜索的数据，其中每一条数据就是一个文档，例如一个商品信息</li><li>词条：对文档数据或用户搜索数据进行分词，例如我是中国人分词为我，是，中国人…</li></ul><p><strong>创建倒排索引</strong>：</p><ul><li>将每一个文档数据进行分词，得到一个个词条</li><li>创建表，每行数据包括词条，词条所在的文档 id，位置等信息</li><li>词条唯一性，可以给词条创建正向索引</li></ul><table tabindex="0"><thead><tr><th>正向索引</th><th></th><th></th><th>倒排索引</th><th></th></tr></thead><tbody><tr><td><strong>id（索引）</strong></td><td><strong>title</strong></td><td><strong>price</strong></td><td><strong>词条（索引）</strong></td><td><strong>文档 id</strong></td></tr><tr><td>1</td><td>小米手机</td><td>3499</td><td>小米</td><td>1，3，4</td></tr><tr><td>2</td><td>华为手机</td><td>4999</td><td>手机</td><td>1，2</td></tr><tr><td>3</td><td>华为小米充电器</td><td>49</td><td>华为</td><td>2，3</td></tr><tr><td>4</td><td>小米手环</td><td>49</td><td>充电器</td><td>3</td></tr><tr><td>...</td><td>...</td><td>...</td><td>手环</td><td>4</td></tr></tbody></table><p><strong>搜索流程</strong>：</p><ul><li>对搜索数据进行分词，得到每个词条</li><li>搜索词条的文档 id，由于词条有索引，查询效率高</li><li>根据 id 到正向索引中查找具体文档</li></ul><p><strong>正向索引</strong>：</p><ul><li><p>优点：</p><ul><li>可以给多个字段创建索引</li><li>根据索引字段搜索、排序速度非常快</li></ul></li><li><p>缺点：</p><ul><li>根据非索引字段，或者索引字段中的部分词条查找时，只能全表扫描。</li></ul></li></ul><p><strong>倒排索引</strong>：</p><ul><li>优点： <ul><li>根据词条搜索、模糊搜索时，速度非常快</li></ul></li><li>缺点： <ul><li>只能给词条创建索引，而不是字段</li><li>无法根据字段做排序</li></ul></li></ul><h3 id="概念" tabindex="-1">概念 <a class="header-anchor" href="#概念" aria-label="Permalink to &quot;概念&quot;">​</a></h3><table tabindex="0"><thead><tr><th><strong>MySQL</strong></th><th><strong>Elasticsearch</strong></th><th><strong>说明</strong></th></tr></thead><tbody><tr><td>Table</td><td>Index</td><td>索引(index)，就是文档的集合，类似数据库的表(table)</td></tr><tr><td>Row</td><td>Document</td><td>文档（Document），就是一条条的数据，类似数据库中的行（Row），文档都是 JSON 格式</td></tr><tr><td>Column</td><td>Field</td><td>字段（Field），就是 JSON 文档中的字段，类似数据库中的列（Column）</td></tr><tr><td>Schema</td><td>Mapping</td><td>Mapping（映射）是索引中文档的约束，例如字段类型约束。类似数据库的表结构（Schema）</td></tr><tr><td>SQL</td><td>DSL</td><td>DSL 是 elasticsearch 提供的 JSON 风格的请求语句，用来操作 elasticsearch，实现 CRUD</td></tr></tbody></table><h2 id="部署-es" tabindex="-1">部署 es <a class="header-anchor" href="#部署-es" aria-label="Permalink to &quot;部署 es&quot;">​</a></h2><h3 id="安装-es" tabindex="-1">安装 es <a class="header-anchor" href="#安装-es" aria-label="Permalink to &quot;安装 es&quot;">​</a></h3><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  --name</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> es</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  -e</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;ES_JAVA_OPTS=-Xms512m -Xmx512m&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  -e</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;discovery.type=single-node&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  -v</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> es-data:/usr/share/elasticsearch/data</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  -v</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> es-plugins:/usr/share/elasticsearch/plugins</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  --privileged</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  --network</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> hmall</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  -p</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 9200:9200</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  -p</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 9300:9300</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  elasticsearch:7.12.1</span></span></code></pre></div><p>安装完成后，访问 9200 端口，即可看到响应的 Elasticsearch 服务的基本信息</p><h3 id="安装-kibanna" tabindex="-1">安装 Kibanna <a class="header-anchor" href="#安装-kibanna" aria-label="Permalink to &quot;安装 Kibanna&quot;">​</a></h3><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">--name </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">kibana</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">-e </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">ELASTICSEARCH_HOSTS=http://es:9200</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">--network=hmall </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">-p </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">5601:5601</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  \\</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">kibana:7.12.1</span></span></code></pre></div><p>安装完成后，直接访问 5601 端口，即可看到控制台页面</p><h3 id="安装-ik-分词器" tabindex="-1">安装 IK 分词器 <a class="header-anchor" href="#安装-ik-分词器" aria-label="Permalink to &quot;安装 IK 分词器&quot;">​</a></h3><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> exec</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -it</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> es</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ./bin/elasticsearch-plugin</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.12.1/elasticsearch-analysis-ik-7.12.1.zip</span></span></code></pre></div><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> restart</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> es</span></span></code></pre></div><h3 id="使用-ik-分词器" tabindex="-1">使用 IK 分词器 <a class="header-anchor" href="#使用-ik-分词器" aria-label="Permalink to &quot;使用 IK 分词器&quot;">​</a></h3><p>IK 分词器包含两种模式：</p><ul><li><p><code>ik_smart</code>：智能语义切分</p></li><li><p><code>ik_max_word</code>：最细粒度切分</p></li></ul><div class="language-http vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">http</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">POST</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /_analyze</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;analyzer&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;ik_smart&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;text&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;黑马程序员学习java太棒了&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h4 id="拓展词典" tabindex="-1">拓展词典 <a class="header-anchor" href="#拓展词典" aria-label="Permalink to &quot;拓展词典&quot;">​</a></h4><ul><li>打开 IK 分词器 config 目录</li><li>在 IKAnalyzer.cfg.xml 配置文件内容添加：</li></ul><div class="language-XML vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">XML</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;?</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">xml</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> version</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;1.0&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> encoding</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;UTF-8&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">?&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;!</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">DOCTYPE</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> properties</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> SYSTEM &quot;http://java.sun.com/dtd/properties.dtd&quot;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">properties</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">comment</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;IK Analyzer 扩展配置&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">comment</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        &lt;!--用户可以在这里配置自己的扩展字典 *** 添加扩展词典--&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">entry</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> key</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;ext_dict&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;ext.dic&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">entry</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">properties</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><ul><li>在 IK 分词器的 config 目录新建一个 <code>ext.dic</code>，可以参考 config 目录下复制一个配置文件进行修改</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>传智播客</span></span>
<span class="line"><span>泰裤辣</span></span></code></pre></div><ul><li>重启 elasticsearch</li></ul><h2 id="索引库操作" tabindex="-1">索引库操作 <a class="header-anchor" href="#索引库操作" aria-label="Permalink to &quot;索引库操作&quot;">​</a></h2><p>Index 类似数据库表，Mapping 映射类似表的结构，因此需要先创建 Index 和 Mapping</p><h3 id="mapping-映射属性" tabindex="-1">Mapping 映射属性 <a class="header-anchor" href="#mapping-映射属性" aria-label="Permalink to &quot;Mapping 映射属性&quot;">​</a></h3><ul><li>type：字段数据类型 <ul><li>字符串：text(可分词的文本)，keyword(精确值)</li><li>数值：long，integer，short，byte，double，float</li><li>布尔：boolean</li><li>日期：date</li><li>对象：object</li></ul></li><li>index：是否创建索引，默认 true</li><li>analyzer：使用哪种分词器</li><li>properties：该字段的子字段</li></ul><h3 id="索引库-crud" tabindex="-1">索引库 CRUD <a class="header-anchor" href="#索引库-crud" aria-label="Permalink to &quot;索引库 CRUD&quot;">​</a></h3><ul><li><p>格式：<code>请求方式 请求路径 请求参数</code></p></li><li><p>创建：<code>PUT /索引库名 mapping映射</code></p></li><li><p>查询：<code>GET /索引库名</code></p></li><li><p>修改：<strong>不支持修改已有的字段，但允许添加新字段</strong> <code>PUT /索引库名/_mapping mapping映射</code></p></li><li><p>删除：<code>DELETE /索引库名</code></p></li></ul><div class="language-JSON vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">JSON</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">PUT /heima</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;mappings&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;properties&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;info&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        &quot;type&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;text&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        &quot;analyzer&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;ik_smart&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      },</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;email&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        &quot;type&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;keyword&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        &quot;index&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;false&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      },</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;name&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        &quot;properties&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">          &quot;firstName&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            &quot;type&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;keyword&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><div class="language-JSON vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">JSON</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">PUT /heima/_mapping</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;properties&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;age&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      &quot;type&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;integer&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h2 id="文档操作" tabindex="-1">文档操作 <a class="header-anchor" href="#文档操作" aria-label="Permalink to &quot;文档操作&quot;">​</a></h2><ul><li>新增：<code>POST /索引库名/_doc/文档id</code></li><li>查询：<code>GET /索引库名/_doc/文档id</code></li><li>删除：<code>DELETE /索引库名/_doc/文档id</code></li><li>修改：分为全局修改(直接覆盖原来的文档)，局部修改(修改文档的部分字段) <ul><li>全局修改：<code>PUT /索引库名/_doc/文档id</code></li><li>局部修改：<code>POST /索引库名/_update/文档id</code></li></ul></li></ul><div class="language-JSON vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">JSON</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">POST /heima/_doc/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;info&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;黑马程序员Java讲师&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;email&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;zy@itcast.cn&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &quot;name&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        &quot;firstName&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;云&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        &quot;lastName&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;赵&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="批处理" tabindex="-1">批处理 <a class="header-anchor" href="#批处理" aria-label="Permalink to &quot;批处理&quot;">​</a></h3><p>批处理采用 POST 请求，基本语法如下：</p><ul><li><p><code>index</code> 代表新增操作</p><ul><li><code>_index</code>：指定索引库名</li><li><code>id</code> 指定要操作的文档 id</li><li><code>{ &quot;field1&quot; : &quot;value1&quot; }</code>：则是要新增的文档内容</li></ul></li><li><p><code>delete</code> 代表删除操作</p><ul><li><p><code>_index</code>：指定索引库名</p></li><li><p><code>_id</code> 指定要操作的文档 id</p></li></ul></li><li><p><code>update</code> 代表更新操作</p><ul><li><p><code>_index</code>：指定索引库名</p></li><li><p><code>_id</code> 指定要操作的文档 id</p></li><li><p><code>{ &quot;doc&quot; : {&quot;field2&quot; : &quot;value2&quot;} }</code>：要更新的文档字段</p></li></ul></li></ul><div class="language-JSON vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">JSON</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">POST _bulk</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{ </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&quot;index&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&quot;_index&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;test&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&quot;_id&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;1&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{ </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&quot;field1&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;value1&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{ </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&quot;delete&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&quot;_index&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;test&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&quot;_id&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;2&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{ </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&quot;create&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&quot;_index&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;test&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&quot;_id&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;3&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> } }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{ </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&quot;field1&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;value3&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{ </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&quot;update&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : {</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&quot;_id&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;1&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&quot;_index&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;test&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">} }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{ </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&quot;doc&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : {</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&quot;field2&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> : </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;value2&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">} }</span></span></code></pre></div><h2 id="restclient" tabindex="-1">RestClient <a class="header-anchor" href="#restclient" aria-label="Permalink to &quot;RestClient&quot;">​</a></h2><h3 id="初始化" tabindex="-1">初始化 <a class="header-anchor" href="#初始化" aria-label="Permalink to &quot;初始化&quot;">​</a></h3><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">dependency</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">groupId</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;org.elasticsearch.client&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">groupId</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">artifactId</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;elasticsearch-rest-high-level-client&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">artifactId</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">dependency</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><div class="language-xml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">xml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">properties</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">elasticsearch.version</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;7.12.1&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">elasticsearch.version</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">properties</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><div class="language-java vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">java</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">RestHighLevelClient client </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> RestHighLevelClient</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(RestClient.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">builder</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    HttpHost.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">create</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;http://192.168.150.101:9200&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">));</span></span></code></pre></div>`,55),h=[l];function p(e,k,d,E,r,o){return a(),i("div",null,h)}const y=s(n,[["render",p]]);export{c as __pageData,y as default};
