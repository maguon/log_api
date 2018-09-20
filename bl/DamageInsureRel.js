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
    var header = "赔付编号" + ',' + "办理时间" + ',' + "保险待赔" + ','+ "保险赔付" + ','+ "保险公司"+ ','+ "经办人"
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
                parkObj.damageInsureDate = new Date(rows[i].damage_insure_date).toLocaleDateString();
                parkObj.insurePlan = rows[i].insure_plan;
                if(rows[i].insure_actual==null){
                    parkObj.insureActual = "";
                }else{
                    parkObj.insureActual = rows[i].insure_actual;
                }
                parkObj.insureName = rows[i].insure_name;
                parkObj.insureUserName = rows[i].insure_user_name;
                parkObj.damageId = rows[i].damage_id;
                parkObj.vin = rows[i].vin;
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
                    parkObj.damageExplain = rows[i].damage_explain;
                }
                csvString = csvString+parkObj.damageInsureId+","+parkObj.damageInsureDate+","+parkObj.insurePlan+","
                    +parkObj.insureActual+"," +parkObj.insureName+","+parkObj.insureUserName+","
                    +parkObj.damageId+","+parkObj.vin+parkObj.eShortName+","+parkObj.rShortName+","+parkObj.damageType+","
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