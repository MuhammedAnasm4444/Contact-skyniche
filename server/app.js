const express = require('express');
const cors = require('cors');
const path = require('path')
const app = express();


const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');

const moment = require('moment')


app.use(express.json());
app.use(cors());

var db;


MongoClient.connect("mongodb://localhost:27017",{useUnifiedTopology:true}, function (err, data) {

  if (err) {
    console.log(err)}
  
  db = data.db('skyNiche')
})

app.use(express.static(path.join(__dirname, '/client/build')))

app.get('/api/v1/contacts', async(req, res) => {
    const contacts = await db.collection('contacts').find({}).toArray()
    
    res.status(200).json(contacts)
})
app.post('/api/v1/contacts/submit-contact', (req, res) => {
  
 
  db.collection('contacts').insertOne(req.body).then(() => {
    res.status(200).json({message:"Success"})
  })
  .catch((err) =>{
    res.status(500).json({message:"server erro"})
  })
})
app.get('/delete/v1/contacts/delete-contact/:id' ,(req, res) => {
    var id = req.params.id
    console.log(id)
    db.collection('contacts').deleteOne({_id:ObjectId(id)}).then(() =>{
        res.status(200).json()
    })
})
app.post('/api/v1/contacts/edit-contact' ,(req, res) => {
    console.log(req.body)
    req.body.date =  moment(req.body.date).format("YYYY-MM-DD");
    console.log(req.body.date)
    db.collection("contacts").updateOne({_id:ObjectId(req.body.id)}, {
        $set:{
            name:req.body.name,
            email:req.body.email,
            phone: req.body.phone,
            desgination:req.body.designation,
            date:req.body.date
        }

    }).then(() =>{
        res.status(200).json()
    })

})


const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});