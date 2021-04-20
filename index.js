const express = require('express')
const app = express()
const port = 5000
const  ObjectID = require('mongodb').ObjectID;
const cors = require('cors')

app.use(cors());
app.use(express.json())

require('dotenv').config()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.do2zp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("your-tutor").collection("services");
  const reviewCollection = client.db("your-tutor").collection("reviews");
  const cartCollection = client.db("your-tutor").collection("cart");
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  app.get('/services',(req,res)=>{
    serviceCollection.find({}).toArray((err,documents)=>{
      res.send(documents)
    })

})
app.get('/reviews',(req,res)=>{
  reviewCollection.find({}).toArray((err,documents)=>{
    res.send(documents)
  })
})
app.get('/reviews/:id',(req,res)=>{
  const id = req.params.id;
  reviewCollection.find({}).toArray((err,documents)=>{
    res.send(documents)
  })
})
app.get('/service/:id',(req,res)=>{
    const id = req.params.id;
    serviceCollection.find({_id: ObjectID(id)}).toArray((err,documents)=>{
      res.send(documents[0])
    })
  })
  app.post('/addCourse', (req, res) => {
    const service = req.body;
    serviceCollection.insertOne(service, (err, result) => {
        res.send({ count: result.insertedCount });
    })
})

app.post('/addreview',(req,res)=>{
  const review = req.body;
  reviewCollection.insertOne(review,(err,result)=>{
    console.log(err,result);
    res.send({count: result.insertedCount})

  })
})
  app.post('/addCart',(req,res)=>{
    const cart = req.body;
    cartCollection.insertOne(cart,(err,result)=>{
      console.log(err,result);
      res.send({count: result.insertedCount})

    })
  })
  
  app.get('/bookList',(req,res)=>{
   

    cartCollection.find().toArray((err,documents)=>{
      res.send(documents)
    })
  })
  app.get('/bookList/:email',(req,res)=>{
    const email = req.params.email

    cartCollection.find({email:email}).toArray((err,documents)=>{
      res.send(documents)
    })
  })

  app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    cartCollection.deleteOne({_id: ObjectID(id)}, (err) => {
        if(!err) {
            res.send({count: 1})
        }
    })
  
  })

  app.patch('/update/:id',(req,res) =>{
    const id = req.params.id;
    cartCollection.updateOne({_id: ObjectID(id)},
    {
      $set:{status: req.body.status}
    })
    .then(result =>{
      console.log(result);
    })

  })

});

app.listen(port)