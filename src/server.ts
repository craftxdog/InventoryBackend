import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { corsConfig } from './Config/Cors'
import { ConnectDB } from './Config/Connect'
import authRoutes from './Routes/AuthRoutes'
import projectRoutes from './Routes/ProjectRoutes'
import methodRoutes from './Routes/MethodRoutes'



dotenv.config();
ConnectDB();

const app = express();

app.use(cors(corsConfig))

// Logging
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/projects', projectRoutes)
app.use('/api/projects', methodRoutes)
app.use('/api/auth', authRoutes)


export default app


// import metodoRoutes from './Routes/MethodRoutes'
// import metodoCMCRoutes from './Routes/MethodCMCRoutes'
