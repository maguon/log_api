/**
 * Created by zwl on 2017/3/30.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var companyDAO = require('../dao/CompanyDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Company.js');

function createCompany(req,res,next){
    var params = req.params ;
    companyDAO.addCompany(params,function(error,result){
        if (error) {
            logger.error(' createCompany ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createCompany ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryCompany(req,res,next){
    var params = req.params ;
    companyDAO.getCompany(params,function(error,result){
        if (error) {
            logger.error(' queryCompany ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCompany ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryCompanyOperateTypeTotal(req,res,next){
    var params = req.params ;
    companyDAO.getCompanyOperateTypeTotal(params,function(error,result){
        if (error) {
            logger.error(' queryCompanyOperateTypeTotal ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCompanyOperateTypeTotal ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryCompanyTruckCountTotal(req,res,next){
    var params = req.params ;
    companyDAO.getCompanyTruckCountTotal(params,function(error,result){
        if (error) {
            logger.error(' queryCompanyTruckCountTotal ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCompanyTruckCountTotal ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryCompanyRoute(req,res,next){
    var params = req.params ;
    companyDAO.getCompanyRoute(params,function(error,result){
        if (error) {
            logger.error(' queryCompanyRoute ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCompanyRoute ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateCompany(req,res,next){
    var params = req.params ;
    companyDAO.updateCompany(params,function(error,result){
        if (error) {
            logger.error(' updateCompany ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCompany ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createCompany : createCompany,
    queryCompany : queryCompany,
    queryCompanyOperateTypeTotal : queryCompanyOperateTypeTotal,
    queryCompanyTruckCountTotal : queryCompanyTruckCountTotal,
    queryCompanyRoute : queryCompanyRoute,
    updateCompany : updateCompany
}