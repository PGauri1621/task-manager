const r=require('express').Router();
const db=require('../db');
const auth=require('../middleware/authMiddleware');
r.use(auth);

r.get('/',async(req,res)=>{
    const t=await db.query('SELECT * FROM tasks WHERE user_id=$1',[req.user.userId]);res.json(t.rows);
});

r.post('/',async(req,res)=>{
    const{title,description}=req.body;
    const t=await db.query('INSERT INTO tasks (user_id,title,description) VALUES ($1,$2,$3) RETURNING *',[req.user.userId,title,description]);
    res.json(t.rows[0]);
});

r.put('/:id',async(req,res)=>{const{id}=req.params;
    const{title,description,completed}=req.body;
    const t=await db.query('UPDATE tasks SET title=$1,description=$2,completed=$3 WHERE id=$4 AND user_id=$5 RETURNING *',[title,description,completed,id,req.user.userId]);
    if(!t.rows.length)return res.status(404).json({error:'nf'});
    res.json(t.rows[0]);
});

r.delete('/:id',async(req,res)=>{
    const{id}=req.params;
    const t=await db.query('DELETE FROM tasks WHERE id=$1 AND user_id=$2 RETURNING id',[id,req.user.userId]);
    if(!t.rows.length)return res.status(404).json({error:'nf'});
    res.json({success:true});
});

module.exports=r;