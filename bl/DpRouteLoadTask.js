/**
 * Created by zwl on 2017/8/22.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dpRouteLoadTaskDAO = require('../dao/DpRouteLoadTaskDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteLoadTask.js');

function createDpRouteLoadTask(req,res,next){
    var params = req.params ;
    dpRouteLoadTaskDAO.addDpRouteLoadTask(params,function(error,result){
        if (error) {
            logger.error(' createDpRouteLoadTask ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDpRouteLoadTask ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDpRouteLoadTask : createDpRouteLoadTask
}
