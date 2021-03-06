/**
 * Created by zwl on 2017/3/15.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveDAO.js');

function addDrive(params,callback){
    var query = " insert into drive_info (user_id,drive_name,gender,id_number,entry_time,archives_num,tel,operate_type,company_id,license_type," +
        " address,sib_tel,license_date,social_type,remark) values( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.driveName;
    paramsArray[i++]=params.gender;
    paramsArray[i++]=params.idNumber;
    paramsArray[i++]=params.entryTime;
    paramsArray[i++]=params.archivesNum;
    paramsArray[i++]=params.tel;
    paramsArray[i++]=params.operateType;
    paramsArray[i++]=params.companyId;
    paramsArray[i++]=params.licenseType;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.sibTel;
    paramsArray[i++]=params.licenseDate;
    paramsArray[i++]=params.socialType;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug( ' addDrive ');
        return callback(error,rows);
    })
}

function getDrive(params,callback) {
    var query = " select d.*,ti1.id as truck_id,ti1.truck_num,ti2.id as vice_truck_id,ti2.truck_num as vice,c.company_name, " +
        " h.truck_num as trail_num,h.number,u.mobile,if(isnull(ti1.id),0,1) as operate_flag " +
        " from drive_info d " +
        " left join truck_info ti1 on d.id=ti1.drive_id " +
        " left join truck_info ti2 on d.id = ti2.vice_drive_id " +
        " left join truck_info h on ti1.rel_id = h.id " +
        " left join company_info c on d.company_id = c.id " +
        " left join user_info u on d.user_id = u.uid " +
        " where d.id is not null";
    var paramsArray=[],i=0;
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and d.id = ? ";
    }
    if(params.viceDriveId){
        paramsArray[i++] = params.viceDriveId;
        query = query + " and d.id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.operateFlag==1){
        query = query + " and ti1.id is not null";
    }
    if(params.operateFlag==0){
        query = query + " and ti1.id is null";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and ti1.id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and ti1.truck_num = ? ";
    }
    if(params.trailNum){
        paramsArray[i++] = params.trailNum;
        query = query + " and h.truck_num = ? ";
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
        query = query + " and d.operate_type = ? ";
    }
    if(params.driveStatus){
        paramsArray[i++] = params.driveStatus;
        query = query + " and d.drive_status = ? ";
    }
    if(params.idNumber){
        paramsArray[i++] = params.idNumber;
        query = query + " and d.id_number = ? ";
    }
    if(params.entryTimeStart){
        paramsArray[i++] = params.entryTimeStart;
        query = query + " and d.entry_time >= ? ";
    }
    if(params.entryTimeEnd){
        paramsArray[i++] = params.entryTimeEnd;
        query = query + " and d.entry_time <= ? ";
    }
    if(params.archivesNum){
        paramsArray[i++] = params.archivesNum;
        query = query + " and d.archives_num = ? ";
    }
    if(params.mobile){
        paramsArray[i++] = params.mobile;
        query = query + " and u.mobile = ? ";
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
    if(params.socialType){
        paramsArray[i++] = params.socialType;
        query = query + " and d.social_type = ? ";
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

function getDriveTruckCount(params,callback) {
    var query = " select count(d.id) as total_drive,count(t.drive_id) as drive_truck_count," +
        " count(t1.vice_drive_id)as vice_drive_count " +
        " from drive_info d " +
        " left join truck_info t on d.id = t.drive_id " +
        " left join truck_info t1 on d.id = t1.vice_drive_id " +
        " where d.id is not null ";
    var paramsArray=[],i=0;
    if(params.driveStatus){
        paramsArray[i++] = params.driveStatus;
        query = query + " and d.drive_status = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveTruckCount ');
        return callback(error,rows);
    });
}

function updateDrive(params,callback){
    var query = " update drive_info set drive_name = ? , gender = ? , id_number = ? , entry_time = ? , archives_num = ? , license_type = ? , " +
        " address = ? , sib_tel = ? , license_date = ? ,  social_type = ? , remark= ?  where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveName;
    paramsArray[i++]=params.gender;
    paramsArray[i++]=params.idNumber;
    paramsArray[i++]=params.entryTime;
    paramsArray[i++]=params.archivesNum;
    paramsArray[i++]=params.licenseType;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.sibTel;
    paramsArray[i++]=params.licenseDate;
    paramsArray[i++]=params.socialType;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.driveId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDrive ');
        return callback(error,rows);
    });
}

function updateDriveCompany(params,callback){
    var query = " update drive_info set operate_type = ? , company_id = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.operateType;
    paramsArray[i++]=params.companyId;
    paramsArray[i]=params.driveId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveCompany ');
        return callback(error,rows);
    });
}

function updateDriveBankNumber(params,callback){
    var query = " update drive_info set bank_number = ? , bank_name = ? , bank_user_name = ? where id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.bankNumber;
    paramsArray[i++]=params.bankName;
    paramsArray[i++]=params.bankUserName;
    paramsArray[i]=params.driveId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveBankNumber ');
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

function updateDriveLevel(params,callback){
    var query = " update drive_info set level = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.level;
    paramsArray[i]=params.driveId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveLevel ');
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

function updateDriveTel(params,callback){
    var query = " update drive_info set tel = ? where user_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.tel;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateDriveTel ');
        return callback(error,rows);
    });
}


module.exports ={
    addDrive : addDrive,
    getDrive : getDrive,
    getLicenseCount : getLicenseCount,
    getDriveCount : getDriveCount,
    getDriveOperateTypeCount : getDriveOperateTypeCount,
    getDriveTruckCount : getDriveTruckCount,
    updateDrive : updateDrive,
    updateDriveCompany : updateDriveCompany,
    updateDriveBankNumber : updateDriveBankNumber,
    updateDriveImage : updateDriveImage,
    updateDriveImageRe : updateDriveImageRe,
    updateLicenseImage : updateLicenseImage,
    updateOpLicenseImage : updateOpLicenseImage,
    updateDriverAvatarImage : updateDriverAvatarImage,
    updateDriveLevel : updateDriveLevel,
    updateDriveStatus : updateDriveStatus,
    updateDriveTel : updateDriveTel
}