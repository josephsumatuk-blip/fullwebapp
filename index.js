const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.static('dist'))
app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(
  morgan(
    'tiny'
  )
);

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  console.log(request.header)
  response.send(
    `<div>
    <p>Phonebook has info for ${persons.length} people.</p>
    <p>${new Date()}</p>
    </div>`
    ).end()
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  console.log(`request id: ${id}`)
  const person = persons.filter(person=>person.id===id)
  if (person.length===0)
    response.status(404).end()
  else
    response.json(person)

})

app.delete('/api/persons/:id', (request, response)=> {
  const id = request.params.id
  console.log(`Delete request id:${id}`)
  persons = persons.filter(person=>person.id !== id)
  response.status(204).end()
})


app.post('/api/persons', (request, response) => {
  const person = request.body
  console.log('Post request')

  // check if name is defined
  if (!person.name) {
    response.status(400).json({error: `person name is missing.`})
    return
  }
  
  if (!person.number) {
    response.status(400).json({error: `person number is missing.`})
    return
  }
  
  const nameinUC = person.name.toUpperCase() 
  console.log(nameinUC)
  if (persons.some(person=>{console.log(person.name.toUpperCase()); return person.name.toUpperCase()===nameinUC})) {
    response.status(404).json({error: `Person ${person.name} is already in Phonebook`})
    return
  }

  person.id = Math.round(Math.random() * 10000 + 1).toString()
  persons = persons.concat(person)
  response.json(person)
})


const PORT = process.env.PORT || 3001
const HOST = process.env.HOST || "localhost"
app.listen(PORT, HOST, () => {
  console.log(`Server running on port ${HOST}:${PORT}`)
})