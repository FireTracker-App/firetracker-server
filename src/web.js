const Koa = require('koa');
const helmet = require('koa-helmet');
const logger = require('koa-logger');
const koaBody = require('koa-body');

const app = new Koa();

app.use(logger());
app.use(helmet());
app.use(koaBody());

app.use(async ctx =>
{
    ctx.body = 'Hello World';
});

app.listen(Number(process.env['PORT']) || 8080);
