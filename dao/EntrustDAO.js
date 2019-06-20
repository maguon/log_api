/**
 * Created by zwl on 2017/6/1.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('EntrustDAO.js');

function addEntrust(params,callback){
    var query = " insert into entrust_info (short_name,entrust_name,secret_key,remark)  values ( ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shortName;
    paramsArray[i++]=params.entrustName;
    paramsArray[i++]=params.secretKey;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addEntrust ');
        return callback(error,rows);
    });
}

function getEntrust(params,callback) {
    var query = " select * from entrust_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and id = ? ";
    }
    if(params.shortName){
        query = query + " and short_name like '%"+params.shortName+"%'";
    }
    if(params.entrustName){
        paramsArray[i++] = params.entrustName;
        query = query + " and entrust_name like '%"+params.entrustName+"%'";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getEntrust ');
        return callback(error,rows);
    });
}

function getEntrustRoute(params,callback) {
    var query = " select e.*,count(ecrr.entrust_id) as route_count from entrust_info e " +
        " left join entrust_city_route_rel ecrr on e.id = ecrr.entrust_id " +
        " where e.id is not null ";
    var paramsArray=[],i=0;
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and e.id = ? ";
    }
    query = query + ' group by e.id ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getEntrustRoute ');
        return callback(error,rows);
    });
}

function getEntrustCar(params,callback) {
    var query = " select c.*,e.short_name as e_short_name,ba.addr_name,r.short_name as r_short_name,ecrr.distance,ecrr.fee " +
        " from car_info c " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join base_addr ba on c.base_addr_id = ba.id " +
        " left join receive_info r on c.receive_id = r.id " +
        " left join entrust_city_route_rel ecrr on c.route_id = ecrr.city_route_id and c.make_id = ecrr.make_id and c.entrust_id = ecrr.entrust_id " +
        " where ecrr.entrust_id is not null and c.car_status >=1 ";
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
    query = query + '  order by c.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getEntrustCar ');
        return callback(error,rows);
    });
}

function getEntrustNotCar(params,callback) {
    var query = " select c.*,e.short_name as e_short_name,ba.addr_name,r.short_name as r_short_name,ecrr.distance,ecrr.fee " +
        " from car_info c " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join base_addr ba on c.base_addr_id = ba.id " +
        " left join receive_info r on c.receive_id = r.id " +
        " left join entrust_city_route_rel ecrr on c.route_id = ecrr.city_route_id and c.make_id = ecrr.make_id and c.entrust_id = ecrr.entrust_id " +
        " where ecrr.entrust_id is null and c.car_status >=1 ";
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
    query = query + '  order by c.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getEntrustNotCar ');
        return callback(error,rows);
    });
}

function getEntrustCarCount(params,callback) {
    var query = " select count(c.id)as entrust_car_count,convert(sum(ecrr.distance*ecrr.fee),decimal(10,2)) as entrust_car_price " +
        " from car_info c " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join entrust_city_route_rel ecrr on c.route_id = ecrr.city_route_id and c.make_id = ecrr.make_id and c.entrust_id = ecrr.entrust_id " +
        " where ecrr.entrust_id is not null and c.car_status >=1 ";
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
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getEntrustCarCount ');
        return callback(error,rows);
    });
}

function getEntrustCarNotCount(params,callback) {
    var query = " select count(c.id)as entrust_car_not_count " +
        " from car_info c " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join entrust_city_route_rel ecrr on c.route_id = ecrr.city_route_id and c.make_id = ecrr.make_id and c.entrust_id = ecrr.entrust_id " +
        " where ecrr.entrust_id is null and c.car_status >=1 ";
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
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getEntrustCarNotCount ');
        return callback(error,rows);
    });
}

function updateEntrust(params,callback){
    var query = " update entrust_info set short_name = ?,entrust_name = ?,secret_key = ?,remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shortName;
    paramsArray[i++]=params.entrustName;
    paramsArray[i++]=params.secretKey;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.entrustId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateEntrust ');
        return callback(error,rows);
    });
}

function updateEntrustCarParkingFee(params,callback){
    var query = " update entrust_info set car_parking_fee = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.carParkingFee;
    paramsArray[i]=params.entrustId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateEntrustCarParkingFee ');
        return callback(error,rows);
    });
}

function addSettleCarBatch(params,callback) {
    var query = " insert into settle_car (vin,entrust_id,route_start_id,route_end_id,distance,fee,plan_price) " +
        " select c.vin,c.entrust_id,c.route_start_id,c.route_end_id,ecrr.distance,ecrr.fee,(ecrr.distance*ecrr.fee) as plan_price " +
        " from car_info c " +
        " left join entrust_info e on c.entrust_id = e.id " +
        " left join entrust_city_route_rel ecrr on c.route_id = ecrr.city_route_id and c.make_id = ecrr.make_id and c.entrust_id = ecrr.entrust_id " +
        " left join settle_car sc on c.vin = sc.vin and c.entrust_id= sc.entrust_id and c.route_start_id = sc.route_start_id and c.route_end_id = sc.route_end_id " +
        " where sc.vin is null " +
        " and ecrr.entrust_id is not null and c.car_status >=1 ";
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
    query = query + '  order by c.id desc ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addSettleCarBatch ');
        return callback(error,rows);
    });
}


module.exports ={
    addEntrust : addEntrust,
    getEntrust : getEntrust,
    getEntrustRoute : getEntrustRoute,
    getEntrustCar : getEntrustCar,
    getEntrustNotCar : getEntrustNotCar,
    getEntrustCarCount : getEntrustCarCount,
    getEntrustCarNotCount : getEntrustCarNotCount,
    updateEntrust : updateEntrust,
    updateEntrustCarParkingFee : updateEntrustCarParkingFee,
    addSettleCarBatch : addSettleCarBatch
}