ALTER TABLE `drive_info`
ADD UNIQUE INDEX `tel` (`tel`) ;
ALTER TABLE `dp_route_load_task_detail`
ADD COLUMN `arrive_date`  datetime NULL COMMENT '送达时间' AFTER `vin`;
ADD COLUMN `date_id`  int(4) NULL DEFAULT NULL COMMENT '送达统计时间' AFTER `arrive_date`;
ALTER TABLE `user_info`
ADD COLUMN `avatar_image`  varchar(100) NULL COMMENT '用户头像' AFTER `gender`;
ALTER TABLE `dp_task_stat`
ADD COLUMN `not_plan_count`  int(10) NULL DEFAULT 0 COMMENT '未派发台数' AFTER `plan_count`;
ADD COLUMN `task_stat_status`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '需求统计状态(1-未完成,2-已完成)' AFTER `date_id`;
ALTER TABLE `dp_route_load_task`
ADD COLUMN `field_op_id`  int(10) NULL COMMENT '现场调度员ID' AFTER `user_id`;
ADD COLUMN `plan_date`  datetime NULL COMMENT '计划装车时间' AFTER `date_id`;
ADD COLUMN `real_count`  int(10) NULL DEFAULT 0 COMMENT '实际装车数量' AFTER `plan_count`;
ALTER TABLE `dp_route_load_task_detail`
ADD COLUMN `dp_route_task_id`  int(10) NULL COMMENT '路线ID' AFTER `id`;
ALTER TABLE `dp_demand_info`
ADD COLUMN `plan_count`  int(10) NULL DEFAULT 0 COMMENT '计划派发商品车数量' AFTER `pre_count`;
ADD COLUMN `not_plan_count`  int(10) NULL DEFAULT 0 COMMENT '未派发台数' AFTER `plan_count`,
ADD COLUMN `load_count`  int(10) NULL DEFAULT 0 COMMENT '装车数量' AFTER `not_plan_count`;
ALTER TABLE `receive_info`
ADD COLUMN `clean_fee`  decimal(10,2) NULL COMMENT '洗车费' AFTER `city_id`;
-- ----------------------------
-- Table structure for drive_refuel
-- ----------------------------
DROP TABLE IF EXISTS `drive_refuel`;
CREATE TABLE `drive_refuel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `drive_id` int(10) NOT NULL DEFAULT '0' COMMENT '司机ID',
  `truck_id` int(10) NOT NULL DEFAULT '0' COMMENT '货车ID',
  `date_id` int(4) NOT NULL COMMENT '加油申报统计时间',
  `refuel_date` datetime DEFAULT NULL COMMENT '加油时间',
  `refuel_volume` decimal(10,2) NOT NULL COMMENT '加油量',
  `dp_route_task_id` int(10) DEFAULT NULL COMMENT '路线ID',
  `refuel_address_type` tinyint(1) NOT NULL COMMENT '加油地类别(1-内部加油,2-外部加油)',
  `refuel_address` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '加油详细地址',
  `lng` decimal(10,5) DEFAULT NULL COMMENT '经度',
  `lat` decimal(10,5) DEFAULT NULL COMMENT '纬度',
  `refuel_money` decimal(10,2) DEFAULT NULL COMMENT '加油金额',
  `check_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '审核状态(1-待审核,2-通过,3-拒绝)',
  `check_reason` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '审核拒绝原因',
  `check_user_id` int(10) DEFAULT NULL COMMENT '审核人ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '加油申报时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for car_exception_rel
-- ----------------------------
DROP TABLE IF EXISTS `car_exception_rel`;
CREATE TABLE `car_exception_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `car_id` int(10) NOT NULL COMMENT '商品车ID',
  `exception_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '车辆状态(1-异常,2-正常)',
  `remark` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '异常描述',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for user_device
-- ----------------------------
DROP TABLE IF EXISTS `user_device`;
CREATE TABLE `user_device` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) NOT NULL COMMENT '用户ID',
  `device_token` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '设备标识',
  `version` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '设备版本',
  `app_type` tinyint(1) NOT NULL COMMENT 'app登录类型(1-仓储app,2-车管app,3-调度app,4-司机app)',
  `device_type` tinyint(1) NOT NULL DEFAULT '1' COMMENT '设备类型(1-android,2-ios)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for damage_info
