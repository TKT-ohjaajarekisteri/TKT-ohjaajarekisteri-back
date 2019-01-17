const { Client } = require('pg');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

app.use(morgan(':method :url :json :status :response-time ms'))

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

app.get('/api/', async (request, response) => {
    response.json('Hello World');
})

app.get('/api/ohjaajat', async (request, response) => {
    client.connect()
    const results = [];
    await client.query('SELECT * FROM ohjaaja;', (err, res) => {
        if (err) {
            client.end()
            response.status(400).send({ error: err })
        }
        for (let row of res.rows) {
            results.push(row);
        }
    })
  client.end()
  response.json(results) 

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})