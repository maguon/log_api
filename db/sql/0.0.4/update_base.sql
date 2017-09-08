-- ----------------------------
-- Table structure for drive_refuel
-- ----------------------------
DROP TABLE IF EXISTS `drive_refuel`;
CREATE TABLE `drive_refuel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `drive_id` int(10) NOT NULL DEFAULT '0' COMMENT '司机ID',
  `truck_id` int(10) NOT NULL DEFAULT '0' COMMENT '货车ID',
  `date_id` int(4) NOT NULL COMMENT '加油申报时间',
  `refuel_date` datetime DEFAULT NULL COMMENT '加油时间',
  `refuel_volume` decimal(10,2) NOT NULL COMMENT '加油量',
  `city_route_id` int(10) DEFAULT NULL COMMENT '城市路线ID',
  `refuel_address_type` tinyint(1) NOT NULL COMMENT '加油地类别(1-内部加油,2-外部加油)',
  `refuel_address` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '加油详细地址',
  `lng` decimal(10,5) DEFAULT NULL COMMENT '经度',
  `lat` decimal(10,5) DEFAULT NULL COMMENT '纬度',
  `refuel_money` decimal(10,2) DEFAULT NULL COMMENT '加油金额',
  `check_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '审核状态(1-待审核,2-通过,3-拒绝)',
  `check_reason` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '审核拒绝原因',
  `check_user_id` int(10) DEFAULT NULL COMMENT '审核人ID',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `drive_info`
ADD UNIQUE INDEX `tel` (`tel`) ;