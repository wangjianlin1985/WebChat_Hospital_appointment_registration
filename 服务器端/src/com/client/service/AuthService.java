package com.client.service;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.client.utils.AppException;
import com.client.utils.Cache;
import com.client.utils.HttpRequest;
import com.client.utils.JsonUtils;
import com.client.utils.ReturnCode;
import com.client.utils.SessionConsts;
import com.client.utils.UserToken;
import com.client.utils.WeixinToken;

@Service
public class AuthService {
	
	/**
	 * 请求微信服务器获取用户openid
	 * @param jsCode 微信小程序发来的有效凭证
	 * @return
	 */
	public String getOpenId(String jsCode) {
		 
		/*
		 * 获取微信openID接口地址请求格式
		 * https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
		 */
		String param = "appid="+SessionConsts.APP_ID+"&secret="+SessionConsts.APP_SECRET+"&js_code="+jsCode+"&grant_type=authorization_code";
		try {
			String result = HttpRequest.sendGet("https://api.weixin.qq.com/sns/jscode2session", param);
			WeixinToken weixinToken = JsonUtils.jsonToObject(result, WeixinToken.class);
			return weixinToken.getOpenid(); 
		} catch (Exception e) {
			throw new AppException(ReturnCode.FAIL_LOGIN);
		}
	}
	
	
	
	/**
	 * 登录保存用户信息
	 * @param userToken
	 * @return
	 */ 
	public boolean setUserToken(String authToken, UserToken userToken) {
		//设置用户Token有效时间2小时
		Cache.put(authToken, userToken, 60 * 60 * 2 * 1000);
		return Cache.get(authToken) != null; 
	}
	
	
	/**
	 * 获取用户登录信息
	 * @return 用户登录信息
	 */
	public UserToken getUserToken(String authToken) {
	    if (authToken==null || authToken.equals("")) {
	    	return null;
	    }
		// 从缓存中获取用户信息
	    return Cache.get(authToken);
	}
	
	/**
	 * 判断用户Token凭证是否有效
	 * @param authToken
	 * @return
	 */
	public boolean isValid(String authToken) {
	    return getUserToken(authToken) != null;
	}
	
	
	public String getUserName(HttpServletRequest request) {
		//通过accessToken获取到用户信息
		String authToken = request.getHeader(SessionConsts.AUTH_TOKEN_NAME);
		if(!isValid(authToken)) return null; 
		UserToken userToken = getUserToken(authToken);
		return userToken.getUserName();
	}
	

}
