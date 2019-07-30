/**
 * Created by zwl on 2019/4/9.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveExceedOilRelDAO.js');

function addDriveExceedOilRel(params,callback){
    var query = " insert into drive_exceed_oil_rel (number,exceed_oil_id,drive_id,truck_id,oil_date,date_id," +
        " oil_address_type,oil_address,oil,urea,oil_single_price,urea_single_price,oil_money,urea_money,payment_type,payment_status) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.number;
    paramsArray[i++]=params.exceedOilId;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.oilDate;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.oilAddressType;
    paramsArray[i++]=params.oilAddress;
    paramsArray[i++]=params.oil;
    paramsArray[i++]=params.urea;
    paramsArray[i++]=params.oilSinglePrice;
    paramsArray[i++]=params.ureaSinglePrice;
    paramsArray[i++]=params.oilMoney;
    paramsArray[i++]=params.ureaMoney;
    paramsArray[i++]=params.paymentType;
    paramsArray[i++]=params.paymentStatus;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDriveExceedOilRel ');
        return callback(error,rows);
    });
}

function getDriveExceedOilRel(params,callback) {
    var query = " select deor.*,d.drive_name,t.truck_num " +
        " from drive_exceed_oil_rel deor " +
        " left join drive_info d on deor.drive_id = d.id " +
        " left join truck_info t on deor.truck_id = t.id " +
        " where deor.id is not null ";
    var paramsArray=[],i=0;
    if(params.relId){
        paramsArray[i++] = params.relId;
        query = query + " and deor.id = ? ";
    }
    if(params.exceedOilId){
        paramsArray[i++] = params.exceedOilId;
        query = query + " and deor.exceed_oil_id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and deor.drive_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and deor.truck_id = ? ";
    }
    if(params.oilDateStart){
        paramsArray[i++] = params.oilDateStart;
        query = query + " and deor.oil_date >= ? ";
    }
    if(params.oilDateEnd){
        paramsArray[i++] = params.oilDateEnd;
        query = query + " and deor.oil_date <= ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and deor.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and deor.created_on <= ? ";
    }
    query = query + '  order by deor.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveExceedOilRel ');
        return callback(error,rows);
    });
}

function getDriveExceedOilRelCount(params,callback) {
    var query = " select sum(deor.oil_money) as oil_money,sum(deor.urea_money) as urea_money " +
        " from drive_exceed_oil_rel deor " +
        " where deor.id is not null ";
    var paramsArray=[],i=0;
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and deor.drive_id = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and deor.truck_id = ? ";
    }
    if(params.oilDateStart){
        paramsArray[i++] = params.oilDateStart;
        query = query + " and deor.oil_date >= ? ";
    }
    if(params.oilDateEnd){
        paramsArray[i++] = params.oilDateEnd;
        query = query + " and deor.oil_date <= ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart +" 00:00:00";
        query = query + " and deor.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd +" 23:59:59";
        query = query + " and deor.created_on <= ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveExceedOilRelCount ');
        return callback(error,rows);
    });
}

function updateDriveExceedOilRel(params,callback){
    var query = " update drive_exceed_oil_rel set oil_date = ? , date_id = ? , " +
        " oil_address_type = ? , oil_address = ? , oil = ? , urea = ? , oil_single_price = ? , " +
        " urea_single_price = ? , oil_money = ? , urea_money = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.oilDate;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.oilAddressType;
    paramsArray[i++]=params.oilAddress;
    paramsArray[i++]=params.oil;
    paramsArray[i++]=params.urea;
    paramsArray[i++]=params.oilSinglePrice;
    paramsArray[i++]=params.ureaSinglePrice;
    paramsArray[i++]=params.oilMoney;
    paramsArray[i++]=params.ureaMoney;
    paramsArray[i++]=params.relId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveExceedOilRel ');
        return callback(error,rows);
    });
}

function deleteDriveExceedOilRel(params,callback){
    var query = " delete from drive_exceed_oil_rel where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.relId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteDriveExceedOilRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addDriveExceedOilRel : addDriveExceedOilRel,
    getDriveExceedOilRel : getDriveExceedOilRel,
    getDriveExceedOilRelCount : getDriveExceedOilRelCount,
    updateDriveExceedOilRel : updateDriveExceedOilRel,
    deleteDriveExceedOilRel : deleteDriveExceedOilRel
}
