/**
 * Created by zwl on 2017/4/13.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var carDAO = require('../dao/CarDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Car.js');

function createCar(req,res,next){
    var params = req.params ;
    carDAO.addCar(params,function(error,result){
        if (error) {
            logger.error(' createCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createCar ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryCar(req,res,next){
    var params = req.params ;
    carDAO.getCar(params,function(error,result){
        if (error) {
            logger.error(' queryCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCar ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createCar : createCar,
    queryCar : queryCar
}
