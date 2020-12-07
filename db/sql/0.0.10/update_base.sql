-- ----------------------------
-- 2019-05-13 更新
-- ----------------------------
ALTER TABLE `truck_info`
ADD COLUMN `output_company_id`  int(10) NULL DEFAULT 0 COMMENT '产值公司' AFTER `company_id`,
ADD COLUMN `output_company_name`  varchar(50) NULL DEFAULT NULL COMMENT '产值公司名称' AFTER `output_company_id`;
-- ----------------------------
-- 2019-05-13 更新
-- ----------------------------
ALTER TABLE `city_route_info`
ADD COLUMN `reverse_money`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '倒板金额' AFTER `protect_fee`;
-- ----------------------------
-- 2019-05-13 更新
-- ----------------------------
ALTER TABLE `drive_info`
ADD COLUMN `bank_number`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '账号' AFTER `sib_tel`,
ADD COLUMN `bank_name`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '开户行' AFTER `bank_number`,
ADD COLUMN `bank_user_name`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '户名' AFTER `bank_name`;
-- ----------------------------
-- 2019-05-13 更新
-- ----------------------------
-- ----------------------------
-- Table structure for drive_work
-- ----------------------------
DROP TABLE IF EXISTS `drive_work`;
CREATE TABLE `drive_work` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `drive_id` int(10) NOT NULL DEFAULT '0' COMMENT '司机ID',
  `drive_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '司机姓名',
  `truck_id` int(10) DEFAULT '0' COMMENT '货车ID',
  `truck_num` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '货车牌号',
  `mobile` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名(手机号)',
  `y_month` int(4) NOT NULL DEFAULT '0' COMMENT '月份',
  `social_security_fee` decimal(10,2) DEFAULT '0.00' COMMENT '社保费',
  `work_count` int(10) DEFAULT '0' COMMENT '出勤天数',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2019-05-13 更新
-- ----------------------------
-- ----------------------------
-- Table structure for car_vin_match
-- ----------------------------
DROP TABLE IF EXISTS `car_vin_match`;
CREATE TABLE `car_vin_match` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vin` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'VIN码匹配',
  `make_id` int(10) DEFAULT '0' COMMENT '品牌ID',
  `make_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '品牌名称',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `vin` (`vin`,`make_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2019-05-13 更新
