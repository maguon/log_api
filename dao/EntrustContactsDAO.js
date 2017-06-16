/**
 * Created by zwl on 2017/6/8.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('EntrustContactsDAO.js');

function addEntrustContacts(params,callback){
    var query = " insert into entrust_contacts (entrust_id,contacts_name,position,tel) values ( ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.entrustId;
    paramsArray[i++]=params.contactsName;
    paramsArray[i++]=params.position;
    paramsArray[i]=params.tel;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addEntrustContacts ');
        return callback(error,rows);
    });
}

function getEntrustContacts(params,callback) {
    var query = " select ec.* from entrust_contacts ec left join entrust_info en on ec.entrust_id = en.id where ec.contacts_status = 1 and ec.id is not null ";
    var paramsArray=[],i=0;
    if(params.entrustId){
        paramsArray[i++] = params.entrustId;
        query = query + " and en.id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getEntrustContacts ');
        return callback(error,rows);
    });
}

function updateEntrustContacts(params,callback){
    var query = " update entrust_contacts set contacts_name = ? , position = ? , tel = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.contactsName;
    paramsArray[i++]=params.position;
    paramsArray[i++]=params.tel;
    paramsArray[i]=params.contactsId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateEntrustContacts ');
        return callback(error,rows);
    });
}

function updateContactsStatus(params,callback){
    var query = " update entrust_contacts set contacts_status = ? where id = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.entrustContactsStatus;
    paramsArray[i] = params.contactsId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateContactsStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addEntrustContacts : addEntrustContacts,
    getEntrustContacts : getEntrustContacts,
    updateEntrustContacts : updateEntrustContacts,
    updateContactsStatus : updateContactsStatus
}