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
BEGIN
IF(new.drive_id>0&&new.rel_id>0&&new.repair_status=1) THEN
update truck_dispatch set dispatch_flag =1 where truck_id = new.id;
ELSEIF(new.drive_id=0||new.rel_id=0||new.repair_status=0) THEN
update truck_dispatch set dispatch_flag =0 where truck_id = new.id;
END IF;
END $$
delimiter ;
-- ----------------------------
-- Table structure for dp_task_stat
-- ----------------------------
DROP TABLE IF EXISTS `dp_task_stat`;
CREATE TABLE `dp_task_stat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `route_start_id` int(10) NOT NULL COMMENT '起始地ID',
  `base_addr_id` int(10) NOT NULL COMMENT '起始地发货地址ID',
  `route_end_id` int(10) NOT NULL COMMENT '目的地ID',
  `receive_id` int(10) NOT NULL COMMENT '经销商ID',
  `pre_count` int(10) NOT NULL DEFAULT '0' COMMENT '指令安排台数',
  `plan_count` int(10) NOT NULL DEFAULT '0' COMMENT '已派发台数',
  `date_id` int(4) NOT NULL COMMENT '指令时间',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`route_start_id`,`base_addr_id`,`route_end_id`,`receive_id`,`date_id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for dp_route_task
-- ----------------------------
DROP TABLE IF EXISTS `dp_route_task`;
CREATE TABLE `dp_route_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL COMMENT '指令调度人ID',
  `truck_id` int(10) NOT NULL COMMENT '货车ID',
  `drive_id` int(10) NOT NULL COMMENT '司机ID',
  `route_start_id` int(10) NOT NULL COMMENT '城市线路ID',
  `route_end_id` int(10) NOT NULL COMMENT '目的地ID',
  `distance` decimal(10,2) NOT NULL COMMENT '公里数',
  `task_plan_date` datetime DEFAULT NULL COMMENT '任务计划时间',
  `task_start_date` datetime DEFAULT NULL COMMENT '任务起始时间',
  `task_end_date` datetime DEFAULT NULL COMMENT '任务完成时间',
  `date_id` int(4) NOT NULL COMMENT '任务完成统计时间',
  `car_count` int(10) NOT NULL DEFAULT '0' COMMENT '实际装车商品车数量',
  `task_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '指令状态(1-待接受,2-接受,3执行,4-在途,8-取消安排,9-已完成)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for dp_route_load_task
-- ----------------------------
DROP TABLE IF EXISTS `dp_route_load_task`;
CREATE TABLE `dp_route_load_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL COMMENT '派发人ID',
  `demand_id` int(10) NOT NULL COMMENT '调度需求ID',
  `dp_route_task_id` int(10) NOT NULL COMMENT '任务路线ID',
  `route_start_id` int(10) NOT NULL COMMENT '城市线路ID',
  `base_addr_id` int(10) NOT NULL COMMENT '起始地发货地址ID',
  `route_end_id` int(10) NOT NULL COMMENT '目的地ID',
  `receive_id` int(10) NOT NULL COMMENT '经销商ID',
  `date_id` int(4) NOT NULL COMMENT '指令时间',
  `load_date` datetime DEFAULT NULL COMMENT '装车时间',
  `plan_count` int(10) NOT NULL DEFAULT '0' COMMENT '派发商品车数量',
  `load_task_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '任务状态(1-未装车,3-已装车,7-已到达,8-取消任务,9-已完成)',
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
  `car_load_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '商品车状态(1-已装车,2-已送达)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- ----------------------------
-- Table structure for dp_demand_info
-- ----------------------------
DROP TABLE IF EXISTS `dp_demand_info`;
CREATE TABLE `dp_demand_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL COMMENT '操作人ID',
  `route_start_id` int(10) NOT NULL COMMENT '起始地ID',
  `route_start` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '起始地城市',
  `base_addr_id` int(10) NOT NULL DEFAULT '0' COMMENT '起始地发货地址ID',
  `route_end_id` int(10) NOT NULL COMMENT '目的地ID',
  `route_end` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '目的地城市',
  `receive_id` int(10) NOT NULL COMMENT '经销商ID',
  `pre_count` int(10) NOT NULL DEFAULT '0' COMMENT '指令安排台数',
  `date_id` int(4) NOT NULL COMMENT '指令时间',
  `demand_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '需求状态(0-取消,1-正常)',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- ----------------------------
--  Triggers structure for table dp_demand_info
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_new_demand_stat`;
delimiter $$
CREATE TRIGGER `trg_new_demand_stat` AFTER INSERT ON `dp_demand_info` FOR EACH ROW
BEGIN
INSERT INTO dp_task_stat(route_start_id,base_addr_id,route_end_id,receive_id,date_id,pre_count)
VALUES (new.route_start_id,new.base_addr_id,new.route_end_id,new.receive_id,new.date_id,new.pre_count)
ON DUPLICATE KEY UPDATE pre_count = pre_count+ new.pre_count ,task_stat_status=1;
END $$
delimiter ;

