/**
 * Created by zwl on 2018/3/2.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var damageCheckIndemnityDAO = require('../dao/DamageCheckIndemnityDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DamageCheckIndemnity.js');

function createDamageCheckIndemnity(req,res,next){
    var params = req.params ;
    damageCheckIndemnityDAO.addDamageCheckIndemnity(params,function(error,result){
        if (error) {
            logger.error(' createDamageCheckIndemnity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDamageCheckIndemnity ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDamageCheckIndemnity : createDamageCheckIndemnity
}