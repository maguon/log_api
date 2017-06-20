/**
 * Created by zwl on 2017/6/7.
 */

var db=require('../db/connection/MysqlDb.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ReceiveContactsDAO.js');

function addReceiveContacts(params,callback){
    var query = " insert into receive_contacts (receive_id,contacts_name,position,tel) values ( ? , ? , ? , ? ) ";
    var paramsArray=[],i=0;
    paramsArray[i++]=params.receiveId;
    paramsArray[i++]=params.contactsName;
    paramsArray[i++]=params.position;
    paramsArray[i]=params.tel;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addReceiveContacts ');
        return callback(error,rows);
    });
}

function getReceiveContacts(params,callback) {
    var query = " select rc.* from receive_contacts rc left join receive_info re on rc.receive_id = re.id where rc.contacts_status = 1 and rc.id is not null ";
    var paramsArray=[],i=0;
    if(params.receiveId){
        paramsArray[i++] = params.receiveId;
        query = query + " and re.id = ? ";
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' getReceiveContacts ');
        return callback(error,rows);
    });
}

function updateReceiveContacts(params,callback){
    var query = " update receive_contacts set contacts_name = ? , position = ? , tel = ? where id = ? " ;
    var paramsArray=[],i=0;
    paramsArray[i++]=params.contactsName;
    paramsArray[i++]=params.position;
    paramsArray[i++]=params.tel;
    paramsArray[i]=params.receiveContactsId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateReceiveContacts ');
        return callback(error,rows);
    });
}

function updateContactsStatus(params,callback){
    var query = " update receive_contacts set contacts_status = ? where id = ?";
    var paramsArray=[],i=0;
    paramsArray[i++] = params.contactsStatus;
    paramsArray[i] = params.receiveContactsId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateContactsStatus ');
        return callback(error,rows);
    });
}


module.exports ={
    addReceiveContacts : addReceiveContacts,
    getReceiveContacts : getReceiveContacts,
    updateReceiveContacts : updateReceiveContacts,
    updateContactsStatus : updateContactsStatus
}