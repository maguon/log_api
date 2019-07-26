/**
 * Created by zwl on 2019/7/25.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('EntrustInvoiceCarRelDAO.js');

function addEntrustInvoiceCarRel(params,callback){
    var query = " insert into entrust_invoice_car_rel (entrust_invoice_id,car_id,route_start_id,route_end_id,price) " +
        " values ( ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.entrustInvoiceId;
    paramsArray[i++]=params.carId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i]=params.price;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addEntrustInvoiceCarRel ');
        return callback(error,rows);
    });
}

function getEntrustInvoiceCarRel(params,callback) {
    var query = " select eicr.*,c.vin,c1.city_name as route_start,c2.city_name as route_end " +
        " from entrust_invoice_car_rel eicr " +
        " left join car_info c on eicr.car_id = c.id " +
        " left join city_info c1 on eicr.route_start_id = c1.id " +
        " left join city_info c2 on eicr.route_end_id = c2.id " +
        " where eicr.id is not null ";
    var paramsArray=[],i=0;
    if(params.relId){
        paramsArray[i++] = params.relId;
        query = query + " and eicr.id = ? ";
    }
    if(params.entrustInvoiceId){
        paramsArray[i++] = params.entrustInvoiceId;
        query = query + " and eicr.entrust_invoice_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getEntrustInvoiceCarRel ');
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
    deleteEntrustInvoiceCarRel : deleteEntrustInvoiceCarRel,
    getEntrustInvoiceCarRel : getEntrustInvoiceCarRel
}
