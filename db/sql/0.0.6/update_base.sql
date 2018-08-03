-- ----------------------------
-- Table structure for dp_route_task_loan
-- ----------------------------
DROP TABLE IF EXISTS `dp_route_task_loan`;
CREATE TABLE `dp_route_task_loan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `drive_id` int(10) NOT NULL COMMENT '司机ID',
  `apply_passing_cost` decimal(10,2) DEFAULT '0.00' COMMENT '申请过路费',
  `apply_fuel_cost` decimal(10,2) DEFAULT '0.00' COMMENT '申请燃料费',
  `apply_protect_cost` decimal(10,2) DEFAULT '0.00' COMMENT '申请保道费',
  `apply_penalty_cost` decimal(10,2) DEFAULT '0.00' COMMENT '申请罚款费',
  `apply_parking_cost` decimal(10,2) DEFAULT '0.00' COMMENT '申请停车费',
  `apply_taxi_cost` decimal(10,2) DEFAULT '0.00' COMMENT '申请打车费',
  `apply_explain` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '申请备注',
  `apply_plan_money` decimal(10,2) DEFAULT '0.00' COMMENT '申请应付金额',
  `apply_user_id` int(10) NOT NULL DEFAULT '0' COMMENT '出车款申请人ID',
  `apply_date` datetime DEFAULT NULL COMMENT '出车款申请时间',
  `grant_passing_cost` decimal(10,2) DEFAULT '0.00' COMMENT '发放过路费',
  `grant_fuel_cost` decimal(10,2) DEFAULT '0.00' COMMENT '发放燃料费',
  `grant_protect_cost` decimal(10,2) DEFAULT '0.00' COMMENT '发放保道费',
  `grant_penalty_cost` decimal(10,2) DEFAULT '0.00' COMMENT '发放罚款费',
  `grant_parking_cost` decimal(10,2) DEFAULT '0.00' COMMENT '发放停车费',
  `grant_taxi_cost` decimal(10,2) DEFAULT '0.00' COMMENT '发放打车费',
  `grant_explain` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '发放说明',
  `grant_actual_money` decimal(10,2) DEFAULT '0.00' COMMENT '发放实际金额',
  `grant_user_id` int(10) DEFAULT '0' COMMENT '发放人ID',
  `grant_date` datetime DEFAULT NULL COMMENT '发放时间',
  `refund_passing_cost` decimal(10,2) DEFAULT '0.00' COMMENT '报销过路费',
  `refund_fuel_cost` decimal(10,2) DEFAULT '0.00' COMMENT '报销燃料费',
  `refund_protect_cost` decimal(10,2) DEFAULT '0.00' COMMENT '报销保道费',
  `refund_penalty_cost` decimal(10,2) DEFAULT '0.00' COMMENT '报销罚款费',
  `refund_parking_cost` decimal(10,2) DEFAULT '0.00' COMMENT '报销停车费',
  `refund_taxi_cost` decimal(10,2) DEFAULT '0.00' COMMENT '报销打车费',
  `refund_explain` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '报销说明',
  `refund_actual_money` decimal(10,2) DEFAULT '0.00' COMMENT '报销实际金额',
  `refund_user_id` int(10) DEFAULT '0' COMMENT '报销人ID',
  `refund_date` datetime DEFAULT NULL COMMENT '报销时间',
  `date_id` int(4) DEFAULT NULL COMMENT '报销统计时间',
  `repayment_money` decimal(10,2) DEFAULT '0.00' COMMENT '还款金额',
  `profit` decimal(10,2) DEFAULT '0.00' COMMENT '盈亏',
  `task_loan_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '发放状态(0-取消,1-未发放,2-已发放,3-已报销)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for dp_route_task_loan_rel
-- ----------------------------
DROP TABLE IF EXISTS `dp_route_task_loan_rel`;
CREATE TABLE `dp_route_task_loan_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dp_route_task_loan_id` int(10) NOT NULL COMMENT '出车款ID',
  `dp_route_task_id` int(10) NOT NULL COMMENT '调度编号ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`dp_route_task_loan_id`,`dp_route_task_id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2018-03-30 更新
