/**
 * Created by zwl on 2019/8/6.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleOuterInvoiceCarRelDAO.js');

function addSettleOuterInvoiceCarRelBatch(params,callback) {
    var query = " insert into settle_outer_invoice_car_rel (outer_invoice_id,car_id,distance,fee,total_fee) " +
        " select "+params.outerInvoiceId+",c.id,sot.distance,sot.fee,sot.distance*sot.fee " +
        " from dp_route_task dpr " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " left join company_info cm on t.company_id = cm.id " +
        " left join dp_route_load_task_detail drltd on dpr.id = drltd.dp_route_task_id " +
        " left join car_info c on drltd.car_id = c.id " +
        " left join settle_outer_truck sot on c.make_id = sot.make_id and c.route_start_id = sot.route_start_id " +
        " and c.route_end_id = sot.route_end_id and t.company_id = sot.company_id " +
        " left join settle_outer_invoice_car_rel soicr on c.id = soicr.car_id " +
        " where dpr.id is not null and c.car_status=9 and soicr.car_id is null ";
    var paramsArray=[],i=0;
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and c.entrust_id = ? ";
    }
    if(params.orderStart){
        paramsArray[i++] = params.orderStart;
        query = query + " and c.order_date >= ? ";
    }
    if(params.orderEnd){
        paramsArray[i++] = params.orderEnd;
        query = query + " and c.order_date <= ? ";
    }
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and c.make_id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and c.route_start_id = ? ";
    }
    if(params.addrId){
        paramsArray[i++] = params.addrId;
        query = query + " and c.base_addr_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and c.route_end_id = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and c.receive_id = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and t.operate_type = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and t.company_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and dpr.truck_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addSettleOuterInvoiceCarRelBatch ');
        return callback(error,rows);
    });
}

function getSettleOuterInvoiceCarRel(params,callback) {
    var query = " select soicr.*,c.vin " +
        " from settle_outer_invoice_car_rel soicr " +
        " left join car_info c on soicr.car_id = c.id " +
        " where soicr.id is not null ";
    var paramsArray=[],i=0;
    if(params.relId){
        paramsArray[i++] = params.relId;
        query = query + " and soicr.id = ? ";
    }
    if(params.outerInvoiceId){
        paramsArray[i++] = params.outerInvoiceId;
        query = query + " and soicr.outer_invoice_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSettleOuterInvoiceCarRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addSettleOuterInvoiceCarRelBatch : addSettleOuterInvoiceCarRelBatch,
    getSettleOuterInvoiceCarRel : getSettleOuterInvoiceCarRel
}
