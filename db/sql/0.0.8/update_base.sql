-- ----------------------------
-- 2018-07-19 更新
-- ----------------------------
ALTER TABLE `receive_info`
ADD COLUMN `receive_type`  tinyint(1) NULL DEFAULT 1 COMMENT '经销商类型(1-4S店,2-大客户,3-临时停放地)' AFTER `receive_name`;
-- ----------------------------
-- 2018-07-24 更新
-- ----------------------------
ALTER TABLE `settle_handover_info`
ADD COLUMN `serial_number`  int(10) NOT NULL DEFAULT 0 COMMENT '序号' AFTER `number`;
-- ----------------------------
-- 2018-07-24 更新
-- 调度中转添加字段
-- ----------------------------
ALTER TABLE `dp_route_load_task`
ADD COLUMN `load_task_type`  tinyint(1) NULL DEFAULT 1 COMMENT '调度任务类型(1-始发站出发,2-中转站出发)' AFTER `field_op_id`,
ADD COLUMN `transfer_demand_id`  int(10) NULL DEFAULT 0 COMMENT '中转需求ID' AFTER `demand_id`,
ADD COLUMN `transfer_flag`  tinyint(1) NULL DEFAULT 0 COMMENT '是否中转标识(0-否,1-是)' AFTER `load_task_status`,
ADD COLUMN `transfer_city_id`  int(10) NULL DEFAULT 0 COMMENT '中转城市ID' AFTER `transfer_flag`,
ADD COLUMN `transfer_addr_id`  int(10) NULL DEFAULT 0 COMMENT '中转站装车地ID' AFTER `transfer_city_id`;

ALTER TABLE `dp_task_stat`
ADD COLUMN `transfer_count`  int(10) NULL DEFAULT 0 COMMENT '中转数' AFTER `not_plan_count`;
-- ----------------------------
-- Table structure for dp_transfer_demand_info
-- ----------------------------
DROP TABLE IF EXISTS `dp_transfer_demand_info`;
CREATE TABLE `dp_transfer_demand_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `demand_id` int(10) NOT NULL DEFAULT '0' COMMENT '调度需求ID',
  `route_start_id` int(10) NOT NULL DEFAULT '0' COMMENT '起始地ID',
  `base_addr_id` int(10) NOT NULL DEFAULT '0' COMMENT '起始地发货地址ID',
  `transfer_city_id` int(10) NOT NULL DEFAULT '0' COMMENT '中转站ID',
  `transfer_addr_id` int(10) NOT NULL DEFAULT '0' COMMENT '中转站装车地ID',
  `route_end_id` int(10) NOT NULL DEFAULT '0' COMMENT '目的地ID',
  `receive_id` int(10) NOT NULL DEFAULT '0' COMMENT '经销商ID',
  `pre_count` int(10) DEFAULT '0' COMMENT '需求中转数',
  `transfer_count` int(10) DEFAULT '0' COMMENT '即将到达中转数',
  `arrive_count` int(10) DEFAULT '0' COMMENT '已到达中转数',
  `plan_count` int(10) DEFAULT '0' COMMENT '已派发台数',
  `date_id` int(4) NOT NULL COMMENT '指令时间',
  `transfer_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态(0-取消,1-正常,2-完成)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`route_start_id`,`base_addr_id`,`transfer_city_id`,`transfer_addr_id`,`route_end_id`,`receive_id`,`date_id`),
  UNIQUE KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2018-07-25 更新
