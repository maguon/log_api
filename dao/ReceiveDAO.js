/**
 * Created by zwl on 2017/5/31.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ReceiveDAO.js');

function addReceive(params,callback){
    var query = " insert into receive_info (short_name,receive_name,receive_type,address,lng,lat,city_id,make_id,make_name," +
        " receive_flag,remark) values (? , ? ,  ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shortName;
    paramsArray[i++]=params.receiveName;
    paramsArray[i++]=params.receiveType;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.lng;
    paramsArray[i++]=params.lat;
    paramsArray[i++]=params.cityId;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.makeName;
    paramsArray[i++]=params.receiveFlag;
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
    if(params.receiveType){
        paramsArray[i++] = params.receiveType;
        query = query + " and re.receive_type = ? ";
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
        query = query + " and (re.city_id = ? or re.city_id = 0) ";
    }
    if(params.makeId){
        paramsArray[i++] = params.makeId;
        query = query + " and re.make_id = ? ";
    }
    if(params.receiveFlag){
        paramsArray[i++] = params.receiveFlag;
        query = query + " and re.receive_flag = ? ";
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

function getReceiveCount(params,callback) {
    var query = " select c.id,c.city_name,count(r.id) as receive_count " +
        " from city_info c " +
        " left join receive_info r on c.id = r.city_id" +
        " where c.id is not null ";
    var paramsArray=[],i=0;
    if(params.cityId){
        paramsArray[i++] = params.cityId;
        query = query + " and c.id = ? ";
    }
    query = query + ' group by c.id ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getReceiveCount ');
        return callback(error,rows);
    });
}

function updateReceive(params,callback){
    var query = " update receive_info set short_name = ?, receive_name = ? , receive_type = ? , address = ?, lng = ?, lat = ?," +
        " city_id = ?, make_id = ?, make_name = ?, receive_flag = ?, remark = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.shortName;
    paramsArray[i++]=params.receiveName;
    paramsArray[i++]=params.receiveType;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.lng;
    paramsArray[i++]=params.lat;
    paramsArray[i++]=params.cityId;
    paramsArray[i++]=params.makeId;
    paramsArray[i++]=params.makeName;
    paramsArray[i++]=params.receiveFlag;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.receiveId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateReceive ');
        return callback(error,rows);
    });
}

function updateReceiveCleanFee(params,callback){
    var query = " update receive_info set clean_fee = ? , big_clean_fee = ? , trailer_fee = ? , trailer_month_flag = ? , " +
        " run_fee = ? , run_month_flag = ? , lead_fee = ? , lead_month_flag = ? , other_fee = ? , other_month_flag = ? , month_flag = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.cleanFee;
    paramsArray[i++]=params.bigCleanFee;
    paramsArray[i++]=params.trailerFee;
    paramsArray[i++]=params.trailerMonthFlag;
    paramsArray[i++]=params.runFee;
    paramsArray[i++]=params.runMonthFlag;
    paramsArray[i++]=params.leadFee;
    paramsArray[i++]=params.leadMonthFlag;
    paramsArray[i++]=params.otherFee;
    paramsArray[i++]=params.otherMonthFlag;
    paramsArray[i++]=params.monthFlag;
    paramsArray[i]=params.receiveId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateReceiveCleanFee ');
        return callback(error,rows);
    });
}


module.exports ={
    addReceive: addReceive,
    getReceive : getReceive,
    getReceiveCount : getReceiveCount,
    updateReceive : updateReceive ,
    updateReceiveCleanFee : updateReceiveCleanFee
}
