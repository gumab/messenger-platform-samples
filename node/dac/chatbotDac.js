'use strict';

var configDB = require('../config/database');
var mysql = require('mysql');
var connection = mysql.createConnection(configDB.mysql);


module.exports = {
  selectAllKeys: function (callback) {
    connection.query('select * from RESPONSE', function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result)
      }
    });
  },
  selectResponseBySeq: function (res_id, callback) {
    connection.query('select * from RESPONSE where res_id='+ res_id, function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result)
      }
    });
  },
  selectResponseDataByResId: function (res_id, callback){
    connection.query('select * from RESPONSE_DATA where res_id='+ res_id +' order by res_data_id', function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result)
      }
    });
  },
  selectResponseData2ByResDataId: function (res_data_id, callback){
    connection.query('select * from RESPONSE_DATA2 where res_data_id in ('+ res_data_id +') order by res_data2_id', function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, result)
      }
    });
  }
};
