/**
 * Created by zwl on 2017/8/14.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var cityRouteDAO = require('../dao/CityRouteDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CityRoute.js');

function createCityRoute(req,res,next){
    var params = req.params ;
    cityRouteDAO.addCityRoute(params,function(error,result){
        if (error) {
            logger.error(' createCityRoute ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createCityRoute ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryCityRoute(req,res,next){
    var params = req.params ;
    cityRouteDAO.getCityRoute(params,function(error,result){
        if (error) {
            logger.error(' queryCityRoute ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCityRoute ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateCityRoute(req,res,next){
    var params = req.params ;
    cityRouteDAO.updateCityRoute(params,function(error,result){
        if (error) {
            logger.error(' updateCityRoute ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCityRoute ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createCityRoute : createCityRoute,
    queryCityRoute : queryCityRoute,
    updateCityRoute : updateCityRoute
}