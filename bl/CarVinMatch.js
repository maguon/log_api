/**
 * Created by zwl on 2017/4/5.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var carVinMatchDAO = require('../dao/CarVinMatchDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarVinMatch.js');

function createCarVinMatch(req,res,next){
    var params = req.params ;
    carVinMatchDAO.addCarVinMatch(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "数据已经存在，请重新录入");
                return next();
            } else{
                logger.error(' createCarVinMatch ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createCarVinMatch ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryCarVinMatch(req,res,next){
    var params = req.params ;
    carVinMatchDAO.getCarVinMatch(params,function(error,result){
        if (error) {
            logger.error(' queryCarVinMatch ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCarVinMatch ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateCarVinMatch(req,res,next){
    var params = req.params ;
    carVinMatchDAO.updateCarVinMatch(params,function(error,result){
        if (error) {
            logger.error(' updateCarVinMatch ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCarVinMatch ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function removeCarVinMatch(req,res,next){
    var params = req.params ;
    carVinMatchDAO.deleteCarVinMatch(params,function(error,result){
        if (error) {
            logger.error(' removeCarVinMatch ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeCarVinMatch ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createCarVinMatch : createCarVinMatch,
    queryCarVinMatch : queryCarVinMatch,
    updateCarVinMatch : updateCarVinMatch,
    removeCarVinMatch : removeCarVinMatch
}