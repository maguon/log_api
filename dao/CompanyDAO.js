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
    var query = " select c.*,y.city_name,count(t.id) as truck_count from company_info c " +
        " left join truck_info t on c.id=t.company_id left join city_info y on c.city_id = y.id " +
        " where t.truck_type=1 or c.id is not null group by c.id ";
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
    if(params.contacts){
        paramsArray[i++] = params.contacts;
        query = query + " and contacts = ? ";
    }
    if(params.operateCity){
        paramsArray[i++] = params.operateCity;
        query = query + " and operate_city = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
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
    paramsArray[i++]=params.remark;
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