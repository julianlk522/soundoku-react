import cors from 'cors'
import express from 'express'
import { errorHandler } from './middleware/errorMiddleware'

const app = express()

//  middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(errorHandler)

// test connection
const PORT = 1999
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

app.get('/', (req, res) => {
	res.send('Hello Shworld!')
})
