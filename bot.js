const {Scenes, Telegraf} = require('telegraf');
// сессии для mongoose 
const {session} = require("telegraf-session-mongoose");
// тектовые команды
const {CMD_TEXT} = require('./config/consts');
// подключение всех команд для бота
const {
    start,
    backMenu,
    startWhatWeather,
    authorization_wizard,
    registration_wizard,
    sendFile,
    exampleStartCallback,
} = require('./controllers/commands');

const {authorizationScene} = require('./controllers/Authorization');
const {registrationScene} = require('./controllers/Registraion');
const {whatWeatherScene} = require('./controllers/weatherScene');
const {sendFileScene} = require('./controllers/sendFiles');

// инициализация
const bot = new Telegraf(process.env.BOT_TOKEN);
// регистрируем сцены
const stage = new Scenes.Stage([whatWeatherScene, authorizationScene, registrationScene, sendFileScene])

const setupBot = () => {
    // подключение промежуточных обработчиков (middleware) 
    // сессий с коллекцией в бд и сцен
    bot.use(session({collectionName: 'sessions'}));
    bot.use(stage.middleware())
    // обычный middleware (пример)
    bot.use((ctx, next) => {
        // console.log(ctx)
        return next()
    })
    // команда "/start" аналог cmd.command('start', handler)
    bot.start(start);
    // прослушка на сообщение
    bot.hears(CMD_TEXT.menu, backMenu)
    bot.hears(CMD_TEXT.authorization, authorization_wizard)
    bot.hears(CMD_TEXT.registraion, registration_wizard)
    bot.hears(CMD_TEXT.sendFiles, sendFile)

    // пример использования callback button
    bot.hears('start_scene_callback', exampleStartCallback)
    // ловим callback и заходим в сцену
    bot.action('test_callback', authorization_wizard)
    bot.action('test_callback', registration_wizard)

    return bot;
}


module.exports = {
    setupBot
}