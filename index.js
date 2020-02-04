const express = require('express');

const server = express();

server.use(express.json());

//////////////////////////////////////////////////////
// Query params = ?teste=1

// server.get('/teste', (req,res)=> {
//   const nome = req.query.nome;

//   return res.json({'message': `hello ${nome}!!`})
// })

//////////////////////////////////////////////////////
// Route params = /users/1

// server.get('/users/:id', (req,res)=> {
//   const {id} = req.params;

//   return res.json({'message': `buscando o usuário ${id}`})
// })

//////////////////////////////////////////////////////
// Request body = {"name": "francisco", "email": "francisco@gmail.com"}


//////////////////////////////////////////////////////

//localhost:3000/teste

//CRUD - Create, Read, Update, Delete

const users = ['Diego', 'Cláudio', 'Francisco']


//midllewar que retorna o método e url utilizadas e o tempo gasto na requisição
server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  
  next();

  console.timeEnd('Request')
})

//midlleware para verificar se o body da requisição está certo
function checkUserExists(req, res, next){
  if(!req.body.name) {
    return res.status(400).json({error: 'User name is required'});
  }

  return next();
}

//midlleware para verificar se há o index no array
function checkUserInArray(req, res, next){
  const user = users[req.params.index];

  if(!user) {
    return res.status(400).json({error: 'User dos not exists'});
  }

  req.user = user;

  return next();
}



//Retorna os dados
server.get('/users', (req,res) => {
  return res.json(users);
})

server.get('/users/:index', checkUserInArray, (req,res)=> {
  return res.json(req.user)
})

//Cria os dados
server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
})

//Edita algum dado

server.put('/users/:index', checkUserExists, checkUserInArray, (req,res)=>{
  const {index} = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
})

//Deleta algum dado

server.delete('/users/:index', checkUserInArray, (req,res)=>{
  const {index} = req.params;

  users.splice(index, 1);

  return res.json(users);
})


//iNICIA O SERVIDOR NA PORTA 3000
server.listen(3000);