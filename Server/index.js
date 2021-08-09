const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const { MONGOURI } = require('./config/keys');

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
  console.log('success');
});

require('./models/user');
require('./models/post');
app.use(express.json());
app.use(require('./Routes/auth'));
app.use(require('./Routes/user'));
app.use(require('./Routes/post'));

if(process.env.NODE_ENV == "production") {
  app.use(express.static('dbproject/build'))
  const path = require('path')
  app.get("*",(req,res) => {
    res.sendFile(path.resolve(__dirname,'dbproject','build','index.html'))
  })
}

app.listen(PORT, () => {
  console.log('Server is running on PORT 5000');
});
