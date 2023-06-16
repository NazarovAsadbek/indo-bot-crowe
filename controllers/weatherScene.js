const {Scenes} = require('telegraf');
const {backMenu} = require('./commands');
const {backButtonMenuAndLocation} = require('../utils/buttons');
const {CMD_TEXT} = require('../config/consts');

// передаём конструктору название сцены и шаги сцен
const whatWeatherScene = new Scenes.BaseScene('weather');

// при входе в сцену отправляется сообщение
whatWeatherScene.enter(ctx => ctx.reply('Введите логин'));

// создание прослушки на метод location tg
whatWeatherScene.on('location', async ctx => {
    try {
        console.log('enter', ctx)
        const msg = ctx.message;
        ctx.reply('💫 Ищу в базе данных погоду');
    } catch (error) {
        console.log(error)
        ctx.reply('Упс... Произошла какая - то ошибка');
    }
})

// вешаем текстовую прослушку hears на сцену
whatWeatherScene.hears(CMD_TEXT.menu, ctx => {
    // выходим со сцены
    ctx.scene.leave();
    return backMenu(ctx);
})

// экспортируем сцену
module.exports = {
    whatWeatherScene
};
