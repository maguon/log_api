/**
 * Created by zwl on 2017/3/14.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckDAO.js');

function addTruckFirst(params,callback){
    var query = "insert into truck_info (truck_num,brand_id,truck_tel,the_code,company_id, " +
        " truck_type,driving_date,license_date,two_date,remark) values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckNum;
    paramsArray[i++]=params.brandId;
    paramsArray[i++]=params.truckTel;
    paramsArray[i++]=params.theCode;
    paramsArray[i++]=params.companyId;
    paramsArray[i++]=params.truckType;
    paramsArray[i++]=params.drivingDate;
    paramsArray[i++]=params.licenseDate;
    paramsArray[i++]=params.twoDate;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug( ' addTruckFirst ');
        return callback(error,rows);
    })
}

function addTruckTrailer(params,callback){
    var query = "insert into truck_info (truck_num,the_code,company_id,truck_type,number,driving_date,license_date,two_date,remark) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? , ? )";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckNum;
    paramsArray[i++]=params.theCode;
    paramsArray[i++]=params.companyId;
    paramsArray[i++]=params.truckType;
    paramsArray[i++]=params.number;
    paramsArray[i++]=params.drivingDate;
    paramsArray[i++]=params.licenseDate;
    paramsArray[i++]=params.twoDate;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug( ' addTruckTrailer ');
        return callback(error,rows);
    })
}

function getTruckFirst(params,callback) {
    var query = " select h.*,t.id as trail_id,t.truck_num as trail_num,t.number as trail_number," +
        " b.brand_name,d.drive_name,c.company_name,c.operate_type " +
        " from truck_info h left join truck_info t on h.rel_id = t.id " +
        " left join truck_brand b on h.brand_id = b.id  " +
        " left join drive_info d on h.drive_id = d.id  " +
        " left join company_info c on h.company_id = c.id where h.id is not null ";
    var paramsArray=[],i=0;
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and h.id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and h.truck_num = ? ";
    }
    if(params.brandId){
        paramsArray[i++] = params.brandId;
        query = query + " and h.brand_id = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and h.drive_id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and h.company_id = ? ";
    }
    if(params.truckType){
        paramsArray[i++] = params.truckType;
        query = query + " and h.truck_type = ? ";
    }
    if(params.truckStatus){
        paramsArray[i++] = params.truckStatus;
        query = query + " and h.truck_status = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and c.operate_type = ? ";
    }
    if(params.drivingDateStart){
        paramsArray[i++] = params.drivingDateStart;
        query = query + " and h.driving_date >= ? ";
    }
    if(params.drivingDateEnd){
        paramsArray[i++] = params.drivingDateEnd;
        query = query + " and h.driving_date <= ? ";
    }
    query = query + '  order by h.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckFirst ');
        return callback(error,rows);
    });
}

function getTruckTrailer(params,callback) {
    var query = " select h.*,t.id as first_id,t.truck_num as first_num,c.company_name,c.operate_type " +
        " from truck_info h left join truck_info t on h.id = t.rel_id " +
        " left join company_info c on h.company_id = c.id where h.id is not null ";
    var paramsArray=[],i=0;
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and h.id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and h.truck_num = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and h.company_id = ? ";
    }
    if(params.truckType){
        paramsArray[i++] = params.truckType;
        query = query + " and h.truck_type = ? ";
    }
    if(params.truckStatus){
        paramsArray[i++] = params.truckStatus;
        query = query + " and h.truck_status = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and c.operate_type = ? ";
    }
    if(params.numberStart){
        paramsArray[i++] = params.numberStart;
        query = query + " and h.number >= ? ";
    }
    if(params.numberEnd){
        paramsArray[i++] = params.numberEnd;
        query = query + " and h.number <= ? ";
    }
    if(params.drivingDateStart){
        paramsArray[i++] = params.drivingDateStart;
        query = query + " and h.driving_date >= ? ";
    }
    if(params.drivingDateEnd){
        paramsArray[i++] = params.drivingDateEnd;
        query = query + " and h.driving_date <= ? ";
    }
    if(params.trailId){
        paramsArray[i++] = params.trailId;
        query = query + " and h.id = ? ";
    }
    query = query + '  order by h.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckTrailer ');
        return callback(error,rows);
    });
}

function getTruckBase(params,callback) {
    var query = " select t.* from truck_info t where t.id is not null ";
    var paramsArray=[],i=0;
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and t.id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and t.truck_num = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and t.drive_id = ? ";
    }
    if(params.relId){
        paramsArray[i++] = params.relId;
        query = query + " and t.rel_id = ? ";
    }
    if(params.truckType){
        paramsArray[i++] = params.truckType;
        query = query + " and t.truck_type = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckBase ');
        return callback(error,rows);
    });
}

function getOperateTypeCount(params,callback) {
    var query = " select count(t.id) as truck_count,c.operate_type from truck_info t left join company_info c on t.company_id = c.id " +
        " where t.id is not null ";
    var paramsArray=[],i=0;
    if(params.truckType){
        paramsArray[i++] = params.truckType;
        query = query + " and t.truck_type= ? ";
    }
    query = query + ' group by c.operate_type ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getOperateTypeCount ');
        return callback(error,rows);
    });
}

function getTruckCount(params,callback) {
    var query = " select count(t.id) as truck_count from truck_info t left join company_info c on t.company_id = c.id " +
        " where t.id is not null ";
    var paramsArray=[],i=0;
    if(params.truckType){
        paramsArray[i++] = params.truckType;
        query = query + " and t.truck_type = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and c.operate_type = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckCount ');
        return callback(error,rows);
    });
}

function getDrivingCount(params,callback) {
    var query = " select count(t.id) as driving_count from truck_info t " +
        " where t.id is not null ";
    var paramsArray=[],i=0;
    if(params.truckStatus){
        paramsArray[i++] = params.truckStatus;
        query = query + " and t.truck_status = ? ";
    }
    if(params.drivingDateStart){
        paramsArray[i++] = params.drivingDateStart;
        query = query + " and t.driving_date >= ? ";
    }
    if(params.drivingDateEnd){
        paramsArray[i++] = params.drivingDateEnd;
        query = query + " and t.driving_date <= ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDrivingCount ');
        return callback(error,rows);
    });
}

function getRepairStatusCount(params,callback) {
    var query = " select count(t.id) as repairStatus_count,t.repair_status from truck_info t left join company_info c on t.company_id = c.id " +
        " where t.id is not null ";
    var paramsArray=[],i=0;
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and c.operate_type= ? ";
    }
    query = query + ' group by t.repair_status ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getRepairStatusCount ');
        return callback(error,rows);
    });
}

function getFirstCount(params,callback) {
    var query = " select count(t.id) as first_count from truck_info t left join company_info c on t.company_id = c.id " +
        " where t.truck_type = 1 and t.id is not null ";
    var paramsArray=[],i=0;
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and c.id= ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getFirstCount ');
        return callback(error,rows);
    });
}

function getTrailerCount(params,callback) {
    var query = " select count(t.id) as trailer_count from truck_info t left join company_info c on t.company_id = c.id " +
        " where t.truck_type = 2 and t.id is not null ";
    var paramsArray=[],i=0;
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and c.id= ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTrailerCount ');
        return callback(error,rows);
    });
}

function getTruckInsureTotalYear(params,callback) {
    var query = " select db.year,sum(ir.insure_money) as insure_money,i.insure_name,ir.insure_type from truck_insure_rel ir " +
        " left join truck_insure i on ir.insure_id = i.id " +
        " left join date_base db on ir.date_id = db.id " +
        " where ir.id is not null ";
    var paramsArray=[],i=0;
    if(params.year){
        paramsArray[i++] = params.year;
        query = query + " and db.year = ? ";
    }
    if(params.insureId){
        paramsArray[i++] = params.insureId;
        query = query + " and ir.insure_id = ? ";
    }
    query = query + ' group by db.year,i.insure_name,ir.insure_type ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckInsureTotalYear ');
        return callback(error,rows);
    });
}

function getTruckInsureTotalMonth(params,callback) {
    var query = " select db.y_month,sum(ir.insure_money) as insure_money,ir.insure_type from truck_insure_rel ir " +
        " left join truck_insure i on ir.insure_id = i.id " +
        " left join date_base db on ir.date_id = db.id " +
        " where ir.id is not null ";
    var paramsArray=[],i=0;
    if(params.year){
        paramsArray[i++] = params.year;
        query = query + " and db.year = ? ";
    }
    if(params.insureId){
        paramsArray[i++] = params.insureId;
        query = query + " and ir.insure_id = ? ";
    }
    if(params.insureType){
        paramsArray[i++] = params.insureType;
        query = query + " and ir.insure_type = ? ";
    }
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + " and db.y_month >= ? ";
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + " and db.y_month <= ? ";
    }
    query = query + ' group by db.y_month,ir.insure_type ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckInsureTotalMonth ');
        return callback(error,rows);
    });
}

function getTruckInsureCountTotalMonth(params,callback) {
    var query = " select db.y_month,count(ir.id) as insure_count from truck_insure_rel ir " +
        " left join truck_insure i on ir.insure_id = i.id " +
        " left join date_base db on ir.date_id = db.id " +
        " where ir.id is not null ";
    var paramsArray=[],i=0;
    if(params.year){
        paramsArray[i++] = params.year;
        query = query + " and db.year = ? ";
    }
    if(params.insureId){
        paramsArray[i++] = params.insureId;
        query = query + " and ir.insure_id = ? ";
    }
    if(params.insureType){
        paramsArray[i++] = params.insureType;
        query = query + " and ir.insure_type = ? ";
    }
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + " and db.y_month >= ? ";
    }
    if(params.monthEnd){
        paramsArray[i++] = params.monthEnd;
        query = query + " and db.y_month <= ? ";
    }
    query = query + ' group by db.y_month ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckInsureCountTotalMonth ');
        return callback(error,rows);
    });
}

function getTruckTypeCountTotal(params,callback) {
    var query = " select count(id) as truck_count,truck_type from truck_info where id is not null ";
    var paramsArray=[],i=0;
    if(params.truckType){
        paramsArray[i++] = params.truckType;
        query = query + " and truck_type = ? ";
    }
    query = query + ' group by truck_type ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckTypeCountTotal ');
        return callback(error,rows);
    });
}

function getTruckOperateTypeCountTotal(params,callback) {
    var query = " select count(t.id) as truck_count,c.operate_type from truck_info t left join company_info c on t.company_id = c.id " +
        " where t.id is not null ";
    var paramsArray=[],i=0;
    if(params.truckType){
        paramsArray[i++] = params.truckType;
        query = query + " and t.truck_type= ? ";
    }
    query = query + ' group by c.operate_type ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckOperateTypeCountTotal ');
        return callback(error,rows);
    });
}

function updateTruck(params,callback){
    var query = " update truck_info set truck_num = ? , brand_id = ? , truck_tel = ? ,the_code = ? , company_id = ? , " +
        " truck_type = ? , number = ? , driving_date = ? , license_date = ? , two_date = ? , remark = ?  where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckNum;
    paramsArray[i++]=params.brandId;
    paramsArray[i++]=params.truckTel;
    paramsArray[i++]=params.theCode;
    paramsArray[i++]=params.companyId;
    paramsArray[i++]=params.truckType;
    paramsArray[i++]=params.number;
    paramsArray[i++]=params.drivingDate;
    paramsArray[i++]=params.licenseDate;
    paramsArray[i++]=params.twoDate;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.truckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruck ');
        return callback(error,rows);
    });
}

function updateTruckDrivingImage(params,callback){
    var query = " update truck_info set driving_image = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckImage;
    paramsArray[i]=params.truckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckDrivingImage ');
        return callback(error,rows);
    });
}

function updateTruckLicenseImage(params,callback){
    var query = " update truck_info set license_image = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckImage;
    paramsArray[i]=params.truckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckLicenseImage ');
        return callback(error,rows);
    });
}

function updateTruckInspectImage(params,callback){
    var query = " update truck_info set inspect_image = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckImage;
    paramsArray[i]=params.truckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckInspectImage ');
        return callback(error,rows);
    });
}

function updateTruckRel(params,callback){
    var query = " update truck_info set rel_id = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.trailId;
    paramsArray[i]=params.truckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckRel ');
        return callback(error,rows);
    });
}

function updateTruckDriveRel(params,callback){
    var query = " update truck_info set drive_id = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveId;
    paramsArray[i]=params.truckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckDriveRel ');
        return callback(error,rows);
    });
}

function updateTruckStatus(params,callback){
    var query = " update truck_info set truck_status = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.truckStatus;
    paramsArray[i] = params.truckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateTruckStatus ');
        return callback(error,rows);
    });
}

function updateRepairStatus(params,callback){
    var query = " update truck_info set repair_status = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.repairStatus;
    paramsArray[i] = params.truckId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateRepairStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addTruckFirst : addTruckFirst,
    addTruckTrailer : addTruckTrailer,
    getTruckFirst : getTruckFirst,
    getTruckTrailer : getTruckTrailer,
    getTruckBase : getTruckBase,
    getOperateTypeCount : getOperateTypeCount,
    getTruckCount : getTruckCount,
    getDrivingCount : getDrivingCount,
    getRepairStatusCount : getRepairStatusCount,
    getFirstCount : getFirstCount,
    getTrailerCount : getTrailerCount,
    getTruckInsureTotalYear : getTruckInsureTotalYear,
    getTruckInsureTotalMonth : getTruckInsureTotalMonth,
    getTruckInsureCountTotalMonth : getTruckInsureCountTotalMonth,
    getTruckTypeCountTotal : getTruckTypeCountTotal,
    getTruckOperateTypeCountTotal : getTruckOperateTypeCountTotal,
    updateTruck : updateTruck,
    updateTruckDrivingImage :updateTruckDrivingImage,
    updateTruckLicenseImage :updateTruckLicenseImage,
    updateTruckInspectImage :updateTruckInspectImage,
    updateTruckRel : updateTruckRel,
    updateTruckDriveRel : updateTruckDriveRel,
    updateTruckStatus : updateTruckStatus,
    updateRepairStatus : updateRepairStatus
}