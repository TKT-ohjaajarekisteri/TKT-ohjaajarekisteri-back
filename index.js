const { Client } = require('pg');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const config = require('./utils/config')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('json', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :json :status :response-time ms'))

app.get('/api/', async (request, response) => {
    response.json('Hello World');
})

app.get('/api/ohjaajat/', async (request, response) => {
    const client = new Client({
        connectionString: config.databaseUrl,
        ssl: true,
      });
    
    await client.connect()
    const { rows } = await client.query('SELECT * FROM ohjaaja;') 
    await client.end()
    response.json(rows) 
})

const PORT = config.port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})