-- ----------------------------
ALTER TABLE `car_info`
ADD COLUMN `size_type`  tinyint(1) NULL DEFAULT 0 COMMENT '大小车类型(0-小车,1-大车)' AFTER `port_time`;
-- ----------------------------
-- 2019-05-13 更新
-- ----------------------------
ALTER TABLE `truck_info`
ADD COLUMN `operate_type`  tinyint(1) NULL DEFAULT NULL COMMENT '所属类型(1-自营,2-外协,3-供方,4-承包)' AFTER `vice_drive_id`;
-- ----------------------------
-- 2019-05-13 更新
-- ----------------------------
update truck_info set operate_type = 1;
-- ----------------------------
-- 2019-05-13 更新
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_new_car_size_type`;
DELIMITER ;;
CREATE TRIGGER `trg_update_car_size_type` BEFORE INSERT ON `car_info` FOR EACH ROW BEGIN
set @count =(select count(id) from car_vin_match where make_id = new.make_id and vin = substring(new.vin,4,5));
IF(@count>0) THEN
set new.size_type = 1;
ELSEIF(@count=0) THEN
set new.size_type = 0;
END IF;
END
;;
DELIMITER ;
-- ----------------------------
-- 2019-05-13 更新
-- ----------------------------
ALTER TABLE `dp_route_task`
ADD COLUMN `up_distance_count`  int(10) NULL DEFAULT 0 COMMENT '修改里程次数' AFTER `stat_status`;
-- ----------------------------
-- 2019-05-14 更新
-- ----------------------------
ALTER TABLE `drive_info`
ADD COLUMN `operate_type`  tinyint(1) NULL DEFAULT NULL COMMENT '所属类型(1-自营,2-外协,3-供方,4-承包)' AFTER `tel`;
-- ----------------------------
-- 2019-05-14 更新
-- ----------------------------
update drive_info set operate_type = 1;
-- ----------------------------
-- 2019-05-14 更新
-- ----------------------------
ALTER TABLE `truck_repair_rel`
ADD COLUMN `parts_money`  decimal(10,2) NULL DEFAULT 0 COMMENT '配件金额' AFTER `repair_money`,
ADD COLUMN `maintain_money`  decimal(10,2) NULL DEFAULT 0 COMMENT '保养金额' AFTER `parts_money`;
-- ----------------------------
-- 2019-05-14 更新
-- ----------------------------
ALTER TABLE `drive_work`
ADD COLUMN `hotel_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '住宿费' AFTER `work_count`;
-- ----------------------------
-- 2019-05-14 更新
-- ----------------------------
ALTER TABLE `city_route_info`
DROP COLUMN `protect_fee`;
-- ----------------------------
-- 2019-05-14 更新
-- ----------------------------
ALTER TABLE `receive_info`
DROP COLUMN `guard_fee`;
-- ----------------------------
-- 2019-05-14 更新
-- ----------------------------
ALTER TABLE `receive_info`
ADD COLUMN `big_clean_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '大车洗车费' AFTER `clean_fee`;
-- ----------------------------
-- 2019-05-14 更新
-- ----------------------------
update receive_info set big_clean_fee = clean_fee;
-- ----------------------------
-- 2019-05-14 更新
-- ----------------------------
ALTER TABLE `receive_info`
ADD COLUMN `trailer_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '拖车费' AFTER `big_clean_fee`;
-- ----------------------------
-- 2019-05-14 更新
-- ----------------------------
ALTER TABLE `entrust_info`
ADD COLUMN `car_parking_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '商品车停车费' AFTER `secret_key`;
-- ----------------------------
-- 2019-05-14 更新
-- ----------------------------
ALTER TABLE `receive_info`
ADD COLUMN `receive_flag`  tinyint(1) NULL DEFAULT 0 COMMENT '是否为库(0-非库,1-是库)' AFTER `trailer_fee`;
-- ----------------------------
-- 2019-05-14 更新
-- ----------------------------
ALTER TABLE `dp_route_load_task_clean_rel`
CHANGE COLUMN `single_price` `small_single_price`  decimal(10,2) NULL DEFAULT NULL COMMENT '小车洗车单价' AFTER `receive_id`,
ADD COLUMN `big_single_price`  decimal(10,2) NULL DEFAULT NULL COMMENT '大车洗车单价' AFTER `small_single_price`,
ADD COLUMN `small_car_count`  int(10) NULL DEFAULT 0 COMMENT '小车台数' AFTER `big_single_price`,
ADD COLUMN `big_car_count`  int(10) NULL DEFAULT 0 COMMENT '大车台数' AFTER `small_car_count`;
-- ----------------------------
-- 2019-05-14 更新
-- ----------------------------
ALTER TABLE `dp_route_load_task_clean_rel`
ADD COLUMN `trailer_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '拖车费' AFTER `big_car_count`;
-- ----------------------------
-- 2019-05-14 更新
-- ----------------------------
ALTER TABLE `dp_route_load_task_clean_rel`
ADD COLUMN `total_trailer_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '总拖车费' AFTER `trailer_fee`;
-- ----------------------------
-- 2019-05-15 更新
-- ----------------------------
ALTER TABLE `dp_route_load_task_clean_rel`
ADD COLUMN `car_parking_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '商品车停车费' AFTER `total_trailer_fee`;
-- ----------------------------
-- 2019-05-15 更新
-- ----------------------------
ALTER TABLE `drive_exceed_oil_rel`
ADD COLUMN `oil_single_price`  decimal(10,2) NULL DEFAULT 0 COMMENT '油单价' AFTER `urea`,
ADD COLUMN `urea_single_price`  decimal(10,2) NULL DEFAULT 0 COMMENT '尿素单价' AFTER `oil_single_price`,
ADD COLUMN `urea_money`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '加油金额' AFTER `oil_money`;
-- ----------------------------
-- 2019-05-16 更新
-- ----------------------------
ALTER TABLE `truck_insure_rel`
ADD COLUMN `tax_money`  decimal(10,2) NULL DEFAULT 0 COMMENT '税金额' AFTER `insure_money`,
ADD COLUMN `total_money`  decimal(10,2) NULL DEFAULT 0 COMMENT '合计金额' AFTER `tax_money`;
-- ----------------------------
-- 2019-05-16 更新
-- ----------------------------
ALTER TABLE `dp_route_load_task_detail`
ADD UNIQUE INDEX `car_id` (`dp_route_load_task_id`, `car_id`) USING BTREE ;
-- ----------------------------
-- 2019-05-16 更新
-- ----------------------------
ALTER TABLE `truck_brand`
ADD COLUMN `load_reverse_oil`  decimal(10,2) NULL DEFAULT 0 COMMENT '重载倒板油量' AFTER `urea`,
ADD COLUMN `no_load_reverse_oil`  decimal(10,2) NULL DEFAULT 0 COMMENT '空载倒板油量' AFTER `load_reverse_oil`;
-- ----------------------------
-- 2019-05-16 更新
-- ----------------------------
update truck_brand set load_reverse_oil = load_distance_oil , no_load_reverse_oil = no_load_distance_oil;
-- ----------------------------
-- 2019-05-16 更新
-- ----------------------------
ALTER TABLE `dp_route_task_oil_rel`
ADD COLUMN `reverse_oil`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '倒板油量' AFTER `total_urea`,
ADD COLUMN `total_reverse_oil`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '总倒板油量' AFTER `reverse_oil`;
-- ----------------------------
-- 2019-05-16 更新
-- ----------------------------
ALTER TABLE `dp_route_load_task`
ADD COLUMN `receive_flag`  tinyint(1) NULL DEFAULT 0 COMMENT '是否为库(0-非库,1-是库)' AFTER `short_name`;
-- ----------------------------
-- 2019-05-16 更新
-- ----------------------------
ALTER TABLE `dp_route_load_task_tmp`
ADD COLUMN `receive_flag`  tinyint(1) NULL DEFAULT 0 COMMENT '是否为库(0-非库,1-是库)' AFTER `short_name`;
-- ----------------------------
-- 2019-05-17 更新
-- ----------------------------
ALTER TABLE `receive_info`
ADD COLUMN `run_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '地跑费' AFTER `trailer_fee`,
ADD COLUMN `lead_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '带路费' AFTER `run_fee`;
-- ----------------------------
-- 2019-05-17 更新
-- ----------------------------
ALTER TABLE `dp_route_load_task_clean_rel`
ADD COLUMN `run_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '地跑费单价' AFTER `car_parking_fee`,
ADD COLUMN `total_run_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '总地跑费' AFTER `run_fee`,
ADD COLUMN `lead_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '带路费' AFTER `total_run_fee`;
-- ----------------------------
-- 2019-05-20 更新
-- ----------------------------
-- ----------------------------
-- Table structure for dp_route_task_fee
-- ----------------------------
DROP TABLE IF EXISTS `dp_route_task_fee`;
CREATE TABLE `dp_route_task_fee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `drive_id` int(10) DEFAULT NULL COMMENT '司机ID',
  `drive_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '司机姓名',
  `truck_id` int(10) DEFAULT NULL COMMENT '货车ID',
  `truck_num` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '货车牌号',
  `day_count` int(4) DEFAULT '0' COMMENT '天数',
  `single_price` decimal(10,2) DEFAULT '0.00' COMMENT '单价',
  `total_price` decimal(10,2) DEFAULT '0.00' COMMENT '总价',
  `status` tinyint(1) DEFAULT '1' COMMENT '发放状态(0-取消 ,1-未发放,2-已发放)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2019-05-20 更新
-- ----------------------------
ALTER TABLE `dp_route_load_task`
ADD COLUMN `output_ratio`  decimal(10,2) NULL DEFAULT 0 COMMENT '产值比例' AFTER `transfer_addr_name`;
-- ----------------------------
-- 2019-05-20 更新 output_ratio产值比例，状态是已送达并且是中转任务
-- ----------------------------
update dp_route_load_task dprl inner join
(select c2.distance/c1.distance as output_ratio,drtt.id from city_route_info c1 ,city_route_info c2 ,
(select concat(LEAST(ddi.route_start_id,ddi.route_end_id),GREATEST(ddi.route_start_id,ddi.route_end_id)) as demand_route_id,
concat(LEAST(drlt.route_start_id,drlt.transfer_city_id),GREATEST(drlt.route_start_id,drlt.transfer_city_id)) as load_route_id,
drlt.id
from dp_route_load_task drlt left join dp_demand_info ddi on drlt.demand_id = ddi.id) drtt
where c1.route_id= drtt.demand_route_id and c2.route_id = drtt.load_route_id) drttl on dprl.id = drttl.id
set dprl.output_ratio = drttl.output_ratio where dprl.load_task_status = 7 and dprl.transfer_flag = 1;
-- ----------------------------
-- 2019-05-20 更新 output_ratio产值比例为1，状态是已送达并且不是中转任务
-- ----------------------------
update dp_route_load_task dprl inner join (select id from dp_route_load_task) drtt on dprl.id = drtt.id
set dprl.output_ratio = 1 where dprl.load_task_status = 7 and dprl.transfer_flag = 0;
-- ----------------------------
-- 2019-05-21 更新
-- ----------------------------
ALTER TABLE `dp_route_task_fee`
ADD COLUMN `car_oil_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '商品车加油费' AFTER `total_price`;
-- ----------------------------
-- 2019-05-21 更新
-- ----------------------------
-- ----------------------------
-- Table structure for truck_depreciation
-- ----------------------------
DROP TABLE IF EXISTS `truck_depreciation`;
CREATE TABLE `truck_depreciation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `drive_id` int(10) DEFAULT '0' COMMENT '司机ID',
  `drive_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '司机姓名',
  `truck_id` int(10) DEFAULT '0' COMMENT '货车ID',
  `truck_num` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '货车牌号',
  `y_month` int(4) DEFAULT '0' COMMENT '月份',
  `depreciation_fee` decimal(10,2) DEFAULT '0.00' COMMENT '折旧费',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `drive_id` (`drive_id`,`truck_id`,`y_month`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2019-05-22 更新
-- ----------------------------
ALTER TABLE `dp_route_task_fee`
ADD COLUMN `grant_date`  datetime NULL DEFAULT NULL COMMENT '发放时间' AFTER `status`,
ADD COLUMN `date_id`  int(4) NULL DEFAULT NULL COMMENT '发放统计时间' AFTER `grant_date`;
-- ----------------------------
-- 2019-05-23 更新
-- ----------------------------
ALTER TABLE `entrust_city_route_rel`
ADD COLUMN `size_type`  tinyint(1) NULL DEFAULT 0 COMMENT '大小车类型(0-小车,1-大车)' AFTER `make_name`;
-- ----------------------------
-- 2019-05-27 更新
-- ----------------------------
ALTER TABLE `drive_exceed_oil_date`
ADD COLUMN `check_status`  tinyint(1) NULL DEFAULT 2 COMMENT '处理状态(2-处理中,3-已处理)' AFTER `actual_money`;
-- ----------------------------
-- 2019-05-28 更新
-- ----------------------------
ALTER TABLE `drive_exceed_oil_date`
ADD COLUMN `surplus_oil`  decimal(10,2) NULL DEFAULT 0 COMMENT '本月结余油量' AFTER `actual_urea_total`,
ADD COLUMN `surplus_urea`  decimal(10,2) NULL DEFAULT 0 COMMENT '本月结余尿素' AFTER `surplus_oil`;
-- ----------------------------
-- 2019-05-28 更新
-- ----------------------------
ALTER TABLE `drive_exceed_oil_date`
ADD COLUMN `subsidy_oil`  decimal(10,2) NULL DEFAULT 0 COMMENT '本次油补助' AFTER `surplus_urea`,
ADD COLUMN `subsidy_urea`  decimal(10,2) NULL DEFAULT 0 COMMENT '本次尿素补助' AFTER `subsidy_oil`;
-- ----------------------------
-- 2019-05-28 更新
-- ----------------------------
ALTER TABLE `drive_exceed_oil_date`
ADD COLUMN `exceed_oil`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '超油' AFTER `subsidy_urea`,
ADD COLUMN `exceed_urea`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '超尿素' AFTER `exceed_oil`;
-- ----------------------------
-- 2019-05-31 更新
-- ----------------------------
-- ----------------------------
-- Table structure for drive_truck_month_value
-- ----------------------------
DROP TABLE IF EXISTS `drive_truck_month_value`;
CREATE TABLE `drive_truck_month_value` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `y_month` int(4) DEFAULT NULL COMMENT '月份',
  `drive_id` int(10) DEFAULT '0' COMMENT '司机ID',
  `drive_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '司机姓名',
  `truck_id` int(10) DEFAULT '0' COMMENT '货车ID',
  `truck_num` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '货车牌号',
  `brand_id` int(10) DEFAULT NULL COMMENT '品牌ID',
  `brand_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '货车品牌',
  `truck_number` tinyint(2) DEFAULT '0' COMMENT '板车位数',
  `operate_type` tinyint(1) DEFAULT NULL COMMENT '所属类型(1-自营,2-外协)',
  `company_id` int(10) DEFAULT '0' COMMENT '所属公司ID',
  `company_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '所属公司名称',
  `output_company_id` int(10) DEFAULT '0' COMMENT '产值公司',
  `output_company_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '产值公司名称',
  `reverse_count` int(10) DEFAULT '0' COMMENT '倒板数',
  `reverse_salary` decimal(10,2) DEFAULT '0.00' COMMENT '倒板工资',
  `load_distance` decimal(10,2) DEFAULT '0.00' COMMENT '重载里程',
  `no_load_distance` decimal(10,2) DEFAULT '0.00' COMMENT '空载里程',
  `distance` decimal(10,2) DEFAULT '0.00' COMMENT '总里程',
  `load_oil_distance` decimal(10,2) DEFAULT '0.00' COMMENT '重载里程油耗',
  `no_oil_distance` decimal(10,2) DEFAULT '0.00' COMMENT '空载里程油耗',
  `receive_car_count` int(10) DEFAULT '0' COMMENT '运送经销商台数',
  `storage_car_count` int(10) DEFAULT '0' COMMENT '运送到库台数',
  `output` decimal(10,2) DEFAULT '0.00' COMMENT '产值收入',
  `insure_fee` decimal(10,2) DEFAULT '0.00' COMMENT '货车保险费',
  `depreciation_fee` decimal(10,2) DEFAULT '0.00' COMMENT '折旧费',
  `distance_salary` decimal(10,2) DEFAULT '0.00' COMMENT '应发里程工资',
  `damage_under_fee` decimal(10,2) DEFAULT '0.00' COMMENT '质损个人承担',
  `damage_company_fee` decimal(10,2) DEFAULT '0.00' COMMENT '质损公司承担',
  `clean_fee` decimal(10,2) DEFAULT '0.00' COMMENT '洗车费',
  `work_count` int(10) DEFAULT '0' COMMENT '出勤天数',
  `hotel_fee` decimal(10,2) DEFAULT '0.00' COMMENT '住宿费',
  `enter_fee` decimal(10,2) DEFAULT '0.00' COMMENT '交车打车进门费',
  `trailer_fee` decimal(10,2) DEFAULT '0.00' COMMENT '拖车费',
  `car_parking_fee` decimal(10,2) DEFAULT '0.00' COMMENT '提车费',
  `run_fee` decimal(10,2) DEFAULT '0.00' COMMENT '地跑费',
  `lead_fee` decimal(10,2) DEFAULT '0.00' COMMENT '带路费',
  `etc_fee` decimal(10,2) DEFAULT '0.00' COMMENT '过路费',
  `oil_fee` decimal(10,2) DEFAULT '0.00' COMMENT '油费',
  `urea_fee` decimal(10,2) DEFAULT '0.00' COMMENT '尿素费',
  `peccancy_under_fee` decimal(10,2) DEFAULT '0.00' COMMENT '违章罚款个人',
  `peccancy_company_fee` decimal(10,2) DEFAULT '0.00' COMMENT '违章罚款公司',
  `repair_fee` decimal(10,2) DEFAULT '0.00' COMMENT '维修',
  `parts_fee` decimal(10,2) DEFAULT '0.00' COMMENT '配件',
  `maintain_fee` decimal(10,2) DEFAULT '0.00' COMMENT '保养',
  `car_oil_fee` decimal(10,2) DEFAULT '0.00' COMMENT '商品车加油',
  `truck_parking_fee` decimal(10,2) DEFAULT '0.00' COMMENT '货车停车费',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `drive_id` (`y_month`,`drive_id`,`truck_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2019-06-03 更新
-- ----------------------------
ALTER TABLE `drive_salary`
ADD COLUMN `distance_salary`  decimal(10,2) NULL DEFAULT 0 COMMENT '里程工资' AFTER `no_load_distance`,
ADD COLUMN `reverse_salary`  decimal(10,2) NULL DEFAULT 0 COMMENT '倒板工资' AFTER `distance_salary`,
ADD COLUMN `enter_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '交车打车进门费' AFTER `reverse_salary`;
-- ----------------------------
-- 2019-06-04 更新
-- ----------------------------
ALTER TABLE `car_info`
MODIFY COLUMN `order_date`  date NULL DEFAULT NULL COMMENT '指令日期' AFTER `entrust_id`;
-- ----------------------------
-- 2019-06-06 更新
-- ----------------------------
insert into dp_route_task_oil_rel(
dp_route_task_id,truck_id,drive_id,route_id,route_start_id,route_start,route_end_id,route_end,oil,total_oil,urea,total_urea)
select drt.id,drt.truck_id,drt.drive_id,drt.route_id,drt.route_start_id,drt.route_start,drt.route_end_id,drt.route_end,
tb.no_load_distance_oil,(drt.oil_distance*tb.no_load_distance_oil/100) total_oil,tb.urea,(drt.oil_distance*tb.urea/100) total_urea
from dp_route_task drt
left join dp_route_task_oil_rel drtor on drt.id = drtor.dp_route_task_id
left join truck_info ti on drt.truck_id = ti.id
left join truck_brand tb on ti.brand_id = tb.id
where drt.task_plan_date>=20190501 and drtor.id is null and drt.task_status=10;
-- ----------------------------
-- 2019-06-10 更新
-- ----------------------------
ALTER TABLE `dp_route_task_fee`
ADD COLUMN `car_day_count`  int(4) NULL DEFAULT 0 COMMENT '商品车停车天数' AFTER `total_price`,
ADD COLUMN `car_single_price`  decimal(10,2) NULL DEFAULT 0 COMMENT '商品车停车费单价' AFTER `car_day_count`,
ADD COLUMN `car_total_price`  decimal(10,2) NULL DEFAULT 0 COMMENT '商品车停车费总价' AFTER `car_single_price`,
ADD COLUMN `remark`  varchar(200) NULL COMMENT '备注' AFTER `date_id`;
-- ----------------------------
-- 2019-06-10 更新
-- ----------------------------
ALTER TABLE `dp_route_task_fee`
ADD COLUMN `dp_route_task_id`  int(10) NULL COMMENT '任务路线ID' AFTER `truck_num`;
-- ----------------------------
-- 2019-06-10 更新
-- ----------------------------
ALTER TABLE `drive_truck_month_value`
ADD COLUMN `car_parking_total_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '商品车停车费' AFTER `car_oil_fee`;
-- ----------------------------
-- 2019-06-11 更新
-- ----------------------------
ALTER TABLE `drive_salary`
ADD COLUMN `damage_under_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '质损个人承担费用' AFTER `plan_salary`,
ADD COLUMN `accident_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '事故费用' AFTER `damage_under_fee`,
ADD COLUMN `peccancy_under_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '违章个人承担费用' AFTER `accident_fee`,
ADD COLUMN `exceed_oil_fee`  varchar(255) NULL DEFAULT 0 COMMENT '超量扣款' AFTER `peccancy_under_fee`;
-- ----------------------------
-- 2019-06-11 更新
-- ----------------------------
ALTER TABLE `user_device`
ADD COLUMN `device_id`  varchar(50) NULL AFTER `user_id`;
-- ----------------------------
-- 2019-06-11 更新
-- ----------------------------
ALTER TABLE `user_device`
MODIFY COLUMN `device_token`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '设备标识' AFTER `device_id`;
-- ----------------------------
-- 2019-06-11 更新
-- ----------------------------
ALTER TABLE `user_device`
ADD UNIQUE INDEX `user_id` (`user_id`, `device_id`, `app_type`) USING BTREE ;
-- ----------------------------
-- 2019-06-14 更新
-- ----------------------------
ALTER TABLE `dp_route_task_oil_rel`
ADD UNIQUE INDEX `dp_route_task_id` (`dp_route_task_id`) USING BTREE ;
-- ----------------------------
-- 2019-06-14 更新
-- ----------------------------
ALTER TABLE `drive_salary`
ADD COLUMN `food_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '伙食费' AFTER `social_security_fee`,
ADD COLUMN `loan_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '个人借款' AFTER `food_fee`,
ADD COLUMN `withhold`  decimal(10,2) NULL DEFAULT 0 COMMENT '暂扣款' AFTER `loan_fee`,
ADD COLUMN `arrears`  decimal(10,2) NULL DEFAULT 0 COMMENT '上月欠款' AFTER `withhold`;
-- ----------------------------
-- 2019-06-20 更新
-- ----------------------------
ALTER TABLE `entrust_city_route_rel`
ADD COLUMN `route_start_id`  int(10) NULL DEFAULT NULL COMMENT '起始地ID' AFTER `make_name`,
ADD COLUMN `route_end_id`  int(10) NULL DEFAULT NULL COMMENT '目的地ID' AFTER `route_start_id`;
-- ----------------------------
-- 2019-06-20 更新
-- ----------------------------
ALTER TABLE `entrust_city_route_rel`
DROP PRIMARY KEY;
-- ----------------------------
-- 2019-06-20 更新
-- ----------------------------
update entrust_city_route_rel set route_start_id = floor(city_route_id/1000) , route_end_id = mod(city_route_id,1000);
-- ----------------------------
-- 2019-06-20 更新
-- ----------------------------
ALTER TABLE `entrust_city_route_rel`
MODIFY COLUMN `route_start_id`  int(10) NOT NULL COMMENT '起始地ID' AFTER `make_name`,
MODIFY COLUMN `route_end_id`  int(10) NOT NULL COMMENT '目的地ID' AFTER `route_start_id`,
ADD PRIMARY KEY (`entrust_id`, `make_id`, `route_start_id`, `route_end_id`);
-- ----------------------------
-- 2019-06-20 更新
-- ----------------------------
insert into entrust_city_route_rel (entrust_id,city_route_id,make_id,make_name,route_start_id,route_end_id,size_type,distance,fee)
select entrust_id,city_route_id,make_id,make_name,route_end_id,route_start_id,size_type,distance,fee
from entrust_city_route_rel where route_start_id !=route_end_id;
-- ----------------------------
-- 2019-06-24 更新    修改经销商大于1,并且car_count大于0 1oil_distance油补30
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_update_route_task`;
DELIMITER ;;
CREATE TRIGGER `trg_update_route_task` BEFORE UPDATE ON `dp_route_task` FOR EACH ROW BEGIN
IF(new.task_status=4 && old.task_status<>4) THEN
UPDATE truck_dispatch set current_city= 0 , task_start = old.route_start_id ,task_end=old.route_end_id
where truck_id=old.truck_id ;
set new.car_count = (select car_count from truck_dispatch where truck_id = old.truck_id);
IF((select count(distinct dprl.receive_id) from dp_route_load_task dprl
left join city_info c on dprl.route_end_id = c.id
where c.city_oil_flag=1 and dprl.route_end_id=old.route_end_id and dprl.load_task_status=3
and dprl.dp_route_task_id=old.id)>1 and new.car_count>0) THEN
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
-- 2019-06-25 更新
-- ----------------------------
ALTER TABLE `dp_route_load_task`
ADD COLUMN `truck_id`  int(10) NULL DEFAULT NULL COMMENT '货车ID' AFTER `field_op_id`,
ADD COLUMN `drive_id`  int(10) NULL DEFAULT NULL COMMENT '司机ID' AFTER `truck_id`;
-- ----------------------------
-- 2019-06-25 更新
-- ----------------------------
ALTER TABLE `dp_route_load_task_tmp`
ADD COLUMN `truck_id`  int(10) NULL DEFAULT NULL COMMENT '货车ID' AFTER `field_op_id`,
ADD COLUMN `drive_id`  int(10) NULL DEFAULT NULL COMMENT '司机ID' AFTER `truck_id`;
-- ----------------------------
-- 2019-06-25 更新
-- ----------------------------
update dp_route_load_task dprl left join dp_route_task dpr on dprl.dp_route_task_id = dpr.id
set dprl.drive_id = dpr.drive_id , dprl.truck_id = dpr.truck_id;
-- ----------------------------
-- 2019-06-25 更新
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_update_route_task`;
DELIMITER ;;
CREATE TRIGGER `trg_update_route_task` BEFORE UPDATE ON `dp_route_task` FOR EACH ROW BEGIN
IF(new.task_status=4 && old.task_status<>4) THEN
UPDATE truck_dispatch set current_city= 0 , task_start = old.route_start_id ,task_end=old.route_end_id
where truck_id=old.truck_id ;
set new.car_count = (select car_count from truck_dispatch where truck_id = old.truck_id);
IF((select count(distinct dprl.receive_id) from dp_route_load_task dprl
left join city_info c on dprl.route_end_id = c.id
left join dp_route_task dpr on dprl.drive_id = dpr.drive_id and dprl.truck_id = dpr.truck_id
where c.city_oil_flag=1 and dprl.route_end_id=old.route_end_id and dprl.load_task_status=3
and dprl.drive_id = old.drive_id and dprl.truck_id = old.truck_id)>1 and new.car_count>0) THEN
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
-- 2019-06-26 更新
-- ----------------------------
ALTER TABLE `dp_route_task`
ADD COLUMN `outer_flag`  tinyint(1) NULL DEFAULT 0 COMMENT '是否外协(0-否,1-是)' AFTER `reverse_money`;
-- ----------------------------
-- 2019-06-26 更新
-- ----------------------------
ALTER TABLE `receive_info`
ADD COLUMN `month_flag`  tinyint(1) NULL DEFAULT 0 COMMENT '是否月结(0-否,1-是)' AFTER `receive_flag`;
-- ----------------------------
-- 2019-06-26 更新
-- ----------------------------
ALTER TABLE `dp_route_task_tmp`
ADD COLUMN `outer_flag`  tinyint(1) NULL DEFAULT 0 COMMENT '是否外协(0-否,1-是)' AFTER `load_flag`;
-- ----------------------------
-- 2019-06-27 更新
-- ----------------------------
ALTER TABLE `dp_route_load_task_clean_rel`
ADD COLUMN `month_flag`  tinyint(1) NULL DEFAULT 0 COMMENT '是否月结(0-否,1-是)' AFTER `lead_fee`;
-- ----------------------------
-- 2019-06-27 更新
-- ----------------------------
update dp_route_task dpr left join truck_info t on dpr.truck_id = t.id set dpr.outer_flag = 1 where t.operate_type = 2;
-- ----------------------------
-- 2019-07-01 更新
-- ----------------------------
ALTER TABLE `dp_route_load_task_clean_rel`
MODIFY COLUMN `actual_price`  decimal(10,2) NULL DEFAULT NULL COMMENT '实际费用' AFTER `actual_guard_fee`;
-- ----------------------------
-- 2019-07-05 更新
-- ----------------------------
ALTER TABLE `dp_route_task_tmp`
ADD COLUMN `reverse_flag`  tinyint(1) NULL DEFAULT 0 COMMENT '是否倒板(0-否,1-是)' AFTER `load_flag`,
ADD COLUMN `reverse_money`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '倒板金额' AFTER `reverse_flag`;
-- ----------------------------
-- 2019-07-08 更新 去除truck_dispatch car_count>0 oil_load_flag = 1
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_update_route_task`;
DELIMITER ;;
CREATE TRIGGER `trg_update_route_task` BEFORE UPDATE ON `dp_route_task` FOR EACH ROW BEGIN
IF(new.task_status=4 && old.task_status<>4) THEN
UPDATE truck_dispatch set current_city= 0 , task_start = old.route_start_id ,task_end=old.route_end_id
where truck_id=old.truck_id ;
set new.car_count = (select car_count from truck_dispatch where truck_id = old.truck_id);
IF((select count(distinct dprl.receive_id) from dp_route_load_task dprl
left join city_info c on dprl.route_end_id = c.id
left join dp_route_task dpr on dprl.drive_id = dpr.drive_id and dprl.truck_id = dpr.truck_id
where c.city_oil_flag=1 and dprl.route_end_id=old.route_end_id and dprl.load_task_status=3
and dprl.drive_id = old.drive_id and dprl.truck_id = old.truck_id)>1 and new.car_count>0) THEN
set new.oil_distance = old.distance+30;
END IF;

END IF;
END
;;
DELIMITER ;
-- ----------------------------
-- 2019-07-09 更新
-- ----------------------------
ALTER TABLE `entrust_city_route_rel`
ADD COLUMN `two_distance`  decimal(10,2) NULL DEFAULT 0 COMMENT '二级公里数' AFTER `fee`,
ADD COLUMN `two_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '二级价格' AFTER `two_distance`;
-- ----------------------------
-- 2019-07-09 更新
-- ----------------------------
ALTER TABLE `entrust_city_route_rel`
MODIFY COLUMN `size_type`  tinyint(1) NOT NULL DEFAULT 0 COMMENT '大小车类型(0-小车,1-大车)' AFTER `route_end_id`,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`entrust_id`, `make_id`, `route_start_id`, `route_end_id`, `size_type`);
-- ----------------------------
-- 2019-07-09 更新
-- ----------------------------
ALTER TABLE `drive_truck_month_value`
ADD COLUMN `two_output`  decimal(10,2) NULL DEFAULT 0 COMMENT '二级产值收入' AFTER `output`;
-- ----------------------------
-- 2019-07-09 更新
-- ----------------------------
DROP TABLE IF EXISTS `settle_outer_truck`;
CREATE TABLE `settle_outer_truck` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `make_id` int(10) DEFAULT '0' COMMENT '品牌ID',
  `make_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '品牌',
  `route_start_id` int(10) DEFAULT '0' COMMENT '起始地ID',
  `route_start` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '起始城市',
  `route_end_id` int(10) DEFAULT '0' COMMENT '目的地ID',
  `route_end` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '目的城市',
  `distance` decimal(10,2) DEFAULT '0.00' COMMENT '公里数',
  `fee` decimal(10,2) DEFAULT '0.00' COMMENT '单价',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `make_id` (`make_id`,`route_start_id`,`route_end_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2019-07-12 更新
-- ----------------------------
ALTER TABLE `settle_outer_truck`
ADD COLUMN `company_id`  int(10) NULL DEFAULT 0 COMMENT '外协公司ID' AFTER `id`;
-- ----------------------------
-- 2019-07-12 更新
-- ----------------------------
ALTER TABLE `settle_outer_truck`
DROP INDEX `make_id` ,
ADD UNIQUE INDEX `company_id` (`company_id`, `make_id`, `route_start_id`, `route_end_id`) USING BTREE ;
-- ----------------------------
-- 2019-07-22 更新
-- ----------------------------
ALTER TABLE `dp_route_task_fee`
ADD COLUMN `cash_etc`  decimal(10,2) NULL DEFAULT 0 COMMENT '现金ETC' AFTER `car_oil_fee`,
ADD COLUMN `cash_repair`  decimal(10,2) NULL DEFAULT 0 COMMENT '现金维修' AFTER `cash_etc`,
ADD COLUMN `cash_peccancy`  decimal(10,2) NULL DEFAULT 0 COMMENT '现金违章' AFTER `cash_repair`,
ADD COLUMN `cash_oil`  decimal(10,2) NULL DEFAULT 0 COMMENT '现金加油' AFTER `cash_peccancy`;
-- ----------------------------
-- 2019-07-25 更新
-- ----------------------------
-- ----------------------------
-- Table structure for drive_exceed_oil_price
-- ----------------------------
DROP TABLE IF EXISTS `drive_exceed_oil_price`;
CREATE TABLE `drive_exceed_oil_price` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `oil_single_price` decimal(10,2) DEFAULT '0.00' COMMENT '油的每升扣款单价',
  `urea_single_price` decimal(10,2) DEFAULT '0.00' COMMENT '尿素每升扣款单价',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2019-07-26 更新
-- ----------------------------
-- ----------------------------
-- Table structure for entrust_invoice
-- ----------------------------
DROP TABLE IF EXISTS `entrust_invoice`;
CREATE TABLE `entrust_invoice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entrust_id` int(10) DEFAULT '0' COMMENT '委托方ID',
  `car_count` int(10) DEFAULT '0' COMMENT '商品车数量',
  `plan_price` decimal(10,2) DEFAULT '0.00' COMMENT '预计金额',
  `update_price` decimal(10,2) DEFAULT '0.00' COMMENT '调整金额',
  `actual_price` decimal(10,2) DEFAULT '0.00' COMMENT '实际金额',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `invoice_status` tinyint(1) DEFAULT '1' COMMENT '处理状态(1-未处理,2-已处理)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for entrust_invoice_car_rel
-- ----------------------------
DROP TABLE IF EXISTS `entrust_invoice_car_rel`;
CREATE TABLE `entrust_invoice_car_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entrust_invoice_id` int(10) DEFAULT '0' COMMENT '委托方ID',
  `car_id` int(10) DEFAULT '0' COMMENT '商品车ID',
  `route_start_id` int(10) DEFAULT '0' COMMENT '起始地ID',
  `route_end_id` int(10) DEFAULT '0' COMMENT '目的地ID',
  `price` decimal(10,2) DEFAULT '0.00' COMMENT '金额',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2019-07-29 更新
-- ----------------------------
ALTER TABLE `drive_exceed_oil_price`
ADD COLUMN `surplus_oil_single_price`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '结油每升扣款单价' AFTER `urea_single_price`,
ADD COLUMN `surplus_urea_single_price`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '结尿素每升扣款单价' AFTER `surplus_oil_single_price`;
-- ----------------------------
-- 2019-07-29 更新
-- ----------------------------
ALTER TABLE `drive_exceed_oil_date`
ADD COLUMN `load_oil_distance`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '重载油耗公里' AFTER `exceed_urea`,
ADD COLUMN `no_load_oil_distance`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '空载油耗公里' AFTER `load_oil_distance`,
ADD COLUMN `oil_single_price`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '油每升扣款单价' AFTER `no_load_oil_distance`,
ADD COLUMN `urea_single_price`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '尿素每升扣款单价' AFTER `oil_single_price`;
-- ----------------------------
-- 2019-07-29 更新
-- ----------------------------
ALTER TABLE `dp_route_task`
ADD COLUMN `remark`  varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注' AFTER `up_distance_count`;
-- ----------------------------
-- 2019-07-29 更新
-- ----------------------------
ALTER TABLE `dp_route_task_fee`
ADD COLUMN `other_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '其他费用' AFTER `cash_oil`;
-- ----------------------------
-- 2019-07-29 更新
-- ----------------------------
ALTER TABLE `truck_etc`
ADD COLUMN `number`  varchar(50) NULL COMMENT '编号' AFTER `id`,
ADD COLUMN `payment_type`  tinyint(1) NULL DEFAULT 1 COMMENT '是否打款(1-否 ,2-是)' AFTER `upload_id`,
ADD COLUMN `payment_status`  tinyint(1) NULL DEFAULT 0 COMMENT '打款状态(-1-驳回 ,0-未打款,1-已打款)' AFTER `payment_type`;
-- ----------------------------
-- 2019-07-30 更新
-- ----------------------------
ALTER TABLE `truck_repair_rel`
ADD COLUMN `number`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '编号' AFTER `id`,
ADD COLUMN `payment_type`  tinyint(1) NULL DEFAULT 1 COMMENT '是否打款(1-否 ,2-是)' AFTER `remark`,
ADD COLUMN `payment_status`  tinyint(1) NULL DEFAULT 0 COMMENT '打款状态(-1-驳回 ,0-未打款,1-已打款)' AFTER `payment_type`;
-- ----------------------------
-- 2019-07-30 更新
-- ----------------------------
ALTER TABLE `drive_exceed_oil_rel`
ADD COLUMN `number`  varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '编号' AFTER `id`,
ADD COLUMN `payment_type`  tinyint(1) NULL DEFAULT 1 COMMENT '是否打款(1-否 ,2-是)' AFTER `urea_money`,
ADD COLUMN `payment_status`  tinyint(1) NULL DEFAULT 0 COMMENT '打款状态(-1-驳回 ,0-未打款,1-已打款)' AFTER `payment_type`;
-- ----------------------------
-- 2019-07-30 更新
-- ----------------------------
ALTER TABLE `truck_etc`
ADD COLUMN `grant_date_id`  int(4) NULL COMMENT '发放时间' AFTER `payment_status`;
-- ----------------------------
-- 2019-07-30 更新
-- ----------------------------
ALTER TABLE `truck_repair_rel`
ADD COLUMN `grant_date_id`  int(4) NULL DEFAULT NULL COMMENT '发放时间' AFTER `payment_status`;
-- ----------------------------
-- 2019-07-30 更新
-- ----------------------------
ALTER TABLE `drive_exceed_oil_rel`
ADD COLUMN `grant_date_id`  int(4) NULL DEFAULT NULL COMMENT '发放时间' AFTER `payment_status`;
-- ----------------------------
-- 2019-08-02 更新
-- ----------------------------
ALTER TABLE `drive_truck_month_value`
ADD COLUMN `other_fee`  decimal(10,2) NULL DEFAULT 0.00 COMMENT '其他费用' AFTER `truck_parking_fee`;
-- ----------------------------
-- 2019-08-05 更新
-- ----------------------------
-- ----------------------------
-- Table structure for drive_social_security
-- ----------------------------
DROP TABLE IF EXISTS `drive_social_security`;
CREATE TABLE `drive_social_security` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `drive_id` int(10) DEFAULT '0' COMMENT '司机ID',
  `drive_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '司机姓名',
  `mobile` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户名(手机号)',
  `y_month` int(4) DEFAULT '0' COMMENT '月份',
  `social_security_fee` decimal(10,2) DEFAULT '0.00' COMMENT '社保费',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `drive_id` (`drive_id`,`y_month`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2019-08-06 更新
-- ----------------------------
-- ----------------------------
-- Table structure for settle_outer_invoice
-- ----------------------------
DROP TABLE IF EXISTS `settle_outer_invoice`;
CREATE TABLE `settle_outer_invoice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(10) DEFAULT '0' COMMENT '外协公司ID',
  `car_count` int(10) DEFAULT '0' COMMENT '商品车数量',
  `plan_price` decimal(10,2) DEFAULT '0.00' COMMENT '预计金额',
  `update_price` decimal(10,2) DEFAULT '0.00' COMMENT '调整金额',
  `actual_price` decimal(10,2) DEFAULT '0.00' COMMENT '实际金额',
  `remark` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `invoice_status` tinyint(1) DEFAULT '1' COMMENT '处理状态(1-未处理,2-已处理)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for settle_outer_invoice_car_rel
-- ----------------------------
DROP TABLE IF EXISTS `settle_outer_invoice_car_rel`;
CREATE TABLE `settle_outer_invoice_car_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `outer_invoice_id` int(10) DEFAULT '0',
  `car_id` int(10) DEFAULT '0',
  `distance` decimal(10,2) DEFAULT '0.00' COMMENT '公里数',
  `fee` decimal(10,2) DEFAULT '0.00' COMMENT '单价',
  `total_fee` decimal(10,2) DEFAULT '0.00' COMMENT '总价',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `car_id` (`car_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2019-08-26 更新
-- ----------------------------
ALTER TABLE `truck_accident_insure`
ADD COLUMN `detail_explain`  varchar(200) NULL COMMENT '详细说明' AFTER `check_explain`;
-- ----------------------------
-- 2019-08-26 更新
-- ----------------------------
ALTER TABLE `truck_accident_insure`
ADD COLUMN `ref_remark`  varchar(200) NULL COMMENT '定损员信息' AFTER `insure_actual`;
-- ----------------------------
-- 2019-08-26 更新
-- ----------------------------
ALTER TABLE `damage_insure`
ADD COLUMN `detail_explain`  varchar(200) NULL COMMENT '详细说明' AFTER `check_explain`;
-- ----------------------------
-- 2019-10-08 更新
-- ----------------------------
ALTER TABLE `receive_info`
ADD COLUMN `trailer_month_flag`  tinyint(1) NULL DEFAULT 0 COMMENT '拖车费是否月结(0-否,1-是)' AFTER `trailer_fee`,
ADD COLUMN `run_month_flag`  tinyint(1) NULL DEFAULT 0 COMMENT '地跑费是否月结(0-否,1-是)' AFTER `run_fee`,
ADD COLUMN `lead_month_flag`  tinyint(1) NULL DEFAULT 0 COMMENT '带路费是否月结(0-否,1-是)' AFTER `lead_fee`;
-- ----------------------------
-- 2019-10-08 更新
-- ----------------------------
ALTER TABLE `dp_route_load_task_clean_rel`
ADD COLUMN `actual_trailer_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '总拖车费' AFTER `total_trailer_fee`,
ADD COLUMN `actual_run_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '总地跑费' AFTER `total_run_fee`,
ADD COLUMN `actual_lead_fee`  decimal(10,2) NULL DEFAULT 0 COMMENT '总带路费' AFTER `lead_fee`;
-- ----------------------------
-- 2019-11-05 更新
-- ----------------------------
ALTER TABLE `drive_work`
ADD COLUMN `remark` varchar(200) NULL COMMENT '描述（司机出勤备注）' AFTER `updated_on`;
-- ----------------------------
-- 2019-11-12 更新
-- ----------------------------
ALTER TABLE `damage_info`
ADD COLUMN `car_model_name` varchar(50) NULL COMMENT '车型号名称' AFTER `car_id`;
-- ----------------------------
-- 2019-11-14 更新
-- ----------------------------
ALTER TABLE `dp_route_load_task_clean_rel`
ADD COLUMN `create_user_id` int(10) NOT NULL DEFAULT 0 COMMENT '创建人ID' AFTER `grant_user_id`;
-- ----------------------------
-- 2019-12-9 更新
-- ----------------------------
ALTER TABLE `car_info`
ADD COLUMN `company_id` int(11) NULL DEFAULT NULL COMMENT '外协公司ID（不是外协时为0）' AFTER `vin`;
DROP TRIGGER `trg_new_car`;
DELIMITER ;;
CREATE TRIGGER `trg_new_car` AFTER INSERT ON `car_info` FOR EACH ROW BEGIN
set @count = (select count(*) from dp_demand_info
where demand_status=1 and user_id=0 and route_start_id=new.route_start_id and base_addr_id=new.base_addr_id
 and route_end_id = new.route_end_id and receive_id=new.receive_id and date_id = DATE_FORMAT(new.order_date,'%Y%m%d'));
IF(new.route_end_id>0 && new.car_status=1&&new.receive_id>0&&new.order_date is not null && @count=0 && new.company_id=0) THEN
INSERT INTO dp_demand_info(user_id,route_id,route_start_id,route_start,base_addr_id,route_end_id,route_end,receive_id,date_id,pre_count)
VALUES (0,new.route_id,new.route_start_id,new.route_start,new.base_addr_id,new.route_end_id,new.route_end,new.receive_id,DATE_FORMAT(new.order_date,'%Y%m%d'),1);
ELSEIF (new.route_end_id>0 && new.car_status=1&&new.receive_id>0&&new.order_date is not null&&@count>0 && new.company_id=0) THEN
UPDATE dp_demand_info set pre_count=pre_count+1 where user_id=0 and route_start_id=new.route_start_id and base_addr_id=new.base_addr_id
 and route_end_id = new.route_end_id and receive_id=new.receive_id and date_id = DATE_FORMAT(new.order_date,'%Y%m%d');
END IF ;
END
;;
DELIMITER ;

DROP TRIGGER `trg_delete_car`;
DELIMITER ;;
CREATE TRIGGER `trg_delete_car` BEFORE DELETE ON `car_info` FOR EACH ROW BEGIN
IF(old.route_end_id>0 && old.car_status=1&&old.receive_id>0&&old.order_date is not null && old.company_id =0) THEN
UPDATE dp_demand_info set pre_count=pre_count-1 where route_start_id=old.route_start_id and base_addr_id=old.base_addr_id
and route_end_id = old.route_end_id and receive_id=old.receive_id and date_id = DATE_FORMAT(old.order_date,'%Y%m%d');

END IF ;
END
;;
DELIMITER ;

-- ----------------------------
-- 2019-12-13 更新
-- ----------------------------
ALTER TABLE `dp_route_task_fee`
ADD COLUMN `grant_user_id` int(10) NOT NULL DEFAULT 0 COMMENT '发放人ID' AFTER `remark`,
ADD COLUMN `create_user_id` int(10) NOT NULL DEFAULT 0 COMMENT '创建人ID' AFTER `grant_user_id`;

-- ----------------------------
-- 2020-01-02 更新 添加字段：序列号(用户自定义可为空)
-- ----------------------------
ALTER TABLE `settle_handover_car_rel`
ADD COLUMN `sequence_num` varchar(40) NULL COMMENT '序列号' AFTER `car_id`;

-- ----------------------------
-- 2020-03-02 更新
-- ----------------------------
ALTER TABLE `damage_check_indemnity`
ADD COLUMN `bank_id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '开户行号' AFTER `bank_name`;

-- ----------------------------
-- 2020-03-05 更新
-- ----------------------------
-- ----------------------------
-- Table structure for drive_sundry_fee
-- ----------------------------
DROP TABLE IF EXISTS `drive_sundry_fee`;
CREATE TABLE `drive_sundry_fee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) DEFAULT '0' COMMENT '用户ID',
  `drive_id` int(10) DEFAULT '0' COMMENT '司机ID',
  `y_month` int(4) DEFAULT '0' COMMENT '月份',
  `personal_loan` decimal(10,2) DEFAULT '0.00' COMMENT '个人借款',
  `social_fee` decimal(10,2) DEFAULT '0.00' COMMENT '社保费',
  `meals_fee` decimal(10,2) DEFAULT '0.00' COMMENT '伙食费',
  `other_fee` decimal(10,2) DEFAULT '0.00' COMMENT '其他扣款',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `drive_id` (`drive_id`,`y_month`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- 2020-03-17 更新
-- ----------------------------
DROP TABLE IF EXISTS `drive_salary_retain`;
CREATE TABLE `drive_salary_retain`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `y_month` int(4) NOT NULL COMMENT '月份',
  `user_id` int(10) NULL DEFAULT NULL COMMENT '用户ID',
  `drive_id` int(10) NULL DEFAULT NULL COMMENT '司机ID',
  `damage_retain_fee` decimal(10, 2) NULL DEFAULT 0.00 COMMENT '质损暂扣',
  `damage_op_fee` decimal(10, 2) NULL DEFAULT 0.00 COMMENT '质损罚款',
  `truck_retain_fee` decimal(10, 2) NULL DEFAULT 0.00 COMMENT '交车暂扣',
  `type` tinyint(1) NULL DEFAULT 0 COMMENT '扣款类型（1-质量，2-车管）',
  `remark` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL COMMENT '备注',
  `created_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updated_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- 2020-03-17 更新
-- ----------------------------
ALTER TABLE `drive_work`
DROP COLUMN `social_security_fee`,
DROP COLUMN `hotel_fee`,
ADD COLUMN `hotel_bonus`  decimal(10,2) DEFAULT 0 COMMENT '出差补助' AFTER `work_count`,
ADD COLUMN `full_work_bonus`  decimal(10,2) DEFAULT 0 COMMENT '满勤补助' AFTER `hotel_bonus`,
ADD COLUMN `other_bonus`  decimal(10,2) DEFAULT 0 COMMENT '其他补助' AFTER `full_work_bonus`;

-- ----------------------------
-- 2020-03-18 更新
-- ----------------------------
ALTER TABLE `drive_salary`
MODIFY COLUMN `other_fee` decimal(10,2) DEFAULT 0 COMMENT '其他扣款',
DROP COLUMN `entrust_id`,
DROP COLUMN `plan_salary`,
DROP COLUMN `refund_fee`,
DROP COLUMN `withhold`,
DROP COLUMN `arrears`,
ADD COLUMN `company_id` int(10) DEFAULT '0' COMMENT '所属公司ID' AFTER `entrust_id`,
ADD COLUMN `user_id` int(10) DEFAULT '0' COMMENT '用户ID' AFTER `company_id`,
ADD COLUMN `damage_retain_fee` decimal(10,2) DEFAULT 0 COMMENT '质损暂扣' AFTER `exceed_oil_fee`,
ADD COLUMN `damage_op_fee` decimal(10,2) DEFAULT 0 COMMENT '质安罚款' AFTER `damage_retain_fee`,
ADD COLUMN `truck_retain_fee` decimal(10,2) DEFAULT 0 COMMENT '交车暂扣' AFTER `damage_op_fee`,
ADD COLUMN `personal_tax` decimal(10,2) DEFAULT 0 COMMENT '个税' AFTER `truck_retain_fee`,
ADD COLUMN `hotel_bonus` decimal(10,2) DEFAULT 0 COMMENT '出差补助' AFTER `personal_tax`,
ADD COLUMN `full_work_bonus`  decimal(10,2) DEFAULT 0 COMMENT '满勤补助' AFTER `hotel_bonus`,
ADD COLUMN `other_bonus` decimal(10,2) DEFAULT 0 COMMENT '其他补助' AFTER `full_work_bonus`,
ADD COLUMN `car_oil_fee` decimal(10,2) DEFAULT 0 COMMENT '商品车加油费' AFTER `other_bonus`,
ADD COLUMN `truck_parking_fee` decimal(10,2) DEFAULT 0 COMMENT '货车停车费' AFTER `car_oil_fee`,
ADD COLUMN `car_parking_fee` decimal(10,2) DEFAULT 0 COMMENT '商品车停车费' AFTER `truck_parking_fee`,
ADD COLUMN `dp_other_fee` decimal(10,2) DEFAULT 0 COMMENT '其它运送费用' AFTER `car_parking_fee`,
ADD COLUMN `clean_fee` decimal(10,2) DEFAULT 0 COMMENT '洗车费' AFTER `dp_other_fee`,
ADD COLUMN `trailer_fee` decimal(10,2) DEFAULT 0 COMMENT '拖车费' AFTER `clean_fee`,
ADD COLUMN `car_pick_fee` decimal(10,2) DEFAULT 0 COMMENT '提车费' AFTER `trailer_fee`,
ADD COLUMN `run_fee` decimal(10,2) DEFAULT 0 COMMENT '地跑费' AFTER `car_pick_fee`,
ADD COLUMN `lead_fee` decimal(10,2) DEFAULT 0 COMMENT '带路费' AFTER `run_fee`;

-- ----------------------------
-- 2020-03-18 更新
-- ----------------------------
ALTER TABLE `drive_salary_retain`
ADD COLUMN `op_user_id` int(10) NULL DEFAULT NULL COMMENT '处理用户ID' AFTER `user_id`;

-- ----------------------------
-- 2020-03-26 更新
-- ----------------------------
ALTER TABLE `drive_exceed_oil_date`
ADD COLUMN `gps_no_load_oil_distance` decimal(10, 2) NULL DEFAULT 0.00 COMMENT 'GPS空载油耗公里' AFTER `actual_money`,
ADD COLUMN `gps_load_oil_distance` decimal(10, 2) NULL DEFAULT 0.00 COMMENT 'GPS重载油耗公里' AFTER `gps_no_load_oil_distance`,
ADD COLUMN `gps_oil_total` decimal(10, 2) NULL DEFAULT 0.00 COMMENT 'GPS总用油量' AFTER `gps_load_oil_distance`,
ADD COLUMN `gps_urea_total` decimal(10, 2) NULL DEFAULT 0.00 COMMENT 'GPS计划总尿素量' AFTER `gps_oil_total`,
ADD COLUMN `gps_exceed_oil` decimal(10, 2) NULL DEFAULT 0.00 COMMENT 'GPS超油' AFTER `gps_urea_total`,
ADD COLUMN `gps_exceed_urea` decimal(10, 2) NULL DEFAULT 0.00 COMMENT 'GPS超尿素' AFTER `gps_exceed_oil`,
ADD COLUMN `gps_actual_money` decimal(10, 2) NULL DEFAULT 0.00 COMMENT 'GPS实际超量总金额' AFTER `gps_exceed_urea`;

-- ----------------------------
-- 2019-04-20 更新
-- ----------------------------
ALTER TABLE `drive_truck_month_value`
CHANGE COLUMN `hotel_fee` `hotel_bonus` decimal(10,2) DEFAULT 0 COMMENT '出差补助' AFTER `work_count`,
ADD COLUMN `full_work_bonus`  decimal(10,2) DEFAULT 0 COMMENT '满勤补助' AFTER `hotel_bonus`,
ADD COLUMN `other_bonus`  decimal(10,2) DEFAULT 0 COMMENT '其他补助' AFTER `full_work_bonus`;

-- ----------------------------
-- 2019-04-24 更新
-- ----------------------------
ALTER TABLE `drive_info`
ADD COLUMN `social_type` tinyint(1) DEFAULT 1 COMMENT '社保类型（0-退保，1-在保）' AFTER `license_type`;

-- ----------------------------
-- 2019-05-13 更新
-- ----------------------------
ALTER TABLE `drive_info`
ADD COLUMN `entry_time` date DEFAULT NULL COMMENT '入职时间' AFTER `id_number`,
ADD COLUMN `archives_num` varchar(50) COMMENT '档案编号' AFTER `entry_time`;

DROP TABLE IF EXISTS `truck_brand_style`;
CREATE TABLE `truck_brand_style` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `brand_style_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '品牌型号名称',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `truck_info`
ADD COLUMN `brand_style_id` int(10) COMMENT '品牌型号ID' AFTER `brand_id`,
ADD COLUMN `brand_style_name` varchar(50) COMMENT '品牌型号名称' AFTER `brand_style_Id`;

ALTER TABLE `truck_brand_style`
ADD COLUMN `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '品牌型号状态（0-停用,1-可用）' AFTER `brand_style_name`;

-- ----------------------------
-- 2020-08-20 更新
-- ----------------------------
DROP TABLE IF EXISTS `damage_qa_task`;
CREATE TABLE `damage_qa_task`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `upload_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci  NOT NULL COMMENT '上传ID',
  `car_count` int(10) COMMENT '商品车计数',
  `qa_car_count` int(10) DEFAULT 0 COMMENT '质检车计数',
  `date_id` int(4) NOT NULL COMMENT '质检任务时间',
  `created_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '质检任务创建时间',
  `updated_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `damage_qa_task_car_rel`;
CREATE TABLE `damage_qa_task_car_rel`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `qt_id` int(10) NOT NULL COMMENT '质检任务ID',
  `car_id` int(10) NOT NULL COMMENT '商品车ID',
  `qa_status` tinyint(1) DEFAULT 0 COMMENT '质检状态(0-未检,1-已检)',
  `user_id` int(10) DEFAULT 0 COMMENT '用户ID',
  `date_id` int(4) COMMENT '质检时间',
  `created_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '质检任务创建时间',
  `updated_on` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2020-09-04 更新
-- ----------------------------
ALTER TABLE `entrust_city_route_rel`
ADD COLUMN `op_user_id` int(10) DEFAULT 0 COMMENT '用户ID' AFTER `size_type`;
-- ----------------------------
-- 2020-09-07 更新
-- ----------------------------
ALTER TABLE `city_route_info`
ADD COLUMN `op_user_id` int(10) DEFAULT 0 COMMENT '用户ID' AFTER `reverse_money`;
-- ----------------------------
-- 2020-11-20 更新
-- ----------------------------
ALTER TABLE `city_route_info`
MODIFY COLUMN `reverse_money` decimal(10, 2) DEFAULT 0.00 COMMENT '倒板金额(6位)' AFTER `distance`,
ADD COLUMN `reverse_money_2` decimal(10, 2) DEFAULT 0.00 COMMENT '倒板金额(8位)' AFTER `reverse_money`;
-- ----------------------------
--  2020-12-03 Table structure for `total_month_stat`
-- ----------------------------
DROP TABLE IF EXISTS `total_month_stat`;
CREATE TABLE `total_month_stat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `y_month` int(11) NOT NULL,
  `car_count` int(11) DEFAULT '0' COMMENT '商品车数量',
  `truck_count` int(11) DEFAULT '0' COMMENT '运营货车数量',
  `load_distance` decimal(10,2) DEFAULT '0.00' COMMENT '重载公里数',
  `no_load_distance` decimal(10,2) DEFAULT '0.00' COMMENT '空载公里数',
  `total_distance` decimal(10,2) DEFAULT '0.00' COMMENT '总公里数',
  `load_ratio` decimal(10,2) DEFAULT '0.00' COMMENT '重载率',
  `output` decimal(10,2) DEFAULT '0.00' COMMENT '产值',
  `per_truck_output` decimal(10,2) DEFAULT '0.00' COMMENT '单车产值',
  `per_km_output` decimal(10,2) DEFAULT '0.00' COMMENT '单公里产值',
  `outer_car_count` int(11) DEFAULT '0' COMMENT '外协商品车数量',
  `outer_output` decimal(10,2) DEFAULT '0.00' COMMENT '外协产值',
  `outer_fee` decimal(10,2) DEFAULT '0.00' COMMENT '外协费用',
  `etc_fee` decimal(10,2) DEFAULT '0.00' COMMENT '过路费',
  `oil_vol` decimal(10,2) DEFAULT '0.00' COMMENT '加油量',
  `oil_fee` decimal(10,2) DEFAULT '0.00' COMMENT '加油费',
  `urea_vol` decimal(10,2) DEFAULT '0.00' COMMENT '尿素量',
  `urea_fee` decimal(10,2) DEFAULT '0.00' COMMENT '尿素费',
  `repair_fee` decimal(10,2) DEFAULT '0.00' COMMENT '修理费',
  `part_fee` decimal(10,2) DEFAULT '0.00' COMMENT '零件费',
  `maintain_fee` decimal(10,2) DEFAULT '0.00' COMMENT '保养费',
  `inner_repair_count` int(11) DEFAULT '0' COMMENT '内部维修数',
  `inner_repair_fee` decimal(10,2) DEFAULT '0.00' COMMENT '内部维修费',
  `outer_repair_count` int(11) DEFAULT '0' COMMENT '在外维修次数',
  `outer_repair_fee` decimal(10,2) DEFAULT '0.00' COMMENT '在外维修数',
  `fine_count` int(11) DEFAULT '0' COMMENT '处罚次数',
  `fine_score` int(11) DEFAULT '0' COMMENT '处罚分数',
  `buy_score_fee` decimal(10,2) DEFAULT '0.00' COMMENT '买分金额',
  `traffic_fine_fee` decimal(10,2) DEFAULT '0.00' COMMENT '交通罚款',
  `fine_money` decimal(10,2) DEFAULT '0.00' COMMENT '处理金额',
  `driver_under_money` decimal(10,2) DEFAULT '0.00' COMMENT '司机承担罚款',
  `company_under_money` decimal(10,2) DEFAULT '0.00' COMMENT '公司承担',
  `damage_count` int(11) DEFAULT '0' COMMENT '质损数',
  `person_damage_money` decimal(10,2) DEFAULT '0.00' COMMENT '个人承担质损费',
  `company_damage_money` decimal(10,2) DEFAULT '0.00' COMMENT '公司承担质损费',
  `total_damange_money` decimal(10,2) DEFAULT '0.00' COMMENT '质损总成本',
  `per_car_damage_money` decimal(10,2) DEFAULT '0.00' COMMENT '单车质损成本',
  `per_car_c_damange_money` decimal(10,2) DEFAULT '0.00' COMMENT '单车公司承担成本',
  `car_insurance` decimal(10,2) DEFAULT '0.00' COMMENT '商品车保险待赔',
  `clean_fee` decimal(10,2) DEFAULT '0.00' COMMENT '洗车费',
  `enter_fee` decimal(10,2) DEFAULT '0.00' COMMENT '进门费',
  `trail_fee` decimal(10,2) DEFAULT '0.00' COMMENT '拖车费',
  `car_parking_fee` decimal(10,2) DEFAULT '0.00' COMMENT '商品车停车费',
  `run_fee` decimal(10,2) DEFAULT '0.00' COMMENT '地跑费',
  `lead_fee` decimal(10,2) DEFAULT '0.00' COMMENT '带路费',
  `per_car_clean_fee` decimal(10,2) DEFAULT '0.00' COMMENT '单车洗车费',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;