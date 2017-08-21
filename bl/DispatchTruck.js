/**
 * Created by zwl on 2017/8/21.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dispatchTruckDAO = require('../dao/DispatchTruckDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DispatchTruck.js');

function createDispatchTruck(req,res,next){
    var params = req.params ;
    dispatchTruckDAO.addDispatchTruck(params,function(error,result){
        if (error) {
            logger.error(' createDispatchTruck ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDispatchTruck ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDispatchTruck(req,res,next){
    var params = req.params ;
    dispatchTruckDAO.getDispatchTruck(params,function(error,result){
        if (error) {
            logger.error(' queryDispatchTruck ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDispatchTruck ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDispatchTruck : createDispatchTruck,
    queryDispatchTruck : queryDispatchTruck
}