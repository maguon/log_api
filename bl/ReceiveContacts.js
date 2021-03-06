/**
 * Created by zwl on 2017/6/7.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var receiveContactsDAO = require('../dao/ReceiveContactsDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ReceiveContacts.js');

function createReceiveContacts(req,res,next){
    var params = req.params ;
    receiveContactsDAO.addReceiveContacts(params,function(error,result){
        if (error) {
            logger.error(' createReceiveContacts ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createReceiveContacts ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryReceiveContacts(req,res,next){
    var params = req.params ;
    receiveContactsDAO.getReceiveContacts(params,function(error,result){
        if (error) {
            logger.error(' queryReceiveContacts ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryReceiveContacts ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateReceiveContacts(req,res,next){
    var params = req.params ;
    receiveContactsDAO.updateReceiveContacts(params,function(error,result){
        if (error) {
            logger.error(' updateReceiveContacts ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateReceiveContacts ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function removeContacts(req,res,next){
    var params = req.params ;
    params.contactsStatus = listOfValue.CONTACTS_STATUS_NOT_ACTIVE;
    receiveContactsDAO.updateContactsStatus(params,function(error,result){
        if (error) {
            logger.error(' removeContacts ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeContacts ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createReceiveContacts : createReceiveContacts,
    queryReceiveContacts : queryReceiveContacts,
    updateReceiveContacts : updateReceiveContacts,
    removeContacts : removeContacts
}
