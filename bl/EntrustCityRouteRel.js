/**
 * Created by zwl on 2018/8/27.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var entrustCityRouteRelDAO = require('../dao/EntrustCityRouteRelDAO.js');
var cityDAO = require('../dao/CityDAO.js');
var carMakeDAO = require('../dao/CarMakeDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('EntrustCityRouteRel.js');
var csv=require('csvtojson');
var fs = require('fs');

function createEntrustCityRouteRel(req,res,next){
    var params = req.params ;
    var parkObj = {};
    var cityRouteFlag  = true;
    Seq().seq(function(){
        var that = this;
        cityDAO.getCity({cityId:params.routeStartId},function(error,rows){
            if (error) {
                logger.error(' getCity ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length>0){
                    parkObj.routeStart = rows[0].city_name;
                }
                that();
            }
        })
    }).seq(function(){
        var that = this;
        cityDAO.getCity({cityId:params.routeEndId},function(error,rows){
            if (error) {
                logger.error(' getCity ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length>0){
                    parkObj.routeEnd = rows[0].city_name;
                }
                that();
            }
        })
    }).seq(function(){
        var that = this;
        if(params.sizeType==0){
            params.sizeType = "0";
        }
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
                    req.params.entrustContent =" 设置  "+parkObj.routeStart+" - "+parkObj.routeEnd+" 品牌 "+params.makeName+"  "+
                        params.distance+"公里  "+params.fee+"元/公里 "+" "+params.twoDistance+"公里  "+params.twoFee+"元/公里 ";
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
                    req.params.entrustContent =" 修改设置  "+parkObj.routeStart+" - "+parkObj.routeEnd+" 品牌 "+params.makeName+"  "+
                        params.distance+"公里  "+params.fee+"元/公里 "+" "+params.twoDistance+"公里  "+params.twoFee+"元/公里 ";
                    req.params.entrustId = params.entrustId;
                    req.params.cityRouteId = params.cityRouteId;
                    resUtil.resetQueryRes(res,null);
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
        var subParams = {
            entrustId : params.entrustId,
            makeId : params.makeId,
            routeStartId : params.routeStartId,
            routeEndId : params.routeEndId
        }
        entrustCityRouteRelDAO.getEntrustCityRouteRel(subParams,function(error,rows){
            if (error) {
                logger.error(' getEntrustCityRouteRel ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows && rows.length>0){
                    parkObj.entrustId = rows[0].entrust_id;
                    parkObj.cityRouteId = rows[0].city_route_id;
                    parkObj.makeName = rows[0].make_name;
                    parkObj.routeStart = rows[0].route_start;
                    parkObj.routeEnd = rows[0].route_end;
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
                req.params.entrustContent =" 修改设置  "+parkObj.routeStart+" - "+parkObj.routeEnd+" 品牌 "+parkObj.makeName+"  "+
                    params.distance+"公里  "+params.fee+"元/公里 "+" "+params.twoDistance+"公里  "+params.twoFee+"元/公里 ";
                req.params.entrustId = parkObj.entrustId;
                req.params.cityRouteId = parkObj.cityRouteId;
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function getEntrustCityRouteRelCsv(req,res,next){
    var csvString = "";
    var header = "委托方" + ',' +"品牌" + ',' + "车型" + ',' + "起始城市" + ','+ "目的城市" + ','+ "公里数"+ ','+ "单价" + ','+"总价" + ','+
        "二级公里数" + ','+ "二级单价" + ','+"二级总价";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    entrustCityRouteRelDAO.getEntrustCityRouteRel(params,function(error,rows){
        if (error) {
            logger.error(' getEntrustCityRouteRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.shortName = rows[i].short_name;
                parkObj.makeName = rows[i].make_name;
                if(rows[i].size_type == 1){
                    parkObj.sizeType = "小";
                }else{
                    parkObj.sizeType = "大";
                }
                if(rows[i].route_start == null){
                    parkObj.routeStart = "";
                }else{
                    parkObj.routeStart = rows[i].route_start;
                }
                if(rows[i].route_end == null){
                    parkObj.routeEnd = "";
                }else{
                    parkObj.routeEnd = rows[i].route_end;
                }
                if(rows[i].distance == null){
                    parkObj.distance = "";
                }else{
                    parkObj.distance = rows[i].distance;
                }
                if(rows[i].fee == null){
                    parkObj.fee = "";
                }else{
                    parkObj.fee = rows[i].fee;
                }
                parkObj.totalFee =rows[i].distance*rows[i].fee;
                if(rows[i].two_distance == null){
                    parkObj.twoDistance = "";
                }else{
                    parkObj.twoDistance = rows[i].two_distance;
                }
                if(rows[i].two_fee == null){
                    parkObj.twoFee = "";
                }else{
                    parkObj.twoFee = rows[i].two_fee;
                }
                parkObj.twoTotalFee =rows[i].two_distance*rows[i].two_fee;

                csvString = csvString+parkObj.shortName+","+parkObj.makeName+","+parkObj.sizeType+","+parkObj.routeStart+","+parkObj.routeEnd+","+
                    parkObj.distance+","+parkObj.fee+","+parkObj.totalFee+","+parkObj.twoDistance+","+
                    parkObj.twoFee+","+parkObj.twoTotalFee+ '\r\n';
            }
            var csvBuffer = new Buffer(csvString,'utf8');
            res.set('content-type', 'application/csv');
            res.set('charset', 'utf8');
            res.set('content-length', csvBuffer.length);
            res.writeHead(200);
            res.write(csvBuffer);//TODO
            res.end();
            return next(false);
        }
    })
}

function uploadEntrustCityRouteRelFile(req,res,next){
    var params = req.params;
    var relFlag  = true;
    var parkObj = {};
    var successedInsert = 0;
    var failedCase = 0;
    var file = req.files.file;
    csv().fromFile(file.path).then(function(objArray) {
        Seq(objArray).seqEach(function(rowObj,i){
            var that = this;
            Seq().seq(function(){
                var that = this;
                var subParams ={
                    makeId : objArray[i].制造商ID,
                    row : i+1,
                }
                carMakeDAO.getCarMake(subParams,function(error,rows){
                    if (error) {
                        logger.error(' getCarMake ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else{
                        if(rows&&rows.length==1) {
                            parkObj.makeName = rows[0].make_name;
                        }else{
                            parkObj.makeName = "";
                        }
                        that();
                    }
                })
            }).seq(function(){
                var that = this;
                var subParams ={
                    entrustId : objArray[i].委托方ID,
                    makeId : objArray[i].制造商ID,
                    routeStartId : objArray[i].起始城市ID,
                    routeEndId : objArray[i].目的地ID,
                    sizeType : objArray[i].车型,
                    row : i+1,
                }
                entrustCityRouteRelDAO.getEntrustCityRouteRel(subParams,function(error,rows){
                    if (error) {
                        logger.error(' getEntrustCityRouteRel ' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    } else{
                        if(rows&&rows.length>0){
                            relFlag = false;
                        }else{
                            relFlag = true;
                        }
                        that();
                    }
                })
            }).seq(function(){
                if(objArray[i].车型=='1'||objArray[i].车型=='0'){
                    if(relFlag){
                        if(objArray[i].起始城市ID>objArray[i].目的地ID){
                            parkObj.cityRouteId = objArray[i].目的地ID+''+objArray[i].起始城市ID;
                        }else{
                            parkObj.cityRouteId = objArray[i].起始城市ID+''+objArray[i].目的地ID;
                        }
                        var subParams ={
                            entrustId : objArray[i].委托方ID,
                            cityRouteId : parkObj.cityRouteId,
                            makeId : objArray[i].制造商ID,
                            makeName : parkObj.makeName,
                            routeStartId : objArray[i].起始城市ID,
                            routeEndId : objArray[i].目的地ID,
                            sizeType : objArray[i].车型,
                            distance : objArray[i].公里数,
                            fee : objArray[i].单价,
                            twoDistance : objArray[i].二级公里数,
                            twoFee : objArray[i].二级单价,
                            row : i+1
                        }
                        entrustCityRouteRelDAO.addEntrustCityRouteRel(subParams,function(err,result){
                            if (err) {
                                logger.error(' addEntrustCityRouteRel ' + err.message);
                                //throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                                that(null,i);
                            } else {
                                if(result&&result.affectedRows>0){
                                    successedInsert = successedInsert+result.affectedRows;
                                    logger.info(' addEntrustCityRouteRel ' + 'success');
                                }else{
                                    logger.warn(' addEntrustCityRouteRel ' + 'failed');
                                }
                                that(null,i);
                            }
                        })
                    }else{
                        var subParams ={
                            entrustId : objArray[i].委托方ID,
                            makeId : objArray[i].制造商ID,
                            routeStartId : objArray[i].起始城市ID,
                            routeEndId : objArray[i].目的地ID,
                            sizeType : objArray[i].车型,
                            distance : objArray[i].公里数,
                            fee : objArray[i].单价,
                            twoDistance : objArray[i].二级公里数,
                            twoFee : objArray[i].二级单价,
                            row : i+1
                        }
                        entrustCityRouteRelDAO.updateEntrustCityRouteRel(subParams,function(err,result){
                            if (err) {
                                logger.error(' updateEntrustCityRouteRel ' + err.message);
                                //throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                                that(null,i);
                            } else {
                                if(result && result.affectedRows > 0){
                                    successedInsert = successedInsert+result.affectedRows;
                                    logger.info(' updateEntrustCityRouteRel ' + 'success');
                                }else{
                                    logger.warn(' updateEntrustCityRouteRel ' + 'failed');
                                }
                                that(null,i);
                            }
                        })
                    }
                }else{
                    that(null,i);
                }

            })

        }).seq(function(){
            fs.unlink(file.path, function() {});
            failedCase=objArray.length-successedInsert;
            logger.info(' uploadEntrustCityRouteRelFile ' + 'success');
            resUtil.resetQueryRes(res, {successedInsert:successedInsert,failedCase:failedCase},null);
            return next();
        })
    })
}


module.exports = {
    createEntrustCityRouteRel : createEntrustCityRouteRel,
    queryEntrustCityRouteRel : queryEntrustCityRouteRel,
    updateEntrustCityRouteRel : updateEntrustCityRouteRel,
    getEntrustCityRouteRelCsv : getEntrustCityRouteRelCsv,
    uploadEntrustCityRouteRelFile : uploadEntrustCityRouteRelFile
}
