import express from 'express'
const app = express()
const port = 3000

app.listen(port, () => {
    console.log(`Journal app listening on http://localhost:${port}`)
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})