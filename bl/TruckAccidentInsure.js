/**
 * Created by zwl on 2018/2/7.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var truckAccidentInsureDAO = require('../dao/TruckAccidentInsureDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('TruckAccidentInsure.js');

function queryTruckAccidentInsure(req,res,next){
    var params = req.params ;
    truckAccidentInsureDAO.getTruckAccidentInsure(params,function(error,result){
        if (error) {
            logger.error(' queryTruckAccidentInsure ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryTruckAccidentInsure ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    queryTruckAccidentInsure : queryTruckAccidentInsure
}
