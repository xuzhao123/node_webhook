const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const { execSync, execFile } = require('child_process');

var app = new Koa();
var router = new Router();

app.use(bodyParser())

const env = process.env.NODE_ENV;
const publicPath = env === 'development' ? path.join(__dirname, './public') : '/root/xuzhao/www/blog'

router.post('/', (ctx, next) => {
    const { payload } = ctx.request.body;
    if (!payload) {
        return;
    }
    let data;
    try {
        data = JSON.stringify(payload)
    } catch (e) { }

    if (!data) {
        return;
    }

    if (data.ref !== 'refs/heads/master') {
        return;
    }

    execFileSync('publish.sh');

    ctx.status = 200;


    // console.log(JSON.stringify(ctx.params, null, 2))
    // console.log(JSON.stringify(ctx.request.body, null, 2))
    // ctx.status = 200;
});

router.get('/', (ctx, next) => {
    execSync('chmod 755 publish.sh')
    execFile('./publish.sh', [env, publicPath], (error, stdout, stderr) => {
        if (error) {
            throw error;
        }

        console.log(stdout);
    });
    ctx.status = 200;
});


app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000)