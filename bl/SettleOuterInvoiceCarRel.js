/**
 * Created by zwl on 2019/8/6.
 */

var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var encrypt = require('../util/Encrypt.js');
var listOfValue = require('../util/ListOfValue.js');
var sysConst = require('../util/SysConst.js');
var settleOuterInvoiceCarRelDAO = require('../dao/SettleOuterInvoiceCarRelDAO.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var Seq = require('seq');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleOuterInvoiceCarRel.js');

function querySettleOuterInvoiceCarRel(req,res,next){
    var params = req.params ;
    settleOuterInvoiceCarRelDAO.getSettleOuterInvoiceCarRel(params,function(error,result){
        if (error) {
            logger.error(' querySettleOuterInvoiceCarRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySettleOuterInvoiceCarRel ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}

function getSettleOuterInvoiceCarRelCsv(req,res,next){
    var csvString = "";
    var header = "VIN" + ',' + "公里数" + ',' + "单价" + ','+ "总价";
    csvString = header + '\r\n'+csvString;
    var params = req.params ;
    var parkObj = {};
    settleOuterInvoiceCarRelDAO.getSettleOuterInvoiceCarRel(params,function(error,rows){
        if (error) {
            logger.error(' getSettleOuterInvoiceCarRel ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            for(var i=0;i<rows.length;i++){
                parkObj.vin = rows[i].vin;
                if(rows[i].distance==null){
                    parkObj.distance = "";
                }else{
                    parkObj.distance = rows[i].distance;
                }
                if(rows[i].fee==null){
                    parkObj.fee = "";
                }else{
                    parkObj.fee = rows[i].fee;
                }
                if(rows[i].total_fee==null){
                    parkObj.totalFee = "";
                }else{
                    parkObj.totalFee = rows[i].total_fee;
                }
                csvString = csvString+parkObj.vin+","+parkObj.distance+","+parkObj.fee+","+parkObj.totalFee+'\r\n';
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
    querySettleOuterInvoiceCarRel : querySettleOuterInvoiceCarRel,
    getSettleOuterInvoiceCarRelCsv : getSettleOuterInvoiceCarRelCsv
}
