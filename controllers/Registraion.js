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

        ctx.reply('Введите пароль');
        // указываем state для следующего шага сцены
        ctx.scene.state.new_login = numberText;
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

        ctx.reply('Введите номер телефона нового пользователя в следующем формате: +998909998877');
        ctx.scene.state.new_password = numberText;

        // выходим со сцены
        ctx.wizard.next();
    } catch (e) {
        console.log(e)
    }
});

// третий шаг сцены
const stepThree = Telegraf.on('text', async ctx => {
    try {
        const msg = ctx.message;
        const numberText = msg.text

        ctx.scene.state.new_phone_number = numberText;

        console.log("login:", ctx.scene.state.new_login, "password:", ctx.scene.state.new_password, "phonenumber:", ctx.scene.state.new_phone_number);
        const response = await axios.post("https://2768-95-214-211-177.ngrok-free.app/api/TG/RegisterUser", {
            login: ctx.scene.state.new_login,
            password: ctx.scene.state.new_password,
            phoneNumber: ctx.scene.state.new_phone_number
        })

        if (response.status === 200) {
            ctx.reply(`Вы успешно зарегистрировали нового пользователя ${response.data.login}${!!response.data.phoneNumber ? ", " + response.data.phoneNumber : ""}!`, {
                ...authButtonMenu
            })
        } else {
            throw Error('Произошла ошибка при регистрации нового пользователя.')
        }
        // выходим со сцены
        ctx.scene.leave();
    } catch (e) {
        ctx.reply(`Произошла ошибка при авторизации. Код: ${e.response.data.status}. Описание ошибки: ${e.response.data.title}. Пожалуйста повторите попытку!`, {
            ...mainMenu
        })
    }
});

// передаём конструктору название сцены и шаги сцен
const registrationScene = new Scenes.WizardScene('registration_wizard', stepOne, stepTwo, stepThree)

registrationScene.enter(ctx => ctx.reply('Введите логин нового пользователя'));

// вешаем прослушку hears на сцену
registrationScene.hears(CMD_TEXT.menu, ctx => {
    ctx.scene.leave();
    return backMenu(ctx);
})

// экспортируем сцену
module.exports = {
    registrationScene
};