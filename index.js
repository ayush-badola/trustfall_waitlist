require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Users = require('./models/waitlist');
const path = require('path');
const nodemailer = require('nodemailer');
const SMTPConnection = require('nodemailer/lib/smtp-connection');
const { getMaxListeners } = require('events');

const app=express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
const PORT = process.env.PORT || 3000;

mongoose.set('strictQuery', false);

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected at ${conn.connection.host}`);

    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
}

app.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ayush2badola@gmail.com',
        pass: 'rjmlzucfaicmjkye',
    },
});

app.get('/', (req,res) => {
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
        await newuser.save();

        const mailOptions = {
            from: 'ayush2badola@gmail.com', // Sender's email address
            to: email, // Recipient's email address
            subject: 'Welcome to Trustfall', // Subject of the email
            text: `Hi ${name}!\n\nThank you for registering with Trustfall's waitlist!\n\nYou'll get notified as sson as Trustfall launches!\n\nFall with Trust - Trustfall,\nAyush Badola (Founder, Trustfall)`, // Body of the email
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.render("registered");
    }
        
    else{
        res.render("existing");
    }
    
});

connectDB().then(()=>{
    app.listen(PORT, ()=>{
      console.log(`Listening on PORT ${PORT}`);
    })
});