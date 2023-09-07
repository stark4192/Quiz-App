const express = require('express');
const app = express();
const dotenv = require('dotenv')
const cors = require('cors')

const connectDB = require('./server/database/connection');
app.use(cors());

dotenv.config({path:"config.env"})
const PORT= process.env.PORT;

connectDB();

const admin = require('firebase-admin');
const credentials = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api',require('./server/routes/router'))



app.listen(PORT,()=>{
console.log(`server is listening on port http://localhost:${PORT}`)});
