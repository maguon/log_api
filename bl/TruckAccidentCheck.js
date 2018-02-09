/**
 * Created by zwl on 2018/2/6.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var truckAccidentCheckDAO = require('../dao/TruckAccidentCheckDAO.js');
var truckAccidentDAO = require('../dao/TruckAccidentDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('TruckAccidentCheck.js');

function createTruckAccidentCheck(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        truckAccidentCheckDAO.addTruckAccidentCheck(params,function(error, result) {
            if (error) {
                logger.error(' createTruckAccidentCheck ' + error.message);
                throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createTruckAccidentCheck ' + 'success');
                    that();
                }else{
                    resUtil.resetFailedRes(res," 事故处理操作失败 ");
                    return next();
                }
            }
        })
    }).seq(function () {
        params.accidentStatus = sysConst.ACCIDENT_STATUS.in_process;
        truckAccidentDAO.updateTruckAccidentStatus(params,function(error,result){
            if (error) {
                logger.error(' updateTruckAccidentStatus ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateTruckAccidentStatus ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function updateTruckAccidentCheck(req,res,next){
    var params = req.params ;
    truckAccidentCheckDAO.updateTruckAccidentCheck(params,function(error,result){
        if (error) {
            logger.error(' updateTruckAccidentCheck ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateTruckAccidentCheck ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createTruckAccidentCheck : createTruckAccidentCheck,
    updateTruckAccidentCheck : updateTruckAccidentCheck
}
