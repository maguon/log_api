/**
 * Created by zwl on 2018/9/14.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var entrustMakeRelDAO = require('../dao/EntrustMakeRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('EntrustMakeRel.js');

function createEntrustMakeRel(req,res,next){
    var params = req.params ;
    entrustMakeRelDAO.addEntrustMakeRel(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "品牌不能重复关联，操作失败");
                return next();
            } else{
                logger.error(' createEntrustMakeRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createEntrustMakeRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function queryEntrustMakeRel(req,res,next){
    var params = req.params ;
    entrustMakeRelDAO.getEntrustMakeRel(params,function(error,result){
        if (error) {
            logger.error(' queryEntrustMakeRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryEntrustMakeRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function removeEntrustMakeRel(req,res,next){
    var params = req.params;
    entrustMakeRelDAO.deleteEntrustMakeRel(params,function(error,result){
        if (error) {
            logger.error(' removeEntrustMakeRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeEntrustMakeRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createEntrustMakeRel : createEntrustMakeRel,
    queryEntrustMakeRel : queryEntrustMakeRel,
    removeEntrustMakeRel : removeEntrustMakeRel
}
