import{_ as i,c as l,a2 as a,o as t}from"./chunks/framework.DptEmx5X.js";const h=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Interview/Interview/ByteDance.md","filePath":"Interview/Interview/ByteDance.md"}'),o={name:"Interview/Interview/ByteDance.md"};function p(r,e,n,s,c,d){return t(),l("div",null,e[0]||(e[0]=[a('<h2 id="字节-一面" tabindex="-1">字节 一面 <a class="header-anchor" href="#字节-一面" aria-label="Permalink to &quot;字节 一面&quot;">​</a></h2><ol><li><p>双 token 优点</p></li><li><p>前端轮询方法，websocket</p></li><li><p>优化大量数据</p></li><li><p>Redis：</p><ol><li>缓存一致性</li><li>db是分布式的话如何保证一致性</li><li>缓存击穿：分布式锁</li></ol></li><li><p>Rabbitmq：场景，消息失败ack，一直回调问题</p></li><li><p>Mysql：索引最左匹配：a=0&amp;&amp;b=0 / a=0&amp;&amp;b&gt;0</p></li><li><p>订单库存分布式，事务</p></li><li><p>计算机网络：</p><ol><li>TCP可靠：序列号</li><li>第二次握手失效</li><li>第三次传完后会立马发送数据吗</li></ol></li></ol><h2 id="oppo-一面" tabindex="-1">oppo 一面 <a class="header-anchor" href="#oppo-一面" aria-label="Permalink to &quot;oppo 一面&quot;">​</a></h2><p>深挖项目：</p><ol><li>docker 判题：只支持输出流，只支持java包，不支持第三方包</li><li>外卖：宕机后无法支付回调怎么解决</li><li>同步/异步</li><li>支付并发问题：sychronized，分布式锁 setnx</li><li>使用 websocket 通知，如果是多机器如何保证通知到所有 Session</li><li>JVM内存模型，问了什么JMM，happen-before</li><li>IO 多路复用：epoll 和 select，边缘触发，水平触发</li><li>快速排序，归并排序，时间空间复杂度，稳定性</li></ol>',5)]))}const b=i(o,[["render",p]]);export{h as __pageData,b as default};