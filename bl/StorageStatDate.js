/**
 * Created by zwl on 2017/4/20.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var storageStatDateDAO = require('../dao/StorageStatDateDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('StorageStatDate.js');

function queryStorageStatDate(req,res,next){
    var params = req.params ;
    storageStatDateDAO.getStorageStatDate(params,function(error,result){
        if (error) {
            logger.error(' queryStorageStatDate ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryStorageStatDate ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryStorageStatDate : queryStorageStatDate
}
