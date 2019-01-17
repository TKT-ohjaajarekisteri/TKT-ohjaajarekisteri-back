const { Client } = require('pg');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('json', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :json :status :response-time ms'))

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

app.get('/api/', async (request, response) => {
    response.json('Hello World');
})

app.get('/api/ohjaajat/', async (request, response) => {
    client.connect()
    const { rows } = await  client.query('SELECT * FROM ohjaaja;')
    client.end()
    response.json(rows) 
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})