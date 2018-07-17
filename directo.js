const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();


mongoose.connect('mongodb://localhost/directo-scrapping');


const userSchema = new mongoose.Schema({
  email: String,
  query: String,
  newspapers: String
})

const USERS = mongoose.model('user', userSchema);

app.get('/subscribe', (req, res) => {
  const { email, query, newspapers } = req.query;
  USERS.create({ email, query, newspapers })
    .then(response => res.status(201).json(response))
    .catch(err => res.status(500).json(err));
})

app.get('/sendMeAnEmailRightNowMadafaca', (req, res) => {
  const email = req.query.email;
  getUserByEmail(email).then(user => {

    const loquequiere = user.query;

    if ( user.newspapers.includes('marca')){
      scrapeaMarca().then(news => {
        
        const lasquetuquieres = news.filter( notice => {
          return notice.title.toLowerCase().includes(user.query.toLowerCase());
        } )
        sendEmail(user.email, lasquetuquieres);
      })
    }
  })
})

function sendEmail(email, array){
  
}

function scrapeaMarca() {
  return axios.get('http://www.marca.com/futbol.html?intcmp=MENUPROD&s_kw=futbol')
    .then(response => {
      const news = [];
      const $ = cheerio.load(response.data, { decodeEntities: true });
      const titles = $('article h2 a');

      titles.each((idx, element) => {
        const titleElement = $(element);
        news.push({ title: titleElement.text(), newspaper: 'marca' });
      })
      return news;
    })
}

function getUserByEmail(email) {
  return USERS.findOne({ email })
    .then(response => {
      return response;
    })
}


app.listen(4001);

