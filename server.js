var express = require('express');
var bodyParser=require('body-parser');
var apiRouter   = require('./apiRouter.js').router;

//instantiate server
var server=express();

//configuring body-parser
server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json());

server.get('/',function(req,res){
  res.setHeader('Content-Type','text/html');
  res.status(200).send('<h1> nfjfs </h1>')
});

//connect router
server.use('/api',apiRouter);

//server.listen(3000)
server.listen(3000,() => console.log('Express server is runnning at part no : 3000'));