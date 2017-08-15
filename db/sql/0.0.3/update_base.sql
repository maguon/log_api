ALTER TABLE `truck_info`
ADD COLUMN `usable_flag`  tinyint(1) NOT NULL DEFAULT 0 COMMENT '货车可用运力标识' AFTER `truck_status`;
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