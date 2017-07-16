'use strict';


var chatbotDac = require('./dac/chatbotDac');

const RES_TYPE = {
  TEXT:0,
  IMAGE:1,
  BUTTON:2,
  GENERIC:3,
  QUICK_REPLY:4,
  VIDEO:5,
  FILE:6
};

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
              if(data[i].match_yn > 0){
                if(data[i].res_key == msg){
                  res_id = data[i].res_id;
                  break;
                }
              } else {
                var keyList = data[i].res_key.split(';');
                if (keyList) {
                  if (keyList.every(function (x) {
                      return msg.indexOf(x) >= 0
                    })) {
                    if (matchingCount < keyList.length) {
                      res_id = data[i].res_id;
                      matchingCount = keyList.length;
                    }
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

  if(resData){
    chatbotDac.selectResponseDataByResId(resData.res_id, function (err, resDetailData) {
      switch (resData.type){
        case RES_TYPE.GENERIC:
          chatbotDac.selectResponseData2ByResDataId(resDetailData.map(function(x){return x.res_data_id}).join(','), function (err2, resDetailData2) {
            var element = [];
            var textResult = null;
            var result = null;
            if(!err && resDetailData) {
              for (var i = 0; i < resDetailData.length; i++) {
                var e = resDetailData.map(function(x){return {title:x.title, subtitle:x.subtitle, item_url:x.item_url,image_url:x.image_url}})[i];
                if(!err2 && resDetailData2) {
                  e.buttons = resDetailData2.filter(function (x) {
                    if (x.res_data_id == resDetailData[i].res_data_id) {
                      return true;
                    } else {
                      return false;
                    }
                  }).map(function (x) {
                    return { type: x.type, url: x.url, title: x.title, payload: x.payload }
                  });
                }
                element = element.concat(e);
              }
              if(resData.response) {
                textResult = {
                  text: resData.response,
                  metadata: "DEVELOPER_DEFINED_METADATA"
                };
              }

              result = {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "generic",
                    elements: element
                  }
                }
              }
            }
            if(textResult) {
              callback(textResult);
            }
            callback(result);
          });
          break;
        case RES_TYPE.BUTTON:
          var result = {
            attachment: {
              type: "template",
              payload: {
                template_type: "button",
                text: resData.response,
                buttons: resDetailData.map(function(x){return {type:x.type,url:x.url,title:x.title,payload:x.payload}})
              }
            }
          };
          callback(result);
          break;
        case RES_TYPE.QUICK_REPLY:
          var result = {
            text: resData.response,
            quick_replies: resDetailData.map(function (x) {
              return { content_type: x.content_type, title: x.title, payload: x.payload }
            })
          };
          callback(result);
          break;
        case RES_TYPE.IMAGE:
          var result = {
            attachment: {
              type: "image",
              payload: {
                url: resData.response
              }
            }
          };
          callback(result);
          break;
        case RES_TYPE.VIDEO:
          var result = {
            attachment: {
              type: "video",
              payload: {
                url: resData.response
              }
            }
          };
          callback(result);
          break;
        case RES_TYPE.FILE:
          var result = {
            attachment: {
              type: "file",
              payload: {
                url: resData.response
              }
            }
          };
          callback(result);
          break;
        case RES_TYPE.TEXT:
          var result = {
            text: resData.response,
            metadata: "DEVELOPER_DEFINED_METADATA"
          };
          callback(result);
          break;
      }
    });
  }
  else {
    callback(null);
  }
}
