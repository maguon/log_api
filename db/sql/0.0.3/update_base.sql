-- ----------------------------
-- Table structure for city_route_info
-- ----------------------------
DROP TABLE IF EXISTS `city_route_info`;
CREATE TABLE `city_route_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `route_start_id` int(10) NOT NULL COMMENT '起始地ID',
  `route_start` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '起始地名称',
  `route_end_id` int(10) NOT NULL COMMENT '目的地ID',
  `route_end` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '目的地名称',
  `distance` decimal(10,2) NOT NULL COMMENT '公里数',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`route_start_id`,`route_end_id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
--  Table structure for `truck_dispatch`
-- ----------------------------
DROP TABLE IF EXISTS `truck_dispatch`;
CREATE TABLE `truck_dispatch` (
  `truck_id` int(11) NOT NULL,
  `dispatch_flag` tinyint(1) NOT NULL DEFAULT '0',
  `current_city` int(11) NOT NULL DEFAULT '0',
  `task_start` int(11) NOT NULL DEFAULT '0',
  `task_end` int(11) NOT NULL DEFAULT '0',
  `car_count` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`truck_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

delimiter $$
DROP TRIGGER IF EXISTS trg_add_truck_dispatch;
create  trigger trg_add_truck_dispatch
after insert on truck_info for each row
BEGIN
IF (new.truck_type=1)THEN
insert into truck_dispatch (truck_id) values(new.id);
END IF;
END $$
delimiter ;


delimiter $$
DROP TRIGGER IF EXISTS trg_set_truck_dispatch;
CREATE TRIGGER `trg_set_truck_dispatch` AFTER UPDATE ON `truck_info` FOR EACH ROW
IF(new.drive_id>0&&new.rel_id>0&&new.repair_status=1) THEN
update truck_dispatch set dispatch_flag =1 where truck_id = new.id;
ELSEIF(new.drive_id=0||new.rel_id=0||new.repair_status=0) THEN
update truck_dispatch set dispatch_flag =0 where truck_id = new.id;
END IF;
END $$
delimiter ;
-- ----------------------------
-- Table structure for dp_task_satat
-- ----------------------------
DROP TABLE IF EXISTS `dp_task_satat`;
CREATE TABLE `dp_task_satat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `route_satat_id` int(10) NOT NULL COMMENT '起始地ID',
  `route_start` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '起始地城市',
  `base_addr_id` int(10) NOT NULL DEFAULT '0' COMMENT '起始地发货地址ID',
  `route_end_id` int(10) NOT NULL COMMENT '目的地ID',
  `route_end` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '目的地城市',
  `receive_id` int(10) NOT NULL COMMENT '经销商ID',
  `pre_count` int(10) NOT NULL DEFAULT '0' COMMENT '指令安排台数',
  `plan_count` int(10) NOT NULL DEFAULT '0' COMMENT '已派发台数',
  `date_id` int(4) NOT NULL COMMENT '指令时间',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for dp_route_task
-- ----------------------------
DROP TABLE IF EXISTS `dp_route_task`;
CREATE TABLE `dp_route_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `truck_id` int(10) NOT NULL COMMENT '货车ID',
  `drive_id` int(10) NOT NULL COMMENT '司机ID',
  `route_start_id` int(10) NOT NULL COMMENT '城市线路ID',
  `route_end_id` int(10) NOT NULL COMMENT '目的地ID',
  `distance` decimal(10,2) NOT NULL COMMENT '公里数',
  `task_plan_date` datetime DEFAULT NULL COMMENT '任务计划时间',
  `task_start_date` datetime DEFAULT NULL COMMENT '任务起始时间',
  `task_end_date` datetime DEFAULT NULL COMMENT '任务结束时间',
  `car_count` int(10) NOT NULL DEFAULT '0' COMMENT '实际装车商品车数量',
  `task_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '指令状态(1-待接受,2-接受,3执行,4-在途,8-取消安排,9-已完成)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for dp_route_load_task
-- ----------------------------
DROP TABLE IF EXISTS `dp_route_load_task`;
CREATE TABLE `dp_route_load_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dp_route_task_id` int(10) NOT NULL COMMENT '任务路线ID',
  `route_start_id` int(10) NOT NULL COMMENT '城市线路ID',
  `base_addr_id` int(10) DEFAULT NULL COMMENT '起始地发货地址ID',
  `route_end_id` int(10) NOT NULL COMMENT '目的地ID',
  `receive_id` int(10) NOT NULL COMMENT '经销商ID',
  `date_id` int(4) NOT NULL COMMENT '指令时间',
  `plan_count` int(10) NOT NULL DEFAULT '0' COMMENT '派发商品车数量',
  `load_task_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '任务状态(0-取消任务,1-正常)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for dp_route_load_task_detail
-- ----------------------------
DROP TABLE IF EXISTS `dp_route_load_task_detail`;
CREATE TABLE `dp_route_load_task_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dp_route_load_task_id` int(10) NOT NULL COMMENT '路线任务ID',
  `car_id` int(10) NOT NULL COMMENT '商品车ID',
  `vin` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '商品车VIN码',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

