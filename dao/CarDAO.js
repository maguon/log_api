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
    var query = " select c.*,r.*,p.col,p.road from car_info c left join car_storage_rel r on c.id = r.car_id " +
        " left join storage_parking p on c.id = p.car_id where c.id is not null ";
    var paramsArray=[],i=0;
    if(params.carId){
        paramsArray[i++] = params.carId;
        query = query + " and c.id = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCar ');
        return callback(error,rows);
    });
}

module.exports ={
    addCar : addCar,
    getCar : getCar
}