-- ----------------------------
DROP TABLE IF EXISTS `damage_info`;
CREATE TABLE `damage_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `declare_user_id` int(10) NOT NULL COMMENT '质损申报人',
  `car_id` int(10) NOT NULL COMMENT '商品车ID',
  `truck_id` int(10) DEFAULT NULL COMMENT '货车ID',
  `truck_num` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '货车牌号',
  `drive_id` int(10) DEFAULT NULL COMMENT '司机ID',
  `drive_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '司机姓名',
  `date_id` int(4) NOT NULL COMMENT '质损申报统计时间',
  `damage_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '质损状态(1-待处理,2-处理中,3-已处理)',
  `damage_explain` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '质损说明',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '质损申报时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for damage_check
-- ----------------------------
DROP TABLE IF EXISTS `damage_check`;
CREATE TABLE `damage_check` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `damage_id` int(10) NOT NULL COMMENT '质损编号ID',
  `under_user_id` int(10) DEFAULT NULL COMMENT '责任人用户ID',
  `under_user_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `damage_type` tinyint(1) DEFAULT NULL COMMENT '质损类型(1-一般质损,2-严重质损)',
  `damage_link_type` tinyint(1) DEFAULT NULL COMMENT '质损环节类别(1-短驳移库,2-公路运输,3-公司运输,4-驾驶员漏检,5-交通事故)',
  `refund_user_id` int(10) DEFAULT NULL COMMENT '报销人用户ID',
  `refund_user_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reduction_cost` decimal(10,2) DEFAULT NULL COMMENT '降价费',
  `penalty_cost` decimal(10,2) DEFAULT NULL COMMENT '罚款',
  `profit` decimal(10,2) DEFAULT NULL COMMENT '盈亏',
  `repair_id` int(10) DEFAULT NULL COMMENT '维修站ID',
  `repair_cost` decimal(10,2) DEFAULT NULL COMMENT '维修费',
  `transport_cost` decimal(10,2) DEFAULT NULL COMMENT '运费',
  `under_cost` decimal(10,2) DEFAULT NULL COMMENT '责任人承担费用',
  `company_cost` decimal(10,2) DEFAULT NULL COMMENT '公司承担费用',
  `op_user_id` int(10) DEFAULT NULL COMMENT '处理人用户ID',
  `date_id` int(4) DEFAULT NULL COMMENT '处理结束时间',
  `remark` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '质损处理时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `damage_id` (`damage_id`) USING BTREE COMMENT '唯一质损编号'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for damage_insure
-- ----------------------------
DROP TABLE IF EXISTS `damage_insure`;
CREATE TABLE `damage_insure` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `damage_insure_id` int(10) NOT NULL COMMENT '保险赔付ID',
  `insure_user_id` int(10) NOT NULL COMMENT '经办人',
  `insure_plan` decimal(10,2) DEFAULT NULL COMMENT '保险计划待赔',
  `insure_actual` decimal(10,2) DEFAULT NULL COMMENT '保险实际赔付',
  `insure_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '质损保险状态(1-未完结,2-已完结)',
  `date_id` int(4) DEFAULT NULL COMMENT '办理保险赔付统计时间',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '办理保险赔付时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for damage_insure_rel
-- ----------------------------
DROP TABLE IF EXISTS `damage_insure_rel`;
CREATE TABLE `damage_insure_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `insure_id` int(10) NOT NULL COMMENT '保险公司ID',
  `damage_id` int(10) NOT NULL COMMENT '质损编号ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for dp_route_load_task_clean_rel
-- ----------------------------
DROP TABLE IF EXISTS `dp_route_load_task_clean_rel`;
CREATE TABLE `dp_route_load_task_clean_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dp_route_load_task_id` int(10) NOT NULL COMMENT '路线任务ID',
  `truck_id` int(10) NOT NULL COMMENT '货车ID',
  `receive_id` int(10) NOT NULL COMMENT '经销商ID',
  `single_price` decimal(10,2) DEFAULT NULL COMMENT '洗车单价',
  `total_price` decimal(10,2) DEFAULT NULL COMMENT '洗车总价',
  `grant_user_id` int(10) DEFAULT NULL COMMENT '发放人',
  `drive_user_id` int(10) DEFAULT NULL COMMENT '领取人司机',
  `date_id` int(4) DEFAULT NULL COMMENT '领取时间',
  `collect_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '领取状态(1-未审核,2-已通过,3-未领取,4-已领取)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;