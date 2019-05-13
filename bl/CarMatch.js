/**
 * Created by zwl on 2017/4/5.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var carMatchDAO = require('../dao/CarMatchDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarMatch.js');

function createCarMatch(req,res,next){
    var params = req.params ;
    carMatchDAO.addCarMatch(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "数据已经存在，请重新录入");
                return next();
            } else{
                logger.error(' createCarMatch ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createCarMatch ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryCarMatch(req,res,next){
    var params = req.params ;
    carMatchDAO.getCarMatch(params,function(error,result){
        if (error) {
            logger.error(' queryCarMatch ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarMatch ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateCarMatch(req,res,next){
    var params = req.params ;
    carMatchDAO.updateCarMatch(params,function(error,result){
        if (error) {
            logger.error(' updateCarMatch ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCarMatch ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function removeCarMatch(req,res,next){
    var params = req.params ;
    carMatchDAO.deleteCarMatch(params,function(error,result){
        if (error) {
            logger.error(' removeCarMatch ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeCarMatch ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createCarMatch : createCarMatch,
    queryCarMatch : queryCarMatch,
    updateCarMatch : updateCarMatch,
    removeCarMatch : removeCarMatch
}