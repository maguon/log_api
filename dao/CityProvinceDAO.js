/**
 * Created by yym on 2021/1/28.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CityProvinceDAO.js');

function addCityProvince(params,callback){
    var query = " insert into city_province (province_name,remark)  values (? , ?)";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.provinceName;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addCityProvince ');
        return callback(error,rows);
    });
}

function getCityProvince(params,callback) {
    var query = " select * from city_province where id is not null ";
    var paramsArray=[],i=0;
    if(params.provinceId){
        paramsArray[i++] = params.provinceId;
        query = query + " and id = ? ";
    }
    if(params.provinceName){
        paramsArray[i++] = params.provinceName;
        query = query + " and province_name like '%"+params.provinceName+"%'";
    }
    if(params.provinceStatus!= null || params.provinceStatus==0 ){
        paramsArray[i++] = params.provinceStatus;
        query = query + " and province_status = ? ";
    }
    query = query + ' order by province_status desc';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getCityProvince ');
        return callback(error,rows);
    });
}

function updateCityProvinceStatus(params,callback){
    var query = " update city_province set province_status = ? where id = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.cityProvinceId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateCityProvinceStatus ');
        return callback(error,rows);
    });
}

module.exports ={
    addCityProvince : addCityProvince,
    getCityProvince : getCityProvince,
    updateCityProvinceStatus : updateCityProvinceStatus
}