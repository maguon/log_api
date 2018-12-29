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
DELIMITER ;;
CREATE TRIGGER `trg_new_demand_stat` AFTER INSERT ON `dp_demand_info` FOR EACH ROW INSERT INTO
dp_task_stat(route_start_id,route_start,base_addr_id,addr_name,route_end_id,route_end,receive_id,short_name,date_id,pre_count)
VALUES (new.route_start_id,new.route_start,new.base_addr_id,new.addr_name,new.route_end_id,new.route_end,new.receive_id,new.short_name,new.date_id,new.pre_count)
ON DUPLICATE KEY UPDATE pre_count = pre_count+ new.pre_count ,task_stat_status=1;
;;
DELIMITER ;
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
ADD COLUMN `exceed_type`  tinyint(1) NULL DEFAULT 0 COMMENT '超量类型(1-超油,2-超尿素)' AFTER `dp_route_task_id`;