-- 追加transfer_flag状态验证，如果任务是中转，更新中转需求、原始需求统计中的plan_count
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_new_load_task`;
DELIMITER ;;
CREATE TRIGGER `trg_new_load_task` AFTER INSERT ON `dp_route_load_task` FOR EACH ROW BEGIN
IF(new.load_task_type=1) THEN
UPDATE dp_demand_info set plan_count=plan_count+new.plan_count where id= new.demand_id ;
UPDATE dp_task_stat set plan_count = plan_count+new.plan_count where route_start_id=new.route_start_id
and base_addr_id=new.base_addr_id and route_end_id = new.route_end_id and receive_id=new.receive_id and date_id = new.date_id;
END IF;
IF(new.transfer_flag=1) THEN
UPDATE dp_task_stat set transfer_count = transfer_count+new.plan_count where route_start_id=new.route_start_id
and base_addr_id=new.base_addr_id and route_end_id = new.route_end_id and receive_id=new.receive_id and date_id = new.date_id;
END IF;
IF(new.load_task_type=2) THEN
UPDATE dp_transfer_demand_info set plan_count=plan_count+new.plan_count where id= new.transfer_demand_id ;
END IF;
END
;;
DELIMITER ;
-- ----------------------------
-- 2018-07-25 更新
-- 追加transfer_flag和load_task_type状态,如果中转任务被取消,更新原始需求、原始需求统计、中转需求plan_count
--追加状态等于3装车完成，更新dp_demand_info,dp_task_stat计划数为实际装车数,如果是中转任务,同时更新transfer_count为实际中转数
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
UPDATE dp_route_task set task_status=4,car_count = (select sum(real_count)
from dp_route_load_task where dp_route_task_id = old.dp_route_task_id)
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
-- 2018-08-06 更新
-- ----------------------------
ALTER TABLE `settle_handover_info`
ADD COLUMN `status`  tinyint(1) NOT NULL DEFAULT 1 COMMENT '交接单状态(1-未完结,2-已完结)' AFTER `handove_image`;
-- ----------------------------
-- 2018-08-13 更新
-- ----------------------------
ALTER TABLE `dp_route_load_task`
ADD COLUMN `arrive_date`  datetime NULL COMMENT '到达时间' AFTER `load_date`;
-- ----------------------------
-- 2018-08-16 更新
-- ----------------------------
ALTER TABLE `car_info`
ADD COLUMN `current_city_id`  int(10) NULL DEFAULT 0 COMMENT '当前所在城市ID' AFTER `order_date_id`,
ADD COLUMN `current_city`  varchar(50) NULL COMMENT '当前所在城市' AFTER `current_city_id`,
ADD COLUMN `current_addr_id`  int(10) NULL DEFAULT 0 COMMENT '当前装车地点ID' AFTER `current_city`;
-- ----------------------------
-- 2018-08-27 更新
-- ----------------------------
ALTER TABLE `dp_route_task`
ADD COLUMN `truck_number`  tinyint(2) NULL DEFAULT 0 COMMENT '板车位数' AFTER `car_count`,
ADD COLUMN `load_flag`  tinyint(1) NULL DEFAULT 0 COMMENT '是否满载(0-否,1-是)' AFTER `truck_number`;
-- ----------------------------
-- Table structure for entrust_city_route_rel
-- ----------------------------
DROP TABLE IF EXISTS `entrust_city_route_rel`;
CREATE TABLE `entrust_city_route_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entrust_id` int(10) NOT NULL COMMENT '委托方ID',
  `city_route_id` int(10) NOT NULL COMMENT '路线ID',
  `distance` decimal(10,2) NOT NULL COMMENT '公里数',
  `fee` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '每公里费用',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`entrust_id`,`city_route_id`),
  UNIQUE KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2018-08-30 更新
-- ----------------------------
ALTER TABLE `city_route_info`
ADD COLUMN `route_id`  int(10) NULL DEFAULT 0 COMMENT '线路组合ID' AFTER `id`;
ALTER TABLE `city_route_info`
DROP PRIMARY KEY,
ADD PRIMARY KEY (`route_id`);
ALTER TABLE `car_info`
ADD COLUMN `route_id`  int(10) NULL DEFAULT 0 COMMENT '线路组合ID' AFTER `model_name`;
ALTER TABLE `dp_route_task`
ADD COLUMN `route_id`  int(10) NULL DEFAULT 0 COMMENT '线路组合ID' AFTER `drive_id`;
ALTER TABLE `dp_demand_info`
ADD COLUMN `route_id`  int(10) NULL DEFAULT 0 COMMENT '线路组合ID' AFTER `user_id`;
-- ----------------------------
-- 2018-08-30 更新
--更新route_id线路组合ID
-- ----------------------------
update city_route_info set route_id = concat(LEAST(route_start_id,route_end_id),GREATEST(route_start_id,route_end_id));
update car_info set route_id = concat(LEAST(route_start_id,route_end_id),GREATEST(route_start_id,route_end_id));
update dp_route_task set route_id = concat(LEAST(route_start_id,route_end_id),GREATEST(route_start_id,route_end_id));
update dp_demand_info set route_id = concat(LEAST(route_start_id,route_end_id),GREATEST(route_start_id,route_end_id));
-- ----------------------------
-- 2018-08-31 更新
-- ----------------------------
ALTER TABLE `dp_route_load_task`
ADD COLUMN `route_start`  varchar(50) NULL COMMENT '起始地' AFTER `route_start_id`,
ADD COLUMN `route_end`  varchar(50) NULL COMMENT '目的地' AFTER `route_end_id`,
ADD COLUMN `transfer_city`  varchar(50) NULL COMMENT '中转城市' AFTER `transfer_city_id`;