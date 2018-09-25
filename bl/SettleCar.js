/**
 * Created by zwl on 2018/9/25.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var settleCarDAO = require('../dao/SettleCarDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('SettleCar.js');

function createSettleCar(req,res,next){
    var params = req.params ;
    settleCarDAO.addSettleCar(params,function(error,result){
        if (error) {
            logger.error(' createSettleCar ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createSettleCar ' + 'success ');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createSettleCar : createSettleCar
}