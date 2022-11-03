const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

require('./db/mongoose');
const userRouter = require('./routers/user');
const User = require('./models/users');


app.use(bodyParser.json()); 
app.use(cors());    
app.use(userRouter);

module.exports = app;