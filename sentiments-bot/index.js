const Telegraf = require('telegraf');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
const BOT_TOKEN = process.env.BOT_TOKEN || 'your_token';

const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx)=> ctx.reply(`Hi, ${ctx.message.from.first_name}`));
bot.help((ctx)=>ctx.reply('This bot will detect sentiments of text'));
bot.hears(/.*/, (ctx)=>{
  const result = sentiment.analyze(ctx.message.text);
  return ctx.reply(
    `Оценка (все слова): ${result.score}
    Средняя по тексту: ${result.comparative}
    `
  );
});
bot.launch();
console.log('Bot started');