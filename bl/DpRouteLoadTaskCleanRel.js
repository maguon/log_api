/**
 * Created by zwl on 2018/1/29.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dpRouteLoadTaskCleanRelDAO = require('../dao/DpRouteLoadTaskCleanRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteLoadTaskCleanRel.js');

function queryDpRouteLoadTaskCleanRel(req,res,next){
    var params = req.params ;
    dpRouteLoadTaskCleanRelDAO.getDpRouteLoadTaskCleanRel(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteLoadTaskCleanRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteLoadTaskCleanRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryDpRouteLoadTaskCleanRel : queryDpRouteLoadTaskCleanRel
}
