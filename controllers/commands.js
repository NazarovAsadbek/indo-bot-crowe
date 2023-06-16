// команды для бота 

const {
    mainMenu,
    startCallbackButton
} = require("../utils/buttons");

const start = (ctx) =>
    ctx.reply(`
        Привет, ${ctx.update.message.from.first_name}!`, {
        disable_web_page_preview: true,
        parse_mode: 'HTML',
        ...mainMenu
    });

const backMenu = ctx => {
    ctx.reply(`Ты находишься в меню`, {
        disable_web_page_preview: true,
        parse_mode: 'HTML',
        ...mainMenu
    });
}
const startWhatWeather = ctx => {
    // console.log(ctx)
    /*
    1. Бот запрашивает геопозицию человека в ТГ
    2. Человек по кнопке или через вложения отправляет своё местоположение
    3. Нам приходят даннные и мы отправляет через API запрос по погоде по координатам его
    4. Обработка
    */
    // входим в зарегистрированную в bot.js (15 строка) сцену
    return ctx.scene.enter('weather');
};

const whatWeatherNotI = ctx => ctx.scene.enter('weatherNotI');
const sendFile = ctx => ctx.scene.enter('sendFile');

const exampleStartCallback = (ctx) =>
    ctx.reply('😳 Прислали сообщение с inline-keyboard и callback button.\nОна ведёт на сцену "weatherNotI"', {
        ...startCallbackButton
    })


module.exports = {
    start,
    backMenu,
    sendFile,
    startWhatWeather,
    whatWeatherNotI,
    exampleStartCallback
}