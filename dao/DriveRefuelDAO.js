/**
 * Created by zwl on 2017/9/8.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveRefuelDAO.js');

function addDriveRefuel(params,callback){
    var query = " insert into drive_refuel (drive_id,truck_id,date_id,refuel_date,refuel_volume,city_route_id, " +
        "refuel_address_type,refuel_address,lng,lat,refuel_money) values ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.driveId;
    paramsArray[i++]=params.truckId;
    paramsArray[i++]=params.dateId;
    paramsArray[i++]=params.refuelDate;
    paramsArray[i++]=params.refuelVolume;
    paramsArray[i++]=params.cityRouteId;
    paramsArray[i++]=params.refuelAddressType;
    paramsArray[i++]=params.refuelAddress;
    paramsArray[i++]=params.lng;
    paramsArray[i++]=params.lat;
    paramsArray[i]=params.refuelMoney;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addDriveRefuel ');
        return callback(error,rows);
    });
}


module.exports ={
    addDriveRefuel: addDriveRefuel
}
