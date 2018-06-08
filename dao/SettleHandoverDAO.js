/**
 * Created by zwl on 2018/6/5.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleHandoverDAO.js');

function addSettleHandover(params,callback){
    var query = " insert into settle_handover_info (number,entrust_id,op_user_id,received_date,remark) values ( ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.number;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.receivedDate;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addSettleHandover ');
        return callback(error,rows);
    });
}

function getSettleHandover(params,callback) {
    var query = " select sh.*,e.short_name,u.real_name as op_user_name from settle_handover_info sh" +
        " left join entrust_info e on sh.entrust_id = e.id " +
        " left join user_info u on sh.op_user_id = u.uid " +
        " left join settle_handover_car_rel shcr on sh.id = shcr.settle_handover_id " +
        " left join car_info c on shcr.car_id = c.id " +
        " where sh.id is not null ";
    var paramsArray=[],i=0;
    if(params.settleHandoverId){
        paramsArray[i++] = params.settleHandoverId;
        query = query + " and sh.id = ? ";
    }
    if(params.number){
        paramsArray[i++] = params.number;
        query = query + " and sh.number = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
    }
    if(params.vinCode){
        query = query + " and c.vin like '%"+params.vinCode+"%'";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and sh.entrust_id = ? ";
    }
    if(params.receivedDateStart){
        paramsArray[i++] = params.receivedDateStart +" 00:00:00";
        query = query + " and sh.received_date >= ? ";
    }
    if(params.receivedDateEnd){
        paramsArray[i++] = params.receivedDateEnd +" 23:59:59";
        query = query + " and sh.received_date <= ? ";
    }
    query = query + ' order by sh.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSettleHandover ');
        return callback(error,rows);
    });
}

function updateCarCountPlus(params,callback){
    var query = " update settle_handover_info set car_count = car_count +1 where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i]=params.settleHandoverId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCarCountPlus ');
        return callback(error,rows);
    });
}

function updateCarCountMinus(params,callback){
    var query = " update settle_handover_info set car_count = car_count -1 where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i]=params.settleHandoverId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCarCountMinus ');
        return callback(error,rows);
    });
}


module.exports ={
    addSettleHandover : addSettleHandover,
    getSettleHandover : getSettleHandover,
    updateCarCountPlus : updateCarCountPlus,
    updateCarCountMinus : updateCarCountMinus
}