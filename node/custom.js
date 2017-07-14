'use strict';


var chatbotDac = require('./dac/chatbotDac');

module.exports = {
  getResponse: function(msg, callback) {
    var result = null;
    if(msg){
      chatbotDac.selectAllKeys(function(err, data){
        if(err || !data){
          callback(null);
        } else {
          var res_id = -1;
          var matchingCount = 0;
          for(var i=0;i<data.length;i++){
            if(data[i].res_key) {
              var keyList = data[i].res_key.split(';');
              if (keyList) {
                if(keyList.every(function(x){return msg.indexOf(x)>=0})){
                  if(matchingCount<keyList.length){
                    res_id = data[i].res_id;
                    matchingCount=keyList.length;
                  }
                }
              }
            }
          }

          if(res_id>=0){
            chatbotDac.selectResponseBySeq(res_id, function(err, resData){
              if(err || !resData){
                callback(null);
              } else {
                getMessage(resData[0], callback)
              }
            })
          } else {
            callback(null);
          }
        }
      });
    } else {
      callback(result);
    }
  }
};



function getMessage(resData, callback){
  var result = null;

  if(resData){
    chatbotDac.selectResponseDataByResId(resData.res_id, function (err, resDetailData) {
      switch (resData.type){
        case RES_TYPE.BUTTON:
          result = {
            attachment: {
              type: "template",
              payload: {
                template_type: "button",
                text: resData.response,
                buttons: resDetailData
              }
            }
          };
          break;
        case RES_TYPE.IMAGE:
          result = {
            attachment: {
              type: "image",
              payload: {
                url: resData.response
              }
            }
          };
          break;
        case RES_TYPE.TEXT:
          result = {
            text: resData.response,
            metadata: "DEVELOPER_DEFINED_METADATA"
          };
          break;
      }
      callback(result);
    });
  }
  else {
    callback(null);
  }
}
