import mongoose from 'mongoose';
import colors from 'colors'
import { exit } from 'node:process'

export const ConnectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_CONNECTION_STRING)
    const url = `${connection.host}:${connection.port}`
    console.log(colors.magenta.bold(`MongoDB is connected in : ${url} url`))
  } catch (error) {
    console.log(colors.red.bold(`Error >> ${error.message}`))
    exit(1)
  }
}
