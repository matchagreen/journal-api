import express from 'express'
import linksRoute from './routes/links.js'

const app = express()
const port = 3000

app.listen(port, () => {
    console.log(`Journal app listening on http://localhost:${port}`)
})

// Import routes
app.use('/', linksRoute)

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })