/**
 * Created by zwl on 2017/3/15.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveDAO = require('../dao/DriveDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Drive.js');

function queryDrive(req,res,next){
    var params = req.params ;
    driveDAO.getDrive(params,function(error,result){
        if (error) {
            logger.error(' queryDrive ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDrive ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveCount(req,res,next){
    var params = req.params ;
    driveDAO.getDriveCount(params,function(error,result){
        if (error) {
            logger.error(' queryDriveCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryDrive : queryDrive,
    queryDriveCount :queryDriveCount
}