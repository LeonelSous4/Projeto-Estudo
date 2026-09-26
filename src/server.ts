import express from "express"
import { routes } from "./routes"
import { errorHandling } from "./middlewares/error-handling"

const PORT = 7777

const app = express()

app.use(express.json())

app.use(routes)

app.use(errorHandling)

app.listen(PORT, () => console.log(`Sever is running on port ${PORT}`))
