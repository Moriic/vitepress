import{_ as n,c as s,o as a,a4 as p}from"./chunks/framework.DpC1ZpOZ.js";const m=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Backend/Nginx/Nginx.md","filePath":"Backend/Nginx/Nginx.md"}'),l={name:"Backend/Nginx/Nginx.md"},e=p(`<h2 id="安装" tabindex="-1">安装 <a class="header-anchor" href="#安装" aria-label="Permalink to &quot;安装&quot;">​</a></h2><ul><li>解压：<code>tar</code></li><li>安装依赖 <ul><li><code>yum install -y gcc</code></li><li><code>yum install -y pcre pcre-devel</code></li><li><code>yum install -y zlib zlib-devel</code></li></ul></li><li>安装目录：<code>./configure --prefix=/usr/local/nginx</code></li><li><code>make</code> <code>make install</code></li><li>关闭防火墙：<code>systemctl stop firewalld</code></li><li>关闭防火墙自启：<code>systemctl disable firewalld</code></li><li>nginx自启：<code>vi /usr/lib/systemd/system/nginx.service</code></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[Unit]</span></span>
<span class="line"><span>Description=nginx - web server</span></span>
<span class="line"><span>After=network.target remote-fs.target nss-lookup.target</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[Service]</span></span>
<span class="line"><span>Type=forking</span></span>
<span class="line"><span>PIDFile=/usr/local/nginx/logs/nginx.pid</span></span>
<span class="line"><span>ExecStartPre=/usr/local/nginx/sbin/nginx -t -c /usr/local/nginx/conf/nginx.conf</span></span>
<span class="line"><span>ExecStart=/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf</span></span>
<span class="line"><span>ExecReload=/usr/local/nginx/sbin/nginx -s reload</span></span>
<span class="line"><span>ExecStop=/usr/local/nginx/sbin/nginx -s stop</span></span>
<span class="line"><span>ExecQuit=/usr/local/nginx/sbin/nginx -s quit</span></span>
<span class="line"><span>PrivateTmp=true</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[Install]</span></span>
<span class="line"><span>WantedBy=multi-user.target</span></span></code></pre></div><ul><li>重新加载系统服务：<code>systemctl daemon-reload</code></li><li>开机自启：<code>systemctl enable nginx.service</code></li></ul><p>nginx</p><ul><li><code>nginx</code>：启动</li><li><code>nginx -s stop</code>：快速停止</li><li><code>nginx -s quit</code>：退出前完成连接请求</li><li><code>nginx -s reload</code>：重新加载配置</li></ul><h2 id="目录结构" tabindex="-1">目录结构 <a class="header-anchor" href="#目录结构" aria-label="Permalink to &quot;目录结构&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[root@localhost ~]# tree /usr/local/nginx</span></span>
<span class="line"><span>/usr/local/nginx</span></span>
<span class="line"><span>├── client_body_temp                 # POST 大文件暂存目录</span></span>
<span class="line"><span>├── conf                             # Nginx所有配置文件的目录</span></span>
<span class="line"><span>│   ├── fastcgi.conf                 # fastcgi相关参数的配置文件</span></span>
<span class="line"><span>│   ├── fastcgi.conf.default         # fastcgi.conf的原始备份文件</span></span>
<span class="line"><span>│   ├── fastcgi_params               # fastcgi的参数文件</span></span>
<span class="line"><span>│   ├── fastcgi_params.default       </span></span>
<span class="line"><span>│   ├── koi-utf</span></span>
<span class="line"><span>│   ├── koi-win</span></span>
<span class="line"><span>│   ├── mime.types                   # 媒体类型</span></span>
<span class="line"><span>│   ├── mime.types.default</span></span>
<span class="line"><span>│   ├── nginx.conf                   #这是Nginx默认的主配置文件，日常使用和修改的文件</span></span>
<span class="line"><span>│   ├── nginx.conf.default</span></span>
<span class="line"><span>│   ├── scgi_params                  # scgi相关参数文件</span></span>
<span class="line"><span>│   ├── scgi_params.default  </span></span>
<span class="line"><span>│   ├── uwsgi_params                 # uwsgi相关参数文件</span></span>
<span class="line"><span>│   ├── uwsgi_params.default</span></span>
<span class="line"><span>│   └── win-utf</span></span>
<span class="line"><span>├── fastcgi_temp                     # fastcgi临时数据目录</span></span>
<span class="line"><span>├── html                             # Nginx默认站点目录</span></span>
<span class="line"><span>│   ├── 50x.html                     # 错误页面优雅替代显示文件，例如出现502错误时会调用此页面</span></span>
<span class="line"><span>│   └── index.html                   # 默认的首页文件</span></span>
<span class="line"><span>├── logs                             # Nginx日志目录</span></span>
<span class="line"><span>│   ├── access.log                   # 访问日志文件</span></span>
<span class="line"><span>│   ├── error.log                    # 错误日志文件</span></span>
<span class="line"><span>│   └── nginx.pid                    # pid文件，Nginx进程启动后，会把所有进程的ID号写到此文件</span></span>
<span class="line"><span>├── proxy_temp                       # 临时目录</span></span>
<span class="line"><span>├── sbin                             # Nginx 可执行文件目录</span></span>
<span class="line"><span>│   └── nginx                        # Nginx 二进制可执行程序</span></span>
<span class="line"><span>├── scgi_temp                        # 临时目录</span></span>
<span class="line"><span>└── uwsgi_temp                       # 临时目录</span></span></code></pre></div>`,8),i=[e];function c(t,o,d,r,g,u){return a(),s("div",null,i)}const f=n(l,[["render",c]]);export{m as __pageData,f as default};
