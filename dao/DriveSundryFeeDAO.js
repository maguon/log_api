/**
 * Created by yjy on 2020/3/5.
 */
var db = require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriveSundryFeeDAO.js');

function addDriveSundryFee(params, callback) {
    var query = "insert into drive_sundry_fee (user_id,drive_id,y_month,personal_loan,social_fee,meals_fee,other_fee) " +
        " values ( ? , ? , ? , ? , ? , ? , ? ) ";
    var paramsArray = [], i = 0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.driveId;
    paramsArray[i++] = params.yMonth;
    paramsArray[i++] = params.personalLoan;
    paramsArray[i++] = params.socialFee;
    paramsArray[i++] = params.mealsFee;
    paramsArray[i++] = params.otherFee;
    db.dbQuery(query, paramsArray, function (error, rows) {
        logger.debug(' addDriveSundryFee ');
        return callback(error, rows);
    })
}

function updateDriveSundryFee(params, callback) {
    var query = " update drive_sundry_fee set personal_loan = ? , social_fee = ?, meals_fee = ? , other_fee = ? where id is not null ";
    var paramsArray = [], i = 0;
    paramsArray[i++] = params.personalLoan;
    paramsArray[i++] = params.socialFee;
    paramsArray[i++] = params.mealsFee;
    paramsArray[i++] = params.otherFee;
    if (params.driveSundryFeeId) {
        paramsArray[i++] = params.driveSundryFeeId;
        query = query + " and id = ? ";
    }
    db.dbQuery(query, paramsArray, function (error, rows) {
        logger.debug(' updateDriveSundryFee ');
        return callback(error, rows);
    });
}

function updateDriveSundryOtherFee(params, callback) {
    var query = " update drive_sundry_fee set other_fee = ? where id is not null ";
    var paramsArray = [], i = 0;
    paramsArray[i++] = params.otherFee;
    if (params.userId) {
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? ";
    }
    if (params.driveId) {
        paramsArray[i++] = params.driveId;
        query = query + " and drive_id = ? ";
    }
    if (params.yMonth) {
        paramsArray[i++] = params.yMonth;
        query = query + " and y_month = ? ";
    }
    if (params.driveSundryFeeId) {
        paramsArray[i++] = params.driveSundryFeeId;
        query = query + " and id = ? ";
    }
    db.dbQuery(query, paramsArray, function (error, rows) {
        logger.debug(' updateDriveSundryOtherFee ');
        return callback(error, rows);
    });
}

function getDriveSundryFee(params, callback) {
    var query = " select dsf.*,d.drive_name,d.tel from drive_sundry_fee dsf left join drive_info d on d.id = dsf.drive_id  " +
        " where dsf.id is not null ";
    var paramsArray = [], i = 0;
    if (params.driveSundryFeeId) {
        paramsArray[i++] = params.driveSundryFeeId;
        query = query + " and dsf.id = ? ";
    }
    if (params.userId) {
        paramsArray[i++] = params.userId;
        query = query + " and dsf.user_id = ? ";
    }
    if (params.driveId) {
        paramsArray[i++] = params.driveId;
        query = query + " and dsf.drive_id = ? ";
    }
    if (params.yMonth) {
        paramsArray[i++] = params.yMonth;
        query = query + " and dsf.y_month = ? ";
    }
    query = query + ' order by dsf.id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query, paramsArray, function (error, rows) {
        logger.debug(' getDriveSundryFee ');
        return callback(error, rows);
    });
}

module.exports = {
    addDriveSundryFee: addDriveSundryFee,
    updateDriveSundryFee: updateDriveSundryFee,
    updateDriveSundryOtherFee: updateDriveSundryOtherFee,
    getDriveSundryFee: getDriveSundryFee
};