DROP TRIGGER IF EXISTS `trg_update_demand_stat`;
delimiter $$
CREATE TRIGGER `trg_update_demand_stat` AFTER UPDATE ON `dp_demand_info` FOR EACH ROW
BEGIN
IF (new.demand_status=0 && old.demand_status=1)THEN
UPDATE dp_task_stat set pre_count = pre_count- new.pre_count
where route_start_id=new.route_start_id and base_addr_id=new.base_addr_id
and route_end_id=new.route_end_id and receive_id = new.receive_id and date_id = new.date_id;
END IF;
IF (new.demand_status=2)THEN
UPDATE dp_task_stat set  task_stat_status = 2
where route_start_id=old.route_start_id and base_addr_id=old.base_addr_id
and route_end_id=old.route_end_id and receive_id = old.receive_id and date_id = old.date_id
and (select count(id) from dp_demand_info where date_id =old.date_id)=0 ;
END IF;
IF(new.user_id=0) THEN
UPDATE dp_task_stat set pre_count = pre_count + (new.pre_count - old.pre_count)
where route_start_id=new.route_start_id and base_addr_id=new.base_addr_id
and route_end_id=new.route_end_id and receive_id = new.receive_id and date_id = new.date_id;
END IF;
END $$
delimiter ;

-- ----------------------------
--  Triggers structure for table car_info
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_new_car`;
delimiter $$
CREATE TRIGGER `trg_new_car` AFTER INSERT ON `car_info` FOR EACH ROW
BEGIN
set @count = (select count(*) from dp_demand_info
where user_id=0 and route_start_id=new.route_start_id and base_addr_id=new.base_addr_id
 and route_end_id = new.route_end_id and receive_id=new.receive_id and date_id = DATE_FORMAT(new.order_date,'%Y%m%d'));
IF(new.route_end_id>0 && new.car_status=1&&new.receive_id>0&&new.order_date is not null && @count=0) THEN
INSERT INTO dp_demand_info(user_id,route_start_id,route_start,base_addr_id,route_end_id,route_end,receive_id,date_id,pre_count)
VALUES (0,new.route_start_id,new.route_start,new.base_addr_id,new.route_end_id,new.route_end,new.receive_id,DATE_FORMAT(new.order_date,'%Y%m%d'),1);
ELSEIF (new.route_end_id>0 && new.car_status=1&&new.receive_id>0&&new.order_date is not null&&@count>0) THEN
UPDATE dp_demand_info set pre_count=pre_count+1 where user_id=0 and route_start_id=new.route_start_id and base_addr_id=new.base_addr_id
 and route_end_id = new.route_end_id and receive_id=new.receive_id and date_id = DATE_FORMAT(new.order_date,'%Y%m%d');
END IF ;
END $$
delimiter ;

ALTER TABLE `truck_repair_rel`
ADD COLUMN `repair_user`  varchar(50) NULL COMMENT '维修人姓名' AFTER `drive_name`;
ALTER TABLE `drive_info`
ADD COLUMN `driver_image_re`  varchar(100) NULL COMMENT '司机身份证反面照片' AFTER `drive_image`,
ADD COLUMN `op_license_image`  varchar(100) NULL COMMENT '准驾证照片' AFTER `license_image`,
ADD COLUMN `driver_avatar_image`  varchar(100) NULL COMMENT '司机个人照片' AFTER `op_license_image`;
ALTER TABLE `truck_info`
DROP COLUMN `copilot`,
ADD COLUMN `vice_drive_id`  int(10) NULL DEFAULT 0 COMMENT '副驾ID' AFTER `drive_id`;


-- ----------------------------
--  Triggers structure for table dp_route_load_task
-- ----------------------------
DROP TRIGGER IF EXISTS `trg_new_load_task`;
delimiter $$
CREATE TRIGGER `trg_new_load_task` AFTER INSERT ON `dp_route_load_task` FOR EACH ROW
BEGIN

UPDATE dp_demand_info set plan_count=plan_count+new.plan_count where id= new.demand_id ;
UPDATE dp_task_stat set plan_count = plan_count+new.plan_count where route_start_id=new.route_start_id
and base_addr_id=new.base_addr_id and route_end_id = new.route_end_id and receive_id=new.receive_id and date_id = new.date_id;

END $$
delimiter ;

DROP TRIGGER IF EXISTS `trg_update_load_task`;
delimiter $$
CREATE TRIGGER `trg_update_load_task` AFTER UPDATE ON `dp_route_load_task` FOR EACH ROW
BEGIN
IF(new.load_task_status=8 && old.load_task_status<>8) THEN
UPDATE dp_demand_info set plan_count=plan_count-old.plan_count where id= new.demand_id ;
UPDATE dp_task_stat set plan_count = plan_count-old.plan_count where route_start_id=new.route_start_id
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
END $$
delimiter ;

DROP TRIGGER IF EXISTS `trg_update_route_task`;
delimiter $$
CREATE TRIGGER `trg_update_route_task` AFTER UPDATE ON `dp_route_task` FOR EACH ROW
BEGIN
IF(new.task_status=4 && old.task_status<>4) THEN
UPDATE truck_dispatch set current_city= 0 , task_start = old.route_start_id ,task_end=old.route_end_id,car_count=new.car_count
where truck_id=old.truck_id ;
END IF;
END $$;
delimiter ;

