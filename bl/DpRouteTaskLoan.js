/**
 * Created by zwl on 2018/2/27.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var dpRouteTaskLoanDAO = require('../dao/DpRouteTaskLoanDAO.js');
var dpRouteTaskLoanRelDAO = require('../dao/DpRouteTaskLoanRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var moment = require('moment/moment.js');
var logger = serverLogger.createLogger('DpRouteTaskLoan.js');

function createDpRouteTaskLoan(req,res,next){
    var params = req.params ;
    var dpRouteTaskLoanId = 0;
    Seq().seq(function(){
        var that = this;
        var myDate = new Date();
        params.applyDate = myDate;
        dpRouteTaskLoanDAO.addDpRouteTaskLoan(params,function(error,result){
            if (error) {
                logger.error(' createDpRouteTaskLoan ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.insertId>0){
                    logger.info(' createDpRouteTaskLoan ' + 'success');
                    dpRouteTaskLoanId = result.insertId;
                    that();
                }else{
                    resUtil.resetFailedRes(res,"create dpRouteTaskLoan failed");
                    return next();
                }
            }
        })
    }).seq(function(){
        var that = this;
        var dpRouteTaskIds = params.dpRouteTaskIds;
        var rowArray = [] ;
        rowArray.length= dpRouteTaskIds.length;
        Seq(rowArray).seqEach(function(rowObj,i){
            var that = this;
            var subParams ={
                dpRouteTaskLoanId : dpRouteTaskLoanId,
                dpRouteTaskId : dpRouteTaskIds[i],
                row : i+1,
            }
            dpRouteTaskLoanRelDAO.addDpRouteTaskLoanRel(subParams,function(err,result){
                if (err) {
                    logger.error(' createTruckAccidentInsureRel ' + err.message);
                    throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if(result&&result.insertId>0){
                        logger.info(' createTruckAccidentInsureRel ' + 'success');
                    }else{
                        logger.warn(' createTruckAccidentInsureRel ' + 'failed');
                    }
                    that(null,i);
                }
            })
        }).seq(function(){
            that();
        })
    }).seq(function(){
        logger.info(' createDpRouteTaskLoan ' + 'success');
        resUtil.resetCreateRes(res,{insertId:dpRouteTaskLoanId},null);
        return next();
    })
}

function queryDpRouteTaskLoan(req,res,next){
    var params = req.params ;
    dpRouteTaskLoanDAO.getDpRouteTaskLoan(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTaskLoan ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTaskLoan ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function updateDpRouteTaskLoanApply (req,res,next){
    var params = req.params;
    var myDate = new Date();
    params.applyDate = myDate;
    dpRouteTaskLoanDAO.updateDpRouteTaskLoanApply(params,function(error,result){
        if (error) {
            logger.error(' updateDpRouteTaskLoanApply ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDpRouteTaskLoanApply ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDpRouteTaskLoanGrant (req,res,next){
    var params = req.params;
    var myDate = new Date();
    params.grantDate = myDate;
    params.taskLoanStatus = sysConst.TASK_LOAN__STATUS.grant;
    dpRouteTaskLoanDAO.updateDpRouteTaskLoanGrant(params,function(error,result){
        if (error) {
            logger.error(' updateDpRouteTaskLoanGrant ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDpRouteTaskLoanGrant ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDpRouteTaskLoanRepayment (req,res,next){
    var params = req.params;
    var myDate = new Date();
    var strDate = moment(myDate).format('YYYYMMDD');
    params.dateId = parseInt(strDate);
    params.refundDate = myDate;
    dpRouteTaskLoanDAO.updateDpRouteTaskLoanRepayment(params,function(error,result){
        if (error) {
            logger.error(' updateDpRouteTaskLoanRepayment ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDpRouteTaskLoanRepayment ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function updateDpRouteTaskLoanStatus (req,res,next){
    var params = req.params;
    dpRouteTaskLoanDAO.updateDpRouteTaskLoanStatus(params,function(error,result){
        if (error) {
            logger.error(' updateDpRouteTaskLoanStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateDpRouteTaskLoanStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}

function removeDpRouteTaskLoan(req,res,next){
    var params = req.params;
    Seq().seq(function(){
        var that = this;
        dpRouteTaskLoanDAO.getDpRouteTaskLoan(params,function(error,rows){
            if (error) {
                logger.error(' getDpRouteTaskLoan ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else{
                if(rows&&rows.length >0&&rows[0].task_loan_status == sysConst.TASK_LOAN__STATUS.not_grant){
                    that();
                }else{
                    logger.warn(' getDpRouteTaskLoan ' + 'failed');
                    resUtil.resetFailedRes(res," 不是未发放状态，不能完成删除操作。");
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        dpRouteTaskLoanDAO.deleteDpRouteTaskLoan(params,function(error,result){
            if (error) {
                logger.error(' removeDpRouteTaskLoan ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result&&result.affectedRows>0){
                    logger.info(' removeDpRouteTaskLoan ' + 'success');
                    that();
                }else{
                    logger.warn(' removeDpRouteTaskLoan ' + 'failed');
                    resUtil.resetFailedRes(res," 删除失败，请核对相关ID ");
                    return next();
                }
            }
        })
    }).seq(function () {
        dpRouteTaskLoanRelDAO.deleteDpRouteTaskLoanRelAll(params,function(error,result){
            if (error) {
                logger.error(' removeDpRouteTaskLoanRelAll ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' removeDpRouteTaskLoanRelAll ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}

function queryDpRouteTaskLoanMonthStat(req,res,next){
    var params = req.params ;
    dpRouteTaskLoanDAO.getDpRouteTaskLoanMonthStat(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTaskLoanMonthStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTaskLoanMonthStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function getDpRouteTaskLoanCsv(req,res,next){
    var csvString = "";
    var header = "出车款编号" + ',' + "司机" + ',' + "货车牌号" + ','+ "申请金额" + ','+ "申请时间"+ ','+ "申请人"+ ','+ "申请备注"
        + ','+ "发放金额" + ','+ "发放时间" + ','+ "发放人"+ ','+ "发放备注"
        + ','+ "报销金额" + ','+ "报销时间"+ ','+ "报销人" + ','+ "报销备注"
        + ','+ "还款金额"+ ','+ "盈亏"+ ','+ "发放状态";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    dpRouteTaskLoanDAO.getDpRouteTaskLoan(params,function(error,rows){
        if (error) {
            logger.error(' getDpRouteTaskLoanCsv ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.dpRouteTaskLoanId = rows[i].id;
                parkObj.driveName = rows[i].drive_name;
                parkObj.truckNum = rows[i].truck_num;
                parkObj.applyPlanMoney = rows[i].apply_plan_money;
                if(rows[i].apply_date == null){
                    parkObj.applyDate = "";
                }else{
                    parkObj.applyDate = new Date(rows[i].apply_date).toLocaleDateString();
                }
                parkObj.applUserName = rows[i].appl_user_name;
                if(rows[i].apply_explain == null){
                    parkObj.applyExplain = "";
                }else{
                    parkObj.applyExplain = rows[i].apply_explain;
                }
                parkObj.grantActualMoney = rows[i].grant_actual_money;
                if(rows[i].grant_date == null){
                    parkObj.grantDate = "";
                }else{
                    parkObj.grantDate = new Date(rows[i].grant_date).toLocaleDateString();
                }
                if(rows[i].grant_user_name == null){
                    parkObj.grantUserName = "";
                }else{
                    parkObj.grantUserName = rows[i].grant_user_name;
                }
                if(rows[i].grant_explain == null){
                    parkObj.grantExplain = "";
                }else{
                    parkObj.grantExplain = rows[i].grant_explain;
                }
                parkObj.refundActualMoney = rows[i].refund_actual_money;
                if(rows[i].refund_date == null){
                    parkObj.refundDate = "";
                }else{
                    parkObj.refundDate = new Date(rows[i].refund_date).toLocaleDateString();
                }
                if(rows[i].refund_user_name == null){
                    parkObj.refundUserName = "";
                }else{
                    parkObj.refundUserName = rows[i].refund_user_name;
                }
                if(rows[i].refund_explain == null){
                    parkObj.refundExplain = "";
                }else{
                    parkObj.refundExplain = rows[i].refund_explain;
                }
                parkObj.repaymentMoney = rows[i].repayment_money;
                parkObj.profit = rows[i].profit;
                if(rows[i].task_loan_status == 1){
                    parkObj.taskLoanStatus = "未发放";
                }else if(rows[i].task_loan_status == 2){
                    parkObj.taskLoanStatus = "已发放";
                }else if(rows[i].task_loan_status == 3){
                    parkObj.taskLoanStatus = "已报销";
                }else{
                    parkObj.taskLoanStatus = "已取消";
                }
                csvString = csvString+parkObj.dpRouteTaskLoanId+","+parkObj.driveName+","+parkObj.truckNum+","
                    +parkObj.applyPlanMoney+","+parkObj.applyDate+","+parkObj.applUserName+","+parkObj.applyExplain+","
                    +parkObj.grantActualMoney+","+parkObj.grantDate+","+parkObj.grantUserName+","+parkObj.grantExplain+","
                    +parkObj.refundActualMoney+","+parkObj.refundDate+","+parkObj.refundUserName+","+parkObj.refundExplain+","
                    +parkObj.repaymentMoney+","+parkObj.profit+","+parkObj.taskLoanStatus+ '\r\n';
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
    createDpRouteTaskLoan : createDpRouteTaskLoan,
    queryDpRouteTaskLoan : queryDpRouteTaskLoan,
    updateDpRouteTaskLoanApply : updateDpRouteTaskLoanApply,
    updateDpRouteTaskLoanGrant : updateDpRouteTaskLoanGrant,
    updateDpRouteTaskLoanRepayment : updateDpRouteTaskLoanRepayment,
    updateDpRouteTaskLoanStatus : updateDpRouteTaskLoanStatus,
    removeDpRouteTaskLoan : removeDpRouteTaskLoan,
    queryDpRouteTaskLoanMonthStat : queryDpRouteTaskLoanMonthStat,
    getDpRouteTaskLoanCsv : getDpRouteTaskLoanCsv
}