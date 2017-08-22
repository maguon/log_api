/**
 * Created by zwl on 2017/8/22.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var truckDispatchDAO = require('../dao/TruckDispatchDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckDispatch.js');

function queryTruckDispatch(req,res,next){
    var params = req.params ;
    truckDispatchDAO.getTruckDispatch(params,function(error,result){
        if (error) {
            logger.error(' queryTruckDispatch ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckDispatch ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryTruckDispatch: queryTruckDispatch
}
