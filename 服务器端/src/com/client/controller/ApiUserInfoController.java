package com.client.controller;

import java.util.HashMap;
import java.util.List;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.ui.Model;

import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;

import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;

import org.springframework.web.bind.annotation.ModelAttribute;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.chengxusheji.po.UserInfo;
import com.chengxusheji.service.UserInfoService;
import com.client.service.AuthService;
import com.client.utils.JsonResult;
import com.client.utils.JsonResultBuilder;
import com.client.utils.ReturnCode;

@RestController
@RequestMapping("/api/userInfo") 
public class ApiUserInfoController {
	@Resource UserInfoService userInfoService;
	@Resource AuthService authService;

	@InitBinder("userInfo")
	public void initBinderUserInfo(WebDataBinder binder) {
		binder.setFieldDefaultPrefix("userInfo.");
	}

	/*客户端ajax方式添加用户信息*/
	@RequestMapping(value = "/add", method = RequestMethod.POST)
	public JsonResult add(@Validated UserInfo userInfo, BindingResult br, Model model, HttpServletRequest request,HttpServletResponse response) throws Exception {
		//通过accessToken获取到用户信息 
		String userName = authService.getUserName(request);
		if(userName == null) return JsonResultBuilder.error(ReturnCode.TOKEN_VALID_ERROR);
		if (br.hasErrors()) //验证输入参数
			return JsonResultBuilder.error(ReturnCode.INPUT_PARAM_ERROR);
		if(userInfoService.getUserInfo(userInfo.getUser_name()) != null) //验证主键是否重复
			return JsonResultBuilder.error(ReturnCode.PRIMARY_EXIST_ERROR);
        userInfoService.addUserInfo(userInfo); //添加到数据库
        return JsonResultBuilder.ok();
	}

	/*客户端ajax更新用户信息*/
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	public JsonResult update(@Validated UserInfo userInfo, BindingResult br, Model model, HttpServletRequest request,HttpServletResponse response) throws Exception {
		//通过accessToken获取到用户信息 
		String userName = authService.getUserName(request);
		if(userName == null) return JsonResultBuilder.error(ReturnCode.TOKEN_VALID_ERROR);
		if (br.hasErrors())  //验证输入参数
			return JsonResultBuilder.error(ReturnCode.INPUT_PARAM_ERROR); 
        userInfoService.updateUserInfo(userInfo);  //更新记录到数据库
        return JsonResultBuilder.ok(userInfoService.getUserInfo(userInfo.getUser_name()));
	}
	
	
	/*ajax方式显示获取用户详细信息*/
	@RequestMapping(value="/selfGet",method=RequestMethod.POST)
	public JsonResult selfGetUserInfo(Model model,HttpServletRequest request,HttpServletResponse response) throws Exception {
		//通过accessToken获取到用户信息 
		String userName = authService.getUserName(request);
		if(userName == null) return JsonResultBuilder.error(ReturnCode.TOKEN_VALID_ERROR);
		/*根据主键user_name获取UserInfo对象*/
        UserInfo userInfo = userInfoService.getUserInfo(userName); 
        return JsonResultBuilder.ok(userInfo);
	}
	

	/*ajax方式显示获取用户详细信息*/
	@RequestMapping(value="/get/{user_name}",method=RequestMethod.POST)
	public JsonResult getUserInfo(@PathVariable String user_name,Model model,HttpServletRequest request,HttpServletResponse response) throws Exception {
        /*根据主键user_name获取UserInfo对象*/
        UserInfo userInfo = userInfoService.getUserInfo(user_name); 
        return JsonResultBuilder.ok(userInfo);
	}

	/*ajax方式删除用户记录*/
	@RequestMapping(value="/delete/{user_name}",method=RequestMethod.POST)
	public JsonResult deleteUserInfo(@PathVariable String user_name,Model model,HttpServletRequest request,HttpServletResponse response) throws Exception {
		//通过accessToken获取到用户信息 
		String userName = authService.getUserName(request);
		if(userName == null) return JsonResultBuilder.error(ReturnCode.TOKEN_VALID_ERROR);
		try {
			userInfoService.deleteUserInfo(user_name);
			return JsonResultBuilder.ok();
		} catch (Exception ex) {
			return JsonResultBuilder.error(ReturnCode.FOREIGN_KEY_CONSTRAINT_ERROR);
		}
	}

	//客户端查询用户信息
	@RequestMapping(value="/list",method=RequestMethod.POST)
	public JsonResult list(String user_name,String name,String birthDate,String telephone,Integer page,Integer rows, Model model, HttpServletRequest request,HttpServletResponse response) throws Exception {
		if (page==null || page == 0) page = 1;
		if (user_name == null) user_name = "";
		if (name == null) name = "";
		if (birthDate == null) birthDate = "";
		if (telephone == null) telephone = "";
		if(rows != 0)userInfoService.setRows(rows);
		List<UserInfo> userInfoList = userInfoService.queryUserInfo(user_name, name, birthDate, telephone, page);
	    /*计算总的页数和总的记录数*/
	    userInfoService.queryTotalPageAndRecordNumber(user_name, name, birthDate, telephone);
	    /*获取到总的页码数目*/
	    int totalPage = userInfoService.getTotalPage();
	    /*当前查询条件下总记录数*/
	    int recordNumber = userInfoService.getRecordNumber();
	    HashMap<String, Object> resultMap = new HashMap<String, Object>();
	    resultMap.put("totalPage", totalPage);
	    resultMap.put("list", userInfoList);
	    return JsonResultBuilder.ok(resultMap);
	}

	//客户端ajax获取所有用户
	@RequestMapping(value="/listAll",method=RequestMethod.POST)
	public JsonResult listAll() throws Exception{
		List<UserInfo> userInfoList = userInfoService.queryAllUserInfo(); 
		return JsonResultBuilder.ok(userInfoList);
	}
}