-- ----------------------------
ALTER TABLE `dp_route_task_loan_rel`
DROP PRIMARY KEY,
ADD UNIQUE INDEX `dp_route_task_id` (`dp_route_task_id`) USING BTREE ;
-- ----------------------------
-- 2018-04-04 更新
-- ----------------------------
ALTER TABLE `damage_check_indemnity`
ADD COLUMN `date_id`  int(4) NULL DEFAULT NULL COMMENT '打款统计时间' AFTER `indemnity_date`;
-- ----------------------------
-- 2018-04-08 更新
-- ----------------------------
ALTER TABLE `damage_insure_loan`
ADD COLUMN `date_id`  int(4) NULL DEFAULT NULL COMMENT '商品车借款统计时间' AFTER `loan_date`;
ALTER TABLE `truck_accident_insure_loan`
ADD COLUMN `date_id`  int(4) NULL DEFAULT NULL COMMENT '货车借款统计时间' AFTER `loan_date`;
-- ----------------------------
-- 2018-04-16 更新
-- ----------------------------
ALTER TABLE `dp_route_task`
ADD COLUMN `stat_status`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '结算状态(1-未结算,2-已结算)' AFTER `task_status`;
ALTER TABLE `damage_info`
ADD COLUMN `stat_status`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '结算状态(1-未结算,2-已结算)' AFTER `damage_explain`;
ALTER TABLE `truck_accident_info`
ADD COLUMN `stat_status`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '结算状态(1-未结算,2-已结算)' AFTER `accident_status`;
-- ----------------------------
-- Table structure for drive_salary
-- ----------------------------
DROP TABLE IF EXISTS `drive_salary`;
CREATE TABLE `drive_salary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `month_date_id` int(4) NOT NULL COMMENT '月份',
  `drive_id` int(10) NOT NULL DEFAULT '0' COMMENT '司机ID',
  `truck_id` int(10) NOT NULL DEFAULT '0' COMMENT '货车ID',
  `entrust_id` int(10) DEFAULT NULL COMMENT '委托方ID',
  `load_distance` int(10) DEFAULT NULL COMMENT '重载',
  `no_load_distance` int(10) DEFAULT NULL COMMENT '空载',
  `plan_salary` decimal(10,2) DEFAULT '0.00' COMMENT '应发工资',
  `other_fee` decimal(10,2) DEFAULT NULL COMMENT '其他费用',
  `actual_salary` decimal(10,2) DEFAULT '0.00' COMMENT '实发工资',
  `grant_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '工资状态(1-未结算,2-未发放,3-已发放)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for drive_salary_accident_rel
-- ----------------------------
DROP TABLE IF EXISTS `drive_salary_accident_rel`;
CREATE TABLE `drive_salary_accident_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `drive_salary_id` int(10) NOT NULL COMMENT '司机工资ID',
  `accident_id` int(10) NOT NULL COMMENT '事故编号ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `accident_id` (`accident_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for drive_salary_damage_rel
-- ----------------------------
DROP TABLE IF EXISTS `drive_salary_damage_rel`;
CREATE TABLE `drive_salary_damage_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `drive_salary_id` int(10) NOT NULL COMMENT '司机工资ID',
  `damage_id` int(10) NOT NULL COMMENT '质损编号ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `damage_id` (`damage_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for drive_salary_task_rel
-- ----------------------------
DROP TABLE IF EXISTS `drive_salary_task_rel`;
CREATE TABLE `drive_salary_task_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `drive_salary_id` int(10) NOT NULL COMMENT '司机工资ID',
  `dp_route_task_id` int(10) NOT NULL COMMENT '调度编号ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `dp_route_task_id` (`dp_route_task_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2018-04-24 更新
