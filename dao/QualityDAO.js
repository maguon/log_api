/**
 * Created by zwl on 2017/10/31.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('QualityDAO.js');

function addQuality(params,callback){
    var query = " insert into quality_info (declare_user_id,car_id,truck_id,truck_num,drive_id,drive_name,date_id,quality_explain) " +
        " values ( ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.carId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.truckNum;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.driveName;
    paramsArray[i++]=params.dateId;
    paramsArray[i]=params.qualityExplain;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addQuality ');
        return callback(error,rows);
    });
}

function getQuality(params,callback) {
    var query = " select q.*,u.real_name,u.type,c.vin,c.make_name, " +
        " r.short_name as re_short_name,e.short_name as en_short_name from quality_info q " +
        " left join user_info u on q.declare_user_id = u.uid " +
        " left join car_info c on q.car_id = c.id " +
        " left join receive_info r on c.receive_id = r.id " +
        " left join entrust_info e on c.entrust_id = e.id where q.id is not null ";
    var paramsArray=[],i=0;
    if(params.qualityId){
        paramsArray[i++] = params.qualityId;
        query = query + " and q.id = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart;
        query = query + " and date_format(q.created_on,'%Y-%m') >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd;
        query = query + " and date_format(q.created_on,'%Y-%m') <= ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and c.vin = ? ";
    }
    if(params.qualityStatus){
        paramsArray[i++] = params.qualityStatus;
        query = query + " and q.quality_status = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getQuality ');
        return callback(error,rows);
    });
}

function updateQuality(params,callback){
    var query = " update quality_info set truck_id = ? , truck_num = ? , drive_id = ? , drive_name = ? , quality_explain = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.truckNum;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.driveName;
    paramsArray[i++]=params.qualityExplain;
    paramsArray[i]=params.qualityId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateQuality ');
        return callback(error,rows);
    });
}


module.exports ={
    addQuality : addQuality,
    getQuality : getQuality,
    updateQuality : updateQuality
}
