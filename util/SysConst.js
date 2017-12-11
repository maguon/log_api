/**
 * Created by zwl on 2017/7/10.
 */
var USER_TYPE  ={
    admin : 99,  //系统管理员
    drive_op : 10,//司机操作员
    truck_op : 11,//车管部操作员
    truck_admin : 19,//车管部管理员
    storage_op : 21, //仓储部操作员
    storage_admin : 21,//仓储部管理员
    dispatch_op : 31, //调度部操作员
    dispatch_admin : 39//调度部管理员
};
var RECORD_OP_TYPE  ={
    truckOp : 20,
    driverOp : 30,
    create : 31,
    accept : 32,
    doing : 33,
    on_road : 34,
    cancel : 38,
    completed : 39
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
var DEMAND_STATUS  ={
    cancel : 0,
    not_completed : 1,
    completed : 2
};
var TASK_STATUS  ={
    ready_accept : 1,
    accept : 2,
    doing : 3,
    on_road : 4,
    cancel : 8,
    completed : 9,
    all_completed : 10

};
var LOAD_TASK_STATUS  ={
    no_load : 1,
    load : 3,
    arrive : 7,
    cancel : 8,
    completed : 9
};
var CAR_LOAD_STATUS  ={
    load : 1,
    arrive : 2
};
var USER_LOGIN_APP_TYPE  ={
    storage : 1,
    truck : 2,
    dispatch : 3,
    drive : 4
};
var DAMAGE_STATUS  ={
    ready_process : 1,
    in_process : 2,
    completed : 3
};

var REFUEL_STATUS  ={
    rejected : 3,
    checked : 2 ,
    no_check : 1
};

module.exports = {
    USER_TYPE : USER_TYPE,
    RECORD_OP_TYPE : RECORD_OP_TYPE,
    LICENSE_TYPE : LICENSE_TYPE,
    DEMAND_STATUS : DEMAND_STATUS,
    TASK_STATUS : TASK_STATUS,
    LOAD_TASK_STATUS : LOAD_TASK_STATUS,
    CAR_LOAD_STATUS : CAR_LOAD_STATUS,
    USER_LOGIN_APP_TYPE : USER_LOGIN_APP_TYPE,
    DAMAGE_STATUS : DAMAGE_STATUS ,
    REFUEL_STATUS : REFUEL_STATUS
}