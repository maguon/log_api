/**
 * Created by yym on 2021/1/28.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var cityProvinceDAO = require('../dao/CityProvinceDAO.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CityProvince.js');

function createCityProvince(req,res,next){
    var params = req.params ;
    cityProvinceDAO.addCityProvince(params,function(error,result){
        if (error) {
            logger.error(' createCityProvince ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createCityProvince ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryCityProvince(req,res,next){
    var params = req.params ;
    cityProvinceDAO.getCityProvince(params,function(error,result){
        if (error) {
            logger.error(' queryCityProvince ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCityProvince ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateCityProvinceStatus(req,res,next){
    var params = req.params ;
    cityProvinceDAO.updateCityProvinceStatus(params,function(error,result){
        if (error) {
            logger.error(' updateCityProvinceStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCityProvinceStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

module.exports = {
    createCityProvince : createCityProvince,
    queryCityProvince : queryCityProvince,
    updateCityProvinceStatus : updateCityProvinceStatus
}