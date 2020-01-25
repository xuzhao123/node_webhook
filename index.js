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

/**
 * 执行脚本更新博客
 */
function updateBlog() {
    execSync('chmod 755 publish.sh')
    execFile('./publish.sh', [env, publicPath], (error, stdout, stderr) => {
        if (error) {
            throw error;
        }

        console.log(stdout);
    });
}

updateBlog();

router.post('/', (ctx, next) => {
    const { payload } = ctx.request.body;

    if (!payload) {
        return;
    }

    const data = JSON.parse(payload);

    if (data.ref !== 'refs/heads/master') {
        return;
    }

    updateBlog()

    ctx.status = 200;
});

router.get('/', (ctx, next) => {
    updateBlog()
    ctx.status = 200;
});


app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(3000)
