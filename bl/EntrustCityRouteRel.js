/**
 * Created by zwl on 2018/8/27.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var entrustCityRouteRelDAO = require('../dao/EntrustCityRouteRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('EntrustCityRouteRel.js');

function createEntrustCityRouteRel(req,res,next){
    var params = req.params ;
    entrustCityRouteRelDAO.addEntrustCityRouteRel(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "委托方线路已经存在，请重新录入");
                return next();
            } else{
                logger.error(' createEntrustCityRouteRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createEntrustCityRouteRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createEntrustCityRouteRel : createEntrustCityRouteRel
}
