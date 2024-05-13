const Router = require('koa-router');
const subscriptions = require('../../db');

const router = new Router();
//let subscriptions = [];

router.post('/subscriptions', (ctx) => {

    const { name, password } = ctx.request.body;
    console.log(ctx.request.body)

    if (subscriptions.data.some(sub => sub.name === name)) {
        ctx.response.status = 401;
        ctx.response.body = {status: "exists"};

        return;
    }

    subscriptions.add({ name, password });
    ctx.response.body = {status: "OK"};

});


router.delete('/subscriptions/:name', (ctx) => {

    const { name } = ctx.params;
    console.log(ctx.params);

    try {
        if (subscriptions.data.every(sub => sub.name !== name)) {
            ctx.response.status = 400;
            ctx.response.body = {status: "subscription doesn\'t exists"};

            return;
        }

    subscriptions.data = subscriptions.data.filter(sub => sub.name !== name);
    ctx.response.body = {status: "OK"};
    }
    catch {
       // ctx.response.status = 400;
        ctx.response.body = {status: "data receiving error"};

        return;
    };

});

module.exports = router;