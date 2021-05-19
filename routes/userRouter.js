const client = require('../conf')
const express = require('express')
const userRouter = express.Router()
userRouter.use(express.json())
userRouter.use(express.urlencoded())
const {body, validationResult} = require('express-validator')

const Validator = [
    body("first_name").isLength({ min: 2, max : 10 }),
    body("last_name").isLength({ min: 2}),
    body("age").isInt({max : 50})
  ];
  

userRouter.get('/api/users', (req, res) => {
    client.query(`SELECT * FROM users`,)
    .then(data => res.json(data.rows))
    .catch(err => res.json(err))
})

userRouter.get('/api/users/:id', (req, res) => {
    let {id} = req.params
    client.query(`SELECT * FROM users WHERE id = $1`, [id] )
    .then(data => res.json(data.rows))
    .catch(err => res.json(err))
})

userRouter.get('/:id/orders', (req, res) => {
    let {id} = req.params
    // client.query(`SELECT * FROM orders WHERE user_id = ${id}`)
    client.query(`SELECT users.first_name, users.last_name, orders.price, orders.date FROM users JOIN orders ON users.id = orders.user_id WHERE users.id= ${id}`)
    .then(data => res.json(data.rows))
    .catch(err => res.json(err))
})

// userRouter.put('/:id/check-inactive', (req, res) => {
//     const { id } = req.params;
//     client.query(`
//     SELECT users.first_name, users.last_name, COUNT(orders.date) AS order_count
//     FROM users 
//     LEFT JOIN orders 
//     ON users.id = orders.user_id
//     WHERE users.id = $1
//     GROUP BY users.first_name, users.last_name
//     `, [id])
//     .then(data => {
//         const [user] = data.rows
//         if (!user) res.status(404).send('No user matching that id')
//         if (parseInt(user.order_count, 10) < 1) {
//             return client.query(`UPDATE users SET active=false WHERE id=$1 RETURNING *`, [id])
//         }
//         else res.send('This user has already place some orders before')
//     })
//     .then(data => {
//         res.json(data.rows)
//     })
//     .catch(err => console.error(err))
// })

userRouter.put('/:id/check-inactive', (req, res) => {
    let {id} = req.params
    client.query(`UPDATE users SET active=false WHERE id = ${id} AND id NOT IN(SELECT user_id FROM orders) RETURNING *`)
    .then(data => res.json(data.rows))
    .catch(err => res.json(err))
})


userRouter.post('/api/users', Validator, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

    const {first_name, last_name, age} = req.body
    client.query(`INSERT INTO users (first_name, last_name, age) VALUES('${first_name}', '${last_name}', '${age}') RETURNING *`)
    
    .then(data => res.json(data.rows))
    .catch(err => res.json(err))
   
})

userRouter.put('/api/users/:id', Validator, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
    let {id} = req.params
    const {first_name, last_name, age} = req.body
    client.query(`UPDATE users SET first_name='${first_name}', last_name='${last_name}', age='${age}' WHERE id = ${id} RETURNING *`)
    .then(data => res.json(data.rows))
    .catch(err => res.json(err))

})

userRouter.delete('/api/users/:id', (req, res) => {
    let {id} = req.params
    client.query(`DELETE FROM users WHERE id = ${id}`)
    .then(() => res.json('Item has been deleted'))
    .catch(err => res.json(err))
})




module.exports = userRouter