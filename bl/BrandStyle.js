/**
 * Created by yym on 2020/5/13.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var brandStyleDAO = require('../dao/BrandStyleDAO.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('BrandStyle.js');

function createBrandStyle(req,res,next){
    var params = req.params ;
    brandStyleDAO.addBrandStyle(params,function(error,result){
        if (error) {
            logger.error(' createBrandStyle ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createBrandStyle ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryBrandStyle(req,res,next){
    var params = req.params ;
    brandStyleDAO.getBrandStyle(params,function(error,result){
        if (error) {
            logger.error(' queryBrandStyle ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryBrandStyle ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateBrandStyle(req,res,next){
    var params = req.params ;
    brandStyleDAO.updateBrandStyle(params,function(error,result){
        if (error) {
            logger.error(' updateBrandStyle ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateBrandStyle ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

module.exports = {
    createBrandStyle : createBrandStyle,
    queryBrandStyle : queryBrandStyle,
    updateBrandStyle : updateBrandStyle
}
