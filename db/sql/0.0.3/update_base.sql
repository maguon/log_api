ALTER TABLE `truck_info`
ADD COLUMN `dispatch_status`  tinyint(1) NOT NULL DEFAULT 0 AFTER `repair_status`;
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
-- Table structure for dispatch_truck_info
-- ----------------------------
DROP TABLE IF EXISTS `dispatch_truck_info`;
CREATE TABLE `dispatch_truck_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `route_start_id` int(10) NOT NULL COMMENT '起始地ID',
  `route_start` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '起始地城市',
  `base_addr_id` int(10) NOT NULL DEFAULT '0' COMMENT '起始地发货地址ID',
  `route_end_id` int(10) NOT NULL COMMENT '目的地ID',
  `route_end` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '目的地城市',
  `receive_id` int(10) NOT NULL COMMENT '经销商ID',
  `pre_count` int(10) NOT NULL COMMENT '指令安排台数',
  `plan_count` int(10) NOT NULL DEFAULT '0' COMMENT '调度派发台数',
  `order_date` datetime DEFAULT NULL COMMENT '指令日期',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for dispatch_truck_rel
-- ----------------------------
DROP TABLE IF EXISTS `dispatch_truck_rel`;
CREATE TABLE `dispatch_truck_rel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `truck_id` int(10) NOT NULL COMMENT '货车ID',
  `drive_id` int(10) NOT NULL COMMENT '司机ID',
  `city_route_id` int(10) NOT NULL COMMENT '城市线路ID',
  `base_addr_id` int(10) DEFAULT NULL COMMENT '起始地发货地址ID',
  `route_end_id` int(10) NOT NULL COMMENT '目的地ID',
  `distance` decimal(10,2) NOT NULL COMMENT '公里数',
  `receive_id` int(10) NOT NULL DEFAULT '0' COMMENT '经销商ID',
  `task_start_date` datetime DEFAULT NULL COMMENT '任务生成时间',
  `task_end_date` datetime DEFAULT NULL COMMENT '任务结束时间',
  `car_count` int(11) NOT NULL DEFAULT '0' COMMENT '派发商品车数量',
  `task_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '任务状态(0-取消安排,1-已安排,2-已完成)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

