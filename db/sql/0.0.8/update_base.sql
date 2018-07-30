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
-- Table structure for dp_task_transfer_stat
-- ----------------------------
DROP TABLE IF EXISTS `dp_task_transfer_stat`;
CREATE TABLE `dp_task_transfer_stat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `route_start_id` int(10) NOT NULL COMMENT '起始地ID',
  `base_addr_id` int(10) NOT NULL COMMENT '起始地发货地址ID',
  `transfer_city_id` int(10) NOT NULL COMMENT '中转城市ID',
  `transfer_addr_id` int(10) NOT NULL COMMENT '中转站ID',
  `route_end_id` int(10) NOT NULL DEFAULT '0' COMMENT '目的地ID',
  `receive_id` int(10) NOT NULL DEFAULT '0' COMMENT '经销商ID',
  `pre_count` int(10) DEFAULT '0' COMMENT '需求安排台数',
  `transfer_count` int(10) DEFAULT '0' COMMENT '中转数',
  `plan_count` int(10) DEFAULT '0' COMMENT '已派发台数',
  `date_id` int(4) NOT NULL COMMENT '指令时间',
  `transfer_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '中转状态(1-未完成,2-已完成)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`route_start_id`,`base_addr_id`,`transfer_city_id`,`transfer_addr_id`,`route_end_id`,`receive_id`,`date_id`),
  UNIQUE KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `pre_count` int(10) DEFAULT '0' COMMENT '需求安排台数',
  `transfer_count` int(10) DEFAULT '0' COMMENT '中转数',
  `plan_count` int(10) DEFAULT '0' COMMENT '已派发台数',
  `date_id` int(4) NOT NULL COMMENT '指令时间',
  `transfer_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态(0-取消,1-正常,2-完成)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- 2018-07-25 更新
-- 追加transfer_flag状态验证，如果任务是中转，更新中转需求、中转需求统计、原始需求统计中的plan_count
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_new_load_task`;
DELIMITER ;;
CREATE TRIGGER `trg_new_load_task` AFTER INSERT ON `dp_route_load_task` FOR EACH ROW BEGIN
UPDATE dp_demand_info set plan_count=plan_count+new.plan_count where id= new.demand_id ;
UPDATE dp_task_stat set plan_count = plan_count+new.plan_count where route_start_id=new.route_start_id
and base_addr_id=new.base_addr_id and route_end_id = new.route_end_id and receive_id=new.receive_id and date_id = new.date_id;
IF(new.transfer_flag=1) THEN
UPDATE dp_transfer_demand_info set plan_count=plan_count+new.plan_count where id= new.transfer_demand_id ;
UPDATE dp_task_stat set transfer_count = transfer_count+new.plan_count where route_start_id=new.route_start_id
and base_addr_id=new.base_addr_id and route_end_id = new.route_end_id and receive_id=new.receive_id and date_id = new.date_id;
UPDATE dp_task_transfer_stat set plan_count = plan_count+new.plan_count where route_start_id=new.route_start_id
and base_addr_id=new.base_addr_id and transfer_city_id=new.transfer_city_id and transfer_addr_id = new.transfer_addr_id
and route_end_id = new.route_end_id and receive_id=new.receive_id and date_id = new.date_id;
END IF;
END
;;
DELIMITER ;
-- ----------------------------
-- 2018-07-25 更新
-- 追加transfer_flag状态验证，如果中转任务被取消，更新原始需求、原始需求统计、中转需求、中转需求统计plan_count
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
UPDATE dp_task_transfer_stat set plan_count = plan_count-old.plan_count where route_start_id=new.route_start_id
and base_addr_id=new.base_addr_id and transfer_city_id=new.transfer_city_id and transfer_addr_id = new.transfer_addr_id
and route_end_id = new.route_end_id and receive_id=new.receive_id and date_id = new.date_id;
ELSEIF(new.load_task_status=8 && old.load_task_status<>8) THEN
UPDATE dp_demand_info set plan_count=plan_count-old.plan_count where id= new.demand_id ;
UPDATE dp_task_stat set plan_count = plan_count-old.plan_count
where route_start_id=new.route_start_id
and base_addr_id=new.base_addr_id and route_end_id = new.route_end_id and receive_id=new.receive_id and date_id = new.date_id;
END IF;
IF(new.load_task_status=3 && old.load_task_status<>3) THEN
UPDATE dp_route_task set task_status=4,car_count = (select sum(real_count)
from dp_route_load_task where dp_route_task_id = old.dp_route_task_id)
where (select count(*) from dp_route_load_task where load_task_status <>3 and load_task_status<>8 and dp_route_task_id = old.dp_route_task_id ) =0 and id= old.dp_route_task_id;
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
-- 2018-07-27 更新
-- 通过到达生成中转需求，同时生成中转需求统计
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_new_transfer_demand_stat`;
DELIMITER ;;
CREATE TRIGGER `trg_new_transfer_demand_stat` AFTER INSERT ON `dp_transfer_demand_info` FOR EACH ROW
INSERT INTO dp_task_transfer_stat(route_start_id,base_addr_id,transfer_city_id,transfer_addr_id,route_end_id,receive_id,pre_count,transfer_count,date_id)
VALUES (new.route_start_id,new.base_addr_id,new.transfer_city_id,new.transfer_addr_id,new.route_end_id,new.receive_id,new.pre_count,new.transfer_count,new.date_id)
ON DUPLICATE KEY UPDATE pre_count = pre_count+ new.pre_count ,transfer_count = transfer_count+ new.transfer_count transfer_status=1;
;;
DELIMITER ;
