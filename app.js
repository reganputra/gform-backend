import express from 'express'
import dotenv from 'dotenv'
import apiRouter from './routes/api.js'
import connection from './connection.js'

const app = express()
const env = dotenv.config().parsed
app.use(express.json())
app.use(express.urlencoded({ extended : true }))

app.use('/', apiRouter)

// catch error 404
app.use((req, res)=>{
    res.status(404).json({message: '404_not_found'})
})

// MongoDB connection
connection()

app.listen(env.APP_PORT, () => {
    console.log(`listening on server port ${env.APP_PORT}`)
})
