SET NAMES utf8mb4;

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for admin_user
-- ----------------------------
DROP TABLE IF EXISTS `admin_user`;
CREATE TABLE `admin_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `user_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户名',
  `real_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '真实姓名',
  `password` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户密码',
  `role_id` int(10) DEFAULT NULL COMMENT '角色ID',
  `mobile` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for app_version
-- ----------------------------
DROP TABLE IF EXISTS `app_version`;
CREATE TABLE `app_version` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `app` tinyint(1) unsigned NOT NULL,
  `type` tinyint(1) NOT NULL,
  `version` varchar(20) NOT NULL,
  `url` varchar(200) NOT NULL,
  `force_update` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `remark` varchar(400) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for city_info
-- ----------------------------
DROP TABLE IF EXISTS `city_info`;
CREATE TABLE `city_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `city_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '城市名称',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for company_info
-- ----------------------------
DROP TABLE IF EXISTS `company_info`;
CREATE TABLE `company_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `company_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '公司名称',
  `operate_type` tinyint(1) DEFAULT '1' COMMENT '所属类型(1-自营,2-承包,3-供方,4-外协)',
  `cooperation_time` datetime DEFAULT NULL,
  `contacts` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tel` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '电话',
  `city_id` int(10) DEFAULT NULL COMMENT '城市ID',
  `remark` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for department
-- ----------------------------
DROP TABLE IF EXISTS `department`;
CREATE TABLE `department` (
  `dept_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增唯一ID',
  `dept_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '部门名称',
  `tel` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '电话',
  `fax` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '传真',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`dept_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for drive_info
-- ----------------------------
DROP TABLE IF EXISTS `drive_info`;
CREATE TABLE `drive_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `drive_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '司机姓名',
  `gender` char(1) COLLATE utf8mb4_unicode_ci DEFAULT '1' COMMENT '性别',
  `truck_id` int(10) DEFAULT NULL COMMENT '头车ID',
  `id_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '身份证号码',
  `tel` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '电话',
  `company_id` int(10) DEFAULT NULL COMMENT '所属公司ID',
  `drive_status` tinyint(1) DEFAULT '1' COMMENT '司机状态(0-正常,1-停用)',
  `license_level` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '驾驶证级别',
  `license_date` datetime DEFAULT NULL COMMENT '驾驶证到期日期',
  `drive_image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '司机照片',
  `license_image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '驾驶证照片',
  `remark` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for truck_brand
-- ----------------------------
DROP TABLE IF EXISTS `truck_brand`;
CREATE TABLE `truck_brand` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `brand_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '品牌名称',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for truck_info
-- ----------------------------
DROP TABLE IF EXISTS `truck_info`;
CREATE TABLE `truck_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `truck_num` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '车牌号或挂车号',
  `brand_id` int(10) DEFAULT NULL COMMENT '品牌ID',
  `truck_tel` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '随车电话',
  `the_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '车辆识别代码(头车/挂车车架号)',
  `drive_id` int(10) DEFAULT NULL COMMENT '主驾ID',
  `copilot` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '副驾',
  `company_id` int(10) DEFAULT NULL COMMENT '所属公司ID',
  `truck_type` tinyint(1) DEFAULT '1' COMMENT '车辆类型(1-车头,2-挂车)',
  `rel_id` int(10) DEFAULT '0' COMMENT '车辆关联ID(默认为0)',
  `truck_status` tinyint(1) DEFAULT '0' COMMENT '车辆状态(0-可用,1-维修,2-停用)',
  `number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '板车位数',
  `driving_image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '行驶证照片',
  `operation_image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '营运证照片',
  `remark` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '备注',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `uid` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一自增ID',
  `user_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户名',
  `real_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '真实姓名',
  `password` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户密码',
  `type` tinyint(1) DEFAULT '0' COMMENT '用户类型',
  `role_id` int(10) DEFAULT NULL COMMENT '角色ID',
  `dept_id` int(10) DEFAULT NULL COMMENT '部门ID',
  `gender` char(1) COLLATE utf8mb4_unicode_ci DEFAULT '1' COMMENT '性别',
  `tel` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '电话',
  `fax` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '传真',
  `mobile` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号',
  `email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '邮箱',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态',
  `work_status` tinyint(1) DEFAULT '0' COMMENT '工作状态(0-正常,1-停用)',
  `last_login_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最后登录时间',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table structure for user_role
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '角色名称',
  `role_sort` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '角色排序号',
  `func_id_str` varchar(10000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '角色对应的功能ID串',
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;