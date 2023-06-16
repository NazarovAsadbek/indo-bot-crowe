// кнопки для бота
const {Markup} = require('telegraf');
const {CMD_TEXT} = require('../config/consts');

const mainMenu =
    Markup.keyboard([
        [CMD_TEXT.authorization],
    ]).resize()

const backButtonMenu =
    Markup.keyboard([
        [CMD_TEXT.menu],
    ]).resize()

const authButtonMenu =
    Markup.keyboard([
        [CMD_TEXT.registraion],
        [CMD_TEXT.sendFiles],
        [CMD_TEXT.menu],
    ]).resize()

module.exports = {
    mainMenu,
    backButtonMenu,
    authButtonMenu
}