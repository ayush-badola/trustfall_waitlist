require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Users = require('./models/waitlist');
const path = require('path');

const app=express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 3000;

mongoose.set('strictQuery', false);

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected at ${conn.connection.host}');

    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
}

app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res) => {
    //res.send('Trustfall waitlist');
    res.render("index");
});

app.post('/', async (req,res) => {
    const name = (req.body.name).charAt(0).toUpperCase()+(req.body.name).slice(1);
    const email = req.body.email;
    const exist = await Users.findOne({email: email});
    if(!exist){
        const newuser = new Users({
          name: name,
          email: req.body.email
        });
        newuser.save();
        res.send("Yay! You registered!");
    }
        
    else{
        res.send("You've already registered!");
    }
    
});

connectDB().then(()=>{
    app.listen(PORT, ()=>{
      console.log(`Listening on PORT ${PORT}`);
    })
});