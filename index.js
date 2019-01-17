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

app.get('/api/ohjaajat', async (request, response) => {
    client.connect()

    await client.query('SELECT * FROM ohjaaja;', (err, res) => {
    if (err) throw err
    for (let row of res.rows) {
        console.log((JSON.stringify(row)))
    }
    client.end()
  })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})