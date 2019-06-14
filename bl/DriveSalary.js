/**
 * Created by zwl on 2018/4/16.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var driveSalaryDAO = require('../dao/DriveSalaryDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DriveSalary.js');

function createDriveSalary(req,res,next){
    var params = req.params ;
    driveSalaryDAO.addDriveSalary(params,function(error,result){
        if (error) {
            if(error.message.indexOf("Duplicate") > 0) {
                resUtil.resetFailedRes(res, "本月司机已经存在，操作失败");
                return next();
            } else{
                logger.error(' createDriveSalary ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
        } else {
            logger.info(' createDriveSalary ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}

function queryDriveSalary(req,res,next){
    var params = req.params;
    driveSalaryDAO.getDriveSalary(params,function(error,result){
        if (error) {
            logger.error(' queryDriveSalary ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveSalary ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDriveSalaryBase(req,res,next){
    var params = req.params;
    driveSalaryDAO.getDriveSalaryBase(params,function(error,result){
        if (error) {
            logger.error(' queryDriveSalaryBase ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDriveSalaryBase ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDrivePlanSalary(req,res,next){
    var params = req.params;
    driveSalaryDAO.updateDrivePlanSalary(params,function(error,result){
        if (error) {
            logger.error(' updateDrivePlanSalary ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDrivePlanSalary ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDriveActualSalary(req,res,next){
    var params = req.params;
    driveSalaryDAO.updateDriveActualSalary(params,function(error,result){
        if (error) {
            logger.error(' updateDriveActualSalary ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveActualSalary ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDriveSalaryStatus(req,res,next){
    var params = req.params;
    driveSalaryDAO.updateDriveSalaryStatus(params,function(error,result){
        if (error) {
            logger.error(' updateDriveSalaryStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDriveSalaryStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function getDriveSalaryCsv(req,res,next){
    var csvString = "";
    var header = "月份" + ',' +"司机姓名" + ',' + "手机号"+ ','+"所属类型" + ',' + "所属公司" + ','+ "货车牌号" + ','+ "品牌"+ ','+
        "里程工资" + ','+ "交车打车进门费" + ','+ "倒板工资" + ','+"任务工资" + ','+ "商品车质损承担"+ ','+ "货车事故承担"+ ','+
        "违章扣款"+ ','+ "超量扣款" + ','+ "报销扣款" + ','+"社保缴费" + ','+"伙食费"+ ','+ "个人借款" + ','+ "暂扣款" + ','+"上月欠款" + ','+
        "其他扣款"+ ','+ "应付工资"+ ','+ "备注"+ ','+ "发放状态";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    driveSalaryDAO.getDriveSalary(params,function(error,rows){
        if (error) {
            logger.error(' getDriveSalary ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.monthDateId = params.monthDateId;
                parkObj.driveName = rows[i].drive_name;
                if(rows[i].mobile == null){
                    parkObj.mobile = "";
                }else{
                    parkObj.mobile = rows[i].mobile;
                }
                if(rows[i].operate_type == 1){
                    parkObj.operateType = "自营";
                }else{
                    parkObj.operateType = "外协";
                }
                if(rows[i].company_name == null){
                    parkObj.companyName = "";
                }else{
                    parkObj.companyName = rows[i].company_name;
                }
                if(rows[i].truck_num == null){
                    parkObj.truckNum = "";
                }else{
                    parkObj.truckNum = rows[i].truck_num;
                }
                if(rows[i].brand_name == null){
                    parkObj.brandName = "";
                }else{
                    parkObj.brandName = rows[i].brand_name;
                }
                if(rows[i].distance_salary == null){
                    parkObj.distanceSalary = "";
                }else{
                    parkObj.distanceSalary = rows[i].distance_salary;
                }
                if(rows[i].enter_fee == null){
                    parkObj.enterFee = "";
                }else{
                    parkObj.enterFee = rows[i].enter_fee;
                }
                if(rows[i].reverse_salary == null){
                    parkObj.reverseSalary = "";
                }else{
                    parkObj.reverseSalary = rows[i].reverse_salary;
                }
                if(rows[i].plan_salary == null){
                    parkObj.planSalary = "";
                }else{
                    parkObj.planSalary = rows[i].plan_salary;
                }
                if(rows[i].damage_under_fee == null){
                    parkObj.damageUnderFee = "";
                }else{
                    parkObj.damageUnderFee = rows[i].damage_under_fee;
                }
                if(rows[i].accident_fee == null){
                    parkObj.accidentFee = "";
                }else{
                    parkObj.accidentFee = rows[i].accident_fee;
                }
                if(rows[i].peccancy_under_fee == null){
                    parkObj.peccancyUnderFee = "";
                }else{
                    parkObj.peccancyUnderFee = rows[i].peccancy_under_fee;
                }
                if(rows[i].exceed_oil_fee == null){
                    parkObj.exceedOilFee = "";
                }else{
                    parkObj.exceedOilFee = rows[i].exceed_oil_fee;
                }
                if(rows[i].refund_fee == null){
                    parkObj.refundFee = "";
                }else{
                    parkObj.refundFee = rows[i].refund_fee;
                }
                if(rows[i].social_security_fee == null){
                    parkObj.socialSecurityFee = "";
                }else{
                    parkObj.socialSecurityFee = rows[i].social_security_fee;
                }
                if(rows[i].food_fee == null){
                    parkObj.foodFee = "";
                }else{
                    parkObj.foodFee = rows[i].food_fee;
                }
                if(rows[i].loan_fee == null){
                    parkObj.loanFee = "";
                }else{
                    parkObj.loanFee = rows[i].loan_fee;
                }
                if(rows[i].withhold == null){
                    parkObj.withhold = "";
                }else{
                    parkObj.withhold = rows[i].withhold;
                }
                if(rows[i].arrears == null){
                    parkObj.arrears = "";
                }else{
                    parkObj.arrears = rows[i].arrears;
                }
                if(rows[i].other_fee == null){
                    parkObj.otherFee = "";
                }else{
                    parkObj.otherFee = rows[i].other_fee;
                }
                if(rows[i].actual_salary == null){
                    parkObj.actualSalary = "";
                }else{
                    parkObj.actualSalary = rows[i].actual_salary;
                }
                if(rows[i].remark == null){
                    parkObj.remark = "";
                }else{
                    parkObj.remark = rows[i].remark;
                }
                if(rows[i].grant_status == 2){
                    parkObj.grantStatus = "未发放";
                }else if(rows[i].grant_status == 3){
                    parkObj.grantStatus = "已发放";
                }else{
                    parkObj.grantStatus = "未结算";
                }
                csvString = csvString+parkObj.monthDateId+","+parkObj.driveName+","+parkObj.mobile+","+parkObj.operateType+","+ parkObj.companyName+","+
                    parkObj.truckNum+","+parkObj.brandName+","+parkObj.distanceSalary+","+parkObj.enterFee+","+parkObj.reverseSalary+","+
                    parkObj.planSalary+","+parkObj.damageUnderFee+","+parkObj.accidentFee+","+parkObj.peccancyUnderFee+","+parkObj.exceedOilFee+","+
                    parkObj.refundFee+","+parkObj.socialSecurityFee+","+parkObj.foodFee+","+parkObj.loanFee+","+parkObj.withhold+","+parkObj.arrears+","+
                    parkObj.otherFee+","+parkObj.actualSalary+","+parkObj.remark+","+parkObj.grantStatus+ '\r\n';
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
    createDriveSalary : createDriveSalary,
    queryDriveSalary : queryDriveSalary,
    queryDriveSalaryBase : queryDriveSalaryBase,
    updateDrivePlanSalary : updateDrivePlanSalary,
    updateDriveActualSalary : updateDriveActualSalary,
    updateDriveSalaryStatus : updateDriveSalaryStatus,
    getDriveSalaryCsv : getDriveSalaryCsv
}
