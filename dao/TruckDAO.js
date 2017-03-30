/**
 * Created by zwl on 2017/3/14.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckDAO.js');

function addTruck(params,callback){
    var query = " insert into truck_info (truck_num,brand,truck_tel,the_code,operate_type,truck_type,truck_status,number,driving_image,operation_image,remark) " +
        " values (? , ? , ? , ? , ? , ? , ? , ?, ? , ? , ?)";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckNum;
    paramsArray[i++]=params.brand;
    paramsArray[i++]=params.truckTel;
    paramsArray[i++]=params.theCode;
    paramsArray[i++]=params.operateType;
    paramsArray[i++]=params.truckType;
    paramsArray[i++]=params.truckStatus;
    paramsArray[i++]=params.number;
    paramsArray[i++]=params.drivingImage;
    paramsArray[i++]=params.operationImage;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug( ' addTruck ');
        return callback(error,rows);
    })
}

function getTruck(params,callback) {
    var query = " select * from truck_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and truck_num = ? ";
    }
    if(params.brand){
        paramsArray[i++] = params.brand;
        query = query + " and brand = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and operate_type = ? ";
    }
    if(params.truckType){
        paramsArray[i++] = params.truckType;
        query = query + " and truck_type = ? ";
    }
    if(params.truckStatus){
        paramsArray[i++] = params.truckStatus;
        query = query + " and truck_status = ? ";
    }
    if(params.number){
        paramsArray[i++] = params.number;
        query = query + " and number = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruck ');
        return callback(error,rows);
    });
}


module.exports ={
    addTruck : addTruck,
    getTruck : getTruck

}