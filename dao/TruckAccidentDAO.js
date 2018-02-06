/**
 * Created by zwl on 2018/2/2.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckAccidentDAO.js');

function addTruckAccident(params,callback){
    var query = " insert into truck_accident_info ( truck_id , drive_id , dp_route_task_id , " +
        " accident_date , address , lng , lat , date_id , accident_explain ) values ( ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.dpRouteTaskId;
    paramsArray[i++]=params.accidentDate;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.lng;
    paramsArray[i++]=params.lat;
    paramsArray[i++]=params.dateId;
    paramsArray[i]=params.accidentExplain;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addTruckAccident ');
        return callback(error,rows);
    });
}

function getTruckAccident(params,callback) {
    var query = " select ta.*,c.city_name as city_route_start,c1.city_name as city_route_end,t.truck_num,d.drive_name, " +
        " tac.truck_accident_type,tac.under_user_id,tac.under_user_name from truck_accident_info ta " +
        " left join dp_route_task dpr on ta.dp_route_task_id = dpr.id " +
        " left join city_info c on dpr.route_start_id = c.id " +
        " left join city_info c1 on dpr.route_end_id = c1.id " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " left join drive_info d on dpr.drive_id = d.id " +
        " left join truck_accident_check tac on ta.id = tac.truck_accident_id " +
        " where ta.id is not null ";
    var paramsArray=[],i=0;
    if(params.truckAccidentId){
        paramsArray[i++] = params.truckAccidentId;
        query = query + " and ta.id = ? ";
    }
    if(params.truckNum){
        paramsArray[i++] = params.truckNum;
        query = query + " and t.truck_num = ? ";
    }
    if(params.truckType){
        paramsArray[i++] = params.truckType;
        query = query + " and ta.truck_type = ? ";
    }
    if(params.driveId){
        paramsArray[i++] = params.driveId;
        query = query + " and ta.drive_id = ? ";
    }
    if(params.driveName){
        paramsArray[i++] = params.driveName;
        query = query + " and d.drive_name = ? ";
    }
    if(params.accidentDateStart){
        paramsArray[i++] = params.accidentDateStart +" 00:00:00";
        query = query + " and ta.accident_date >= ? ";
    }
    if(params.accidentDateEnd){
        paramsArray[i++] = params.accidentDateEnd +" 23:59:59";
        query = query + " and ta.accident_date <= ? ";
    }
    if(params.dpRouteTaskId){
        paramsArray[i++] = params.dpRouteTaskId;
        query = query + " and ta.dp_route_task_id = ? ";
    }
    if(params.truckAccidentType){
        paramsArray[i++] = params.truckAccidentType;
        query = query + " and tac.truck_accident_type = ? ";
    }
    if(params.underUserId){
        paramsArray[i++] = params.underUserId;
        query = query + " and tac.under_user_id = ? ";
    }
    if(params.underUserName){
        paramsArray[i++] = params.underUserName;
        query = query + " and tac.under_user_name = ? ";
    }
    if(params.accidentStatus){
        paramsArray[i++] = params.accidentStatus;
        query = query + " and ta.accident_status = ? ";
    }
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getTruckAccident ');
        return callback(error,rows);
    });
}


module.exports ={
    addTruckAccident : addTruckAccident,
    getTruckAccident : getTruckAccident
}
