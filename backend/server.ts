import cors from 'cors'
import express from 'express'
import { errorHandler } from './middleware/error'

const app = express()

//  middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(errorHandler)

//  routes
import userRoutes from './routes/userRoutes'
app.use('/users', userRoutes)

import winRoutes from './routes/winRoutes'
app.use('/wins', winRoutes)

const PORT = 1999
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
