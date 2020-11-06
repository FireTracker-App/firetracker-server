const Koa = require('koa');
const helmet = require('koa-helmet');
const logger = require('koa-logger');
const koaBody = require('koa-body');

const indexPage = require('./routes/index-page');

const app = new Koa();

app.use(logger());
app.use(helmet());
app.use(koaBody());

app.use(indexPage.routes());

app.listen(Number(process.env['PORT']) || 8080);
