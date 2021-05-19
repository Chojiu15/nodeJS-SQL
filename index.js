const express = require('express')
const orderRouter = require('./routes/orderRouter')
const app = express()
const port = 3002
const userRouter = require('./routes/userRouter')


app.get('/', (req, res) => {
res.send('Welcome to my API')
})

app.use('/', userRouter)
app.use('/', orderRouter)


app.listen(port, console.log('Server is running'))