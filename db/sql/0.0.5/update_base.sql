-- ----------------------------
-- 2018-01-24 更新
-- ----------------------------
ALTER TABLE `log_base`.`car_info` ADD COLUMN `order_date_id` int(4) AFTER `order_date`;
ALTER TABLE `log_base`.`receive_info` CHANGE COLUMN `clean_fee` `clean_fee` decimal(10,2) DEFAULT 0 COMMENT '洗车费';
ALTER TABLE `log_base`.`dp_route_load_task_clean_rel` ADD COLUMN `dp_route_task_id` int(10) NOT NULL AFTER `id`;
ALTER TABLE `log_base`.`dp_route_load_task_clean_rel` ADD COLUMN `actual_price` decimal(10,2) UNSIGNED COMMENT '实际费用' AFTER `total_price`;

ALTER TABLE `dp_route_load_task_clean_rel`
ADD COLUMN `drive_id`  int(10) NOT NULL COMMENT '司机ID' AFTER `dp_route_load_task_id`;
ADD COLUMN `car_count`  int(10) NULL DEFAULT 0 COMMENT '装车台数' AFTER `actual_price`;
CHANGE COLUMN `collect_status` `status`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '领取状态(0-未通过 ,1-未审核,2-已通过)' AFTER `date_id`;
ADD COLUMN `clean_date`  datetime NULL COMMENT '领取时间' AFTER `drive_user_id`;

ALTER TABLE `damage_insure_rel`
DROP PRIMARY KEY,
ADD PRIMARY KEY (`damage_insure_id`, `damage_id`),
ADD UNIQUE INDEX `id` (`id`) ;

ALTER TABLE `truck_repair_rel`
ADD COLUMN `repair_station_id`  int(10) NULL DEFAULT NULL COMMENT '维修站ID' AFTER `repair_date`,
ADD COLUMN `repair_type`  tinyint(1) NULL DEFAULT NULL COMMENT '维修类型(1-事故,2-非事故)' AFTER `repair_id`;
ADD COLUMN `accident_id`  int(10) NULL COMMENT '事故ID' AFTER `repair_type`;

update car_info set order_date_id = DATE_FORMAT(order_date,'%Y%m%d') where order_date is not null

