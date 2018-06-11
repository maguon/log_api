/**
 * Created by zwl on 2018/6/11.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var drivePeccancyDAO = require('../dao/DrivePeccancyDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DrivePeccancy.js');

function createDrivePeccancy(req,res,next){
    var params = req.params ;
    drivePeccancyDAO.addDrivePeccancy(params,function(error,result){
        if (error) {
            logger.error(' createDrivePeccancy ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDrivePeccancy ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDrivePeccancy : createDrivePeccancy
}
