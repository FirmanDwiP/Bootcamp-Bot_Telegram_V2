const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config({path:'.env'})

const indexRouter = require('./routes/index')
const CustomerRouter = require('./routes/Customers')
const ProductsRouter = require('./routes/Products')
const DriversRouter = require('./routes/Drivers')
const OrderRouter = require('./routes/Orders')
const OrderItemRouter = require('./routes/Order_items')

const app = express()

app.use(logger('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use('/', indexRouter)
app.use('/customer', CustomerRouter)
app.use('/product', ProductsRouter)
app.use('/driver', DriversRouter)
app.use('/order', OrderRouter)
app.use('/orderdetail', OrderItemRouter)

const PORT = process.env.PORT || 5500
app.listen(PORT, console.log(`Server running on port : ${PORT}`))


// const Botkit = require('botkit')
// const token = process.env.TOKEN
// const controller = new Botkit(token)

// controller.hears('hello','message', async (bot, message) => {

//     await bot.reply(message,'Howdy!');
  
//   });

//   const tacos = new BotkitConversation('tacos', controller);
//     tacos.say('Oh boy, taco time!');
//     tacos.ask('What type of taco do you want?', async(answer, convo, bot) => {

//         // do something with the answer!

//     }, 'type_of_taco');
//     tacos.say('Yum!!');
//     controller.addDialog(tacos);

//     controller.hears('tacos','message', async (bot, message) => {
//         await bot.beginDialog('tacos');
//     });

// const controller = botkit.consolebot()

// controller.spawn();

// controller.hears(
//     ['hello','world'],
//     'message_received',
//     function(bot, message){
//         bot.reply(message, 'Hello World')
//     }
// )

const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TOKEN
const api = process.env.URL
const product = process.env.PRODUCT
const bot = new TelegramBot(token, { polling: true})
const axios = require('axios')

bot.onText(/\/start|Hai|Hello|Assalamualaikum/, msg => {
    bot.sendMessage(msg.chat.id, `Hai ${msg.chat.first_name}, selamat datang di toko kami`)
    bot.sendMessage(msg.chat.id, `Silahkan lihat produk kami : /produk`)
    bot.sendMessage(msg.chat.id, `Jika ingin membaca tentang toko kami : /desc`)
});

bot.onText(/\/desc/, msg => {
    bot.sendMessage(msg.chat.id, `FearMan Shop adalah Jasa Desain Grafis Profesional, Cepat, Tepat waktu dan Berkualitas.`)
});

bot.onText(/\/produk/, msg =>{
    let chatid = msg.chat.id
    let inline_keyboard = (el) => [
        [
          {
            text: "Tambahkan ke keranjang",
            callback_data: JSON.stringify(el.cart)
          }
        ]
      ];
        
        axios.get(api+product)
            .then(res=> {
                const data = res.data.data;
                
                data.forEach(el => {
                    let ini = {
                        cart: {
                            id: el.id,
                            // action: 'cart'
                        }
                    };
                    
                    bot.sendMessage(
                        msg.chat.id,
                        `
            *Nama Barang*: ${el.name}
            *Harga*: Rp ${el.price}
            `,
                        {
                            // reply_markup: {
                            //     inline_keyboard: inline_keyboard(ini)
                            // },
                            parse_mode: "Markdown"
                        }
                    );
                }
                );
            })
            .catch(error => {
                console.log(error.message);
            });
    });