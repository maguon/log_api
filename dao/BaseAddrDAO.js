/**
 * Created by zwl on 2017/6/22.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('BaseAddrDAO.js');

function addBaseAddr(params,callback){
    var query = " insert into base_addr (addr_name,address,lng,lat,city_id,remark) values ( ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.addrName;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.lng;
    paramsArray[i++]=params.lat;
    paramsArray[i++]=params.cityId;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addBaseAddr ');
        return callback(error,rows);
    });
}

function getBaseAddr(params,callback) {
    var query = " select ba.*,c.city_name from base_addr ba left join city_info c on ba.city_id = c.id where ba.id is not null ";
    var paramsArray=[],i=0;
    if(params.baseAddrId){
        paramsArray[i++] = params.baseAddrId;
        query = query + " and ba.id = ? ";
    }
    if(params.addName){
        query = query + " and ba.addr_name like '%"+params.addrName+"%'";
    }
    if(params.address){
        paramsArray[i++] = params.address;
        query = query + " and ba.address = ? ";
    }
    if(params.cityId){
        paramsArray[i++] = params.cityId;
        query = query + " and ba.city_id = ? or ba.city_id = 0 ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getBaseAddr ');
        return callback(error,rows);
    });
}

function updateBaseAddr(params,callback){
    var query = " update base_addr set addr_name = ?,address = ?,lng = ?,lat = ?,city_id = ?,remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.addrName;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.lng;
    paramsArray[i++]=params.lat;
    paramsArray[i++]=params.cityId;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.baseAddrId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateBaseAddr ');
        return callback(error,rows);
    });
}


module.exports ={
    addBaseAddr: addBaseAddr,
    getBaseAddr : getBaseAddr,
    updateBaseAddr : updateBaseAddr
}
