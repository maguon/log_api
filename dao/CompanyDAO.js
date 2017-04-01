/**
 * Created by zwl on 2017/3/30.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CompanyDAO.js');

function addCompany(params,callback){
    var query = " insert into company_info (company_name,operate_type,cooperation_time,contacts,tel,city_id,remark) " +
        " values (? , ? , ? , ? , ? , ? , ?)";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.companyName;
    paramsArray[i++]=params.operateType;
    paramsArray[i++]=params.cooperationTime;
    paramsArray[i++]=params.contacts;
    paramsArray[i++]=params.tel;
    paramsArray[i++]=params.cityId;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCompany ');
        return callback(error,rows);
    });
}

function getCompany(params,callback) {
    var query = " select * from company_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and id = ? ";
    }
    if(params.companyName){
        paramsArray[i++] = params.companyName;
        query = query + " and company_name = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and operate_type = ? ";
    }
    if(params.operateCity){
        paramsArray[i++] = params.operateCity;
        query = query + " and operate_city = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCompany ');
        return callback(error,rows);
    });
}

function updateCompany(params,callback){
    var query = " update company_info set company_name = ?,operate_type = ?," +
        " cooperation_time = ?,contacts = ?,tel = ?,city_id = ?,remark = ?  where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.companyName;
    paramsArray[i++]=params.operateType;
    paramsArray[i++]=params.cooperationTime;
    paramsArray[i++]=params.contacts;
    paramsArray[i++]=params.tel;
    paramsArray[i++]=params.cityId;
    paramsArray[i]=params.remark;
    paramsArray[i]=params.companyId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCompany ');
        return callback(error,rows);
    });
}



module.exports ={
    addCompany : addCompany,
    getCompany : getCompany,
    updateCompany : updateCompany
}