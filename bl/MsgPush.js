/**
 * Created by zwl on 2017/10/10.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var msgPushDAO = require('../dao/MsgPushDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('MsgPush.js');

function pushMsg(req,res,next){
    var params = req.params ;
    var obj = {title:"测试消息",content:"来自restapi的单推接口测试消息"};
    params.message = JSON.stringify(obj);
    msgPushDAO.pushMsg(params,function(error,result){
        if (error) {
            logger.error(' pushMsg ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' pushMsg ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports={
    pushMsg : pushMsg
}
