/**
 * Created by zwl on 2017/9/11.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var carExceptionRelDAO = require('../dao/CarExceptionRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarExceptionRel.js');

function createCarExceptionRel(req,res,next){
    var params = req.params ;
    carExceptionRelDAO.addCarExceptionRelDAO(params,function(error,result){
        if (error) {
            logger.error(' createCarExceptionRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createCarExceptionRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createCarExceptionRel : createCarExceptionRel
}
