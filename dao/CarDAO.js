/**
 * Created by zwl on 2017/4/13.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarDAO.js');

function addUploadCar(params,callback){
    var query = " insert into car_info(vin,make_id,make_name,route_start_id,route_start,base_addr_id,route_end_id,route_end,receive_id,entrust_id,order_date,upload_id) " +
        " select tmp.vin,tmp.make_id,ma.make_name,tmp.route_start_id,cs.city_name as route_start,tmp.base_addr_id,tmp.route_end_id,ce.city_name as route_end, " +
        " tmp.receive_id,tmp.entrust_id,tmp.order_date,tmp.upload_id from car_info_tmp tmp " +
        " left join car_make ma on tmp.make_id = ma.id " +
        " left join city_info cs on tmp.route_start_id = cs.id " +
        " left join city_info ce on tmp.route_end_id = ce.id " +
        " left join base_addr ba on tmp.base_addr_id = ba.id " +
        " left join receive_info re on tmp.receive_id = re.id " +
        " left join entrust_info en on tmp.entrust_id = en.id where tmp.id is not null ";
    var paramsArray=[],i=0;
    if(params.uploadId){
        paramsArray[i++] = params.uploadId;
        query = query + " and tmp.upload_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addUploadCar ');
        return callback(error,rows);
    });
}

function addCarTmp(params,callback){
    var query = " insert into car_info_tmp (user_id,upload_id,vin,make_id,route_start_id,base_addr_id,route_end_id,receive_id,entrust_id,order_date) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.uploadId;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.entrustId;
    paramsArray[i]=params.orderDate;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCarTmp ');
        return callback(error,rows);
    });
}

function addCar(params,callback){
    var query = " insert into car_info (vin,make_id,make_name,model_id,model_name," +
        " route_start_id,route_start,base_addr_id,route_end_id,route_end,receive_id,entrust_id,order_date,colour,engine_num,remark) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.makeName;
    paramsArray[i++]=params.modelId;
    paramsArray[i++]=params.modelName;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeStart;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.routeEnd;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.orderDate;
    paramsArray[i++]=params.colour;
    paramsArray[i++]=params.engineNum;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCar ');
        return callback(error,rows);
    });
}

function getCarList(params,callback) {
    var query = " select c.*,ba.addr_name,re.receive_name,en.entrust_name from car_info c " +
        " left join receive_info re on c.receive_id = re.id " +
        " left join entrust_info en on c.entrust_id = en.id " +
        " left join base_addr ba on c.base_addr_id = ba.id where c.id is not null ";
    var paramsArray=[],i=0;
    if(params.carId){
        paramsArray[i++] = params.carId;
        query = query + " and c.id = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
    }
    if(params.vinCode){
        query = query + " and c.vin like '%"+params.vinCode+"%'";
    }
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and c.make_id = ? ";
    }
    if(params.addrId){
        paramsArray[i++] = params.addrId;
        query = query + " and c.base_addr_id = ? ";
    }
    if(params.orderStart){
        paramsArray[i++] = params.orderStart;
        query = query + " and c.order_date >= ? ";
    }
    if(params.orderEnd){
        paramsArray[i++] = params.orderEnd;
        query = query + " and c.order_date <= ? ";
    }
    if(params.createdStart){
        paramsArray[i++] = params.createdStart +" 00:00:00";
        query = query + " and c.created_on >= ? ";
    }
    if(params.createdEnd){
        paramsArray[i++] = params.createdEnd +" 23:59:59";
        query = query + " and c.created_on <= ? ";
    }
    query = query + '  order by c.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCarList ');
        return callback(error,rows);
    });
}

function getCar(params,callback) {
    var query = " select c.*,ba.addr_name, " +
        " re.short_name as re_short_name,re.receive_name, " +
        " en.short_name as en_short_name,en.entrust_name, " +
        " p.id as p_id,p.storage_id,p.row,p.col,p.parking_status, " +
        " r.id as r_id,r.storage_name,r.enter_time,r.plan_out_time,r.real_out_time,r.rel_status " +
        " from car_info c left join storage_parking p on c.id = p.car_id " +
        " left join car_storage_rel r on c.id = r.car_id " +
        " left join base_addr ba on c.base_addr_id = ba.id " +
        " left join receive_info re on c.receive_id = re.id " +
        " left join entrust_info en on c.entrust_id = en.id where c.id is not null ";
    var paramsArray=[],i=0;
    if(params.carId){
        paramsArray[i++] = params.carId;
        query = query + " and c.id = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
    }
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and c.make_id = ? ";
    }
    if(params.modelId){
        paramsArray[i++] = params.modelId;
        query = query + " and c.model_id = ? ";
    }
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and c.receive_id = ? ";
    }
    if(params.carStatus){
        paramsArray[i++] = params.carStatus;
        query = query + " and c.car_status = ? ";
    }
    if(params.enterStart){
        paramsArray[i++] = params.enterStart +" 00:00:00";
        query = query + " and  r.enter_time  >= ? ";
    }
    if(params.enterEnd){
        paramsArray[i++] = params.enterEnd +" 23:59:59";
        query = query + " and r.enter_time  <= ? ";
    }
    if(params.planStart){
        paramsArray[i++] = params.planStart;
        query = query + " and r.plan_out_time >= ? ";
    }
    if(params.planEnd){
        paramsArray[i++] = params.planEnd;
        query = query + " and r.plan_out_time <= ? ";
    }
    if(params.realStart){
        paramsArray[i++] = params.realStart +" 00:00:00";
        query = query + " and r.real_out_time >= ? ";
    }
    if(params.realEnd){
        paramsArray[i++] = params.realEnd +" 23:59:59";
        query = query + " and r.real_out_time <= ? ";
    }
    if(params.relStatus){
        paramsArray[i++] = params.relStatus;
        query = query + " and r.rel_status = ? ";
    }
    if(params.active){
        paramsArray[i++] = params.active;
        query = query + " and r.active = ? ";
    }
    if(params.storageId){
        paramsArray[i++] = params.storageId;
        query = query + " and p.storage_id = ? ";
    }
    if(params.vinCode){
        query = query + " and c.vin like '%"+params.vinCode+"%'";
    }
    query = query + '  order by c.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCar ');
        return callback(error,rows);
    });
}

function getCarBase(params,callback) {
    var query = " select c.*,ba.addr_name, " +
        " re.short_name as re_short_name,re.receive_name, " +
        " en.short_name as en_short_name,en.entrust_name, " +
        " p.id as p_id,p.storage_id,p.row,p.col,p.parking_status, " +
        " r.id as r_id,r.storage_name,r.enter_time,r.plan_out_time,r.real_out_time,r.rel_status " +
        " from car_info c left join storage_parking p on c.id = p.car_id " +
        " left join car_storage_rel r on c.id = r.car_id " +
        " left join base_addr ba on c.base_addr_id = ba.id " +
        " left join receive_info re on c.receive_id = re.id " +
        " left join entrust_info en on c.entrust_id = en.id where c.id is not null ";
    var paramsArray=[],i=0;
    if(params.carId){
        paramsArray[i++] = params.carId;
        query = query + " and c.id = ? ";
    }
    if(params.vin){
        paramsArray[i] = params.vin;
        query = query + " and c.vin = ? ";
    }
    query = query + ' order by r.id desc ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCarBase ');
        return callback(error,rows);
    });
}

function getCarRouteEndCount(params,callback) {
    var query = " select count(id) as route_end_count,route_start,route_end from car_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.orderDate){
        paramsArray[i++] = params.orderDate;
        query = query + " and date_format(order_date,'%Y-%m-%d') = ? ";
    }
    query = query + ' group by route_start,route_end ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCarRouteEndCount ');
        return callback(error,rows);
    });
}

function getCarOrderDateCount(params,callback) {
    var query = " select count(id) as route_end_count,route_start,route_end,date_format(order_date,'%Y-%m-%d') as order_date from car_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.orderDate){
        paramsArray[i++] = params.orderDate;
        query = query + " and date_format(order_date,'%Y-%m-%d') = ? ";
    }
    query = query + ' group by route_start,route_end,order_date ';
    query = query + ' order by order_date ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCarOrderDateCount ');
        return callback(error,rows);
    });
}

function getCarReceiveCount(params,callback) {
    var query = " select count(c.id) as receive_count,c.route_start_id,c.route_start,c.receive_id,re.short_name,re.receive_name " +
        " from car_info c left join receive_info re on c.receive_id = re.id where c.id is not null ";
    var paramsArray=[],i=0;
    if(params.orderDate){
        paramsArray[i++] = params.orderDate;
        query = query + " and date_format(order_date,'%Y-%m-%d') = ? ";
    }
    query = query + ' group by c.route_start_id,c.route_start,c.receive_id,re.short_name,re.receive_name ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCarReceiveCount ');
        return callback(error,rows);
    });
}

function updateCar(params,callback){
    var query = " update car_info set vin = ? , make_id = ? , make_name = ? , model_id = ? , model_name = ? , " +
        " route_start_id = ? , route_start = ? , base_addr_id = ? , route_end_id = ? , route_end = ? , receive_id = ? , " +
        " entrust_id = ? , order_date = ? , colour = ? , engine_num = ? , remark = ? where id = ? "  ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.makeName;
    paramsArray[i++]=params.modelId;
    paramsArray[i++]=params.modelName;
    paramsArray[i++]=params.routeStartId;
    paramsArray[i++]=params.routeStart;
    paramsArray[i++]=params.baseAddrId;
    paramsArray[i++]=params.routeEndId;
    paramsArray[i++]=params.routeEnd;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.orderDate;
    paramsArray[i++]=params.colour;
    paramsArray[i++]=params.engineNum;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCar ');
        return callback(error,rows);
    });
}

function updateCarVin(params,callback){
    var query = " update car_info set vin = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.vin;
    paramsArray[i]=params.carId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCarVin ');
        return callback(error,rows);
    });
}


module.exports ={
    addUploadCar : addUploadCar,
    addCarTmp : addCarTmp,
    addCar : addCar,
    getCarList : getCarList,
    getCar : getCar,
    getCarBase : getCarBase,
    getCarRouteEndCount : getCarRouteEndCount,
    getCarOrderDateCount : getCarOrderDateCount,
    getCarReceiveCount : getCarReceiveCount,
    updateCar : updateCar,
    updateCarVin : updateCarVin
}