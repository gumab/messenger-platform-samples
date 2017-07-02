'use strict';

var configDB = require('../config/database');
var mysql = require('mysql');
var connection = mysql.createConnection(configDB.mysql);


module.exports = {
  selectAllKeys: function (callback) {
    connection.query('select seq, res_key from RESPONSE_JSON', function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result)
      }
    });
  },
  selectResponseBySeq: function (seq, callback) {
    connection.query('select type, response from RESPONSE_JSON where seq='+ seq, function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result)
      }
    });
  }
};
