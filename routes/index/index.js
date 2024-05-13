const Router = require('koa-router');
const subscriptions = require('../../db');

const router = new Router();

router.post('/auth', (ctx) => {
    const { name, password } = ctx.request.body;
    console.log("subscr", subscriptions);
    if (subscriptions.data.some(sub => sub.name === name)) {
        let psw = (subscriptions.data.find(sub => sub.name === name)).password
        if (psw === password) {
            ctx.response.status = 201;
            ctx.response.body = {status: "exists"};

            return;
        }
        
        ctx.response.body = {status: "Password not found"}

        return;
    }

    ctx.response.body = {status: "Nick-name not found"};
    return;

});

module.exports = router;