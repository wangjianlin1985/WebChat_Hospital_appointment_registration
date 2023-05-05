# WebChat_Hospital_appointment_registration
微信小程序医院预约挂号系统设计后端SSM可升级SpringBoot毕业源码案例设计

## 开发技术：微信小程序客户端 + Java后台服务器端 + mysql数据库

（1）登陆：用户可以通过手机号和验证码绑定登录小程序系统。
（2）修改个人资料：医生和用户都可以通过对在个人资料模块修改资料包括密码。
（3）用户：查看科室信息，查看医生信息，查看新闻信息，查看网站留言以及基本的登陆注册功能，我要预约以及我的预约信息，我要留言等功能。
（5）医生：我的病人信息管理模块，预约管理模块，留言列表，能够查看处理预约自己的看病请求。
（7）系统管理员：科室信息管理，医生信息管理，病人信息管理，预约信息管理，新闻信息管理，留言信息管理，用户信息管理等。

## 实体ER属性如下：
科室信息: 科室id,科室名称,科室介绍,成立日期,负责人

医生信息: 医生工号,登录密码,所在科室,医生姓名,性别,医生照片,入职日期,医生职位,工作经验,联系方式,擅长,医生介绍

病人信息: 病人id,医生,病人姓名,性别,身份证号,联系电话,病人病例,登记时间

预约信息: 预约id,预约用户,预约医生,预约日期,时段,联系电话,下单时间,处理状态,医生回复

新闻信息: 新闻id,新闻标题,新闻图片,新闻内容,新闻日期,新闻来源

留言: 留言id,留言标题,留言内容,留言人,留言时间,管理回复,回复时间

用户: 用户名,登录密码,姓名,性别,出生日期,用户照片,联系电话,邮箱,家庭地址,注册时间,微信openid
