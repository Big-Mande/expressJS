const express = require('express');
const morgan = require('morgan');
const app = express();
// this json parser functions by transforming the json into a Javascript object
// which is then attached to the body property of the request before the route handler is called. 
app.use(express.json());
app.use(morgan('tiny'));
let people = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

const generateId = () =>{
    const maxId = people.length > 0
    ? Math.max(...people.map(n => n.id)) + 1
    : 0;
    return maxId;
};

app.get('/',(request,response) => {
    response.send('<h1>wuss good bb</h1>')
});

app.get('/info', (request, response) => {
    const numPeople = people.length;
    const time = new Date();
    response.send(`<p>Phonebook has info for ${numPeople} people.</p>
                    <p>${time}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(people);
});

//convert id to number since we are comparing a JSON string to a num
app.get('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id);
    const person = people.find(target => target.id === id);
    response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = people.find(persons => persons.id === id);
    // check if person exists or not
    if(!person){
    return response.status(404).send(`ERROR person with the ID: ${id} does not exist in database.`);
    }
    people = people.filter(person => person.id !== person);
    response.status(200).send(`person with ID: ${request.params.id} has been eradicated from the database homie 🤪`);
});

app.post('/api/persons', (request,response) => {
    const body = request.body
    console.log(body);
    if(!body.number || !body.name) {
        return response.status(400).json({
            error: 'missing info make sure to include a name and number'
        });
    };

    if(people.some(person => person.name === body.name)){
        return response.status(400).json({
        error: "name must be unique"      
        });
    };

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    };
    people = people.concat(person);
    response.json(people);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`server running on port ${PORT}...`));

