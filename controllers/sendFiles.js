const {Telegraf, Scenes} = require('telegraf');
const {CMD_TEXT, URL_API} = require('../config/consts');
const {backMenu} = require('../controllers/commands');
const axios = require("axios");

// первый шаг сцены
const stepOne = Telegraf.on('document', async ctx => {
    try {
        const document = ctx.message;
        const fromUserId = ctx.message.from.id;
        console.log('file', document, fromUserId);
        if (ctx.message.text === '/start') {
            return ctx.scene.enter('sendFile');
        }

        ctx.reply('Отправьте файл(ы)')
        // указываем state для следующего шага сцены
        ctx.scene.state.login = ctx.message.text;
        const test = await axios.post("https://2768-95-214-211-177.ngrok-free.app/api/TG/Authenticate", {
            "login": "asadbek",
            "password": "12345",
            "telegramUserId": "5673712208"
        })
        console.log('test', test)
        // говорим, чтобы перешёл к следующему шагу
        ctx.wizard.next();
    } catch (error) {
        console.log(error)
        ctx.reply('Упс... Произошла какая - то ошибка');
    }
});

// второй шаг сцены
const stepTwo = Telegraf.on('text', async ctx => {
    try {
        const msg = ctx.message;
        const numberText = msg.text
        if (numberText === '/start') {
            return ctx.scene.enter('sendFile');
        }
        // console.log('login', msg, numberText)

        ctx.scene.state.password = numberText;
        ctx.reply(`login="${ctx.scene.state.login}", password:"${ctx.scene.state.password}"`)
        // выходим со сцены
        ctx.scene.leave();
    } catch (error) {
        console.log(error)
        ctx.reply('Упс... Произошла какая - то ошибка');
    }
});

// передаём конструктору название сцены и шаги сцен
const sendFileScene = new Scenes.WizardScene('sendFile', stepOne, stepTwo)

sendFileScene.enter(ctx => ctx.reply('Введите логин'));

// вешаем прослушку hears на сцену
sendFileScene.hears(CMD_TEXT.menu, ctx => {
    ctx.scene.leave();
    return backMenu(ctx);
})

// экспортируем сцену
module.exports = {
    sendFileScene
}; 