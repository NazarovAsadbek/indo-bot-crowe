const {Telegraf, Scenes} = require('telegraf');
const {CMD_TEXT} = require('../config/consts');
const {backMenu} = require('../controllers/commands');
const {backButtonMenu, mainMenu, authButtonMenu} = require('../utils/buttons');

// первый шаг сцены
const stepOne = Telegraf.on('text', async ctx => {
    try {
        const msg = ctx.message;
        const numberText = msg.text
        console.log('login', msg, numberText)
        if (numberText === '/start') {
            return ctx.scene.enter('weatherNotI');
        }
        console.log('mainMenu', mainMenu)

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
            return ctx.scene.enter('weatherNotI');
        }
        console.log('login', msg, numberText)

        ctx.scene.state.password = numberText;
        ctx.reply(`login="${ctx.scene.state.login}", password:"${ctx.scene.state.password}"`, {
            ...authButtonMenu
        })
        // выходим со сцены
        ctx.scene.leave();
    } catch (error) {
        console.log(error)
        ctx.reply('Упс... Произошла какая - то ошибка');
    }
});

// передаём конструктору название сцены и шаги сцен
const whatWeatherNotIScene = new Scenes.WizardScene('weatherNotI', stepOne, stepTwo)

whatWeatherNotIScene.enter(ctx => ctx.reply('Введите логин'));

// вешаем прослушку hears на сцену
whatWeatherNotIScene.hears(CMD_TEXT.menu, ctx => {
    ctx.scene.leave();
    return backMenu(ctx);
})

// экспортируем сцену
module.exports = {
    whatWeatherNotIScene
}; 