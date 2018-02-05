/**
 * Created by zwl on 2018/2/2.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckAccidentDAO.js');

function addTruckAccident(params,callback){
    var query = " insert into truck_accident_info ( truck_id , drive_id , dp_route_task_id , " +
        " accident_date , address , date_id , accident_explain ) values ( ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.dpRouteTaskId;
    paramsArray[i++]=params.accidentDate;
    paramsArray[i++]=params.address;
    paramsArray[i++]=params.dateId;
    paramsArray[i]=params.accidentExplain;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addTruckAccident ');
        return callback(error,rows);
    });
}

function getTruckAccident(params,callback) {
    var query = " select ta.*,c.city_name as city_route_start,c1.city_name as city_route_end,t.truck_num,d.drive_name from truck_accident_info ta " +
        " left join dp_route_task dpr on ta.dp_route_task_id = dpr.id " +
        " left join city_info c on dpr.route_start_id = c.id " +
        " left join city_info c1 on dpr.route_end_id = c1.id " +
        " left join truck_info t on dpr.truck_id = t.id " +
        " left join drive_info d on dpr.drive_id = d.id where ta.id is not null ";
    var paramsArray=[],i=0;
    if(params.truckAccidentId){
        paramsArray[i++] = params.truckAccidentId;
        query = query + " and ta.id = ? ";
    }
    if(params.accidentStatus){
        paramsArray[i++] = params.accidentStatus;
        query = query + " and ta.accident_status = ? ";
    }
    if(params.truckId){
        paramsArray[i++] = params.truckId;
        query = query + " and ta.truck_id = ? ";
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
