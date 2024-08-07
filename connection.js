import dotenv from 'dotenv'
import mongoose from 'mongoose'

const env = dotenv.config().parsed

const connection = () => {
    // connect to database
mongoose.connect( env.DB_URI, {
    dbName: env.DB_NAME
})
    const connection = mongoose.connection
    connection.on('error', console.error.bind(console, 'Connection Error'))
    connection.once('open', () => {
        console.log(`Connected to database: ${env.DB_NAME}`)
})
}


export default connection