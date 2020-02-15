const express = require('express')
const router = require('./router')

const app = express()
const port = 5005

app.use(express.json())

router(app)

app.listen(port, () => console.log(`Listening on port ${port}`))