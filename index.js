require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Users = require('./models/waitlist');

const app=express();
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

app.get('/', (req,res) => {
    res.send('Trustfall waitlist');
});

connectDB().then(()=>{
    app.listen(PORT, ()=>{
      console.log(`Listening on PORT ${PORT}`);
    })
});