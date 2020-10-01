const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const users = [
  {
    id: 1,
    username: 'john',
    fullname: 'Johnny Walker',
    created: new Date('2020-06-01T23:59:59.999Z')
  },
  {
    id: 2,
    username: 'betty',
    fullname: 'Betty Crockett',
    created: new Date('2020-06-01T23:59:59.999Z')
  }
];

const messages = [
  {
    id: 1,
    from: 1,
    to: 2,
    message: 'hey betty',
    created: new Date('2020-06-05T23:59:59.999Z')
  },
  {
    id: 2,
    from: 2,
    to: 1,
    message: 'hey johnny',
    created: new Date('2020-06-06T23:59:59.999Z')
  },
  {
    id: 3,
    from: 1,
    to: 2,
    message: 'wanna grab a shake?',
    created: new Date('2020-06-07T01:59:59.999Z')
  },
  {
    id: 4,
    from: 2,
    to: 1,
    message: 'getta out here ya jerk',
    created: new Date('2020-06-08T01:59:59.999Z')
  },
]

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/users/:id', (req, res) => {
  const foundUser = users.find(user => user.id === parseInt(req.params.id, 10));
  if (!foundUser) {
    return res.sendStatus(404);
  }
  return res.json(foundUser);
});

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.get('/messages/:id', (req, res) => {
  const foundMessage = messages.find(message => message.id === parseInt(req.params.id, 10));
  if (!foundMessage) {
    return res.sendStatus(404);
  }
  return res.json(foundMessage);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
