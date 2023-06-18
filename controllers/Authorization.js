const {Telegraf, Scenes} = require('telegraf');
const {CMD_TEXT, URL_API} = require('../config/consts');
const {backMenu} = require('../controllers/commands');
const {mainMenu, authButtonMenu} = require('../utils/buttons');
const axios = require("axios");

// первый шаг сцены
const stepOne = Telegraf.on('text', async ctx => {
    try {
        const msg = ctx.message;
        const numberText = msg.text
        if (numberText === '/start') {
            return ctx.scene.enter('authorization_wizard');
        }

        ctx.reply('Введите пароль')
        // указываем state для следующего шага сцены
        ctx.scene.state.login = numberText;
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
            return ctx.scene.enter('authorization_wizard');
        }

        ctx.scene.state.password = numberText;

        const response = await axios.post(`https://2768-95-214-211-177.ngrok-free.app/api/TG/Authenticate?login=${ctx.scene.state.login}&password=${ctx.scene.state.password}`);

        if (response.status === 200) {
            if (!!response?.data?.isAdmin) {
                ctx.reply(`Вы успешно авторизировались ${response.data.login}${!!response.data.phoneNumber ? ", " + response.data.phoneNumber : ""}!`, {
                    ...authButtonMenu
                })
            } else {
                ctx.reply(`Вы успешно авторизировались ${response.data.login}${!!response.data.phoneNumber ? ", " + response.data.phoneNumber : ""}!`, {
                    ...mainMenu
                })
            }
        } else {
            throw Error('Произошла ошибка авторизации')
        }
        // выходим со сцены
        ctx.scene.leave();
    } catch (e) {
        console.log(e)
        ctx.reply(`Произошла ошибка при авторизации. Код: ${e.response.data.status}. Описание ошибки: ${e.response.data.title}. Пожалуйста повторите попытку!`, {
            ...mainMenu
        })
    }
});

// передаём конструктору название сцены и шаги сцен
const authorizationScene = new Scenes.WizardScene('authorization_wizard', stepOne, stepTwo)

authorizationScene.enter(ctx => ctx.reply('Введите логин'));

// вешаем прослушку hears на сцену
authorizationScene.hears(CMD_TEXT.menu, ctx => {
    ctx.scene.leave();
    return backMenu(ctx);
})

// экспортируем сцену
module.exports = {
    authorizationScene
};