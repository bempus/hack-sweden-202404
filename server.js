
import express from "express"

const app = express()
console.log(process.cwd());
app.use('/', express.static(`${process.cwd()}/app/build`))

app.listen(3000)