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
        params.grantDate = myDate;
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
                    if(err.message.indexOf("Duplicate") > 0) {
                        resUtil.resetFailedRes(res, "调度编号已经被关联，操作失败");
                        return next();
                    } else{
                        logger.error(' createTruckAccidentInsureRel ' + err.message);
                        throw sysError.InternalError(err.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    }
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

function updateDpRouteTaskLoanGrant (req,res,next){
    var params = req.params;
    var myDate = new Date();
    params.grantDate = myDate;
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
    if(params.refundDate){
        var refundDate = params.refundDate;
        var d = new Date(refundDate);
        var currentDateStr = moment(d).format('YYYYMMDD');
        params.dateId = parseInt(currentDateStr);
        params.refundDate = d;
    }else{
        var myDate = new Date();
        var strDate = moment(myDate).format('YYYYMMDD');
        params.dateId = parseInt(strDate);
        params.refundDate = myDate;
    }
    params.taskLoanStatus = sysConst.TASK_LOAN_STATUS.refund;
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

function queryDpRouteTaskLoanCount(req,res,next){
    var params = req.params ;
    dpRouteTaskLoanDAO.getDpRouteTaskLoanCount(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTaskLoanCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTaskLoanCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
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

function queryDpRouteTaskLoanDayStat(req,res,next){
    var params = req.params ;
    dpRouteTaskLoanDAO.getDpRouteTaskLoanDayStat(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTaskLoanDayStat ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTaskLoanDayStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function getDpRouteTaskLoanCsv(req,res,next){
    var csvString = "";
    var header = "出车款编号" + ',' + "司机" + ',' + "货车牌号" + ','+ "发放金额" + ','+ "发放时间" + ','+ "发放人"+ ','+ "发放备注"
        + ','+ "报销金额" + ','+ "报销时间"+ ','+ "报销人" + ','+ "报销备注" + ','+ "还款金额"+ ','+ "盈亏"+ ','+ "发放状态";
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
                parkObj.grantActualMoney = rows[i].grant_actual_money;
                if(rows[i].grant_date == null){
                    parkObj.grantDate = "";
                }else{
                    parkObj.grantDate = moment(rows[i].grant_date).format('YYYY-MM-DD');
                }
                if(rows[i].grant_user_name == null){
                    parkObj.grantUserName = "";
                }else{
                    parkObj.grantUserName = rows[i].grant_user_name;
                }
                if(rows[i].grant_explain == null){
                    parkObj.grantExplain = "";
                }else{
                    parkObj.grantExplain = rows[i].grant_explain.replace(/[\r\n]/g, '');
                }
                parkObj.refundActualMoney = rows[i].refund_actual_money;
                if(rows[i].refund_date == null){
                    parkObj.refundDate = "";
                }else{
                    parkObj.refundDate = moment(rows[i].refund_date).format('YYYY-MM-DD');
                }
                if(rows[i].refund_user_name == null){
                    parkObj.refundUserName = "";
                }else{
                    parkObj.refundUserName = rows[i].refund_user_name;
                }
                if(rows[i].refund_explain == null){
                    parkObj.refundExplain = "";
                }else{
                    parkObj.refundExplain = rows[i].refund_explain.replace(/[\r\n]/g, '');
                }
                parkObj.repaymentMoney = rows[i].repayment_money;
                parkObj.profit = rows[i].profit;
                 if(rows[i].task_loan_status == 1){
                    parkObj.taskLoanStatus = "已发放";
                }else if(rows[i].task_loan_status == 2){
                    parkObj.taskLoanStatus = "已报销";
                }else{
                    parkObj.taskLoanStatus = "已取消";
                }
                csvString = csvString+parkObj.dpRouteTaskLoanId+","+parkObj.driveName+","+parkObj.truckNum+","
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

function queryDpRouteTaskNotLoan(req,res,next){
    var params = req.params ;
    dpRouteTaskLoanDAO.getDpRouteTaskNotLoan(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTaskNotLoan ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTaskNotLoan ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function queryDpRouteTaskNotLoanCount(req,res,next){
    var params = req.params ;
    dpRouteTaskLoanDAO.getDpRouteTaskNotLoanCount(params,function(error,result){
        if (error) {
            logger.error(' queryDpRouteTaskNotLoanCount ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryDpRouteTaskNotLoanCount ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports = {
    createDpRouteTaskLoan : createDpRouteTaskLoan,
    queryDpRouteTaskLoan : queryDpRouteTaskLoan,
    updateDpRouteTaskLoanGrant : updateDpRouteTaskLoanGrant,
    updateDpRouteTaskLoanRepayment : updateDpRouteTaskLoanRepayment,
    updateDpRouteTaskLoanStatus : updateDpRouteTaskLoanStatus,
    queryDpRouteTaskLoanCount : queryDpRouteTaskLoanCount,
    queryDpRouteTaskLoanMonthStat : queryDpRouteTaskLoanMonthStat,
    queryDpRouteTaskLoanDayStat : queryDpRouteTaskLoanDayStat,
    getDpRouteTaskLoanCsv : getDpRouteTaskLoanCsv,
    queryDpRouteTaskNotLoan : queryDpRouteTaskNotLoan,
    queryDpRouteTaskNotLoanCount : queryDpRouteTaskNotLoanCount
}