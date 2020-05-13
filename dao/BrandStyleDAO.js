/**
 * Created by yym on 2020/5/13.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('BrandStyleDAO.js');

function addBrandStyle(params,callback){
    var query = " insert into truck_brand_style (brand_style_name)  values (?)";
    var paramsArray=[],i=0;
    paramsArray[i]=params.brandStyleName;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addBrandStyle ');
        return callback(error,rows);
    });
}

function getBrandStyle(params,callback) {
    var query = " select * from truck_brand_style where id is not null ";
    var paramsArray=[],i=0;
    if(params.brandStyleId){
        paramsArray[i++] = params.brandStyleId;
        query = query + " and id = ? ";
    }
    if(params.brandStyleName){
        paramsArray[i++] = params.brandStyleName;
        query = query + " and brand_style_name = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getBrandStyle ');
        return callback(error,rows);
    });
}

function updateBrandStyle(params,callback){
    var query = " update truck_brand_style set brand_style_name = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.brandStyleName;
    paramsArray[i]=params.brandStyleId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateBrandStyle ');
        return callback(error,rows);
    });
}

module.exports ={
    addBrandStyle : addBrandStyle,
    getBrandStyle : getBrandStyle,
    updateBrandStyle : updateBrandStyle
}
