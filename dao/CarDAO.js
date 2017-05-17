/**
 * Created by zwl on 2017/4/13.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CarDAO.js');

function addCar(params,callback){
    var query = " insert into car_info (vin,make_id,make_name,model_id,model_name,pro_date,colour,engine_num,remark) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ?) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.makeName;
    paramsArray[i++]=params.modelId;
    paramsArray[i++]=params.modelName;
    paramsArray[i++]=params.proDate;
    paramsArray[i++]=params.colour;
    paramsArray[i++]=params.engineNum;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCar ');
        return callback(error,rows);
    });
}

function getCar(params,callback) {
    var query = " select c.*, " +
        " p.id as p_id,p.storage_id,p.row,p.col,p.parking_status, " +
        " r.id as r_id,r.storage_name,r.enter_time,r.plan_out_time,r.real_out_time,r.rel_status " +
        " from car_info c left join storage_parking p on c.id = p.car_id " +
        " left join car_storage_rel r on c.id = r.car_id where c.id is not null ";
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
    query = query + '  order by r.plan_out_time ';
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
    var query = " select c.*, " +
        " p.id as p_id,p.storage_id,p.row,p.col,p.parking_status, " +
        " r.id as r_id,r.storage_name,r.enter_time,r.plan_out_time,r.real_out_time,r.rel_status " +
        " from car_info c left join storage_parking p on c.id = p.car_id " +
        " left join car_storage_rel r on c.id = r.car_id where r.active = 1 and c.id is not null ";
    var paramsArray=[],i=0;
    if(params.carId){
        paramsArray[i++] = params.carId;
        query = query + " and c.id = ? ";
    }
    if(params.vin){
        paramsArray[i] = params.vin;
        query = query + " and c.vin = ? ";
    }
    query = query + '  order by r.id desc ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCarBase ');
        return callback(error,rows);
    });
}

function updateCar(params,callback){
    var query = " update car_info set vin = ? , make_id = ? , make_name = ? , model_id = ? , model_name = ? ," +
        " pro_date = ? , colour = ? , engine_num = ? , remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.vin;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.makeName;
    paramsArray[i++]=params.modelId;
    paramsArray[i++]=params.modelName;
    paramsArray[i++]=params.proDate;
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
    addCar : addCar,
    getCar : getCar,
    getCarBase : getCarBase,
    updateCar : updateCar,
    updateCarVin : updateCarVin
}