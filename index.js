require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const dns = require('dns');
const urlparser = require('url')
const app = express();
const port = '3000'

app.use(cors());

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true }))


mongoose.connect(process.env.MONGO_URI);
const mapUrlSchema = new mongoose.Schema({
    original_url: String
})
const UrlSchema = mongoose.model("freecodecamp", mapUrlSchema);

app.post("/api/shorturl", async function(req, res) {
    const { url } = req.body
    dns.lookup(urlparser.parse(url).hostname, (err,address) => {
        if (!address) {
            res.json({
                error: 'Invalid URL'
            })
        } else {
            const saveUrl = new UrlSchema({
                original_url: url
            })
            saveUrl.save((err,data) => {
                res.json({
                    original_url: data.original_url,
                    short_url: data.id
                })
            })
        }
    })
    
  });
app.get("/api/shorturl/:url", async function(req, res) {
    const id = req.params.url;
    //console.log(await UrlSchema.findById(id))
   const data = await UrlSchema.findById(id)
   res.redirect(data.original_url)

//    UrlSchema.findById(id, async(err,data) => {
//         if (!data) {
//             res.json({
//                 error: 'Invalid URL'
//             })
//         } else {
//             res.redirect(data.orignal_url)
//         }
//     })
  });
  
  
app.listen(port, () => {
    console.log(`Running on port ${port}`)
})

