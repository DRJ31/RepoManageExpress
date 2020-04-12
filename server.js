import express from 'express'
import router from './router'
import { PORT } from './util/config'

const app = express()

app.use(express.json())

router(app)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))