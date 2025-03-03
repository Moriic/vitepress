## 设置 root 用户

```bash
sudo passwd root

sudo vim /etc/ssh/sshd_config
PermitRootLogin yes

sudo systemctl restart sshd
```

## 配置证书

```bash
sudo apt install certbot python3-certbot-nginx -y 

sudo certbot --nginx -d hk.cwcn.eu.org --register-unsafely-without-email
```

## 下载gost并配置

```bash
bash <(curl -fsSL https://github.com/go-gost/gost/raw/master/install.sh) --install
```

```bash
#!/bin/bash

# 根据自己配置更改下面参数 
DOMAIN="hk.cwcn.eu.org"
USER="cwc"
PASS="qq1219533124."
PORT=443
AUTH=$(echo -n ${USER}:${PASS} | base64)

BIND_IP=0.0.0.0
CERT_DIR=/etc/letsencrypt
CERT=${CERT_DIR}/live/${DOMAIN}/fullchain.pem
KEY=${CERT_DIR}/live/${DOMAIN}/privkey.pem
#gost -L "https://:${PORT}?auth=${AUTH}&cert=${CERT}&key=${KEY}&probe_resist=file:/usr/share/nginx/html&knock=www.google.com" 
nohup gost -L "https://:${PORT}?auth=${AUTH}&cert=${CERT}&key=${KEY}&probe_resist=file:/usr/share/nginx/html&knock=www.google.com" >/dev/null 2>&1 &
```

