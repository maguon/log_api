/**
 * Created by zwl on 2017/7/6.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckInsureRelDAO.js');

function addTruckInsureRel(params,callback){
    var query = " insert into truck_insure_rel (truck_id,insure_id,insure_type,insure_num,insure_money," +
        " insure_date,start_date,end_date,date_id)  values ( ? , ? , ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.insureId;
    paramsArray[i++]=params.insureType;
    paramsArray[i++]=params.insureNum;
    paramsArray[i++]=params.insureMoney;
    paramsArray[i++]=params.insureDate;
    paramsArray[i++]=params.startDate;
    paramsArray[i++]=params.endDate;
    paramsArray[i]=params.dateId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addTruckInsureRel ');
        return callback(error,rows);
    });
}

function getTruckInsureRel(params,callback) {
    var query = " select r.*,i.insure_name from truck_insure_rel r left join truck_insure i on r.insure_id = i.id where r.id is not null ";
    var paramsArray=[],i=0;
    if(params.relId){
        paramsArray[i++] = params.relId;
        query = query + " and r.id = ? ";
    }
    if(params.insureNum){
        paramsArray[i++] = params.insureNum;
        query = query + " and r.insure_num = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and r.truck_id = ? ";
    }
    if(params.active){
        paramsArray[i++] = params.active;
        query = query + " and r.active = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckInsureRel ');
        return callback(error,rows);
    });
}

function updateTruckInsureRel(params,callback){
    var query = " update truck_insure_rel set truck_id = ? , insure_id = ? , insure_type = ? , insure_num = ? , insure_money = ? ," +
        " start_date = ? , end_date = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.insureId;
    paramsArray[i++]=params.insureType;
    paramsArray[i++]=params.insureNum;
    paramsArray[i++]=params.insureMoney;
    paramsArray[i++]=params.startDate;
    paramsArray[i++]=params.endDate;
    paramsArray[i]=params.relId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckInsureRel ');
        return callback(error,rows);
    });
}



module.exports ={
    addTruckInsureRel : addTruckInsureRel,
    getTruckInsureRel: getTruckInsureRel,
    updateTruckInsureRel : updateTruckInsureRel
}