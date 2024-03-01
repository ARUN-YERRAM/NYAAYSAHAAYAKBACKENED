let express = require('express');
let mongoose = require('mongoose');
const multer=require('multer');
const cors=require('cors');
const bcrypt = require('bcrypt');

let getFields=multer();

let app = express();
app.use(cors());
app.use(express.json());



let db = async() => {
    try{ 
    
    await mongoose.connect('mongodb+srv://Arun:1234@cluster0.mmyigrp.mongodb.net/NYAAYSAHAAYAK?retryWrites=true&w=majority');   
    
    console.log("  db connected!");
    }
    catch(error) {
        console.log(error);
    }
}
db();

app.get('/',(req,res) => {  
    console.log(" A new request has been raised on  " + new Date(Date.now())); 
    res.writeHead(200,{ 'Content-Type':"text/plain"})  
    res.write(' hey');
    res.end();
});




const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name:{
        type:String,
        required: true,
    }
  });

  // const feedback = new mongoose.Schema({
    // feed:{
      // type:String,
      // requires:true,
    // }
  // });
  
  const Users = new mongoose.model('User', userSchema);
  // const model = new mongoose.model('feedback',feedback);
  

  app.get('/users',async (req,res) => {  
    console.log(" A new request has been raised on  " + new Date(Date.now())); 
    //res.writeHead(200,{ 'Content-Type':"text/json"})  
    const users = await Users.find({});
    console.log(users);
    res.json(users);
    // res.end();
});


  app.post('/login', async (request, response) => {
    const { email, password } = request.body;
  
    try {

      const user = await Users.findOne({ email });
  
      if (user) {
        // Compare hashed password
        //const isPasswordValid = await bcrypt.compare(password, user.password);
  
        if (password === user.password) {
          response.json({ success: true, message: 'Login successful' });
        } else {
          response.status(401).json({ success: false, message: 'Invalid  password' });
        }
      } else {
        response.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      response.status(500).send(error.message);
    }
  });
  
  

  app.post('/signup',async(request, response)=>{
    const { email, password,name } = request.body;
    try{
        const user = await Users.findOne({ email });
        if(user){
            response.status(401).json({ success: false, message: 'Error' });
        }else{
            const user=new Users({email,password,name});
            await user.save();
            response.send({ success: true, message: 'Login successful' });
        }
    }catch (error) {
        response.status(500).send(error.message);
      }
  });


  const appointmentSchema = new mongoose.Schema({
    Fullname: String,
    phone: String,
    email: String,
    date: Date,
    time: String,
    area: String,
    city: String,
    state: String,
    postcode: String,
  });
  
  const Appointment = mongoose.model('Appointment', appointmentSchema);
  
  // Handle form submission
  app.post('/submit-appointment', async (req, res) => {
    // const { email, password,name } = request.body;
    const {name,phone,email,date,time,area,city,state,postCode}=req.body
    try {
      const newAppointment = new Appointment({Fullname:name,phone,email,date,time,area,city,state,postcode:postCode});
      await newAppointment.save();
      res.status(200).json({ message: 'Appointment booked successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Error booking appointment.' });
    }
  });

const Q_As = new mongoose.Schema({ question: String, answer: [String] });
const LawSchema = new mongoose.Schema({
  constitutional_related_faqs: [Q_As],
});

// Define the model
const Laws = mongoose.model('law', LawSchema);

// Define the route
app.get('/laws', async (request, response) => {
  try {
    // Use async/await to handle the asynchronous operation
    const allLaws = await Laws.find();
    response.send(allLaws);
  } catch (error) {
    // Handle errors more gracefully
    console.error(error);
    response.status(500).send('Internal Server Error');
  }
});

//To check the user
app.listen(5000, () => console.log("listening at port 5000"));

