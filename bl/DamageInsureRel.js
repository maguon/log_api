/**
 * Created by zwl on 2018/1/26.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var damageInsureRelDAO = require('../dao/DamageInsureRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DamageInsureRel.js');

function createDamageInsureRel(req,res,next){
    var params = req.params ;
    damageInsureRelDAO.addDamageInsureRel(params,function(error,result){
        if (error) {
            logger.error(' createDamageInsureRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDamageInsureRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function removeDamageInsureRel(req,res,next){
    var params = req.params;
    damageInsureRelDAO.deleteDamageInsureRel(params,function(error,result){
        if (error) {
            logger.error(' removeDamageInsureRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeDamageInsureRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
            }
    })
}


module.exports = {
    createDamageInsureRel : createDamageInsureRel,
    removeDamageInsureRel : removeDamageInsureRel
}