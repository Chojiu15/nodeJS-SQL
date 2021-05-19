const client = require('../conf')
const express = require('express')
const orderRouter = express.Router()
orderRouter.use(express.json())
orderRouter.use(express.urlencoded())
const {body, validationResult} = require('express-validator')

const Validator = [
    body("price").isInt({ min: 1, max : 50 }),
    body("user_id").isInt({ min: 1}),
  ];


orderRouter.get('/api/orders', (req, res) => {
    client.query(`SELECT * FROM orders`,)
    .then(data => res.json(data.rows))
    .catch(err => res.json(err))
})

orderRouter.get('/api/orders/:id', (req, res) => {
    let {id} = req.params
    client.query(`SELECT * FROM orders WHERE id = $1`, [id] )
    .then(data => res.json(data.rows))
    .catch(err => res.json(err))
})

orderRouter.post('/api/orders', Validator, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }    const {price, user_id, date} = req.body
    client.query(`INSERT INTO orders (price, date, user_id) VALUES('${price}', 'August 19, 1975 23:15:30', ${user_id}) RETURNING *`)
    .then(data => res.json(data.rows))
    .catch(err => res.json(err))
})

orderRouter.put('/api/orders/:id', Validator, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
    let {id} = req.params
    const {price, user_id} = req.body
    client.query(`UPDATE orders SET price='${price}', user_id='${user_id}' WHERE id = ${id} RETURNING *`)
    .then(data => res.json(data.rows))
    .catch(err => res.json(err))

})

orderRouter.delete('/api/orders/:id', (req, res) => {
    let {id} = req.params
    client.query(`DELETE FROM orders WHERE id = ${id}`)
    .then(() => res.json('Item has been deleted'))
    .catch(err => res.json(err))
})


module.exports = orderRouter