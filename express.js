const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

let users = [
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

let messages = [
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
  const id = parseInt(req.params.id, 10);
  const foundUser = users.find(user => user.id === id);
  if (!foundUser) {
    return res.sendStatus(404);
  }
  return res.json(foundUser);
});

app.post('/users', (req, res) => {
  const { username, fullname } = req.body;
  if (!username || !fullname) {
    return res.status(400).send('Missed arguments');
  }

  if(users.some(user => user.username === username)) {
    return res.status(400).send('Username already in use');
  }

  const newUser = {
    id: new Date().getTime(),
    username, fullname,
    created: new Date(),
  };
  users.push(newUser);

  res.json(newUser);
});

app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { username, fullname } = req.body;

  if (!username || !fullname) {
    return res.status(400).send('Missed arguments');
  }

  const foundUserIndex = users.findIndex(user => user.id === id);
  if (foundUserIndex === -1) {
    return res.status(400).send('User not found');
  }

  if(users.some(user => user.id !== id && user.username === username)) {
    return res.status(400).send('Username already in use');
  }

  users = [
    ...users.slice(0, foundUserIndex),
    {
      ...users[foundUserIndex],
      username, fullname,
    },
    ...users.slice(foundUserIndex + 1),
  ]

  res.json(users[foundUserIndex]);
});

app.patch('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { username, fullname } = req.body;

  if (!username && !fullname) {
    return res.status(400).send('Missed arguments');
  }

  const foundUserIndex = users.findIndex(user => user.id === id);
  if (foundUserIndex === -1) {
    return res.status(400).send('User not found');
  }

  if(username && users.some(user => user.id !== id && user.username === username)) {
    return res.status(400).send('Username already in use');
  }

  users = [
    ...users.slice(0, foundUserIndex),
    {
      ...users[foundUserIndex],
      ...(username && { username }),
      ...(fullname && { fullname }),
    },
    ...users.slice(foundUserIndex + 1),
  ]

  res.json(users[foundUserIndex]);
});

app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  const foundUserIndex = users.findIndex(user => user.id === id);
  if (foundUserIndex === -1) {
    return res.status(400).send('User not found');
  }

  return res.sendStatus(501);
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

app.post('/messages', (req, res) => {
  const { from, to, message } = req.body;
  if (!from || !to || !message) {
    return res.status(400).send('Missed arguments');
  }

  const fromUser = users.find(user => user.id === from);
  if (!fromUser) {
    return res.status(400).send('Sender not found');
  }

  const toUser = users.find(user => user.id === to);
  if (!toUser) {
    return res.status(400).send('Recipient not found');
  }

  const newMessage = {
    id: new Date().getTime(),
    from, to, message,
    created: new Date(),
  };
  messages.push(newMessage);

  res.json(newMessage);
});

app.get('/users/:userId/messages', (req, res) => {
  const userId = parseInt(req.params.userId, 10);

  if (!users.some(user => user.id === userId)) {
    return res.status(400).send('User not found');
  }

  const userMessages = messages.filter(message => message.to !== userId)

  res.json(userMessages);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
