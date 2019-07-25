/**
 * Created by zwl on 2019/7/25.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveExceedOilPriceDAO = require('../dao/DriveExceedOilPriceDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveExceedOilPrice.js');

function queryDriveExceedOilPrice(req,res,next){
    var params = req.params ;
    driveExceedOilPriceDAO.getDriveExceedOilPrice(params,function(error,result){
        if (error) {
            logger.error(' queryDriveExceedOilPrice ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveExceedOilPrice ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDriveExceedOilPrice(req,res,next){
    var params = req.params ;
    driveExceedOilPriceDAO.updateDriveExceedOilPrice(params,function(error,result){
        if (error) {
            logger.error(' updateDriveExceedOilPrice ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveExceedOilPrice ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryDriveExceedOilPrice : queryDriveExceedOilPrice,
    updateDriveExceedOilPrice : updateDriveExceedOilPrice
}
