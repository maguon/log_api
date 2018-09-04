/**
 * Created by zwl on 2018/8/27.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var entrustCityRouteRelDAO = require('../dao/EntrustCityRouteRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('EntrustCityRouteRel.js');

function createEntrustCityRouteRel(req,res,next){
    var params = req.params ;
    var cityRouteFlag  = true;
    Seq().seq(function(){
        var that = this;
        entrustCityRouteRelDAO.getEntrustCityRouteRel(params,function(error,rows){
            if (error) {
                logger.error(' getEntrustCityRouteRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length>0){
                    cityRouteFlag = false;
                }
                that();
            }
        })
    }).seq(function(){
        if(cityRouteFlag){
            entrustCityRouteRelDAO.addEntrustCityRouteRel(params,function(error,result){
                if (error) {
                    if(error.message.indexOf("Duplicate") > 0) {
                        resUtil.resetFailedRes(res, "委托方线路已经存在，请重新录入");
                        return next();
                    } else{
                        logger.error(' createEntrustCityRouteRel ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    }
                } else {
                    logger.info(' createEntrustCityRouteRel ' + 'success');
                    req.params.entrustContent =" 设置 "+params.distance+"公里  "+params.fee+"元/公里 ";
                    req.params.entrustId = params.entrustId;
                    req.params.cityRouteId = params.cityRouteId;
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        }else{
            entrustCityRouteRelDAO.updateEntrustCityRouteRel(params,function(error,result){
                if (error) {
                    logger.error(' updateEntrustCityRouteRel ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    logger.info(' updateEntrustCityRouteRel ' + 'success');
                    req.params.entrustContent =" 修改设置 "+params.distance+"公里  "+params.fee+"元/公里 ";
                    req.params.entrustId = params.entrustId;
                    req.params.cityRouteId = params.cityRouteId;
                    resUtil.resetUpdateRes(res,result,null);
                    return next();
                }
            })
        }
    })
}

function queryEntrustCityRouteRel(req,res,next){
    var params = req.params ;
    entrustCityRouteRelDAO.getEntrustCityRouteRel(params,function(error,result){
        if (error) {
            logger.error(' queryEntrustCityRouteRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryEntrustCityRouteRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateEntrustCityRouteRel(req,res,next){
    var params = req.params ;
    var parkObj = {};
    Seq().seq(function(){
        var that = this;
        entrustCityRouteRelDAO.getEntrustCityRouteRel({relId:params.relId},function(error,rows){
            if (error) {
                logger.error(' getEntrustCityRouteRel ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0){
                    parkObj.entrustId = rows[0].entrust_id;
                    parkObj.cityRouteId = rows[0].city_route_id;
                    that();
                }else{
                    logger.warn(' getEntrustCityRouteRel ' + 'failed');
                    resUtil.resetFailedRes(res,"数据不存在，请重新输入 ");
                    return next();
                }
            }
        })
    }).seq(function () {
        entrustCityRouteRelDAO.updateEntrustCityRouteRel(params,function(error,result){
            if (error) {
                logger.error(' updateEntrustCityRouteRel ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updateEntrustCityRouteRel ' + 'success');
                req.params.entrustContent =" 修改设置 "+params.distance+"公里  "+params.fee+"元/公里 ";
                req.params.entrustId = parkObj.entrustId;
                req.params.cityRouteId = parkObj.cityRouteId;
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}


module.exports = {
    createEntrustCityRouteRel : createEntrustCityRouteRel,
    queryEntrustCityRouteRel : queryEntrustCityRouteRel,
    updateEntrustCityRouteRel : updateEntrustCityRouteRel
}
