if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod');
} else {
  module.exports = require('./dev');
}

module.exports = {
  MONGOURI: 'mongodb+srv://sree:JCBVWKsXob6W5iTU@cluster0.i67op.mongodb.net/test?retryWrites=true&w=majority',
  JWT_KEY: 'effegwegwrgw4',
  EMAIL: 'https://post-it-media.herokuapp.com'
};
