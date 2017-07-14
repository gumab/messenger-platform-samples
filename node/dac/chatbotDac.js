'use strict';

var configDB = require('../config/database');
var mysql = require('mysql');
var connection = mysql.createConnection(configDB.mysql);


module.exports = {
  selectAllKeys: function (callback) {
    connection.query('select res_id, res_key from RESPONSE', function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result)
      }
    });
  },
  selectResponseBySeq: function (res_id, callback) {
    connection.query('select type, response from RESPONSE where res_id='+ res_id, function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result)
      }
    });
  },
  selectResponseDataByResId: function (res_id, callback){
    connection.query('select type, url, title, payload from RESPONSE_DATA where res_id='+ res_id +' order by res_data_seq', function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result)
      }
    });
  }
};
