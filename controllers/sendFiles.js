const {Telegraf, Scenes} = require('telegraf');
const {CMD_TEXT, URL_API} = require('../config/consts');
const {backMenu} = require('../controllers/commands');
const axios = require("axios");

// первый шаг сцены
const stepOne = Telegraf.on('document', async ctx => {
    try {
        const document = ctx.message;
        const fileUrl = await ctx.telegram.getFileLink(document.document.file_id)

        if (ctx.message.text === '/start') {
            return ctx.scene.enter('authorization_wizard');
        }

        // указываем state для следующего шага сцены
        ctx.reply(`Файл (${document.document.file_name?.toString()?.split('.')[0]}) отправляеется... Пожалуйста подождите⌛️!`)
        const response = await axios.post(`https://83f0-95-214-211-145.ngrok-free.app/api/TG/SendByAdmin2?url=${fileUrl}&fileName=${document.document.file_name}`)
        if (response?.status === 200) {
            ctx.reply(`Файл (${document.document.file_name}) успешно отправлен!`)
        }
        // говорим, чтобы перешёл к следующему шагу
        ctx.scene.leave();
    } catch (error) {
        if (error.response.data === 'User not found') {
            const file_name = ctx.message.document.file_name.toString()?.split('.')

            ctx.reply(`❌ Ошибка! Не найден пользователь с таким логином (${file_name[0]}) Статус: ${error.response.status}`);
        } else {
            ctx.reply(`❌ Ошибка! Неизвестная ошибка. Статус: ${error.response.status}`);
        }
    }
});

// передаём конструктору название сцены и шаги сцен
const sendFileScene = new Scenes.WizardScene('sendFile', stepOne)

sendFileScene.enter(ctx => ctx.reply('Прикрепите файл(ы). Обратите внимание, название файла, должно быть логином пользователя, которому Вы хотите отправить файл'));

// вешаем прослушку hears на сцену
sendFileScene.hears(CMD_TEXT.menu, ctx => {
    ctx.scene.leave();
    return backMenu(ctx);
})

// экспортируем сцену
module.exports = {
    sendFileScene
}; 