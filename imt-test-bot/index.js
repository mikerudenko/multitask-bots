const BOT_TOKEN = process.env.BOT_TOKEN || 'your_token';

const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const WizardScene = require('telegraf/scenes/wizard');

const bmiValue = require('./bmiValue');

const bot = new Telegraf(BOT_TOKEN);


const createScene = new WizardScene('create', 
(ctx)=>{
  ctx.reply('1. Введите Ваш Вес (кг):')
  return ctx.wizard.next();
},
(ctx)=>{
  ctx.wizard.state.weight = parseInt(ctx.message.text, 10);
  ctx.reply('2. Введите Ваш рост (см):');
  return ctx.wizard.next();
},
(ctx)=>{
  ctx.wizard.state.height = parseInt(ctx.message.text, 10) / 100;
  const weight = ctx.wizard.state.weight;
  const height = ctx.wizard.state.height;
  const bmi = weight / height / height;

  ctx.reply(`Ваш индекс массы тела ${bmi} - ${bmiValue(bmi)}`);
  ctx.reply(`Спасибо! Попбобовать еще ращ - /start `)
  return ctx.scene.leave();
}
);

const stage = new Stage();
stage.register(createScene);

bot.use(session());
bot.use(stage.middleware());

bot.start((ctx)=>ctx.scene.enter('create'));

bot.launch().
then(res=>console.log('Started'))
.catch(err=>console.log(err));