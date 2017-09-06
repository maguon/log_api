/**
 * Created by zwl on 2017/3/15.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveDAO.js');

function addDrive(params,callback){
    var query = " insert into drive_info (drive_name,gender,id_number,tel,company_id,license_type," +
        " address,sib_tel,license_date,remark) values( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveName;
    paramsArray[i++]=params.gender;
    paramsArray[i++]=params.idNumber;
    paramsArray[i++]=params.tel;
    paramsArray[i++]=params.companyId;
    paramsArray[i++]=params.licenseType;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.sibTel;
    paramsArray[i++]=params.licenseDate;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug( ' addDrive ');
        return callback(error,rows);
    })
}

function getDrive(params,callback) {
    var query = " select d.*,c.company_name,c.operate_type,t.id as truck_id,t.truck_num " +
        " from drive_info d left join company_info c on d.company_id = c.id " +
        " left join truck_info t on d.id = t.drive_id or d.id = t.vice_driver_id where d.id is not null";
    var paramsArray=[],i=0;
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and d.id = ? ";
    }
    if(params.viceDriverId){
        paramsArray[i++] = params.viceDriverId;
        query = query + " and d.id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and t.id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and t.truck_num = ? ";
    }
    if(params.gender){
        paramsArray[i++] = params.gender;
        query = query + " and d.gender = ? ";
    }
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and d.company_id = ? ";
    }
    if(params.operateType){
        paramsArray[i++] = params.operateType;
        query = query + " and c.operate_type = ? ";
    }
    if(params.driveStatus){
        paramsArray[i++] = params.driveStatus;
        query = query + " and d.drive_status = ? ";
    }
    if(params.tel){
        paramsArray[i++] = params.tel;
        query = query + " and d.tel = ? ";
    }
    if(params.licenseType){
        paramsArray[i++] = params.licenseType;
        query = query + " and d.license_type = ? ";
    }
    if(params.licenseDateStart){
        paramsArray[i++] = params.licenseDateStart;
        query = query + " and d.license_date >= ? ";
    }
    if(params.licenseDateEnd){
        paramsArray[i++] = params.licenseDateEnd;
        query = query + " and d.license_date <= ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDrive ');
        return callback(error,rows);
    });
}

function getLicenseCount(params,callback) {
    var query = " select count(d.id) as license_count from drive_info d where d.id is not null ";
    var paramsArray=[],i=0;
    if(params.licenseDateStart){
        paramsArray[i++] = params.licenseDateStart;
        query = query + " and d.license_date >= ? ";
    }
    if(params.licenseDateEnd){
        paramsArray[i++] = params.licenseDateEnd;
        query = query + " and d.license_date <= ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getLicenseCount ');
        return callback(error,rows);
    });
}

function getDriveCount(params,callback) {
    var query = " select count(d.id) as driveCount from drive_info d left join company_info c on d.company_id = c.id where d.id is not null ";
    var paramsArray=[],i=0;
    if(params.companyId){
        paramsArray[i++] = params.companyId;
        query = query + " and c.id= ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveCount ');
        return callback(error,rows);
    });
}

function getDriveOperateTypeCount(params,callback) {
    var query = " select count(d.id) as drive_count,c.operate_type from drive_info d " +
        " left join company_info c on d.company_id = c.id where d.id is not null ";
    var paramsArray=[],i=0;
    if(params.driveStatus){
        paramsArray[i++] = params.driveStatus;
        query = query + " and d.drive_status = ? ";
    }
    query = query + ' group by c.operate_type ';
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveOperateTypeCount ');
        return callback(error,rows);
    });
}

function updateDrive(params,callback){
    var query = " update drive_info set drive_name = ? , gender = ? , id_number = ? , tel = ? , company_id = ? , license_type = ? , " +
        " address = ? , sib_tel = ? , license_date = ? , remark= ?  where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveName;
    paramsArray[i++]=params.gender;
    paramsArray[i++]=params.idNumber;
    paramsArray[i++]=params.tel;
    paramsArray[i++]=params.companyId;
    paramsArray[i++]=params.licenseType;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.sibTel;
    paramsArray[i++]=params.licenseDate;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.driveId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDrive ');
        return callback(error,rows);
    });
}

function updateDriveImage(params,callback){
    var query = " update drive_info set drive_image = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveImage;
    paramsArray[i]=params.driveId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveImage ');
        return callback(error,rows);
    });
}

function updateDriveImageRe(params,callback){
    var query = " update drive_info set driver_image_re = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveImage;
    paramsArray[i]=params.driveId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveImageRe ');
        return callback(error,rows);
    });
}

function updateLicenseImage(params,callback){
    var query = " update drive_info set license_image = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveImage;
    paramsArray[i]=params.driveId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateLicenseImage ');
        return callback(error,rows);
    });
}

function updateOpLicenseImage(params,callback){
    var query = " update drive_info set op_license_image = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveImage;
    paramsArray[i]=params.driveId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateOpLicenseImage ');
        return callback(error,rows);
    });
}

function updateDriverAvatarImage(params,callback){
    var query = " update drive_info set driver_avatar_image = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveImage;
    paramsArray[i]=params.driveId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriverAvatarImage ');
        return callback(error,rows);
    });
}

function updateDriveStatus(params,callback){
    var query = " update drive_info set drive_status = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.driveStatus;
    paramsArray[i] = params.driveId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addDrive : addDrive,
    getDrive : getDrive,
    getLicenseCount : getLicenseCount,
    getDriveCount : getDriveCount,
    getDriveOperateTypeCount : getDriveOperateTypeCount,
    updateDrive : updateDrive,
    updateDriveImage : updateDriveImage,
    updateDriveImageRe : updateDriveImageRe,
    updateLicenseImage : updateLicenseImage,
    updateOpLicenseImage : updateOpLicenseImage,
    updateDriverAvatarImage : updateDriverAvatarImage,
    updateDriveStatus : updateDriveStatus
}