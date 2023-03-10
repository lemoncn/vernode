const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
    ctx.body = '中文root';
});


app.listen(1234, () => {
    console.log('1223项目启动')
});
