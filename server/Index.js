const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secretwar = "ab32jt21";

const app = express();

const saltRounds = 10;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'mydb'
});

app.get('/',(req,res)=>{
    res.send('Back-End working.');
})

app.post('/register',(req,res) =>{
    const email = req.body.email;
    const password = req.body.password;
    const fname = req.body.fname;
    const lname = req.body.lname;
    if(!email ||!password ||!fname ||!lname){
        return res.status(400).json({
            status:400,
            message:'Please enter all the fields'
        });
    } else {
        db.query("SELECT * FROM users WHERE email =?",email,(err,result)=>{
            if(err){
                console.log(err);
            }else{
                if(result.length > 0){
                    return res.status(401).json({
                        status:401,
                        message:'User already exists'
                    });
                }else{
                    bcrypt.hash(password,saltRounds,(err,hash)=>{
                        db.query('INSERT INTO users(email,password,fname,lname,status_woking) VALUES(?,?,?,?,?)',[email,hash,fname,lname,'Y'],
                        (err,result)=>{
                            if(err){
                                console.log(err);
                                return res.status(500).json({
                                    status:500,
                                    message:'Internal server error'
                                });
                            } else {
                                res.status(200).json({
                                    status:200,
                                    message:'User registered successfully'
                                });
                            }
                            
                        });
                    });
                }
            }
        });
    }
});

app.post('/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    if(!email ||!password){
        return res.status(400).json({
            status:400,
            message:'Please enter all the fields'
        });
    }else{
        db.query("SELECT * FROM users WHERE email =? and status_woking='Y'",email,(err,result)=>{
            if(err){
                console.log(err);
                return res.status(500).json({
                    status:500,
                    message:'Internal server error'
                });
            }
            if(result.length == 0){
                return res.status(401).json({
                    status:401,
                    message:'User does not exist'
                });
            }
            bcrypt.compare(password,result[0].password,(err,isLogin)=>{
                if(err){
                    console.log(err);
                }else{
                    if(isLogin == true){
                        const token = jwt.sign({email:result[0].email},secretwar,{ expiresIn: '720h' });
                        res.status(200).json({
                            status:200,
                            message:'Login successful',
                            userID:result[0].id,
                            email:result[0].email,
                            token:token
                        });
                    }else{
                        return res.status(401).json({
                            status:401,
                            message:'Wrong password'
                        });
                    }
                }
            })
        });
    }
});

app.post('/authen',(req,res)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, secretwar);
        res.status(200).json({
            status:200,
            message:'Authen successful',
            token:decoded
        });
    } catch (error){
        res.status(401).json({
            status:401,
            message:error.message
        });
    }
    
});

app.listen(3333,()=>{
    console.log('Server is running on port 3333');
})