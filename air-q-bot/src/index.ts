const {Telegraf, Markup} = require("telegraf");
const axios = require("axios");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '5236548325:AAGRB7V_VPDWBvotMJ_M6wy21izikZxy_sA';
const AIR_TOKEN = process.env.AIR_TOKEN || '6286ff8928faba63d0aeada154f5ea2d591d6211';
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

const keyboard = Markup.inlineKeyboard([
    Markup.button.callback('Якість повітря', 'air')
])

bot.settings(async (ctx:any) => {
    await ctx.setMyCommands([
      {
        command: '/air',
        description: 'Якість повітря'
      },
    ])
    return ctx.reply('Ok')
})

bot.help(async (ctx:any) => {
    const commands = await ctx.getMyCommands()
    const info = commands.reduce((acc:any, val:any) => `${acc}/${val.command} - ${val.description}\n`, '')
    return ctx.reply(info)
})

bot.start((ctx:any) => {
    return ctx.reply("Цей бот відправляє вам якість повітря - лише відправте геолокацію :-)");
});

const getCurrentAirQuality = async (ctx:any, ) => {
    try {
        const location = ctx.message.location;
        const data = await axios.get(
            `https://api.waqi.info/feed/geo:${location.latitude};${location.longitude}/?token=${AIR_TOKEN}`
        );

        const  {data: {data: {aqi}}} = data;

         ctx.reply(`Якість повітря у вашому регіоні - ${aqi}`);
         return ctx.replyWithPhoto({
            url: 'https://focus.ua/static/storage/thumbs/2176x/4/2d/ee863620-7c7f22cd610ed87f6259b819744ae2d4.png',
            filename: 'info.png'
          })
    } catch (error) {

        return ctx.reply('Будь-ласка відправте свою геопозіцию!');
    }
}


bot.action('air', getCurrentAirQuality);
bot.command('/air', getCurrentAirQuality);
bot.on('message', getCurrentAirQuality)

bot.start(getCurrentAirQuality)
bot.launch()
