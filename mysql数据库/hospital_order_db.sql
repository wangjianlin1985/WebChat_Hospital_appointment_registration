/*
 Navicat Premium Data Transfer

 Source Server         : mysql5.6
 Source Server Type    : MySQL
 Source Server Version : 50620
 Source Host           : localhost:3306
 Source Schema         : hospital_order_db

 Target Server Type    : MySQL
 Target Server Version : 50620
 File Encoding         : 65001

 Date: 19/03/2021 19:47:11
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `username` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `password` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`username`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES ('a', 'a');

-- ----------------------------
-- Table structure for t_department
-- ----------------------------
DROP TABLE IF EXISTS `t_department`;
CREATE TABLE `t_department`  (
  `departmentId` int(11) NOT NULL AUTO_INCREMENT COMMENT '科室id',
  `departmentName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '科室名称',
  `departmentDesc` varchar(5000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '科室介绍',
  `birthDate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '成立日期',
  `chargeMan` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '负责人',
  PRIMARY KEY (`departmentId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_department
-- ----------------------------
INSERT INTO `t_department` VALUES (1, '肝胆外科', '主要检查和治疗肝胆内脏疾病信息', '2021-03-02', '王晓婷');
INSERT INTO `t_department` VALUES (2, '消化内科', '消化内科各种疾病诊治', '2021-03-10', '李明德');

-- ----------------------------
-- Table structure for t_doctor
-- ----------------------------
DROP TABLE IF EXISTS `t_doctor`;
CREATE TABLE `t_doctor`  (
  `doctorNumber` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'doctorNumber',
  `password` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '登录密码',
  `departmentObj` int(11) NOT NULL COMMENT '所在科室',
  `doctorName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '医生姓名',
  `sex` varchar(4) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '性别',
  `doctorPhoto` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '医生照片',
  `birthDate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '出生日期',
  `position` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '医生职位',
  `experience` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '工作经验',
  `contactWay` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '联系方式',
  `goodAt` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '擅长',
  `doctorDesc` varchar(8000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '医生介绍',
  PRIMARY KEY (`doctorNumber`) USING BTREE,
  INDEX `departmentObj`(`departmentObj`) USING BTREE,
  CONSTRAINT `t_doctor_ibfk_1` FOREIGN KEY (`departmentObj`) REFERENCES `t_department` (`departmentId`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_doctor
-- ----------------------------
INSERT INTO `t_doctor` VALUES ('YS001', '123', 1, '王大山', '男', 'upload/4f632cef-d364-4470-8535-7af198873160.jpg', '2021-03-02', '主任医师', '8年', '13508310123', '肝胆外科', '多年肝胆疾病临床经验，擅长各种肝病的治疗和胆结石的微创治疗！');
INSERT INTO `t_doctor` VALUES ('YS002', '123', 2, '张晓娜', '女', 'upload/2a7de47b-902a-4d19-aafb-9e14ee9b9b75.jpg', '2021-03-09', '一级专家', '5年', '13058021083', '内科', '5年临床经验，擅长各种内科疾病的诊治');
INSERT INTO `t_doctor` VALUES ('YS003', '123', 1, '李晓涛', '男', 'upload/3850435a-86b8-4788-9d23-1d841c4035b5.jpg', '2021-03-16', '二级专家', '6年', '13508021023', '慢性肝病和胆结石', '多年经验，丰富呢！');

-- ----------------------------
-- Table structure for t_leaveword
-- ----------------------------
DROP TABLE IF EXISTS `t_leaveword`;
CREATE TABLE `t_leaveword`  (
  `leaveWordId` int(11) NOT NULL AUTO_INCREMENT COMMENT '留言id',
  `leaveTitle` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '留言标题',
  `leaveContent` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '留言内容',
  `userObj` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '留言人',
  `leaveTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '留言时间',
  `replyContent` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '管理回复',
  `replyTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '回复时间',
  PRIMARY KEY (`leaveWordId`) USING BTREE,
  INDEX `userObj`(`userObj`) USING BTREE,
  CONSTRAINT `t_leaveword_ibfk_1` FOREIGN KEY (`userObj`) REFERENCES `t_userinfo` (`user_name`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_leaveword
-- ----------------------------
INSERT INTO `t_leaveword` VALUES (1, '111', '222', '13508123423', '2021-03-18 19:45:15', '333', '2021-03-18 19:45:16');
INSERT INTO `t_leaveword` VALUES (2, '我想看胃病', '我的胃不太舒服！', '13649023423', '2021-03-19 19:27:06', '可以找医生看吧', '2021-03-19 19:44:05');
INSERT INTO `t_leaveword` VALUES (3, '可以帮家人挂号吗', '我家人要是不舒服可以挂号吗？', '13649023423', '2021-03-19 19:27:34', '--', '--');

-- ----------------------------
-- Table structure for t_news
-- ----------------------------
DROP TABLE IF EXISTS `t_news`;
CREATE TABLE `t_news`  (
  `newsId` int(11) NOT NULL AUTO_INCREMENT COMMENT '新闻id',
  `newsTitle` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '新闻标题',
  `newsPhoto` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '新闻图片',
  `newsContent` varchar(8000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '新闻内容',
  `newsDate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '新闻日期',
  `newsFrom` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '新闻来源',
  PRIMARY KEY (`newsId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_news
-- ----------------------------
INSERT INTO `t_news` VALUES (1, '医院预约小程序上线了', 'upload/d5e5050d-28b8-4d96-8960-91ca2d4db365.jpg', '朋友们以后可以通过这个平台预约医生了！', '2021-03-18', '官方');
INSERT INTO `t_news` VALUES (2, '小程序预约更方便', 'upload/eaf51e5b-ab34-47d2-989a-ed2eb11fd12f.jpg', '只要有微信就能关注我们小程序，预约看病更方便', '2021-03-16', '医院官方');

-- ----------------------------
-- Table structure for t_orderinfo
-- ----------------------------
DROP TABLE IF EXISTS `t_orderinfo`;
CREATE TABLE `t_orderinfo`  (
  `orderId` int(11) NOT NULL AUTO_INCREMENT COMMENT '预约id',
  `userObj` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '预约用户',
  `doctorObj` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '预约医生',
  `orderDate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '预约日期',
  `timeInterval` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '时段',
  `telephone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '联系电话',
  `orderTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '下单时间',
  `checkState` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '处理状态',
  `replyContent` varchar(800) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '医生回复',
  PRIMARY KEY (`orderId`) USING BTREE,
  INDEX `userObj`(`userObj`) USING BTREE,
  INDEX `doctorObj`(`doctorObj`) USING BTREE,
  CONSTRAINT `t_orderinfo_ibfk_1` FOREIGN KEY (`userObj`) REFERENCES `t_userinfo` (`user_name`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `t_orderinfo_ibfk_2` FOREIGN KEY (`doctorObj`) REFERENCES `t_doctor` (`doctorNumber`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_orderinfo
-- ----------------------------
INSERT INTO `t_orderinfo` VALUES (1, '13508123423', 'YS001', '2021-03-24', '上午', '13081082342', '2021-03-16 19:44:15', '待处理', '--');
INSERT INTO `t_orderinfo` VALUES (2, '13649023423', 'YS002', '2021-03-20', '下午', '13058092342', '2021-03-19 15:42:19', '同意', '你2点左右来吧');
INSERT INTO `t_orderinfo` VALUES (3, '13649023423', 'YS001', '2021-03-22', '上午', '13058210834', '2021-03-19 19:20:23', '同意', '你早上9点左右来，注意需要空腹');

-- ----------------------------
-- Table structure for t_patient
-- ----------------------------
DROP TABLE IF EXISTS `t_patient`;
CREATE TABLE `t_patient`  (
  `patientId` int(11) NOT NULL AUTO_INCREMENT COMMENT '病人id',
  `doctorObj` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '医生',
  `patientName` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '病人姓名',
  `sex` varchar(4) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '性别',
  `cardNumber` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '身份证号',
  `telephone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '联系电话',
  `illnessCase` varchar(8000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '病人病例',
  `addTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '登记时间',
  PRIMARY KEY (`patientId`) USING BTREE,
  INDEX `doctorObj`(`doctorObj`) USING BTREE,
  CONSTRAINT `t_patient_ibfk_1` FOREIGN KEY (`doctorObj`) REFERENCES `t_doctor` (`doctorNumber`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_patient
-- ----------------------------
INSERT INTO `t_patient` VALUES (1, 'YS001', '王喜天', '女', '513030199811242081', '13508010834', '此病人有哮喘，不过不严重', '2021-03-09 19:33:10');
INSERT INTO `t_patient` VALUES (2, 'YS002', '王曦', '男', '513030199611223042', '13508082342', '这个病人有慢性胃炎，腿脚不方便', '2021-03-19 18:15:20');
INSERT INTO `t_patient` VALUES (3, 'YS001', '李全天', '男', '513030199311241083', '13508108931', '此病人刚检查出来，有慢性胆囊炎，先保守治疗', '2021-03-19 19:36:43');

-- ----------------------------
-- Table structure for t_userinfo
-- ----------------------------
DROP TABLE IF EXISTS `t_userinfo`;
CREATE TABLE `t_userinfo`  (
  `user_name` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'user_name',
  `password` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '登录密码',
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '姓名',
  `gender` varchar(4) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '性别',
  `birthDate` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '出生日期',
  `userPhoto` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户照片',
  `telephone` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '联系电话',
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '邮箱',
  `address` varchar(80) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '家庭地址',
  `regTime` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '注册时间',
  `openid` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`user_name`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_userinfo
-- ----------------------------
INSERT INTO `t_userinfo` VALUES ('13508123423', '123', '李小双', '男', '2021-03-09', 'upload/NoImage.jpg', '13510834234', 'tesat@163.com', 'fasfasf', '2021-03-18 19:33:59', NULL);
INSERT INTO `t_userinfo` VALUES ('13649023423', '--', '牵着蜗牛去逛街', '男', '2020-01-01', 'upload/431b96cfd2a2490282a348741eb7e294', '13058129342', 'dashen@126.com', '四川省成都二仙桥10号', '2021-03-19 00:45:25', 'oM7Mu5XyeVJSc8roaUCRlcz_IP9k');

SET FOREIGN_KEY_CHECKS = 1;
