/**
 * Created by zwl on 2019/3/18.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var dpRouteTaskOilRelDAO = require('../dao/DpRouteTaskOilRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DpRouteTaskOilRel.js');

function queryDpRouteTaskOilRel(req,res,next){
    var params = req.params ;
    dpRouteTaskOilRelDAO.getDpRouteTaskOilRel(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTaskOilRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTaskOilRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDpRouteTaskOilRelStatus (req,res,next){
    var params = req.params;
    dpRouteTaskOilRelDAO.updateDpRouteTaskOilRelStatus(params,function(error,result){
        if (error) {
            logger.error(' updateDpRouteTaskOilRelStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDpRouteTaskOilRelStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryDpRouteTaskOilRel : queryDpRouteTaskOilRel,
    updateDpRouteTaskOilRelStatus : updateDpRouteTaskOilRelStatus
}