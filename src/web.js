const Koa = require('koa');
const helmet = require('koa-helmet');
const logger = require('koa-logger');
const koaBody = require('koa-body');

const helloWorld = require('./routes/hello-world');

const app = new Koa();

app.use(logger());
app.use(helmet());
app.use(koaBody());

app.use(helloWorld.routes());
app.use(helloWorld.allowedMethods());

app.listen(Number(process.env['PORT']) || 8080);
