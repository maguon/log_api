/**
 * Created by zwl on 2017/9/8.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var driveRefuelDAO = require('../dao/DriveRefuelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveRefuel.js');

function createDriveRefuel(req,res,next){
    var params = req.params;
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1 < 10 ? "0" + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
    var day = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();
    var strDate = year + month + day;
    params.dateId = parseInt(strDate);
    driveRefuelDAO.addDriveRefuel(params,function(error,result){
        if (error) {
            logger.error(' createDriveRefuel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDriveRefuel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDriveRefuel(req,res,next){
    var params = req.params ;
    driveRefuelDAO.getDriveRefuel(params,function(error,result){
        if (error) {
            logger.error(' queryDriveRefuel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveRefuel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDriveRefuel : createDriveRefuel,
    queryDriveRefuel : queryDriveRefuel
}
