/**
 * Created by zwl on 2017/5/31.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ReceiveDAO.js');

function addReceive(params,callback){
    var query = " insert into receive_info (receive_name,address,lng,lat,city_id,city_name,remark) values ( ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.receiveName;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.lng;
    paramsArray[i++]=params.lat;
    paramsArray[i++]=params.cityId;
    paramsArray[i++]=params.cityName;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addReceive ');
        return callback(error,rows);
    });
}

function getReceive(params,callback) {
    var query = " select * from receive_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and id = ? ";
    }
    if(params.receiveName){
        paramsArray[i++] = params.receiveName;
        query = query + " and receive_name = ? ";
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
        logger.debug(' getReceive ');
        return callback(error,rows);
    });
}

function updateReceive(params,callback){
    var query = " update receive_info set receive_name = ?,address = ?,lng = ?,lat = ?,city_id = ?,city_name = ?,remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.receiveName;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.lng;
    paramsArray[i++]=params.lat;
    paramsArray[i++]=params.cityId;
    paramsArray[i++]=params.cityName;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.receiveId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateReceive ');
        return callback(error,rows);
    });
}


module.exports ={
    addReceive: addReceive,
    getReceive : getReceive,
    updateReceive : updateReceive
}