-- ----------------------------
-- Table structure for damage_type
-- ----------------------------
DROP TABLE IF EXISTS `damage_type`;
CREATE TABLE `damage_type` (
  `id` int(11) NOT NULL,
  `name` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for repair_station_info
-- ----------------------------
DROP TABLE IF EXISTS `repair_station_info`;
CREATE TABLE `repair_station_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `repair_station_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '维修站名称',
  `address` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '详细地址',
  `lng` decimal(10,5) DEFAULT NULL COMMENT '经度',
  `lat` decimal(10,5) DEFAULT NULL COMMENT '纬度',
  `repair_station_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '维修站状态(0-不可用,1-可用)',
  `remark` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `repair_station_name` (`repair_station_name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for truck_accident_info
-- ----------------------------
DROP TABLE IF EXISTS `truck_accident_info`;
CREATE TABLE `truck_accident_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `truck_id` int(10) NOT NULL COMMENT '货车ID',
  `drive_id` int(10) NOT NULL COMMENT '司机ID',
  `dp_route_task_id` int(10) NOT NULL COMMENT '任务路线ID',
  `accident_date` datetime DEFAULT NULL COMMENT '事故时间',
  `address` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '事故地点',
  `lng` decimal(10,5) DEFAULT NULL COMMENT '经度',
  `lat` decimal(10,5) DEFAULT NULL COMMENT '纬度',
  `date_id` int(4) DEFAULT NULL COMMENT '事故申报统计时间',
  `accident_explain` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '事故描述',
  `accident_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '事故状态(1-待处理,2-处理中,3-已处理)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '事故申报时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for truck_accident_check
-- ----------------------------
DROP TABLE IF EXISTS `truck_accident_check`;
CREATE TABLE `truck_accident_check` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `truck_accident_id` int(10) NOT NULL COMMENT '事故编号ID',
  `truck_accident_type` tinyint(1) DEFAULT NULL COMMENT '事故类型(1-一般,2-严重)',
  `under_user_id` int(10) DEFAULT NULL COMMENT '责任人用户ID',
  `under_user_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '责任人用户名称',
  `under_cost` decimal(10,2) DEFAULT '0.00' COMMENT '责任人承担费用',
  `company_cost` decimal(10,2) DEFAULT '0.00' COMMENT '公司承担费用',
  `profit` decimal(10,2) DEFAULT '0.00' COMMENT '盈亏',
  `op_user_id` int(10) DEFAULT NULL COMMENT '处理人用户ID',
  `end_date` datetime DEFAULT NULL COMMENT '处理结束时间',
  `date_id` int(4) DEFAULT NULL COMMENT '处理结束统计时间',
  `remark` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '事故处理时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `truck_accident_id` (`truck_accident_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for truck_accident_insure
-- ----------------------------
DROP TABLE IF EXISTS `truck_accident_insure`;
CREATE TABLE `truck_accident_insure` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `insure_id` int(10) NOT NULL COMMENT '保险公司ID',
  `insure_type` tinyint(1) NOT NULL COMMENT '保险类型(1-交强险,2-商业险,3-货运险)',
  `insure_plan` decimal(10,2) DEFAULT '0.00' COMMENT '保险计划待赔',
  `financial_loan_status` tinyint(1) DEFAULT '0' COMMENT '财务借款状态(0-无,1-有)',
  `financial_loan` decimal(10,2) DEFAULT '0.00' COMMENT '财务借款',
  `insure_actual` decimal(10,2) DEFAULT '0.00' COMMENT '保险实际赔付',
  `payment_explain` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '赔付说明',
  `insure_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '事故保险状态(1-处理中,2-已处理)',
  `completed_date` datetime DEFAULT NULL COMMENT '赔付结束时间',
  `date_id` int(4) DEFAULT NULL COMMENT '赔付结束统计时间',
  `check_explain` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '处理说明',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '保险赔付生成时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for truck_accident_insure_rel
-- ----------------------------
DROP TABLE IF EXISTS `truck_accident_insure_rel`;
CREATE TABLE `truck_accident_insure_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accident_insure_id` int(10) NOT NULL COMMENT '保险赔付ID',
  `accident_id` int(10) NOT NULL COMMENT '事故编号ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`accident_insure_id`,`accident_id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for truck_accident_type
-- ----------------------------
DROP TABLE IF EXISTS `truck_accident_type`;
CREATE TABLE `truck_accident_type` (
  `id` int(11) NOT NULL,
  `name` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `truck_accident_info`
ADD COLUMN `declare_user_id`  int(10) NOT NULL COMMENT '事故申报人' AFTER `id`;
ALTER TABLE `truck_accident_insure`
ADD COLUMN `insure_user_id`  int(10) NULL COMMENT '经办人ID' AFTER `insure_plan`;
-- ----------------------------
-- Table structure for truck_accident_insure_loan
-- ----------------------------
DROP TABLE IF EXISTS `truck_accident_insure_loan`;
CREATE TABLE `truck_accident_insure_loan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accident_insure_id` int(10) NOT NULL COMMENT '理赔编号ID',
  `loan_user_id` int(10) DEFAULT NULL COMMENT '财务借款人ID',
  `loan_money` decimal(10,2) DEFAULT '0.00' COMMENT '借款金额',
  `loan_explain` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '借款说明',
  `loan_date` datetime DEFAULT NULL COMMENT '借款时间',
  `repayment_user_id` int(10) DEFAULT NULL COMMENT '财务还款人ID',
  `repayment_money` decimal(10,2) DEFAULT '0.00' COMMENT '还款金额',
  `repayment_explain` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '还款说明',
  `repayment_date` datetime DEFAULT NULL COMMENT '还款时间',
  `loan_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '借款状态(0-拒绝,1-未借,2-已借,3-已还)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for dp_route_task_loan
-- ----------------------------
DROP TABLE IF EXISTS `dp_route_task_loan`;
CREATE TABLE `dp_route_task_loan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dp_route_task_id` int(10) NOT NULL COMMENT '调度编号ID',
  `apply_user_id` int(10) NOT NULL COMMENT '出车款申请人ID',
  `apply_date` datetime DEFAULT NULL COMMENT '出车款申请时间',
  `apply_explain` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '申请备注',
  `passing_cost` decimal(10,2) DEFAULT '0.00' COMMENT '过路费',
  `fuel_cost` decimal(10,2) DEFAULT '0.00' COMMENT '燃料费',
  `protect_cost` decimal(10,2) DEFAULT '0.00' COMMENT '保道费',
  `penalty_cost` decimal(10,2) DEFAULT '0.00' COMMENT '罚款费',
  `parking_cost` decimal(10,2) DEFAULT '0.00' COMMENT '停车费',
  `taxi_cost` decimal(10,2) DEFAULT '0.00' COMMENT '打车费',
  `plan_money` decimal(10,2) DEFAULT '0.00' COMMENT '应付金额',
  `actual_money` decimal(10,2) DEFAULT '0.00' COMMENT '实际支付金额',
  `grant_user_id` int(10) DEFAULT NULL COMMENT '发放人ID',
  `grant_date` datetime DEFAULT NULL COMMENT '发放时间',
  `grant_explain` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '发放说明',
  `repayment_money` decimal(10,2) DEFAULT '0.00' COMMENT '还款金额',
  `refund_money` decimal(10,2) DEFAULT '0.00' COMMENT '报销金额',
  `refund_user_id` int(10) DEFAULT NULL COMMENT '报销人ID',
  `refund_date` datetime DEFAULT NULL COMMENT '报销时间',
  `refund_explain` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '报销说明',
  `task_loan_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '借款状态(1-未发放,2-已发放,3-已报销)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2018-02-28 更新
-- ----------------------------
ALTER TABLE `damage_insure`
ADD COLUMN `financial_loan_status`  tinyint(1) NULL DEFAULT 0 COMMENT '财务借款状态(0-无,1-有)' AFTER `insure_plan`,
ADD COLUMN `financial_loan`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '财务借款' AFTER `financial_loan_status`,
ADD COLUMN `payment_explain`  varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '赔付说明' AFTER `financial_loan`,
ADD COLUMN `completed_date`  datetime NULL DEFAULT NULL COMMENT '赔付结束时间' AFTER `insure_status`,
ADD COLUMN `check_explain`  varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '处理说明' AFTER `date_id`;
-- ----------------------------
-- 2018-03-01 更新
-- ----------------------------
ALTER TABLE `truck_insure_rel`
ADD COLUMN `insure_explain`  varchar(200) NULL COMMENT '保单说明' AFTER `end_date`,
ADD COLUMN `insure_user_id`  int(10) NULL DEFAULT NULL COMMENT '经办人ID' AFTER `insure_explain`;
-- ----------------------------
-- 2018-03-05 更新
-- ----------------------------
ALTER TABLE `damage_check`
ADD COLUMN `indemnity_status`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '赔款状态1-无需赔款,2-需要赔款)' AFTER `remark`;

-- ----------------------------
-- Table structure for damage_check_indemnity
-- ----------------------------
DROP TABLE IF EXISTS `damage_check_indemnity`;
CREATE TABLE `damage_check_indemnity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `damage_id` int(10) NOT NULL COMMENT '质损编号ID',
  `damage_check_id` int(10) NOT NULL COMMENT '质损处理ID',
  `bank_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '银行号码',
  `bank_user_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '户名',
  `bank_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '开户行',
  `city_id` int(10) NOT NULL COMMENT '所在城市ID',
  `receive_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '经销商名称',
  `plan_money` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '计划赔款金额',
  `apply_user_id` int(10) NOT NULL COMMENT '打款申请人ID',
  `apply_explain` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '申请打款说明',
  `actual_money` decimal(10,2) DEFAULT '0.00' COMMENT '实际打款金额',
  `indemnity_date` datetime DEFAULT NULL COMMENT '打款时间',
  `indemnity_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '赔款状态(1-未打款,2-已打款)',
  `indemnity_explain` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '打款说明',
  `voucher_image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '打款凭证照片',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for damage_insure_loan
-- ----------------------------
DROP TABLE IF EXISTS `damage_insure_loan`;
CREATE TABLE `damage_insure_loan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `damage_insure_id` int(10) NOT NULL COMMENT '质损理赔编号ID',
  `loan_user_id` int(10) DEFAULT NULL COMMENT '财务借款人ID',
  `loan_money` decimal(10,2) DEFAULT '0.00' COMMENT '借款金额',
  `loan_explain` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '借款说明',
  `loan_date` datetime DEFAULT NULL COMMENT '借款时间',
  `repayment_user_id` int(10) DEFAULT NULL COMMENT '财务还款人ID',
  `repayment_money` decimal(10,2) DEFAULT '0.00' COMMENT '还款金额',
  `repayment_explain` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '还款说明',
  `repayment_date` datetime DEFAULT NULL COMMENT '还款时间',
  `loan_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '质损借款状态(0-拒绝,1-未借,2-已借,3-已还)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
