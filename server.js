// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const path = require('path');
const axios = require('axios');


const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://admin:admin123@cluster0.tcp0znn.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Define a Grade schema and model
// Define shape and content of the document
const gradeSchema = new mongoose.Schema({
  course: String,
  grade: String,
  credits: Number
});

const Gradedb = mongoose.model('Gradedb', gradeSchema);

app.post('/grades', async (req, res) => { //create and add new grade
  const grade = new Gradedb({
    course: req.body.course,
    grade: req.body.grade,
    credits: req.body.credits
  })
  grade 
    .save(grade)
    .then(data => {
      res.send(data)
    })
    .catch(err =>{
      res.status(500).send({
          message : err.message || "Some error occurred while creating a create operation"
      });
    });
});

app.get('/grades', async (req, res) => { //retrieve 
  try {
    const grade = await grade.find();
    res.status(200).send(grade);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/grades/:id', async (req,res) => {
  const id = req.params.id;
  Gradedb.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
  .then(data => {
    if(!data){
        res.status(404).send({ message : `Cannot Update grade with ${id}. Maybe grade not found!`})
    }else{
        res.send(data)
    }
  })
  .catch(err =>{
    res.status(500).send({ message : "Error Update grade information"})
  })
})

app.delete('/grades/:id', async (req, res) => { //delete
  try {
    const grade = await grade.findByIdAndDelete(req.params.id);
    if (!grade) {
      res.status(404).send();
    }
    res.status(200).send(grade);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
