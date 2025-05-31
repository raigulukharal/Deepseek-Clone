import express from "express"
import CookieParser from "cookie-parser"
import dotenv from 'dotenv'
import cors from "cors"
import mongoose from 'mongoose'
import promptRouter from './routes/prompt.route.js'
import userRouter from './routes/user.route.js'

dotenv.config()
const PORT=process.env.PORT || 4002
const app = express()


mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log("Connect to DataBase Successfully")
}).catch((error)=>console.error("Do not Connect to DataBae",error))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json())
app.use(CookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials: true,
  methods:["GET","POST","PUT","DELETE"],
  allowedHeaders:["Content-type","Authorization"]
}))


app.use("/api/v1/user",userRouter)
app.use("/api/v1/deepseekai", promptRouter)

app.listen(PORT, () => {
  console.log(` Server is listening on port ${PORT}`)
})

