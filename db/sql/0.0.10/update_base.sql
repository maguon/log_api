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