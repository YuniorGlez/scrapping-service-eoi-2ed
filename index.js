const express = require('express');
const app = express();

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/scraping-service');

const USERS = mongoose.model('user', new mongoose.Schema({ email: String, query: String, newspapers: String }))

app.get('/subscribe', (req, res) => {
  const { newspapers, email, query } = req.query;
  USERS.create({ newspapers, email, query })
    .then(newUser => {
      res.send('Creado con éxito');
    })
    .catch(newUser => {
      res.send('Hubo algún error');
    })
});

function doWebScrapping (){
  const promises = [];
  promises.push(USERS.find());
  promises.push(scrapMarca());
  promises.push(scrapSport());
  promises.push(scrapAs());

}

function scrapMarca(){
  
}
function scrapSport(){
  
}
function scrapAs(){
  
}



app.listen(4000);