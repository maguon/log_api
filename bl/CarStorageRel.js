/**
 * Created by zwl on 2017/4/13.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var carStorageRelDAO = require('../dao/CarStorageRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarStorageRel.js');

function createCarStorageRel(req,res,next){
    var params = req.params ;
    carStorageRelDAO.addCarStorageRel(params,function(error,result){
        if (error) {
            logger.error(' createCarStorageRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createCarStorageRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function updateRelStatus (req,res,next){
    var params = req.params;
    carStorageRelDAO.updateRelStatus(params,function(error,result){
        if (error) {
            logger.error(' updateRelStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateRelStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createCarStorageRel : createCarStorageRel,
    updateRelStatus : updateRelStatus
}
