/**
 * Created by zwl on 2018/2/8.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var truckAccidentInsureRelDAO = require('../dao/TruckAccidentInsureRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckAccidentInsureRel.js');

function createTruckAccidentInsureRel(req,res,next){
    var params = req.params ;
    truckAccidentInsureRelDAO.addTruckAccidentInsureRel(params,function(error,result){
        if (error) {
            logger.error(' createTruckAccidentInsureRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createTruckAccidentInsureRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function removeTruckAccidentInsureRel(req,res,next){
    var params = req.params;
    truckAccidentInsureRelDAO.deleteTruckAccidentInsureRel(params,function(error,result){
        if (error) {
            logger.error(' removeTruckAccidentInsureRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeTruckAccidentInsureRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createTruckAccidentInsureRel : createTruckAccidentInsureRel,
    removeTruckAccidentInsureRel : removeTruckAccidentInsureRel
}