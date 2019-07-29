/**
 * Created by zwl on 2019/7/25.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveExceedOilPriceDAO.js');

function getDriveExceedOilPrice(params,callback) {
    var query = " select * from drive_exceed_oil_price where id is not null ";
    var paramsArray=[],i=0;
    if(params.oilPriceId){
        paramsArray[i++] = params.oilPriceId;
        query = query + " and id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveExceedOilPrice ');
        return callback(error,rows);
    });
}

function updateDriveExceedOilPrice(params,callback){
    var query = " update drive_exceed_oil_price set oil_single_price = ? , urea_single_price = ? , " +
        " surplus_oil_single_price = ? , surplus_urea_single_price = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.oilSinglePrice;
    paramsArray[i++]=params.ureaSinglePrice;
    paramsArray[i++]=params.surplusOilSinglePrice;
    paramsArray[i++]=params.surplusUreaSinglePrice;
    paramsArray[i]=params.oilPriceId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveExceedOilPrice ');
        return callback(error,rows);
    });
}


module.exports ={
    getDriveExceedOilPrice : getDriveExceedOilPrice,
    updateDriveExceedOilPrice : updateDriveExceedOilPrice
}
