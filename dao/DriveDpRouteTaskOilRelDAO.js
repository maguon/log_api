/**
 * Created by zwl on 2019/3/18.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveDpRouteTaskOilRelDAO.js');

function addDriveDpRouteTaskOilRel(params,callback){
    var query = " insert into drive_dp_route_task_oil_rel (dp_route_task_oil_rel_id,drive_exceed_oil_id) values ( ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dpRouteTaskOilRelId;
    paramsArray[i]=params.driveExceedOilId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDriveDpRouteTaskOilRel ');
        return callback(error,rows);
    });
}

function getDriveDpRouteTaskOilRel(params,callback) {
    var query = " select dor.*,dpror.dp_route_task_id,t.truck_num,d.drive_name, " +
        " dpror.route_start,dpror.route_end,dpror.distance,dpror.load_flag, " +
        " dpror.oil,dpror.total_oil,dpror.urea,dpror.total_urea " +
        " from drive_dp_route_task_oil_rel dor " +
        " left join dp_route_task_oil_rel dpror on dor.dp_route_task_oil_rel_id = dpror.id " +
        " left join drive_exceed_oil deo on dor.drive_exceed_oil_id = deo.id " +
        " left join truck_info t on dpror.truck_id = t.id " +
        " left join drive_info d on dpror.drive_id = d.id " +
        " where dor.dp_route_task_oil_rel_id is not null ";
    var paramsArray=[],i=0;
    if(params.dpRouteTaskOilRelId){
        paramsArray[i++] = params.dpRouteTaskOilRelId;
        query = query + " and dor.dp_route_task_oil_rel_id = ? ";
    }
    if(params.driveExceedOilId){
        paramsArray[i++] = params.driveExceedOilId;
        query = query + " and dor.drive_exceed_oil_id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getDriveDpRouteTaskOilRel ');
        return callback(error,rows);
    });
}

function deleteDriveDpRouteTaskOilRel(params,callback){
    var query = " delete from drive_dp_route_task_oil_rel where dp_route_task_oil_rel_id = ? and drive_exceed_oil_id = ? ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.dpRouteTaskOilRelId;
    paramsArray[i]=params.driveExceedOilId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' deleteDriveDpRouteTaskOilRel ');
        return callback(error,rows);
    });
}


module.exports ={
    addDriveDpRouteTaskOilRel : addDriveDpRouteTaskOilRel,
    getDriveDpRouteTaskOilRel : getDriveDpRouteTaskOilRel,
    deleteDriveDpRouteTaskOilRel : deleteDriveDpRouteTaskOilRel
}