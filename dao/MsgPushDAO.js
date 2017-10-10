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
        paramsString = paramsString +i+ "="+params[i];
    }
    return paramsString
}

function pushMsg(params, callback) {
    var timestamp = Number.parseInt(new Date().getTime()/1000);
    var md5Param = {
        device_token: params.deviceToken,
        message : params.message,
        message_type : params.messageType
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
    httpUtil.httpGet(smsConfig.xingeOptions.host,url,{},{},function(error,result){
        logger.error('pushMsg' + error.stack)
        callback(error,result)
    })

}


module.exports = {
    pushMsg : pushMsg
}