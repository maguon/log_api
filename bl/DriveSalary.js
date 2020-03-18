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
        "里程工资" + ','+ "交车打车进门费" + ','+ "倒板工资" + ','+ "商品车质损承担"+ ','+ "货车事故承担"+ ','+
        "违章扣款"+ ','+ "超量扣款" + ','+ "质损暂扣款" + ','+ "质安罚款" + ','+ "交车暂扣款" + ','+ "个税" + ','+ "出差补助" + ','+ "满勤补助" + ','+ "其他补助" + ','+
        "商品车加油费" + ','+ "货车停车费" + ','+ "商品车停车费" + ','+ "其它运送费用" + ','+ "洗车费" + ','+ "拖车费" + ','+ "提车费" + ','+ "地跑费" + ','+ "带路费" + ','+
        "社保缴费" + ','+"伙食费"+ ','+ "个人借款" + ','+ "其他扣款"+ ','+ "应付工资"+ ','+ "备注"+ ','+ "发放状态";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    driveSalaryDAO.getDriveSalary(params,function(error,rows){
        if (error) {
            logger.error(' getDriveSalary ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                // 月份
                parkObj.monthDateId = params.monthDateId;
                // 司机姓名
                parkObj.driveName = rows[i].drive_name;
                // 手机号
                if(rows[i].mobile == null){
                    parkObj.mobile = "";
                }else{
                    parkObj.mobile = rows[i].mobile;
                }
                // 所属类型
                if(rows[i].operate_type == 1){
                    parkObj.operateType = "自营";
                }else{
                    parkObj.operateType = "外协";
                }
                // 所属公司
                if(rows[i].company_name == null){
                    parkObj.companyName = "";
                }else{
                    parkObj.companyName = rows[i].company_name;
                }
                // 货车牌号
                if(rows[i].truck_num == null){
                    parkObj.truckNum = "";
                }else{
                    parkObj.truckNum = rows[i].truck_num;
                }
                // 品牌
                if(rows[i].brand_name == null){
                    parkObj.brandName = "";
                }else{
                    parkObj.brandName = rows[i].brand_name;
                }
                // 里程工资
                if(rows[i].distance_salary == null){
                    parkObj.distanceSalary = "";
                }else{
                    parkObj.distanceSalary = rows[i].distance_salary;
                }
                // 交车打车进门费
                if(rows[i].enter_fee == null){
                    parkObj.enterFee = "";
                }else{
                    parkObj.enterFee = rows[i].enter_fee;
                }
                // 倒板工资
                if(rows[i].reverse_salary == null){
                    parkObj.reverseSalary = "";
                }else{
                    parkObj.reverseSalary = rows[i].reverse_salary;
                }
                // 商品车质损承担
                if(rows[i].damage_under_fee == null){
                    parkObj.damageUnderFee = "";
                }else{
                    parkObj.damageUnderFee = rows[i].damage_under_fee;
                }
                // 货车事故承担
                if(rows[i].accident_fee == null){
                    parkObj.accidentFee = "";
                }else{
                    parkObj.accidentFee = rows[i].accident_fee;
                }
                // 违章扣款
                if(rows[i].peccancy_under_fee == null){
                    parkObj.peccancyUnderFee = "";
                }else{
                    parkObj.peccancyUnderFee = rows[i].peccancy_under_fee;
                }
                // 超量扣款
                if(rows[i].exceed_oil_fee == null){
                    parkObj.exceedOilFee = "";
                }else{
                    parkObj.exceedOilFee = rows[i].exceed_oil_fee;
                }
                // 质损暂扣款
                if(rows[i].damage_retain_fee == null){
                    parkObj.damageRetainFee = "";
                }else{
                    parkObj.damageRetainFee = rows[i].damage_retain_fee;
                }
                // 质安罚款
                if(rows[i].damage_op_fee == null){
                    parkObj.damageOpFee = "";
                }else{
                    parkObj.damageOpFee = rows[i].damage_op_fee;
                }
                // 交车暂扣
                if(rows[i].truck_retain_fee == null){
                    parkObj.truckRetainFee = "";
                }else{
                    parkObj.truckRetainFee = rows[i].truck_retain_fee;
                }
                // 个税
                if(rows[i].personal_tax == null){
                    parkObj.personalTax = "";
                }else{
                    parkObj.personalTax = rows[i].personal_tax;
                }
                // 出差补助
                if(rows[i].hotel_bonus == null){
                    parkObj.hotelBonus = "";
                }else{
                    parkObj.hotelBonus = rows[i].hotel_bonus;
                }
                // 满勤补助
                if(rows[i].full_work_bonus == null){
                    parkObj.fullWorkBonus = "";
                }else{
                    parkObj.fullWorkBonus = rows[i].full_work_bonus;
                }
                // 其他补助
                if(rows[i].other_bonus == null){
                    parkObj.otherBonus = "";
                }else{
                    parkObj.otherBonus = rows[i].other_bonus;
                }
                // 商品车加油费
                if(rows[i].car_oil_fee == null){
                    parkObj.carOilFee = "";
                }else{
                    parkObj.carOilFee = rows[i].car_oil_fee;
                }
                // 货车停车费
                if(rows[i].truck_parking_fee == null){
                    parkObj.truckParkingFee = "";
                }else{
                    parkObj.truckParkingFee = rows[i].truck_parking_fee;
                }
                // 商品车停车费
                if(rows[i].car_parking_fee == null){
                    parkObj.carParkingFee = "";
                }else{
                    parkObj.carParkingFee = rows[i].car_parking_fee;
                }
                // 其它运送费用
                if(rows[i].dp_other_fee == null){
                    parkObj.dpOtherFee = "";
                }else{
                    parkObj.dpOtherFee = rows[i].dp_other_fee;
                }
                // 洗车费
                if(rows[i].clean_fee == null){
                    parkObj.cleanFee = "";
                }else{
                    parkObj.cleanFee = rows[i].clean_fee;
                }
                // 拖车费
                if(rows[i].trailer_fee == null){
                    parkObj.trailerFee = "";
                }else{
                    parkObj.trailerFee = rows[i].trailer_fee;
                }
                // 提车费
                if(rows[i].car_pick_fee == null){
                    parkObj.carPickFee = "";
                }else{
                    parkObj.carPickFee = rows[i].car_pick_fee;
                }
                // 地跑费
                if(rows[i].run_fee == null){
                    parkObj.runFee = "";
                }else{
                    parkObj.runFee = rows[i].run_fee;
                }
                // 带路费
                if(rows[i].lead_fee == null){
                    parkObj.leadFee = "";
                }else{
                    parkObj.leadFee = rows[i].lead_fee;
                }
                // 社保缴费
                if(rows[i].social_security_fee == null){
                    parkObj.socialSecurityFee = "";
                }else{
                    parkObj.socialSecurityFee = rows[i].social_security_fee;
                }
                // 伙食费
                if(rows[i].food_fee == null){
                    parkObj.foodFee = "";
                }else{
                    parkObj.foodFee = rows[i].food_fee;
                }
                // 个人借款
                if(rows[i].loan_fee == null){
                    parkObj.loanFee = "";
                }else{
                    parkObj.loanFee = rows[i].loan_fee;
                }
                // 其他扣款
                if(rows[i].other_fee == null){
                    parkObj.otherFee = "";
                }else{
                    parkObj.otherFee = rows[i].other_fee;
                }
                // 应付工资
                if(rows[i].actual_salary == null){
                    parkObj.actualSalary = "";
                }else{
                    parkObj.actualSalary = rows[i].actual_salary;
                }
                // 备注
                if(rows[i].remark == null){
                    parkObj.remark = "";
                }else{
                    parkObj.remark = rows[i].remark.replace(/[\r\n]/g, '');
                }
                // 发放状态
                if(rows[i].grant_status == 2){
                    parkObj.grantStatus = "未发放";
                }else if(rows[i].grant_status == 3){
                    parkObj.grantStatus = "已发放";
                }else{
                    parkObj.grantStatus = "未结算";
                }

                csvString = csvString+parkObj.monthDateId+","+parkObj.driveName+","+parkObj.mobile+","+parkObj.operateType+","+ parkObj.companyName+","+
                    parkObj.truckNum+","+parkObj.brandName+","+parkObj.distanceSalary+","+parkObj.enterFee+","+parkObj.reverseSalary+","+
                    parkObj.damageUnderFee+","+parkObj.accidentFee+","+parkObj.peccancyUnderFee+","+parkObj.exceedOilFee+","+
                    parkObj.damageRetainFee+","+parkObj.damageOpFee+","+parkObj.truckRetainFee+","+parkObj.personalTax+","+
                    parkObj.hotelBonus+","+parkObj.fullWorkBonus+","+parkObj.otherBonus+","+parkObj.carOilFee+","+
                    parkObj.truckParkingFee+","+parkObj.carParkingFee+","+parkObj.dpOtherFee+","+parkObj.cleanFee+","+
                    parkObj.trailerFee+","+parkObj.carPickFee+","+parkObj.runFee+","+parkObj.leadFee+","+
                    parkObj.socialSecurityFee+","+parkObj.foodFee+","+parkObj.loanFee+","+
                    parkObj.otherFee+","+parkObj.actualSalary+","+parkObj.remark+","+parkObj.grantStatus+ '\r\n';
            }
            var csvBuffer = new Buffer(csvString,'utf8');
            res.set('content-type', 'application/csv');
            res.set('charset', 'utf8');
            res.set('content-length', csvBuffer.length);
            res.writeHead(200);
            res.write(csvBuffer);
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
};
