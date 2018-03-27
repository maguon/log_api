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
    var header = "出车款编号" + ',' + "司机" + ',' + "货车牌号" + ','+ "申请金额" + ','+ "申请时间"+ ','+ "发放金额" + ','+ "发放时间" + ','+ "报销金额"
        + ','+ "报销时间"+ ','+ "发放金额" + ','+ "发放时间" + ','+ "报销金额"+ ','+ "申请时间"+ ','+ "发放金额" + ','+ "发放时间" + ','+ "报销金额"  ;
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    dpRouteTaskLoanDAO.getDpRouteTaskLoan(params,function(error,rows){
        if (error) {
            logger.error(' getDpRouteTaskLoanCsv ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.truckNum = rows[i].truck_num;
                if(rows[i].repair_date == null){
                    parkObj.repairDate = "";
                }else{
                    parkObj.repairDate = new Date(rows[i].repair_date).toLocaleDateString();
                }
                if(rows[i].end_date == null){
                    parkObj.endDate = "";
                }else{
                    parkObj.endDate = new Date(rows[i].end_date).toLocaleDateString();
                }
                if(rows[i].truck_type == 1){
                    parkObj.truckType = "头车";
                }else{
                    parkObj.truckType = "挂车";
                }
                if(rows[i].repair_reason == null){
                    parkObj.repairReason = "";
                }else{
                    parkObj.repairReason = rows[i].repair_reason;
                }
                if(rows[i].remark == null){
                    parkObj.remark = "";
                }else{
                    parkObj.remark = rows[i].remark;
                }
                if(rows[i].repair_money == null){
                    parkObj.repairMoney = "";
                }else{
                    parkObj.repairMoney = rows[i].repair_money;
                }
                if(rows[i].repair_user == null){
                    parkObj.repairUser = "";
                }else{
                    parkObj.repairUser = rows[i].repair_user;
                }
                csvString = csvString+parkObj.truckNum+","+parkObj.repairDate+","+parkObj.endDate+","+parkObj.truckType+","+parkObj.repairReason+","+parkObj.remark+","+parkObj.repairMoney+","+parkObj.repairUser+ '\r\n';
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
    queryDpRouteTaskLoanMonthStat : queryDpRouteTaskLoanMonthStat
}