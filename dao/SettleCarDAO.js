/**
 * Created by zwl on 2018/9/25.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleCarDAO.js');

function addSettleCar(params,callback){
    var query = " insert into settle_car (vin,entrust_id,route_start_id,route_end_id,price,user_id) " +
        " values ( ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.price;
    paramsArray[i++]=params.userId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addSettleCar ');
        return callback(error,rows);
    });
}

function addUploadSettleCar(params,callback){
    var query = " insert into settle_car (vin,entrust_id,route_start_id,route_end_id,price,user_id,upload_id) " +
        " values ( ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.price;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.uploadId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addUploadSettleCar ');
        return callback(error,rows);
    });
}

function getSettleCar(params,callback) {
    var query = " select sc.*,e.short_name as e_short_name,c1.city_name as route_start,c2.city_name as route_end,c.order_date " +
        " from settle_car sc " +
        " left join entrust_info e on sc.entrust_id = e.id " +
        " left join city_info c1 on sc.route_start_id = c1.id " +
        " left join city_info c2 on sc.route_end_id = c2.id " +
        " left join car_info c on sc.vin = c.vin and sc.entrust_id = c.entrust_id " +
        " and sc.route_start_id = c.route_start_id and sc.route_end_id = c.route_end_id " +
        " where sc.id is not null ";
    var paramsArray=[],i=0;
    if(params.settleCarId){
        paramsArray[i++] = params.settleCarId;
        query = query + " and sc.id = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and sc.vin = ? ";
    }
    if(params.vinCode){
        query = query + " and sc.vin like '%"+params.vinCode+"%'";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and sc.entrust_id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and sc.route_start_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and sc.route_end_id = ? ";
    }
    if(params.orderStart){
        paramsArray[i++] = params.orderStart;
        query = query + " and c.order_date >= ? ";
    }
    if(params.orderEnd){
        paramsArray[i++] = params.orderEnd;
        query = query + " and c.order_date <= ? ";
    }
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and sc.user_id = ? ";
    }
    if(params.uploadId){
        paramsArray[i++] = params.uploadId;
        query = query + " and sc.upload_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSettleCar ');
        return callback(error,rows);
    });
}

function getNotSettleCar(params,callback) {
    var query = " select c.*,e.short_name as e_short_name,r.short_name as r_short_name " +
        " from car_info c " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join receive_info r on c.receive_id = r.id " +
        " left join settle_car sc on c.vin = sc.vin and c.entrust_id = sc.entrust_id " +
        " and c.route_start_id = sc.route_start_id and c.route_end_id = sc.route_end_id " +
        " where sc.id is null ";
    var paramsArray=[],i=0;
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
    }
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and c.entrust_id = ? ";
    }
    if(params.routeStartId){
        paramsArray[i++] = params.routeStartId;
        query = query + " and c.route_start_id = ? ";
    }
    if(params.routeEndId){
        paramsArray[i++] = params.routeEndId;
        query = query + " and c.route_end_id = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and c.receive_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getNotSettleCar ');
        return callback(error,rows);
    });
}

function getSettleCarCount(params,callback) {
    var query = " select count(id) as settle_car_count,sum(price) as price from settle_car " +
        " where id is not null ";
    var paramsArray=[],i=0;

    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSettleCarCount ');
        return callback(error,rows);
    });
}

function getNotSettleCarCount(params,callback) {
    var query = " select count(c.id) as not_settle_count from car_info c " +
        " left join settle_car sc on c.vin = sc.vin and c.entrust_id = sc.entrust_id " +
        " and c.route_start_id = sc.route_start_id and c.route_end_id = sc.route_end_id " +
        " where sc.id is null ";
    var paramsArray=[],i=0;

    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getNotSettleCarCount ');
        return callback(error,rows);
    });
}

function updateSettleCar(params,callback){
    var query = " update settle_car set vin = ? , entrust_id = ? , route_start_id = ? , route_end_id = ? , price = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.price;
    paramsArray[i++]=params.settleCarId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateSettleCar ');
        return callback(error,rows);
    });
}


module.exports ={
    addSettleCar : addSettleCar,
    getNotSettleCar : getNotSettleCar,
    getSettleCarCount : getSettleCarCount,
    getNotSettleCarCount : getNotSettleCarCount,
    addUploadSettleCar : addUploadSettleCar,
    getSettleCar : getSettleCar,
    updateSettleCar : updateSettleCar
}

