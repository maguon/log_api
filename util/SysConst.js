/**
 * Created by zwl on 2017/7/10.
 */
var USER_TYPE  ={
    admin : 99
};
var RECORD_OP_TYPE  ={
    truckOp : 20,
    driverOp : 30
};
var LICENSE_TYPE  ={
    A1 : 1,
    A2 : 2,
    A3 : 3,
    B1 : 4,
    B2 : 5,
    C1 : 6,
    C2 : 7,
    C3 : 8
};
var TASK_STATUS  ={
    ready_accept : 1,
    accept : 2,
    execute : 3,
    transport : 4,
    cancel : 8,
    complete : 9
};
var LOAD_TASK_STATUS  ={
    no_load : 1,
    load : 3,
    arrive : 7,
    cancel : 8,
    complete : 9
};


module.exports = {
    USER_TYPE : USER_TYPE,
    RECORD_OP_TYPE : RECORD_OP_TYPE,
    LICENSE_TYPE : LICENSE_TYPE,
    TASK_STATUS : TASK_STATUS,
    LOAD_TASK_STATUS : LOAD_TASK_STATUS
}