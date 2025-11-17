require('dotenv').config();
const app = require('./app');
const db = require('./db');
const PORT = process.env.PORT || 5000;

(async()=>{
  await db.query('SELECT 1');
  app.listen(PORT,()=>console.log('Server '+PORT));
})();
