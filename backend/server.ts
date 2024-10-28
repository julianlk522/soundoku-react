import cors from 'cors'
import express from 'express'
import { errorHandler } from './middleware/error'
import userRoutes from './routes/userRoutes'
import winRoutes from './routes/winRoutes'

const app = express()

//  middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(errorHandler)

//  routes
app.use('/users', userRoutes)
app.use('/wins', winRoutes)

const PORT = 1999
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
