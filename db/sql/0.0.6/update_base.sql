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