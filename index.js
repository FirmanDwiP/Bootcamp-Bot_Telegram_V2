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

const PORT = process.env.PORT || 4499
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
const customer = process.env.CUSTOMER
const bot = new TelegramBot(token, { polling: true})
const axios = require('axios')


let cart = []
let total = 0;

bot.onText(/\/start|Hai|Hello|Assalamualaikum/, msg => {
    bot.sendMessage(msg.chat.id, `Hai ${msg.chat.first_name}, selamat datang di toko kami`)
    bot.sendMessage(msg.chat.id, `Silahkan lihat produk kami : /produk`)
    bot.sendMessage(msg.chat.id, `Jika ingin membaca tentang toko kami : /desc`)
    bot.sendMessage(msg.chat.id, `Profil : /saya`)
});

bot.onText(/\/desc/, msg => {
    bot.sendMessage(msg.chat.id, `FearMan Shop adalah Jasa Desain Grafis Profesional, Cepat, Tepat waktu dan Berkualitas.`)
});

bot.onText(/\/saya/, async (msg)=>{
    const id = msg.from.id
    try {
        const res = await axios.get(api + customer + '/' + id)
        bot.sendMessage(msg.chat.id, `Profil : \nNama : ${res.data.data.full_name} \nUsername: ${res.data.data.username}\nEmail: ${res.data.data.email}\nNoHP: ${res.data.data.phone_number}.`, {
            parse_mode:'Markdown'
        })
    } catch (error) {
        console.log(error);
        bot.sendMessage(msg.chat.id, `Profil anda belum tersedia.\nIsilah data dengan format  : \n\n/register *nama*-*username*-*email*-*NOHP*\n\nExample: /register *firman*-*fearman*-*fearman@mail.com*-*085870067006*`,{
            parse_mode:"Markdown"
        })
    }
})

bot.onText(/\/register (.+)/, async (msg, data)=>{

    const [full_name,username,email,phone_number] = data[1].split('-')
    try {
       const response = await axios.post(api + customer,{
           "data": {
                "attributes": {
                    "id": msg.from.id,
                    "full_name": full_name,
                    "username": username,
                    "email": email,
                    "phone_number": phone_number
                }
           }
       })
       bot.sendMessage(msg.chat.id, 'Berhasil')
    } catch (error) {
        console.log(error);
        bot.sendMessage(msg.chat.id, ' KLIK : /saya')
    }
})

bot.onText(/\/produk/, async (msg)=>{

    try {
        const response = await axios.get(api + product );
        const data = response.data.data;
        bot.sendMessage(msg.chat.id, 'DAFTAR PRODUK')
        data.forEach(el => {
            bot.sendMessage(
              msg.chat.id,
              `*Nama*: ${el.name}
        *Harga*: ${el.price}
        `,{
            "reply_markup": {
                "inline_keyboard": [
                    [
                        {
                            text: "Masukkan barang",
                            callback_data: el.id,
                        },
                    ],
                ],
            }, parse_mode:"Markdown"}
            );
          });
        bot.sendMessage(msg.chat.id,' /checkout untuk Melihat belanjaan anda')
    } catch (error) {
        console.log(error);
    }
})

// bot.on("callback_query", function onCallbackQuery(callbackQuery) {
//         const action = JSON.parse(callbackQuery.data)
//         const msg = callbackQuery.message
//         let x = {
//             cart: {
//                 id: action.id,
//                 action: 'cart'
//         }
//     }
//     const opts = {
//         chat_id: msg.chat.id,
//         message_id: msg.message_id,
//         reply_markup: {
//             inline_keyboard: [[
//                 {
//                     text: "Tambah Ke Keranjang",
//                     callback_data: JSON.stringify(x.cart)
//                 }
//             ]]
//         }
//     };
//     const data = {
//         chat_id: msg.chat.id,
//         message_id: msg.message_id,
//     };
//     let text;
	
// 	axios.get(api + product + action.id)
// 		.then(response => {
// 				if (cart.length == 0) {
// 					cart.push({
// 						name: response.data.data.name,
// 						price: response.data.data.price,
// 						quantity: 1
// 					});
// 					text = `Product berhasil ditambahkan ke keranjang, 
// Silahkan cek keranjang belanja anda /checkout`;
// 					bot.editMessageText(text, data);
// 				}
// 				else {
// 					let i = cart.findIndex(el => el.name == response.data.data.name);
// 					if (i != -1) {
// 						cart[i].quantity += 1;
//                         text = `Product berhasil ditambahkan ke keranjang, 
// Silahkan cek keranjang belanja anda /checkout`;
// 						bot.editMessageText(text, data);
// 					}
// 					else {
// 						cart.push({
// 							name: response.data.data.name,
// 							price: response.data.data.price,
// 							quantity: 1
// 						});
//                         text = `Product berhasil ditambahkan ke keranjang, 
// Silahkan cek keranjang belanja anda /checkout`;
// 						bot.editMessageText(text, data);
						
// 					}
// 				}
// 		})
// 		.catch(err => {
// 			console.log(err.message);
// 		});
// });

bot.onText(/\/checkout/,  (msg)=>{
    let data = JSON.stringify(cart)
    for (let i = 0; i < cart.length; i++) {
        total+= cart[i].quantity * cart[i].price
    }
    bot.sendMessage(msg.chat.id, `Berikut Ini List Belanjaan kamu :  
*${data}* 
Total Belanja Kamu Sebesar Rp. *${total}*`, { parse_mode: "Markdown" }
    )
})