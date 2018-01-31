/**
 * Created by zwl on 2018/1/31.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var repairDAO = require('../dao/RepairDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Repair.js');

function createRepair(req,res,next){
    var params = req.params ;
    repairDAO.addRepair(params,function(error,result){
        if (error) {
            logger.error(' createRepair ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createRepair ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryRepair(req,res,next){
    var params = req.params ;
    repairDAO.getRepair(params,function(error,result){
        if (error) {
            logger.error(' queryRepair ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryRepair ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createRepair : createRepair,
    queryRepair : queryRepair
}
