/**
 * Created by zwl on 2019/7/25.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('EntrustInvoiceDAO.js');

function addEntrustInvoice(params,callback){
    var query = " insert into entrust_invoice (entrust_id) values ( ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.entrustId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addEntrustInvoice ');
        return callback(error,rows);
    });
}

function getEntrustInvoice(params,callback) {
    var query = " select ei.*,e.short_name from entrust_invoice ei " +
        " left join entrust_info e on ei.entrust_id = e.id " +
        " where ei.id is not null ";
    var paramsArray=[],i=0;
    if(params.entrustInvoiceId){
        paramsArray[i++] = params.entrustInvoiceId;
        query = query + " and ei.id = ? ";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and ei.entrust_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getEntrustInvoice ');
        return callback(error,rows);
    });
}

function updateEntrustInvoiceCarCount(params,callback){
    var query = " update entrust_invoice ei inner join (select entrust_invoice_id,count(car_id) car_count,sum(price) price " +
        " from entrust_invoice_car_rel where entrust_invoice_id = "+params.entrustInvoiceId+") eicr on ei.id = eicr.entrust_invoice_id " +
        " set ei.car_count = eicr.car_count , ei.plan_price = eicr.price where eicr.entrust_invoice_id = "+params.entrustInvoiceId;
    var paramsArray=[],i=0;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateEntrustInvoiceCarCount ');
        return callback(error,rows);
    });
}

function updateEntrustInvoice(params,callback){
    var query = " update entrust_invoice set update_price = ? , actual_price = ? , remark = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.updatePrice;
    paramsArray[i++]=params.actualPrice;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.entrustInvoiceId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateEntrustInvoice ');
        return callback(error,rows);
    });
}

function updateEntrustInvoiceStatus(params,callback){
    var query = " update entrust_invoice set invoice_status = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.invoiceStatus;
    paramsArray[i]=params.entrustInvoiceId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateEntrustInvoiceStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addEntrustInvoice : addEntrustInvoice,
    getEntrustInvoice : getEntrustInvoice,
    updateEntrustInvoiceCarCount : updateEntrustInvoiceCarCount,
    updateEntrustInvoice : updateEntrustInvoice,
    updateEntrustInvoiceStatus : updateEntrustInvoiceStatus
}
