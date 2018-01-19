/**
 * Created by zwl on 2017/5/31.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ReceiveDAO.js');

function addReceive(params,callback){
    var query = " insert into receive_info (short_name,receive_name,address,lng,lat,city_id,remark) values (? , ? ,  ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shortName;
    paramsArray[i++]=params.receiveName;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.lng;
    paramsArray[i++]=params.lat;
    paramsArray[i++]=params.cityId;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addReceive ');
        return callback(error,rows);
    });
}

function getReceive(params,callback) {
    var query = " select re.*,c.city_name from receive_info re left join city_info c on re.city_id = c.id where re.id is not null ";
    var paramsArray=[],i=0;
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and re.id = ? ";
    }
    if(params.shortName){
        query = query + " and re.short_name like '%"+params.shortName+"%'";
    }
    if(params.receiveName){
        query = query + " and re.receive_name like '%"+params.receiveName+"%'";
    }
    if(params.address){
        paramsArray[i++] = params.address;
        query = query + " and re.address = ? ";
    }
    if(params.cityId){
        paramsArray[i++] = params.cityId;
        query = query + " and re.city_id = ? ";
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
    var query = " update receive_info set short_name = ?, receive_name = ?,address = ?, lng = ?,lat = ?,city_id = ?,remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shortName;
    paramsArray[i++]=params.receiveName;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.lng;
    paramsArray[i++]=params.lat;
    paramsArray[i++]=params.cityId;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.receiveId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateReceive ');
        return callback(error,rows);
    });
}

function updateReceiveCleanFee(params,callback){
    var query = " update receive_info set clean_fee = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.cleanFee;
    paramsArray[i]=params.receiveId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateReceiveCleanFee ');
        return callback(error,rows);
    });
}


module.exports ={
    addReceive: addReceive,
    getReceive : getReceive,
    updateReceive : updateReceive ,
    updateReceiveCleanFee : updateReceiveCleanFee
}
