/**
 * Created by zwl on 2018/7/27.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var dpTaskTransferStatDAO = require('../dao/DpTaskTransferStatDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DpTaskTransferStat.js');

function queryDpTaskTransferStat(req,res,next){
    var params = req.params ;
    dpTaskTransferStatDAO.getDpTaskTransferStat(params,function(error,result){
        if (error) {
            logger.error(' queryDpTaskTransferStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpTaskTransferStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryDpTaskTransferStat : queryDpTaskTransferStat
}