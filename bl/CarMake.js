/**
 * Created by zwl on 2017/4/11.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var carMakeDAO = require('../dao/CarMakeDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarMake.js');

function createCarMake(req,res,next){
    var params = req.params ;
    carMakeDAO.addCarMake(params,function(error,result){
        if (error) {
            logger.error(' createCarMake ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createCarMake ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryCarMake(req,res,next){
    var params = req.params ;
    carMakeDAO.getCarMake(params,function(error,result){
        if (error) {
            logger.error(' queryCarMake ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarMake ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryCarMakeName(req,res,next){
    var params = req.params ;
    carMakeDAO.getCarMakeName(params,function(error,result){
        if (error) {
            logger.error(' queryCarMakeName ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarMakeName ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateCarMake(req,res,next){
    var params = req.params ;
    carMakeDAO.updateCarMake(params,function(error,result){
        if (error) {
            logger.error(' updateCarMake ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCarMake ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createCarMake : createCarMake,
    queryCarMake : queryCarMake,
    queryCarMakeName : queryCarMakeName,
    updateCarMake : updateCarMake
}