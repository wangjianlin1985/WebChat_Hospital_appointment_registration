package com.client.controller;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.chengxusheji.po.UserInfo;
import com.chengxusheji.service.UserInfoService;
import com.client.service.AuthService;
import com.client.utils.HttpRequest;
import com.client.utils.JsonResult;
import com.client.utils.JsonResultBuilder;
import com.client.utils.ReturnCode;
import com.client.utils.SessionConsts;
import com.client.utils.UUIDGenerator;
import com.client.utils.UserToken;
import com.client.utils.WeixinLoginParams;

//小程序认证管理控制层
@RestController
@RequestMapping("/auth")
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
public class AuthController {

	@Resource
	private AuthService authService;

	@Resource
	private UserInfoService userInfoService;

	/**
	 * 小程序客户端用户注册
	 * @param avatarUrl 头像地址
	 * @param genDer 性别：1代表男
	 * @param nickName 昵称
	 * @param tel  手机号
	 * @param jsCode 获取微信openid的凭证
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/register",method=RequestMethod.POST)
	public JsonResult register(String avatarUrl,String genDer,String nickName,String tel,String jsCode,HttpServletRequest request) throws Exception {
		//获取小程序用户的微信唯一标识openid
		String openId = authService.getOpenId(jsCode);
		//将微信身份标识和用户表进行关联
		UserInfo userInfo = new UserInfo();
		String baseDir = "/upload"; /**保存图像目录路径**/
		String realPathDir = request.getSession().getServletContext().getRealPath(baseDir);  
		String fileName = UUIDGenerator.generate();
		String savePath = realPathDir +  File.separator + fileName;
		HttpRequest.downImage(avatarUrl.replace("https://", "http://"), savePath);
		
		
		//用户信息初始化，包括用户头像，昵称，电话号码，性别等
		userInfo.setUser_name(tel);
		userInfo.setPassword("--");
		userInfo.setAddress("--");
		userInfo.setBirthDate("2020-01-01");
		userInfo.setEmail("--");
		userInfo.setGender(genDer.equals("1")?"男":"女");
		userInfo.setName(nickName);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		userInfo.setRegTime(sdf.format(new java.util.Date()));
		userInfo.setTelephone("--"); 
		userInfo.setUserPhoto("upload/" + fileName);  
	 
		userInfoService.addUserInfo(userInfo);
		userInfoService.updateUserInfoOpenid(userInfo.getUser_name(), openId);

		//生成用户Token
		String authToken = UUIDGenerator.generate();
		UserToken userToken = new UserToken();
		userToken.setUserName(userInfo.getUser_name());
		//将用户Token和用户信息关联起来，放入缓存
		if (authService.setUserToken(authToken, userToken))
			return JsonResultBuilder.ok(SessionConsts.AUTH_TOKEN_KEY, authToken);
		else
			return JsonResultBuilder.error(ReturnCode.CACHE_SET_ERROR);
	}

	/**
	 * 小程序客户端用户请求登录，登录成功返回Token
	 * @param params
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/appLogin",method=RequestMethod.POST)
	public JsonResult login(WeixinLoginParams params) throws Exception {
		try {
			//根据用户发来的凭证调用微信接口获取用户唯一标识openid
			String openid = authService.getOpenId(params.getJscode());
			//根据openid查询关联的用户记录
			UserInfo userInfo = userInfoService.getUserInfoByOpenid(openid);
			if(userInfo == null) 
				return JsonResultBuilder.error(ReturnCode.USER_NOT_LOGIN);
			//生成用户Token，将用户Token和用户信息关联起来，放入缓存
			UserToken userToken = new UserToken();
			userToken.setUserName(userInfo.getUser_name());
			String authToken = UUIDGenerator.generate();
			
			Map<String,String> resultMap = new HashMap<String,String>(); 
			resultMap.put(SessionConsts.AUTH_TOKEN_KEY, authToken);
			resultMap.put("avatarUrl", userInfo.getUserPhotoUrl());
			resultMap.put("nickName", userInfo.getName());

			if (authService.setUserToken(authToken, userToken))
				return JsonResultBuilder.ok(resultMap);
			else
				return JsonResultBuilder.error(ReturnCode.CACHE_SET_ERROR);

			 
		} catch (Exception ex) {
			return JsonResultBuilder.error(ReturnCode.FAIL_LOGIN);
		}
	}

	/**
	 * 给手机号发送短信验证码
	 * @param tel 要发送短信的手机号
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/mobile/code",method=RequestMethod.POST)
	public JsonResult sendCode(String tel) throws Exception { 
		String uid = "";  //调用短信平台的用户名
		String pwd = "";  //调用短信平台的密码 
		String telCodes = "1234";
		String message = "【XXX】短信验证码为" + telCodes;
		//String sendUrl = "https://api.smsbao.com/sms?u="+uid+"&p="+pwd+"&m="+tel+"&c=" + urlencode(message);
		//这里可以调用短信中心发送短信验证码哈
		return JsonResultBuilder.ok(telCodes);
	}
}

