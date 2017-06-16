/**
 * Created by zwl on 2017/6/7.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var entrustContactsDAO = require('../dao/EntrustContactsDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('EntrustContacts.js');

function createEntrustContacts(req,res,next){
    var params = req.params ;
    entrustContactsDAO.addEntrustContacts(params,function(error,result){
        if (error) {
            logger.error(' createEntrustContacts ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createEntrustContacts ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryEntrustContacts(req,res,next){
    var params = req.params ;
    entrustContactsDAO.getEntrustContacts(params,function(error,result){
        if (error) {
            logger.error(' queryEntrustContacts ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryEntrustContacts ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateEntrustContacts(req,res,next){
    var params = req.params ;
    entrustContactsDAO.updateEntrustContacts(params,function(error,result){
        if (error) {
            logger.error(' updateEntrustContacts ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateEntrustContacts ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateContactsStatus(req,res,next){
    var params = req.params ;
    entrustContactsDAO.updateContactsStatus(params,function(error,result){
        if (error) {
            logger.error(' updateContactsStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateContactsStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createEntrustContacts : createEntrustContacts,
    queryEntrustContacts : queryEntrustContacts,
    updateEntrustContacts : updateEntrustContacts,
    updateContactsStatus : updateContactsStatus
}
