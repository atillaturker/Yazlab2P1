const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Axios'u içe aktar
const scrap = require('./scraptest'); // scrap.js dosyasının bulunduğu yolu belirtin
const mongoose = require('mongoose');
const { MongoClient, ObjectId } = require('mongodb');
const { Client } = require('@elastic/elasticsearch')



const app = express();
const port = 3000;
const url = 'mongodb://localhost:27017/akademik';



async function createIndex() {
  const eClient = new Client({
    node: 'https://af40fca347b64b9d949daf72bade11e6.us-central1.gcp.cloud.es.io:443', // Elasticsearch endpoint
    auth: {
      apiKey: { // API key ID and secret
        id: '07052d2cfafc4c33a78fab5c95c68684:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJGFmNDBmY2EzNDdiNjRiOWQ5NDlkYWY3MmJhZGUxMWU2JDM4NDAxMDQ0Y2QxNTQzMmY4YWE4OTk2ZDk2MWU1YzA2',
        api_key: 'essu_VkcxRVRsUTBORUpFUTBnelNXbEtiWE5WTjBvNmFWRm1TbFptT0c1VFQwZG5XRkExVmxSa2FHZDFVUT09AAAAAEXbCWA=',
      }
    }
  });

  try {
    await eClient.indices.create({ index: 'my_index' });
    console.log('Index created successfully!');
  } catch (error) {
    console.error('Error creating index:', error);
  }
}

createIndex();








mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const client = new MongoClient(url);

const articleSchema = new mongoose.Schema({
  articleReferences: [String],
  articlePublisher: String,
  articleTitle: String,
  articleAuthor: String,
  articleType: String,
  articleDate: String,
  articleKeywords: [String],
  articleAbstract: [String],
  articlePdfLink: String,
  articleLink: String,
});





const Article = mongoose.model('Article', articleSchema);


app.use(cors()); // Tüm kaynaklara erişim izni vermek için

const bodyParser = require('body-parser');
app.use(bodyParser.json());



// Rotalar
app.get("/getArticles", (req, res) => {
  Article.find()
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});


async function getArticleDataById(articleId) {
  try {
    // MongoDB'ye bağlan
    await client.connect();

    // Veritabanı ve koleksiyon referanslarını al
    const db = client.db('akademik');
    const collection = db.collection('articles');

    // MongoDB'den belirli bir makaleyi ID'ye göre getir
    const query = { _id: new ObjectId(articleId) };
    const article = await collection.findOne(query);

    return article; // Makale verilerini döndür
  } catch (error) {
    throw error;
  } finally {
    // MongoDB bağlantısını kapat
    await client.close();
  }
}

app.get('/article/:id', async (req, res) => {
  const articleId = req.params.id;
  try {
    // articleId'ye göre veritabanından ilgili makale verilerini al
    const articleData = await getArticleDataById(articleId); // Örnek bir fonksiyon çağrısı
    res.json(articleData); // Makale verilerini istemciye JSON formatında gönder
  } catch (error) {
    console.error('Makale verileri alınırken bir hata oluştu:', error);
    res.status(500).send('Makale verileri alınırken bir hata oluştu');
  }
});

app.post('/sonuclar', async function (req, res) {
    // Front-end tarafından gönderilen metni al
    const searchText = req.body.text;

    // Şu anda sadece konsola yazdırıyoruz, isteğinizi burada kullanabilirsiniz
    console.log("Front-end tarafından gönderilen metin:", searchText);
    try {
        const results = await scrap(searchText);
        await Article.insertMany(results);
        console.log('Veriler MongoDB\'ye başarıyla eklendi.');
        res.send(results);
      } catch (error) {
        console.error("Web scraping işlemi sırasında bir hata oluştu:", error);
        res.status(500).send("Web scraping işlemi sırasında bir hata oluştu.");
      }


    // İşleminiz tamamlandığında istemciye bir yanıt göndermek isterseniz:
    //res.send("Başarıyla alındı");
});

app.listen(3000,()=> console.log("server 3000 portunda calısıyor"))









                