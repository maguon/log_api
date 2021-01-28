/**
 * Created by zwl on 2017/4/5.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var cityDAO = require('../dao/CityDAO.js');
var cityProvinceDAO = require('../dao/CityProvinceDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('City.js');

function createCity(req,res,next){
    var params = req.params ;
    Seq().seq(function () {
        var that = this;
        params.provinceId = params.cityProvinceId;
        cityProvinceDAO.getCityProvince(params,function(error,rows){
            if (error) {
                logger.error(' createCity getCityProvince ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0){
                    params.provinceName = rows[0].province_name;
                    that();
                }else{
                    logger.warn(' createCity getCityProvince ' + 'failed');
                    resUtil.resetFailedRes(res, " 省份不存在，操作失败 ");
                    return next();
                }
            }
        })
    }).seq(function () {
        cityDAO.addCity(params,function(error,result){
            if (error) {
                logger.error(' createCity addCity ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' createCity addCity ' + 'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryCity(req,res,next){
    var params = req.params ;
    cityDAO.getCity(params,function(error,result){
        if (error) {
            logger.error(' queryCity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryCity ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateCity(req,res,next){
    var params = req.params ;
    cityDAO.updateCity(params,function(error,result){
        if (error) {
            logger.error(' updateCity ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCity ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateCityOilFlag (req,res,next){
    var params = req.params;
    cityDAO.updateCityOilFlag(params,function(error,result){
        if (error) {
            logger.error(' updateCityOilFlag ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCityOilFlag ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateCityStatus (req,res,next){
    var params = req.params;
    cityDAO.updateCityStatus(params,function(error,result){
        if (error) {
            logger.error(' updateCityStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateCityStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateCityProvince (req,res,next){
    var params = req.params;
    Seq().seq(function () {
        var that = this;
        params.provinceId = params.cityProvinceId;
        cityProvinceDAO.getCityProvince(params,function(error,rows){
            if (error) {
                logger.error(' updateCityProvince getCityProvince ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0){
                    params.provinceName = rows[0].province_name;
                    that();
                }else{
                    logger.warn(' updateCityProvince getCityProvince ' + 'failed');
                    resUtil.resetFailedRes(res, " 省份不存在，操作失败 ");
                    return next();
                }
            }
        })
    }).seq(function () {
        cityDAO.updateCityProvince(params,function(error,result){
            if (error) {
                logger.error(' updateCityProvince updateCityProvince ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateCityProvince updateCityProvince ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createCity : createCity,
    queryCity : queryCity,
    updateCity : updateCity,
    updateCityOilFlag : updateCityOilFlag,
    updateCityStatus : updateCityStatus,
    updateCityProvince : updateCityProvince
}