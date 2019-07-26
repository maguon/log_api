/**
 * Created by zwl on 2019/7/25.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('EntrustInvoiceCarRelDAO.js');

function addEntrustInvoiceCarRel(params,callback){
    var query = " insert into entrust_invoice_car_rel (entrust_invoice_id,car_id,price) values ( ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.entrustInvoiceId;
    paramsArray[i++]=params.carId;
    paramsArray[i]=params.price;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addEntrustInvoiceCarRel ');
        return callback(error,rows);
    });
}

function deleteEntrustInvoiceCarRel(params,callback){
    var query = " delete from entrust_invoice_car_rel where entrust_invoice_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.entrustInvoiceId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteEntrustInvoiceCarRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addEntrustInvoiceCarRel : addEntrustInvoiceCarRel,
    deleteEntrustInvoiceCarRel : deleteEntrustInvoiceCarRel
}
