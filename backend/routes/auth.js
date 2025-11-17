const r=require('express').Router();
const db=require('../db');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const SECRET=process.env.JWT_SECRET;
r.post('/signup',async(req,res)=>{
    const{email,password}=req.body;
    if(!email||!password)return res.status(400).json({error:'missing'});
    try{
        const hash=await bcrypt.hash(password,10);
        const u= await db.query('INSERT INTO users (email,password_hash) VALUES ($1,$2) RETURNING id,email',[email,hash]);
        const t=jwt.sign({userId:u.rows[0].id},SECRET);res.json({token:t,user:u.rows[0]});
        console.log("Request Body: try", req.body);
    }
    catch(e){
        res.status(500).json({error:'Did this fail?!'});
        console.log("Request Body:catch", req.body);
    }
});
r.post('/login',async(req,res)=>
    {
        const{email,password}=req.body;
        const r2=await db.query('SELECT * FROM users WHERE email=$1',[email]);
        if(!r2.rows.length)
            return res.status(401).json({error:'bad'});
        const u=r2.rows[0];
        if(!await bcrypt.compare(password,u.password_hash))
            return res.status(401).json({error:'bad'});
        const t=jwt.sign({userId:u.id},SECRET);
        res.json({token:t,user:{id:u.id,email:u.email}
        });
    });
    
module.exports=r;