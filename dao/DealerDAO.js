/**
 * Created by zwl on 2017/5/31.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DealerDAO.js');

function addDealer(params,callback){
    var query = " insert into dealer_info (dealer_name,address,lng,lat,city_id,city_name,remark) values ( ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dealerName;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.lng;
    paramsArray[i++]=params.lat;
    paramsArray[i++]=params.cityId;
    paramsArray[i++]=params.cityName;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDealer ');
        return callback(error,rows);
    });
}

function getDealer(params,callback) {
    var query = " select * from dealer_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.dealerId){
        paramsArray[i++] = params.dealerId;
        query = query + " and id = ? ";
    }
    if(params.dealerName){
        paramsArray[i++] = params.dealerName;
        query = query + " and dealer_name = ? ";
    }
    if(params.address){
        paramsArray[i++] = params.address;
        query = query + " and address = ? ";
    }
    if(params.cityId){
        paramsArray[i++] = params.cityId;
        query = query + " and city_id = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDealer ');
        return callback(error,rows);
    });
}

function updateDealer(params,callback){
    var query = " update dealer_info set dealer_name = ?,address = ?,lng = ?,lat = ?,city_id = ?,city_name = ?,remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dealerName;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.lng;
    paramsArray[i++]=params.lat;
    paramsArray[i++]=params.cityId;
    paramsArray[i++]=params.cityName;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.dealerId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDealer ');
        return callback(error,rows);
    });
}


module.exports ={
    addDealer : addDealer,
    getDealer : getDealer,
    updateDealer : updateDealer
}
