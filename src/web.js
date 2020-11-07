const Koa = require('koa');
const helmet = require('koa-helmet');
const logger = require('koa-logger');
const koaBody = require('koa-body');
const koaRespond = require('koa-respond');
const Router = require('koa-router');

const indexPage = require('./routes/index-page');
const markers = require('./routes/markers');

const app = new Koa();

// Log requests, use koa-helmet to set secure headers, and enable body parsing
app.use(logger());
app.use(helmet());
app.use(koaBody());
app.use(koaRespond());

// Set up router for index and marker routes
const router = new Router();
router.use('/', indexPage.routes());
router.use('/markers', markers.routes(), markers.allowedMethods());

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(Number(process.env['PORT']) || 8080);
