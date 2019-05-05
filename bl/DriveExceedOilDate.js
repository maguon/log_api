/**
 * Created by zwl on 2019/5/5.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveExceedOilDateDAO = require('../dao/DriveExceedOilDateDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveExceedOilDate.js');

function createDriveExceedOilDate(req,res,next){
    var params = req.params ;
    driveExceedOilDateDAO.addDriveExceedOilDate(params,function(error,result){
        if (error) {
            logger.error(' createDriveExceedOilDate ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDriveExceedOilDate ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDriveExceedOilDate : createDriveExceedOilDate
}
