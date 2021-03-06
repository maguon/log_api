/**
 * Created by zwl on 2018/9/25.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SettleCarDAO.js');

function addSettleCar(params,callback){
    var query = " insert into settle_car (vin,entrust_id,route_start_id,route_end_id,order_date_id,price,user_id) " +
        " values ( ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.orderDateId;
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
    var query = " select sc.*,e.short_name as e_short_name,c1.city_name as route_start,c2.city_name as route_end,c.order_date,c.make_name," +
        " ecrr.distance as current_distance,ecrr.fee as current_fee , " +
        " cis.province_id as province_start_id, cis.province_name as province_start_name ," +
        " cir.province_id as province_end_id,cir.province_name as province_end_name " +
        " from settle_car sc " +
        " left join entrust_info e on sc.entrust_id = e.id " +
        " left join city_info c1 on sc.route_start_id = c1.id " +
        " left join city_info c2 on sc.route_end_id = c2.id " +
        " left join car_info c on sc.vin = c.vin" +
        " LEFT JOIN city_info cis ON sc.route_start_id = cis.id  " +
        " LEFT JOIN city_info cir ON sc.route_end_id = cir.id  " +
        " and sc.route_start_id = c.route_start_id and sc.route_end_id = c.route_end_id " +
        " left join entrust_city_route_rel ecrr on c.entrust_id = ecrr.entrust_id and c.make_id = ecrr.make_id " +
        " and c.route_start_id = ecrr.route_start_id and c.route_end_id = ecrr.route_end_id and c.size_type = ecrr.size_type " +
        " where sc.id is not null AND sc.entrust_id = c.entrust_id AND sc.route_start_id = c.route_start_id " +
        " AND sc.route_end_id = c.route_end_id and sc.order_date_id = c.order_date_id ";
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
    // 2020-01-15 添加检索条件 品牌ID
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and c.make_id = ? ";
    }
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and sc.user_id = ? ";
    }
    if(params.uploadId){
        paramsArray[i++] = params.uploadId;
        query = query + " and sc.upload_id = ? ";
    }
    if(params.settleStatus){
        paramsArray[i++] = params.settleStatus;
        query = query + " and sc.settle_status = ? ";
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

function getSettleCarCount(params,callback) {
    var query = " select count(sc.id) as settle_car_count,sum(sc.price) as price," +
        " sum(sc.price_2) as price_2,sum(sc.price_3) as price_3,sum(sc.price_4) as price_4,sum(sc.price_5) as price_5 " +
        " from settle_car sc " +
        " left join car_info c on sc.vin = c.vin and sc.entrust_id = c.entrust_id " +
        " and sc.route_start_id = c.route_start_id and sc.route_end_id = c.route_end_id " +
        " where sc.id is not null ";
    var paramsArray=[],i=0;
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
    // 2020-01-15 添加检索条件 品牌ID
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and c.make_id = ? ";
    }
    if(params.settleStatus){
        paramsArray[i++] = params.settleStatus;
        query = query + " and sc.settle_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSettleCarCount ');
        return callback(error,rows);
    });
}

function getNotSettleCarCount(params,callback) {
    var query = " select count(sc.id) as not_settle_car_count,sum(sc.plan_price) as plan_price " +
        " from settle_car sc " +
        " left join car_info c on sc.vin = c.vin and sc.entrust_id = c.entrust_id " +
        " and sc.route_start_id = c.route_start_id and sc.route_end_id = c.route_end_id " +
        " where sc.id is not null and sc.order_date_id = c.order_date_id";
    var paramsArray=[],i=0;
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
    // 2020-01-15 添加检索条件 品牌ID
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and c.make_id = ? ";
    }
    if(params.settleStatus){
        paramsArray[i++] = params.settleStatus;
        query = query + " and sc.settle_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getSettleCarCount ');
        return callback(error,rows);
    });
}

function getEntrustStat(params,callback) {

    var query = " SELECT ei.id , ei.short_name , ei.entrust_name , count( cv.id ) AS countCar, sum(price+price_2+price_3) AS sumFee  " +
        " From settle_car sc " +
        " LEFT JOIN car_info cv ON cv.vin = sc.vin " +
        " LEFT JOIN entrust_info ei ON ei.id = sc.entrust_id " +
        " WHERE sc.id IS NOT NULL " +
        " AND cv.entrust_id = sc.entrust_id  " +
        " AND cv.route_start_id = sc.route_start_id  " +
        " AND cv.route_end_id = sc.route_end_id  " ;
    var paramsArray=[],i=0;
    if(params.dateStart){
        paramsArray[i++] = params.dateStart;
        query = query + " and cv.order_date_id >= ? ";
    }
    if(params.dateEnd){
        paramsArray[i++] = params.dateEnd;
        query = query + " and cv.order_date_id <= ? ";
    }
    query = query + ' GROUP BY cv.entrust_id ';
    query = query + ' order by sumFee desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getEntrustStat ');
        return callback(error,rows);
    });
}

function updateSettleCar(params,callback){
    var query = " update settle_car set vin = ? , entrust_id = ? , route_start_id = ? , route_end_id = ? ,order_date_id = ? , price = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.orderDateId;
    paramsArray[i++]=params.price;
    paramsArray[i++]=params.settleCarId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateSettleCar ');
        return callback(error,rows);
    });
}

function updateUploadSettleCar(params,callback){
    var priceQueryString = "price";
    if (params.seq &&params.seq!=1 &&params.seq<6) {
        priceQueryString = "price_"+params.seq;
    }
    var query = " update settle_car set "+priceQueryString+" = ? , settle_status = ? , user_id = ? , upload_id = ? " +
        " where vin = ? and entrust_id = ? and route_start_id = ? and route_end_id = ? and order_date_id = ?" ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.price;
    paramsArray[i++]=params.settleStatus;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.uploadId;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.orderDateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateUploadSettleCar ');
        return callback(error,rows);
    });
}


module.exports ={
    addSettleCar : addSettleCar,
    getSettleCarCount : getSettleCarCount,
    getNotSettleCarCount : getNotSettleCarCount,
    addUploadSettleCar : addUploadSettleCar,
    getSettleCar : getSettleCar,
    getEntrustStat : getEntrustStat,
    updateSettleCar : updateSettleCar,
    updateUploadSettleCar : updateUploadSettleCar
}

