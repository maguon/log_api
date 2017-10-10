var dateUtil = require('../util/DateUtil.js');
var smsConfig = require('../config/SmsConfig.js');
var https = require('https');
var http = require('http');
var encrypt = require('../util/Encrypt.js')
var httpUtil = require('../util/HttpUtil.js')
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('MsgPushDAO.js');

function getXingeMD5(params,timestamp){
    var paramString = getXingeParamString(params)
    var originString = 'GET'+smsConfig.xingeOptions.host + smsConfig.xingeOptions.url + 'access_id='+
        smsConfig.xingeOptions.accessId+paramString+'timestamp=' + timestamp+ smsConfig.xingeOptions.secretKey;
    var md5String =  encrypt.encryptByMd5NoKey(originString);
    return md5String;
}

function getXingeParamString(params){
    var paramsString = "";
    for(var i in params) {
        paramsString = paramsString + "i="+params[i];
    }
    return paramsString
}

function pushMsg(params, callback) {
    var timestamp = new Date().getTime();
    var md5Param = {
        message_type : params.messageType,
        message : params.message
    }
    var sign= getXingeMD5(md5Param,timestamp);
    /*var subParams = {
        access_id : smsConfig.xingeOptions.accessId,
        timestamp : timestamp ,
        device_token :params.deviceToken,
        message_type : params.messageType,
        message : params.message,
        sign : sign
    }*/
    var url = smsConfig.xingeOptions.url+'?access_id='+smsConfig.xingeOptions.accessId+'&timestamp='+timestamp+'&device_token='+params.deviceToken+
        '&message_type='+params.messageType+'&message='+params.message+'&sign='+sign
    httpUtil.httpGet(smsConfig.xingeOptions.host,smsConfig.xingeOptions.url,{},{},function(error,result){
        callback(error,result)
    })

}


module.exports = {
    pushMsg : pushMsg
}