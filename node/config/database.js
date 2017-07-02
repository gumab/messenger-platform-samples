'use strict';

// config/database.js
var host = 'mysql';
var port = 3306;
if (process.env.CHATBOT_ENV !== 'production') {
  host = '192.168.0.26';
  port = 3307;
}

module.exports = {
  mysql: {
    host: host,
    port: port,
    user: 'chatbot',
    password: 'chatbot1!',
    database: 'chatbotdb'
  }
};