-- ----------------------------
ALTER TABLE `drive_salary`
DROP PRIMARY KEY,
ADD PRIMARY KEY (`month_date_id`, `drive_id`),
ADD UNIQUE INDEX `id` (`id`) USING BTREE ;
-- ----------------------------
-- 2018-05-07 更新
-- ----------------------------
update receive_info set lng = (SQRT((lng-0.0065)*(lng-0.0065)+(lat-0.006)*(lat-0.006))-0.00002*SIN((lat-0.006)*(3.14159265358979324*3000.0/180.0)))*(COS(ATAN2(lat-0.006,lng-0.0065)-0.000003*COS((lng-0.0065)*(3.14159265358979324*3000.0/180.0))));
update receive_info set lat = (SQRT((lng-0.0065)*(lng-0.0065)+(lat-0.006)*(lat-0.006))-0.00002*SIN((lat-0.006)*(3.14159265358979324*3000.0/180.0)))*(SIN(ATAN2(lat-0.006,lng-0.0065)-0.000003*COS((lng-0.0065)*(3.14159265358979324*3000.0/180.0))));
-- ----------------------------
-- 2018-05-08 更新
-- ----------------------------
update truck_accident_info set lng = (SQRT((lng-0.0065)*(lng-0.0065)+(lat-0.006)*(lat-0.006))-0.00002*SIN((lat-0.006)*(3.14159265358979324*3000.0/180.0)))*(COS(ATAN2(lat-0.006,lng-0.0065)-0.000003*COS((lng-0.0065)*(3.14159265358979324*3000.0/180.0))));
update truck_accident_info set lat = (SQRT((lng-0.0065)*(lng-0.0065)+(lat-0.006)*(lat-0.006))-0.00002*SIN((lat-0.006)*(3.14159265358979324*3000.0/180.0)))*(SIN(ATAN2(lat-0.006,lng-0.0065)-0.000003*COS((lng-0.0065)*(3.14159265358979324*3000.0/180.0))));

update base_addr set lng = (SQRT((lng-0.0065)*(lng-0.0065)+(lat-0.006)*(lat-0.006))-0.00002*SIN((lat-0.006)*(3.14159265358979324*3000.0/180.0)))*(COS(ATAN2(lat-0.006,lng-0.0065)-0.000003*COS((lng-0.0065)*(3.14159265358979324*3000.0/180.0))));
update base_addr set lat = (SQRT((lng-0.0065)*(lng-0.0065)+(lat-0.006)*(lat-0.006))-0.00002*SIN((lat-0.006)*(3.14159265358979324*3000.0/180.0)))*(SIN(ATAN2(lat-0.006,lng-0.0065)-0.000003*COS((lng-0.0065)*(3.14159265358979324*3000.0/180.0))));
-- ----------------------------
-- 2018-06-07 更新
-- ----------------------------
ALTER TABLE `car_info`
MODIFY COLUMN `route_start_id`  int(10) NOT NULL COMMENT '起始地ID' AFTER `model_name`,
MODIFY COLUMN `base_addr_id`  int(10) NOT NULL COMMENT '起始地发货地址ID' AFTER `route_start`,
MODIFY COLUMN `route_end_id`  int(10) NOT NULL COMMENT '目的地ID' AFTER `base_addr_id`,
MODIFY COLUMN `receive_id`  int(10) NOT NULL DEFAULT 0 COMMENT '经销商ID' AFTER `route_end`,
MODIFY COLUMN `entrust_id`  int(10) NOT NULL DEFAULT 0 COMMENT '委托方ID' AFTER `receive_id`,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`vin`, `route_start_id`, `base_addr_id`,`entrust_id`),
DROP INDEX `vin` ,
ADD UNIQUE INDEX `id` (`id`) USING BTREE COMMENT '唯一VIN';
-- ----------------------------
-- 2018-08-02 更新
-- ----------------------------
ALTER TABLE `log_base`.`car_info`
DROP PRIMARY KEY,
ADD PRIMARY KEY (`id`),
DROP INDEX `id`,
ADD UNIQUE `vin` USING BTREE (`vin`, `route_start_id`, `base_addr_id`, `entrust_id`) COMMENT '唯一VIN';
