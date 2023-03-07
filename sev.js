const Koa = require('koa');
const app = new Koa();

app.use((ctx,next)=>{
    console.log('middle 1');
    next();
})

app.use((ctx,next)=>{
    console.log('mid 2');
    ctx.response.body = '我是中文'
});

app.listen(8000,()=>{
    console.log('服务器启动成功')
})