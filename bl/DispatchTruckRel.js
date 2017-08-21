/**
 * Created by zwl on 2017/8/21.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dispatchTruckRelDAO = require('../dao/DispatchTruckRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DispatchTruckRel.js');

function createDispatchTruckRel(req,res,next){
    var params = req.params ;
    var myDate = new Date();
    params.taskStartDate = myDate;
    dispatchTruckRelDAO.addDispatchTruckRel(params,function(error,result){
        if (error) {
            logger.error(' createDispatchTruckRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDispatchTruckRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDispatchTruckRel(req,res,next){
    var params = req.params ;
    dispatchTruckRelDAO.getDispatchTruckRel(params,function(error,result){
        if (error) {
            logger.error(' queryDispatchTruckRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDispatchTruckRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDispatchTruckRel : createDispatchTruckRel,
    queryDispatchTruckRel : queryDispatchTruckRel
}