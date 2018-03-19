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
    dispatch_admin : 39, //调度部管理员
    qa_op : 41, //质量部操作员
    qa_manager : 49, //质量部管理员
    finance_op : 51, //财务部操作员
    finance_admin : 59 //财务部管理员
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
var CLEAN_STATUS  ={    //洗车费
    cancel : 0,
    not_completed : 1,
    completed : 2
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

var DAMAGE_TYPE = {
    a : 1 ,
    b : 2 ,
    c : 3 ,
    d : 4 ,
    f : 6
};

var DAMAGE_STEP_TYPE = {
    SYS_OUT : 1, //委托方质损
    PARK_DAMAGE :2 ,//短驳质损
    STORAGE_DAMAGE : 3, //仓储质损
    LOAD_DAMAGE : 4 ,//装车质损
    TRANS_DAMAGE : 5 //运输质损
};
var UNLOAD_CAR_COUNT = 3;

var CAR_OP_TYPE = {
    QUALITY : 10,
    IMPORT : 11,
    MOVING : 12,
    EXPORT : 13,
    LOAD :14 ,
    ARRIVED : 15
}
var ACCIDENT_STATUS  ={ //事故状态
    ready_process : 1,  //待处理
    in_process : 2, //处理中
    completed : 3   //已处理
};
var ACCIDENT__TYPE = {  //事故类型
    commonly : 1 ,  //一般
    serious : 2 //严重
};
var LOAN__STATUS = {  //财务借款状态
    no : 0 ,  //否
    yes : 1 //是
};
var TASK_LOAN__STATUS = {  //出车任务借款状态
    not_grant : 1 ,  //未发放
    grant : 2, //已发放
    refund : 3  //已报销
};
var DAMAGE_INDEMNITY__STATUS = {  //申请质损赔款状态
    no : 1 ,  //不需赔款
    yes : 2 //需要赔款
};

var TRUCK_INSURE__STATUS = {  //货车保险状态
    cancel : -1 ,  //取消删除
    normal : 1 //正常
};


module.exports = {
    USER_TYPE : USER_TYPE,
    RECORD_OP_TYPE : RECORD_OP_TYPE,
    LICENSE_TYPE : LICENSE_TYPE,
    DEMAND_STATUS : DEMAND_STATUS,
    TASK_STATUS : TASK_STATUS,
    LOAD_TASK_STATUS : LOAD_TASK_STATUS,
    CAR_LOAD_STATUS : CAR_LOAD_STATUS,
    CLEAN_STATUS : CLEAN_STATUS,
    USER_LOGIN_APP_TYPE : USER_LOGIN_APP_TYPE,
    DAMAGE_STATUS : DAMAGE_STATUS ,
    REFUEL_STATUS : REFUEL_STATUS ,
    UNLOAD_CAR_COUNT  : UNLOAD_CAR_COUNT ,
    DAMAGE_TYPE : DAMAGE_TYPE ,
    DAMAGE_STEP_TYPE : DAMAGE_STEP_TYPE ,
    CAR_OP_TYPE : CAR_OP_TYPE,
    ACCIDENT_STATUS : ACCIDENT_STATUS,
    ACCIDENT__TYPE : ACCIDENT__TYPE,
    LOAN__STATUS : LOAN__STATUS,
    TASK_LOAN__STATUS : TASK_LOAN__STATUS,
    DAMAGE_INDEMNITY__STATUS : DAMAGE_INDEMNITY__STATUS,
    TRUCK_INSURE__STATUS : TRUCK_INSURE__STATUS
}