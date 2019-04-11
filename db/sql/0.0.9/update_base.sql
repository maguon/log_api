-- ----------------------------
-- 2018-09-06 更新
-- ----------------------------
ALTER TABLE `dp_transfer_demand_info`
ADD COLUMN `addr_name`  varchar(50) NULL COMMENT '装车地' AFTER `base_addr_id`,
ADD COLUMN `transfer_addr_name`  varchar(50) NULL COMMENT '中转装车地' AFTER `transfer_addr_id`,
ADD COLUMN `short_name`  varchar(50) NULL COMMENT '经销商简称' AFTER `receive_id`;
update dp_transfer_demand_info dptd, base_addr ba set dptd.addr_name = ba.addr_name where dptd.base_addr_id = ba.id;
update dp_transfer_demand_info dptd, base_addr ba set dptd.transfer_addr_name = ba.addr_name where dptd.transfer_addr_id = ba.id;
update dp_transfer_demand_info dptd, receive_info r set dptd.short_name = r.short_name where dptd.receive_id = r.id;
-- ----------------------------
-- 2018-09-06 更新
-- ----------------------------
ALTER TABLE `dp_demand_info`
ADD COLUMN `addr_name`  varchar(50) NULL COMMENT '装车地' AFTER `base_addr_id`,
ADD COLUMN `short_name`  varchar(50) NULL COMMENT '经销商简称' AFTER `receive_id`;
update dp_demand_info dpd, base_addr ba set dpd.addr_name = ba.addr_name where dpd.base_addr_id = ba.id;
update dp_demand_info dpd, receive_info r set dpd.short_name = r.short_name where dpd.receive_id = r.id;
-- ----------------------------
-- 2018-09-07 更新
-- ----------------------------
ALTER TABLE `dp_task_stat`
ADD COLUMN `route_start`  varchar(50) NULL COMMENT '起始地城市' AFTER `route_start_id`,
ADD COLUMN `addr_name`  varchar(50) NULL COMMENT '装车地' AFTER `base_addr_id`,
ADD COLUMN `route_end`  varchar(50) NULL COMMENT '目的地城市' AFTER `route_end_id`,
ADD COLUMN `short_name`  varchar(50) NULL COMMENT '经销商简称' AFTER `receive_id`;
update dp_task_stat dpts, city_info c,city_info c1 set dpts.route_start = c.city_name ,dpts.route_end = c1.city_name where dpts.route_start_id = c.id and dpts.route_end_id = c1.id;
update dp_task_stat dpts, base_addr ba set dpts.addr_name = ba.addr_name where dpts.base_addr_id = ba.id;
update dp_task_stat dpts, receive_info r set dpts.short_name = r.short_name where dpts.receive_id = r.id;
-- ----------------------------
-- 2018-09-07 更新
-- dp_task_stat追加route_start,addr_name,route_end,short_name字段
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_new_demand_stat`;
delimiter $$
CREATE TRIGGER `trg_new_demand_stat` AFTER INSERT ON `dp_demand_info` FOR EACH ROW
BEGIN
INSERT INTO dp_task_stat(route_start_id,route_start,base_addr_id,addr_name,route_end_id,route_end,receive_id,short_name,date_id,pre_count)
VALUES (new.route_start_id,new.route_start,new.base_addr_id,new.addr_name,new.route_end_id,new.route_end,new.receive_id,new.short_name,new.date_id,new.pre_count)
ON DUPLICATE KEY UPDATE pre_count = pre_count+ new.pre_count ,task_stat_status=1;
END $$
delimiter ;
-- ----------------------------
-- 2018-09-13 更新
-- ----------------------------
ALTER TABLE `damage_check_indemnity`
ADD COLUMN `contacts_name`  varchar(50) NULL COMMENT '联系人' AFTER `plan_money`,
ADD COLUMN `tel`  varchar(20) NULL COMMENT '联系电话' AFTER `contacts_name`;
-- ----------------------------
-- 2018-09-14 更新
-- ----------------------------
ALTER TABLE `receive_info`
ADD COLUMN `guard_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '门卫费' AFTER `clean_fee`;
ALTER TABLE `dp_route_load_task_clean_rel`
ADD COLUMN `guard_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '门卫费' AFTER `total_price`;
ALTER TABLE `dp_route_load_task_clean_rel`
ADD COLUMN `actual_guard_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '实际门卫费' AFTER `guard_fee`;
-- ----------------------------
-- 2018-09-14 更新
-- ----------------------------
ALTER TABLE `truck_dispatch`
ADD COLUMN `truck_number`  tinyint(2) NULL DEFAULT 0 COMMENT '板车位数' AFTER `truck_id`;
update truck_dispatch td inner join(select t.id,t1.number from truck_info t left join truck_info t1 on t.rel_id = t1.id ) t on td.truck_id = t.id set td.truck_number = if(isnull(t.number),0,t.number);
-- ----------------------------
-- Table structure for entrust_make_rel
-- ----------------------------
DROP TABLE IF EXISTS `entrust_make_rel`;
CREATE TABLE `entrust_make_rel` (
  `entrust_id` int(10) NOT NULL COMMENT '委托方ID',
  `make_id` int(10) NOT NULL COMMENT '品牌ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`entrust_id`,`make_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2018-09-21 更新
-- ----------------------------
ALTER TABLE `drive_peccancy`
ADD COLUMN `date_id`  int(4) NULL COMMENT '违章统计时间' AFTER `op_user_id`;
update drive_peccancy set date_id = DATE_FORMAT(created_on,'%Y%m%d');
-- ----------------------------
-- 2018-09-21 更新
-- ----------------------------
ALTER TABLE `drive_exceed_oil`
ADD COLUMN `date_id`  int(4) NULL COMMENT '超油统计时间' AFTER `op_user_id`;
update drive_exceed_oil set date_id = DATE_FORMAT(created_on,'%Y%m%d');
-- ----------------------------
-- Table structure for settle_car
-- ----------------------------
DROP TABLE IF EXISTS `settle_car`;
CREATE TABLE `settle_car` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vin` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '商品车VIN码',
  `entrust_id` int(10) NOT NULL DEFAULT '0' COMMENT '委托方ID',
  `route_start_id` int(10) NOT NULL DEFAULT '0' COMMENT '起始地ID',
  `route_end_id` int(10) NOT NULL DEFAULT '0' COMMENT '目的地ID',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '价格',
  `user_id` int(10) DEFAULT '0' COMMENT '用户ID',
  `upload_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '上传ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `vin` (`vin`,`entrust_id`,`route_start_id`,`route_end_id`) USING BTREE COMMENT '唯一VIN'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2018-11-02 更新
-- ----------------------------
ALTER TABLE `drive_salary`
MODIFY COLUMN `grant_status`  tinyint(1) NOT NULL DEFAULT 2 COMMENT '工资状态(2-未发放,3-已发放)' AFTER `actual_salary`;
-- ----------------------------
-- Table structure for dp_route_task_tmp
-- ----------------------------
DROP TABLE IF EXISTS `dp_route_task_tmp`;
CREATE TABLE `dp_route_task_tmp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL COMMENT '指令调度人ID',
  `truck_id` int(10) NOT NULL COMMENT '货车ID',
  `drive_id` int(10) NOT NULL COMMENT '司机ID',
  `route_id` int(10) DEFAULT '0' COMMENT '线路组合ID',
  `route_start_id` int(10) NOT NULL COMMENT '城市线路ID',
  `route_start` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '起始城市',
  `route_end_id` int(10) NOT NULL COMMENT '目的地ID',
  `route_end` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '目的城市',
  `distance` decimal(10,2) NOT NULL COMMENT '公里数',
  `task_plan_date` datetime DEFAULT NULL COMMENT '任务计划时间',
  `task_start_date` datetime DEFAULT NULL COMMENT '任务起始时间',
  `task_end_date` datetime DEFAULT NULL COMMENT '任务完成时间',
  `date_id` int(4) DEFAULT NULL COMMENT '任务完成统计时间',
  `car_count` int(10) NOT NULL DEFAULT '0' COMMENT '实际装车商品车数量',
  `truck_number` tinyint(2) DEFAULT '0' COMMENT '板车位数',
  `load_flag` tinyint(1) DEFAULT '0' COMMENT '是否满载(0-否,1-是)',
  `task_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '指令状态(1-待接受,2-接受,3执行,4-在途,8-取消安排,9-已完成,10-全部完成)',
  `stat_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '结算状态(1-未结算,2-已结算)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for dp_route_load_task_tmp
-- ----------------------------
DROP TABLE IF EXISTS `dp_route_load_task_tmp`;
CREATE TABLE `dp_route_load_task_tmp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL COMMENT '派发人ID',
  `field_op_id` int(10) DEFAULT NULL COMMENT '现场调度员ID',
  `load_task_type` tinyint(1) DEFAULT '1' COMMENT '调度任务类型(1-始发站出发,2-中转站出发)',
  `demand_id` int(10) NOT NULL COMMENT '调度需求ID',
  `transfer_demand_id` int(10) DEFAULT '0' COMMENT '中转需求ID',
  `dp_route_task_id` int(10) NOT NULL COMMENT '任务路线ID',
  `route_start_id` int(10) NOT NULL COMMENT '城市线路ID',
  `route_start` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '起始城市',
  `base_addr_id` int(10) NOT NULL COMMENT '起始地发货地址ID',
  `addr_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '装车地',
  `route_end_id` int(10) NOT NULL COMMENT '目的地ID',
  `route_end` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '目的城市',
  `receive_id` int(10) NOT NULL COMMENT '经销商ID',
  `short_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '经销商简称',
  `date_id` int(4) NOT NULL COMMENT '指令时间',
  `plan_date` datetime DEFAULT NULL COMMENT '计划装车时间',
  `load_date` datetime DEFAULT NULL COMMENT '装车时间',
  `arrive_date` datetime DEFAULT NULL COMMENT '到达时间',
  `plan_count` int(10) NOT NULL DEFAULT '0' COMMENT '计划派发商品车数量',
  `real_count` int(10) DEFAULT '0' COMMENT '实际装车数量',
  `load_task_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '任务状态(1-未装车,3-已装车,7-已到达,8-取消任务,9-已完成)',
  `transfer_flag` tinyint(1) DEFAULT '0' COMMENT '是否中转标识(0-否,1-是)',
  `transfer_city_id` int(10) DEFAULT '0' COMMENT '中转城市ID',
  `transfer_city` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '中转城市',
  `transfer_addr_id` int(10) DEFAULT '0' COMMENT '中转站装车地ID',
  `transfer_addr_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '中转装车地',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2018-12-07 更新
-- ----------------------------
ALTER TABLE `drive_salary`
ADD COLUMN `remark`  varchar(200) NULL COMMENT '备注' AFTER `actual_salary`;
-- ----------------------------
-- 2018-12-07 更新
-- ----------------------------
ALTER TABLE `settle_car`
ADD COLUMN `distance`  decimal(10,2) NULL DEFAULT 0 COMMENT '公里数' AFTER `route_end_id`,
ADD COLUMN `fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '公里数单价' AFTER `distance`,
ADD COLUMN `plan_price`  decimal(10,2) NULL DEFAULT 0 COMMENT '预计总价' AFTER `fee`;
-- ----------------------------
-- 2018-12-10 更新
-- ----------------------------
ALTER TABLE `settle_car`
ADD COLUMN `settle_status`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '结算状态' AFTER `price`;
-- ----------------------------
-- 2018-12-28 更新
-- ----------------------------
ALTER TABLE `receive_info`
ADD COLUMN `make_id`  int(10) NULL DEFAULT 0 COMMENT '品牌ID' AFTER `city_id`,
ADD COLUMN `make_name`  varchar(50) NULL COMMENT '品牌名称' AFTER `make_id`;

ALTER TABLE `drive_salary`
ADD COLUMN `social_security_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '社保缴费' AFTER `refund_fee`;
-- ----------------------------
-- 2018-12-29 更新
-- ----------------------------
ALTER TABLE `drive_exceed_oil`
ADD COLUMN `exceed_type`  tinyint(1) NULL DEFAULT 1 COMMENT '超量类型(1-油,2-尿素)' AFTER `dp_route_task_id`;
-- ----------------------------
-- 2019-01-07 更新
-- ----------------------------
ALTER TABLE `drive_peccancy`
ADD COLUMN `truck_type`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '车辆类型(1-车头,2-挂车)' AFTER `truck_id`,
ADD COLUMN `traffic_fine`  decimal(10,2) NOT NULL DEFAULT 0 COMMENT '交通罚款' AFTER `fine_score`,
ADD COLUMN `handle_date`  date NULL COMMENT '处理时间' AFTER `end_date`,
ADD COLUMN `address`  varchar(200) NULL COMMENT '违章地点' AFTER `handle_date`;

update drive_peccancy dp left join truck_info t on dp.truck_id = t.id set dp.truck_type = t.truck_type;

-- ----------------------------
-- 2019-01-08 更新
-- ----------------------------
-- ----------------------------
-- Table structure for truck_security_check
-- ----------------------------
DROP TABLE IF EXISTS `truck_security_check`;
CREATE TABLE `truck_security_check` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `truck_id` int(10) NOT NULL DEFAULT '0' COMMENT '货车ID',
  `truck_type` tinyint(1) NOT NULL DEFAULT '1' COMMENT '车辆类型(1-车头,2-挂车)',
  `drive_id` int(10) DEFAULT '0' COMMENT '司机ID',
  `turn` tinyint(1) DEFAULT '0' COMMENT '转向(0-默认,1-未检,2-不合格,3-合格,4-复检合格)',
  `turn_remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '转向备注',
  `braking` tinyint(1) DEFAULT '0' COMMENT '制动',
  `braking_remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `liquid` tinyint(1) DEFAULT '0' COMMENT '液压',
  `liquid_remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lighting` tinyint(1) DEFAULT '0' COMMENT '照明',
  `lighting_remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transmission` tinyint(1) DEFAULT '0' COMMENT '传动',
  `transmission_remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tyre` tinyint(1) DEFAULT '0' COMMENT '轮胎',
  `tyre_remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `suspension` tinyint(1) DEFAULT '0' COMMENT '悬挂',
  `suspension_remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `structure` tinyint(1) DEFAULT '0' COMMENT '车身结构',
  `structure_remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facilities` tinyint(1) DEFAULT '0' COMMENT '随车安全设施(灭火器、危险安全牌)',
  `facilities_remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_device` tinyint(1) DEFAULT '0' COMMENT '主挂连接装置',
  `link_device_remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `check_date` date DEFAULT NULL COMMENT '检查时间',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `check_user_id` int(10) DEFAULT '0' COMMENT '检查人ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2019-01-22 更新
-- ----------------------------
ALTER TABLE `entrust_info`
ADD COLUMN `secret_key`  varchar(50) NULL COMMENT '密钥' AFTER `entrust_name`;
-- ----------------------------
-- 2019-01-28 更新
-- ----------------------------
ALTER TABLE `dp_demand_info`
ADD COLUMN `remark`  varchar(200) NULL COMMENT '备注' AFTER `demand_status`;
-- ----------------------------
-- 2019-01-29 更新
-- ----------------------------
ALTER TABLE `truck_brand`
ADD COLUMN `load_distance_oil`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '重载油量' AFTER `brand_name`,
ADD COLUMN `no_load_distance_oil`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '空载油量' AFTER `load_distance_oil`;
-- ----------------------------
-- 2019-01-30 更新
-- ----------------------------
ALTER TABLE `entrust_contacts`
ADD COLUMN `contacts_status`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '联系人状态' AFTER `tel`;
-- ----------------------------
-- 2019-02-20 更新
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_update_load_task`;
DELIMITER ;;
CREATE TRIGGER `trg_update_load_task` AFTER UPDATE ON `dp_route_load_task` FOR EACH ROW BEGIN
IF(new.load_task_status=8 && old.load_task_status<>8 && old.transfer_flag =1) THEN
UPDATE dp_demand_info set plan_count=plan_count-old.plan_count where id= new.demand_id ;
UPDATE dp_task_stat set plan_count = plan_count-old.plan_count,transfer_count = transfer_count -old.plan_count
where route_start_id=new.route_start_id and base_addr_id=new.base_addr_id and route_end_id = new.route_end_id
and receive_id=new.receive_id and date_id = new.date_id;
UPDATE dp_transfer_demand_info set plan_count=plan_count-old.plan_count where id= new.transfer_demand_id ;
ELSEIF(new.load_task_status=8 && old.load_task_status<>8) THEN
UPDATE dp_demand_info set plan_count=plan_count-old.plan_count where id= new.demand_id ;
UPDATE dp_task_stat set plan_count = plan_count-old.plan_count
where route_start_id=new.route_start_id
and base_addr_id=new.base_addr_id and route_end_id = new.route_end_id and receive_id=new.receive_id and date_id = new.date_id;
IF(new.load_task_type=2) THEN
UPDATE dp_transfer_demand_info set plan_count=plan_count-new.plan_count where id= new.transfer_demand_id ;
END IF;
END IF;
IF(new.load_task_status=3 && old.load_task_status<>3) THEN
UPDATE dp_route_task set task_status=4
where (select count(*) from dp_route_load_task where load_task_status <>3 and load_task_status<>8 and dp_route_task_id = old.dp_route_task_id ) =0 and id= old.dp_route_task_id;
UPDATE dp_demand_info set plan_count = plan_count+(new.real_count-old.plan_count) where id = new.demand_id and route_start_id=new.route_start_id
and base_addr_id=new.base_addr_id and route_end_id = new.route_end_id and receive_id=new.receive_id and date_id = new.date_id;
UPDATE dp_task_stat set plan_count = plan_count+(new.real_count-old.plan_count) where route_start_id=new.route_start_id and base_addr_id=new.base_addr_id
and route_end_id = new.route_end_id and receive_id=new.receive_id and date_id = new.date_id;
IF(old.transfer_flag =1) THEN
UPDATE dp_task_stat set transfer_count = transfer_count+(new.real_count-old.plan_count)
where route_start_id=new.route_start_id and base_addr_id=new.base_addr_id and route_end_id = new.route_end_id
and receive_id=new.receive_id and date_id = new.date_id;
END IF;
END IF;
IF(new.load_task_status=7 && old.load_task_status<>7) THEN
UPDATE dp_route_task set task_status=10
where id = old.dp_route_task_id and task_status =9 and
(select count(*) from dp_route_load_task where load_task_status <>7 and load_task_status<>8 and dp_route_task_id = old.dp_route_task_id ) =0 ;
END IF;
END
;;
DELIMITER ;
-- ----------------------------
-- 2019-02-20 更新
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_update_route_task`;
DELIMITER ;;
CREATE TRIGGER `trg_update_route_task` BEFORE UPDATE ON `dp_route_task` FOR EACH ROW BEGIN
IF(new.task_status=4 && old.task_status<>4) THEN
UPDATE truck_dispatch set current_city= 0 , task_start = old.route_start_id ,task_end=old.route_end_id
where truck_id=old.truck_id ;
set new.car_count = (select car_count from truck_dispatch where truck_id = old.truck_id);
END IF;
END
;;
DELIMITER ;
-- ----------------------------
-- 2019-02-22 更新
-- ----------------------------
ALTER TABLE `car_info`
DROP INDEX `vin` ,
ADD UNIQUE INDEX `vin` (`vin`, `route_start_id`, `base_addr_id`, `entrust_id`, `route_end_id`, `receive_id`) USING BTREE COMMENT '唯一VIN';
-- ----------------------------
-- 2019-02-26 更新
-- ----------------------------
ALTER TABLE `dp_route_task_loan`
ADD COLUMN `grant_hotel_cost`  decimal(10,2) NULL DEFAULT 0 COMMENT '发放住宿费' AFTER `grant_taxi_cost`,
ADD COLUMN `grant_car_cost`  decimal(10,2) NULL DEFAULT 0 COMMENT '发放商品车费用' AFTER `grant_hotel_cost`,
ADD COLUMN `refund_hotel_cost`  decimal(10,2) NULL DEFAULT 0 COMMENT '报销住宿费' AFTER `refund_taxi_cost`,
ADD COLUMN `refund_car_cost`  decimal(10,2) NULL DEFAULT 0 COMMENT '报销商品车费用' AFTER `refund_hotel_cost`;

ALTER TABLE `car_info`
ADD COLUMN `ship_name`  varchar(40) NULL COMMENT '船名' AFTER `order_date_id`;
-- ----------------------------
-- 2019-02-27 更新
-- ----------------------------
ALTER TABLE `dp_route_task_loan`
ADD COLUMN `refund_enter_cost`  decimal(10,2) NULL DEFAULT 0 COMMENT '报销进门费用' AFTER `refund_car_cost`,
ADD COLUMN `refund_run_cost`  decimal(10,2) NULL DEFAULT 0 COMMENT '报销地跑费用' AFTER `refund_enter_cost`,
ADD COLUMN `refund_trailer_cost`  decimal(10,2) NULL DEFAULT 0 COMMENT '报销拖车费用' AFTER `refund_run_cost`,
ADD COLUMN `refund_repair_cost`  decimal(10,2) NULL DEFAULT 0 COMMENT '报销维修配件费用' AFTER `refund_trailer_cost`,
ADD COLUMN `refund_care_cost`  decimal(10,2) NULL DEFAULT 0 COMMENT '报销保养费用' AFTER `refund_repair_cost`;

insert into damage_type (id,name ) values ( 7,'买断车' );
insert into damage_type (id,name ) values ( 8,'退库车' );
-- ----------------------------
-- 2019-03-05 更新
-- ----------------------------
ALTER TABLE `damage_info`
ADD COLUMN `hang_status`  tinyint(1) NULL DEFAULT 0 COMMENT '挂起状态' AFTER `damage_status`;

ALTER TABLE `drive_peccancy`
ADD COLUMN `buy_score`  decimal(10,2) NULL DEFAULT 0 COMMENT '买分金额' AFTER `fine_score`,
ADD COLUMN `city_id`  int(10) NULL DEFAULT 0 COMMENT '城市ID' AFTER `handle_date`,
ADD COLUMN `city_name`  varchar(50) NULL DEFAULT NULL COMMENT '城市名称' AFTER `city_id`;
-- ----------------------------
-- 2019-03-06 更新
-- ----------------------------
ALTER TABLE `truck_brand`
ADD COLUMN `urea`  decimal(10,2) NULL DEFAULT 0 COMMENT '尿素' AFTER `no_load_distance_oil`;
-- ----------------------------
-- 2019-03-06 更新
-- ----------------------------
ALTER TABLE `damage_insure`
ADD COLUMN `city_id`  int(10) NULL COMMENT '出险城市ID' AFTER `insure_user_id`,
ADD COLUMN `city_name`  varchar(50) NULL DEFAULT NULL COMMENT '出险城市名称' AFTER `city_id`,
ADD COLUMN `declare_date`  date NULL DEFAULT NULL COMMENT '报案日期' AFTER `city_name`,
ADD COLUMN `liability_type`  tinyint(1) NULL DEFAULT 0 COMMENT '责任判定(1-全责,2-免责,3-五五,4-三七）' AFTER `declare_date`,
ADD COLUMN `ref_remark`  varchar(200) NULL DEFAULT NULL COMMENT '定损员信息' AFTER `liability_type`,
ADD COLUMN `derate_money`  decimal(10,2) NULL DEFAULT 0 COMMENT '免赔金额' AFTER `ref_remark`,
ADD COLUMN `car_valuation`  decimal(10,2) NULL DEFAULT 0 COMMENT '商品车估值' AFTER `derate_money`,
ADD COLUMN `invoice_money`  decimal(10,2) NULL DEFAULT 0 COMMENT '发票金额' AFTER `car_valuation`;
-- ----------------------------
-- 2019-03-13 更新    INSERT追加参数route_id
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_new_car`;
DELIMITER ;;
CREATE TRIGGER `trg_new_car` AFTER INSERT ON `car_info` FOR EACH ROW BEGIN
set @count = (select count(*) from dp_demand_info
where user_id=0 and route_start_id=new.route_start_id and base_addr_id=new.base_addr_id
 and route_end_id = new.route_end_id and receive_id=new.receive_id and date_id = DATE_FORMAT(new.order_date,'%Y%m%d'));
IF(new.route_end_id>0 && new.car_status=1&&new.receive_id>0&&new.order_date is not null && @count=0) THEN
INSERT INTO dp_demand_info(user_id,route_id,route_start_id,route_start,base_addr_id,route_end_id,route_end,receive_id,date_id,pre_count)
VALUES (0,new.route_id,new.route_start_id,new.route_start,new.base_addr_id,new.route_end_id,new.route_end,new.receive_id,DATE_FORMAT(new.order_date,'%Y%m%d'),1);
ELSEIF (new.route_end_id>0 && new.car_status=1&&new.receive_id>0&&new.order_date is not null&&@count>0) THEN
UPDATE dp_demand_info set pre_count=pre_count+1 where user_id=0 and route_start_id=new.route_start_id and base_addr_id=new.base_addr_id
 and route_end_id = new.route_end_id and receive_id=new.receive_id and date_id = DATE_FORMAT(new.order_date,'%Y%m%d');
END IF ;
END
;;
DELIMITER ;

-- ----------------------------
-- 2019-03-19 更新
-- ----------------------------
ALTER TABLE `drive_exceed_oil`
ADD COLUMN `drive_id`  int(10) NOT NULL DEFAULT 0 COMMENT '司机ID' AFTER `remark`,
ADD COLUMN `oil_date`  date NULL COMMENT '核油日期' AFTER `drive_id`,
ADD COLUMN `plan_oil`  decimal(10,2) NULL DEFAULT 0 COMMENT '计划用油量' AFTER `oil_date`,
ADD COLUMN `plan_urea`  decimal(10,2) NULL DEFAULT 0 COMMENT '计划尿素量' AFTER `plan_oil`,
ADD COLUMN `actual_oil`  decimal(10,2) NULL DEFAULT 0 COMMENT '实际用油量' AFTER `plan_urea`,
ADD COLUMN `actual_urea`  decimal(10,2) NULL DEFAULT 0 COMMENT '实际尿素量' AFTER `actual_oil`,
ADD COLUMN `exceed_oil`  decimal(10,2) NULL DEFAULT 0 COMMENT '超油' AFTER `actual_urea`,
ADD COLUMN `exceed_urea`  decimal(10,2) NULL DEFAULT 0 COMMENT '超尿素' AFTER `exceed_oil`,
ADD COLUMN `actual_money`  decimal(10,2) NULL DEFAULT 0 COMMENT '实际超量金额' AFTER `exceed_urea`,
ADD COLUMN `settle_status`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '结算状态(1-未结算,2-已结算)' AFTER `actual_money`;
-- ----------------------------
-- 2019-03-19 更新
-- ----------------------------
ALTER TABLE `drive_exceed_oil`
DROP COLUMN `dp_route_task_id`,
DROP COLUMN `exceed_type`,
DROP COLUMN `exceed_oil_quantity`,
DROP COLUMN `exceed_oil_money`,
DROP COLUMN `fine_status`,
DROP COLUMN `op_user_id`,
DROP COLUMN `date_id`,
DROP COLUMN `remark`,
DROP COLUMN `stat_status`;
-- ----------------------------
-- 2019-03-19 更新
-- ----------------------------
ALTER TABLE `drive_exceed_oil`
ADD COLUMN `date_id`  int(4) NULL COMMENT '核油统计时间' AFTER `oil_date`;
ALTER TABLE `drive_exceed_oil`
ADD COLUMN `oil_status`  tinyint(1) NULL DEFAULT 1 COMMENT '录入状态(1-未完成,2-已完成)' AFTER `actual_money`;
-- ----------------------------
-- 2019-03-19 更新
-- ----------------------------
-- ----------------------------
-- Table structure for dp_route_task_oil_rel
-- ----------------------------
DROP TABLE IF EXISTS `dp_route_task_oil_rel`;
CREATE TABLE `dp_route_task_oil_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dp_route_task_id` int(10) DEFAULT '0' COMMENT '任务路线ID',
  `truck_id` int(10) DEFAULT '0' COMMENT '货车ID',
  `drive_id` int(10) DEFAULT NULL COMMENT '司机ID',
  `route_id` int(10) DEFAULT '0' COMMENT '线路组合ID',
  `route_start_id` int(10) DEFAULT NULL COMMENT '城市线路ID',
  `route_start` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '起始城市',
  `route_end_id` int(10) DEFAULT NULL COMMENT '目的地ID',
  `route_end` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '目的城市',
  `distance` decimal(10,2) DEFAULT '0.00' COMMENT '公里数',
  `load_flag` tinyint(1) DEFAULT '0' COMMENT '是否满载(0-否,1-是)',
  `oil` decimal(10,2) DEFAULT '0.00' COMMENT '百公里油耗',
  `total_oil` decimal(10,2) DEFAULT '0.00' COMMENT '总油量',
  `urea` decimal(10,2) DEFAULT '0.00' COMMENT '尿素',
  `total_urea` decimal(10,2) DEFAULT '0.00' COMMENT '总尿素',
  `settle_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '结算状态(1-未结算,2-已结算)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2019-03-19 更新
-- ----------------------------
-- ----------------------------
-- Table structure for drive_dp_route_task_oil_rel
-- ----------------------------
DROP TABLE IF EXISTS `drive_dp_route_task_oil_rel`;
CREATE TABLE `drive_dp_route_task_oil_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dp_route_task_oil_rel_id` int(10) NOT NULL COMMENT '出车款ID',
  `drive_exceed_oil_id` int(10) NOT NULL COMMENT '调度编号ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `dp_route_task_oil_rel_id` (`dp_route_task_oil_rel_id`,`drive_exceed_oil_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2019-03-21 更新
-- ----------------------------
ALTER TABLE `drive_exceed_oil`
ADD COLUMN `remark`  varchar(200) NULL COMMENT '备注' AFTER `settle_status`;
-- ----------------------------
-- 2019-04-09 更新
-- ----------------------------
ALTER TABLE `dp_route_task`
ADD COLUMN `oil_distance`  decimal(10,2) NULL DEFAULT 0 COMMENT '油耗里程' AFTER `distance`,
ADD COLUMN `oil_load_flag`  tinyint(1) NULL DEFAULT 0 COMMENT '油耗是否满载(0-否,1-是)' AFTER `oil_distance`;
-- ----------------------------
-- 2019-04-09 更新
-- ----------------------------
ALTER TABLE `dp_route_task_tmp`
ADD COLUMN `oil_distance`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '油耗里程' AFTER `distance`,
ADD COLUMN `oil_load_flag`  tinyint(1) NULL DEFAULT 0 COMMENT '油耗是否满载(0-否,1-是)' AFTER `oil_distance`;
-- ----------------------------
-- 2019-04-09 更新
-- ----------------------------
ALTER TABLE `city_info`
ADD COLUMN `city_oil_flag`  tinyint(1) NULL DEFAULT 0 COMMENT '城市是否油补(0-否,1-是)' AFTER `city_name`;
-- ----------------------------
-- 2019-04-09 更新    更新油耗公里数
-- ----------------------------
update dp_route_task set oil_distance = distance,oil_load_flag = load_flag;

-- 2019-04-09 更新    追加经销商大于1 1oil_distance油补30,car_count大于0 oil_load_flag等于重载
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_update_route_task`;
DELIMITER ;;
CREATE TRIGGER `trg_update_route_task` BEFORE UPDATE ON `dp_route_task` FOR EACH ROW BEGIN
IF(new.task_status=4 && old.task_status<>4) THEN
UPDATE truck_dispatch set current_city= 0 , task_start = old.route_start_id ,task_end=old.route_end_id
where truck_id=old.truck_id ;
set new.car_count = (select car_count from truck_dispatch where truck_id = old.truck_id);
IF((select count(dprl.id) from dp_route_load_task dprl left join city_info c on dprl.route_end_id = c.id
where c.city_oil_flag=1 and dprl.route_end_id=old.route_end_id and dprl.load_task_status=3)>1) THEN
set new.oil_distance = old.distance+30;
END IF;
IF((select car_count from truck_dispatch where truck_id = old.truck_id)>0) THEN
set new.oil_load_flag = 1;
END IF;
END IF;
END
;;
DELIMITER ;
-- ----------------------------
-- 2019-04-10 更新
-- ----------------------------
-- ----------------------------
-- Table structure for drive_exceed_oil_rel
-- ----------------------------
DROP TABLE IF EXISTS `drive_exceed_oil_rel`;
CREATE TABLE `drive_exceed_oil_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exceed_oil_id` int(10) NOT NULL DEFAULT '0' COMMENT '超油ID',
  `drive_id` int(10) NOT NULL DEFAULT '0' COMMENT '司机ID',
  `truck_id` int(10) NOT NULL DEFAULT '0' COMMENT '货车ID',
  `oil_date` date DEFAULT NULL COMMENT '加油日期',
  `oil_address` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '加油地址',
  `oil` decimal(10,2) DEFAULT '0.00' COMMENT '油',
  `urea` decimal(10,2) DEFAULT '0.00' COMMENT '尿素',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2019-04-11 更新
-- ----------------------------
ALTER TABLE `drive_exceed_oil_rel`
ADD COLUMN `date_id`  int(4) NULL DEFAULT NULL COMMENT '加油统计时间' AFTER `oil_date`;
