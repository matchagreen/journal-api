import express from 'express'
import linksRoute from './routes/links/index.js'
import bodyParser from 'body-parser'

const app = express()
const port = 3000

app.listen(port, () => {
    console.log(`Journal app listening on http://localhost:${port}`)
})

app.use(bodyParser.json())

// Import routes
app.use('/', linksRoute)

app.use((err: any, req: any, res: any, next: any) => {
    if (err.name === 'JsonSchemaValidation') {
        const validations = err.validations
        res.status(400).json({errors: validations})
    }
})

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })