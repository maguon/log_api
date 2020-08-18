/**
 * Created by zwl on 2018/1/26.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var damageInsureRelDAO = require('../dao/DamageInsureRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DamageInsureRel.js');

function createDamageInsureRel(req,res,next){
    var params = req.params ;
    damageInsureRelDAO.addDamageInsureRel(params,function(error,result){
        if (error) {
            logger.error(' createDamageInsureRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createDamageInsureRel ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function removeDamageInsureRel(req,res,next){
    var params = req.params;
    damageInsureRelDAO.deleteDamageInsureRel(params,function(error,result){
        if (error) {
            logger.error(' removeDamageInsureRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeDamageInsureRel ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
            }
    })
}

function getDamageInsureRelCsv(req,res,next){
    var csvString = "";
    var header = "赔付编号" + ',' + "办理时间" + ','+ "保险公司"+ ',' + "定损金额"+ ',' + "待赔金额" + ','+ "实际赔付" + ','+ "经办人"
        + ','+ "出险城市" + ',' + "报案日期" + ','+ "责任判定"+ ',' + "定损员信息"+ ',' + "免赔金额" + ','+ "车辆估值" + ','+ "发票金额"
        + ','+ "质损编号" + ','+ "VIN码" + ','+ "委托方" + ','+ "经销商" + ','+ "质损类型" + ','+ "责任人" + ','+ "司机" + ','+ "货车牌号" + ','+ "质损说明";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    damageInsureRelDAO.getDamageInsureRel(params,function(error,rows){
        if (error) {
            logger.error(' queryDamageInsureRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.damageInsureId = rows[i].damage_insure_id;
                parkObj.createdOn = new Date(rows[i].created_on).toLocaleDateString();
                parkObj.insureName = rows[i].insure_name;
                if(rows[i].damage_money==null){
                    parkObj.damageMoney = "";
                }else{
                    parkObj.damageMoney = rows[i].damage_money;
                }
                parkObj.insurePlan = rows[i].insure_plan;
                if(rows[i].insure_actual==null){
                    parkObj.insureActual = "";
                }else{
                    parkObj.insureActual = rows[i].insure_actual;
                }
                parkObj.insureUserName = rows[i].insure_user_name;
                if(rows[i].city_name==null){
                    parkObj.cityName = "";
                }else{
                    parkObj.cityName = rows[i].city_name;
                }
                if(rows[i].declare_date == null){
                    parkObj.declareDate = "";
                }else{
                    parkObj.declareDate = new Date(rows[i].declare_date).toLocaleDateString();
                }
                if(rows[i].liability_type == 1){
                    parkObj.liabilityType = "全责";
                }else if(rows[i].liability_type == 2){
                    parkObj.liabilityType = "免责";
                }else if(rows[i].liability_type == 3){
                    parkObj.liabilityType = "五五";
                }else if(rows[i].liability_type == 4){
                    parkObj.liabilityType = "三七";
                }else{
                    parkObj.liabilityType = "";
                }
                if(rows[i].ref_remark==null){
                    parkObj.refRemark = "";
                }else{
                    parkObj.refRemark = rows[i].ref_remark;
                }
                if(rows[i].derate_money==null){
                    parkObj.derateMoney = "";
                }else{
                    parkObj.derateMoney = rows[i].derate_money;
                }
                if(rows[i].car_valuation==null){
                    parkObj.carValuation = "";
                }else{
                    parkObj.carValuation = rows[i].car_valuation;
                }
                if(rows[i].invoice_money==null){
                    parkObj.invoiceMoney = "";
                }else{
                    parkObj.invoiceMoney = rows[i].invoice_money;
                }
                parkObj.damageId = rows[i].damage_id;
                if(parkObj.vin == null){
                    parkObj.vin = "";
                }else{
                    parkObj.vin = rows[i].vin;
                }
                parkObj.eShortName = rows[i].e_short_name;
                if(rows[i].r_short_name==null){
                    parkObj.rShortName = "";
                }else{
                    parkObj.rShortName = rows[i].r_short_name;
                }
                if(rows[i].damage_type == 1){
                    parkObj.damageType = "A级";
                }else if(rows[i].damage_type == 2){
                    parkObj.damageType = "B级";
                }else if(rows[i].damage_type == 3){
                    parkObj.damageType = "C级";
                }else if(rows[i].damage_type == 4){
                    parkObj.damageType = "D级";
                }else{
                    parkObj.damageType = "F级";
                }
                if(rows[i].under_user_name==null){
                    parkObj.underUserName = "";
                }else{
                    parkObj.underUserName = rows[i].under_user_name;
                }
                if(rows[i].drive_name==null){
                    parkObj.driveName = "";
                }else{
                    parkObj.driveName = rows[i].drive_name;
                }
                if(rows[i].truck_num==null){
                    parkObj.truckNum = "";
                }else{
                    parkObj.truckNum = rows[i].truck_num;
                }
                if(rows[i].damage_explain==null){
                    parkObj.damageExplain = "";
                }else{
                    parkObj.damageExplain = rows[i].damage_explain.replace(/[\r\n]/g, '');
                }
                csvString = csvString+parkObj.damageInsureId+","+parkObj.createdOn+","+parkObj.insureName+","
                    +parkObj.damageMoney+"," +parkObj.insurePlan+","+parkObj.insureActual+"," +parkObj.insureUserName+","
                    +parkObj.cityName+"," +parkObj.declareDate+","+parkObj.liabilityType+"," +parkObj.refRemark+","
                    +parkObj.derateMoney+"," +parkObj.carValuation+","+parkObj.invoiceMoney+","
                    +parkObj.damageId+","+parkObj.vin+","+parkObj.eShortName+","+parkObj.rShortName+","+parkObj.damageType+","
                    +parkObj.underUserName+","+parkObj.driveName+","+parkObj.truckNum+","+parkObj.damageExplain+ '\r\n';
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


module.exports = {
    createDamageInsureRel : createDamageInsureRel,
    removeDamageInsureRel : removeDamageInsureRel,
    getDamageInsureRelCsv : getDamageInsureRelCsv
}