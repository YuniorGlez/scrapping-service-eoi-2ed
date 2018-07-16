const express = require('express');
const app = express();

const axios = require('axios');
const cheerio = require('cheerio');
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

app.get('/exec', (req, res) => {
  doWebScrapping();
})

function doWebScrapping() {
  const promises = [];
  promises.push(USERS.find());
  promises.push(scrapMarca());
  // promises.push(scrapSport());
  // promises.push(scrapAs());

  Promise.all(promises)
    .then(([users, news1]) => {
      const news = [...news1];

      users.forEach(user => {
        let newsFiltered = [];
        newsFiltered = news.filter(notice => notice.title.toLowerCase().includes(user.query.toLowerCase()));
        console.log(newsFiltered);
        sendEmail(user.email, newsFiltered);
      });

    })

}

function sendEmail(email, news) {
  console.log(`Le envío un correo al usuario ${email} con ${news.length} noticias`);
}


function scrapMarca() {
  return axios.get('http://www.marca.com/futbol.html?intcmp=MENUPROD&s_kw=futbol')
    .then(response => {
      const news = [];
      const $ = cheerio.load(response.data);
      const titles = $('article h2 a');
      titles.each((title, element) => {
        const titleElement = $(element);
        news.push({ title: titleElement.text() });
      })
      return news;
    })
}
function scrapSport() {
  return axios.get('http://www.marca.com/futbol.html?intcmp=MENUPROD&s_kw=futbol')
    .then(response => {
      const news = [];
      const $ = cheerio.load(response.data);
      const titles = $('article h2 a');
      titles.each((title, element) => {
        const titleElement = $(element);
        news.push(titleElement.text());
      })
      return news;
    })
}
function scrapAs() {
  return axios.get('http://www.marca.com/futbol.html?intcmp=MENUPROD&s_kw=futbol')
    .then(response => {
      const news = [];
      const $ = cheerio.load(response.data);
      const titles = $('article h2 a');
      titles.each((title, element) => {
        const titleElement = $(element);
        news.push(titleElement.text());
      })
      return news;
    })
}



app.listen(4000);