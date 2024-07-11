const { updateOne, getAll, createOne, deleteOne } = require('../handlerFactory')
const Message = require('../models/chat/messageModel')

exports.getChat = getAll(Message)
exports.createMessage = createOne(Message)
exports.updateMessage = updateOne(Message)
exports.deleteMessage = deleteOne(Message)

// exports.getCart = async function (req, res, next) {
//   const products = await fetch('https://fakestoreapi.com/products')
//   const parsedProducts = await products.json()

//   const sortedByPrice = parsedProducts.sort((a, b) => a.price - b.price)

//   const categories = []
//   const filteredProducts = sortedByPrice.filter((el, i) => {
//     if (!categories.includes(el.category)) {
//       categories.push(el.category)

//       return true
//     }
//   })

//   let budget = 0

//   function insert() {
//     sortedByPrice.forEach((el) => {
//       if (budget + el.price < 500) {
//         budget += el.price

//         filteredProducts.push(el)
//       }
//     })

//     if (budget + sortedByPrice[0].price < 500) {
//       insert()
//     }
//   }
//   insert()

//   res.status(200).json({
//     budget: budget.toFixed(2),
//     products: filteredProducts,
//   })
// }
