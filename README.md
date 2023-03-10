# 发票工具

2022年9月份开始，https://etax.guangdong.chinatax.gov.cn/xxmh/html/index_origin.html?gopage=true&m1=gzcx#none 的网站已更新。截图模块已同步更新。

## 项目初始化
```
npm install
```

### 编译前端代码
```
npm run build
```

### 运行服务
```
npm run start
```

然后浏览器访问： `http://127.0.0.1:3000`

pm2 start src/server/index.js --name fapiao -i 4