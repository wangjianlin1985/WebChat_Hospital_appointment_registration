package com.client.controller;

import java.text.SimpleDateFormat;
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
import com.chengxusheji.po.Leaveword;
import com.chengxusheji.po.UserInfo;
import com.chengxusheji.service.LeavewordService;
import com.client.service.AuthService;
import com.client.utils.JsonResult;
import com.client.utils.JsonResultBuilder;
import com.client.utils.ReturnCode;

@RestController
@RequestMapping("/api/leaveword") 
public class ApiLeavewordController {
	@Resource LeavewordService leavewordService;
	@Resource AuthService authService;

	@InitBinder("userObj")
	public void initBinderuserObj(WebDataBinder binder) {
		binder.setFieldDefaultPrefix("userObj.");
	}
	@InitBinder("leaveword")
	public void initBinderLeaveword(WebDataBinder binder) {
		binder.setFieldDefaultPrefix("leaveword.");
	}

	/*客户端ajax方式添加留言信息*/
	@RequestMapping(value = "/add", method = RequestMethod.POST)
	public JsonResult add(@Validated Leaveword leaveword, BindingResult br, Model model, HttpServletRequest request,HttpServletResponse response) throws Exception {
		//通过accessToken获取到用户信息 
		String userName = authService.getUserName(request);
		if(userName == null) return JsonResultBuilder.error(ReturnCode.TOKEN_VALID_ERROR);
		if (br.hasErrors()) //验证输入参数
			return JsonResultBuilder.error(ReturnCode.INPUT_PARAM_ERROR);
        leavewordService.addLeaveword(leaveword); //添加到数据库
        return JsonResultBuilder.ok();
	}
	
	
	/*客户端ajax方式添加留言信息*/
	@RequestMapping(value = "/userAdd", method = RequestMethod.POST)
	public JsonResult userAdd(Leaveword leaveword, BindingResult br, Model model, HttpServletRequest request,HttpServletResponse response) throws Exception {
		//通过accessToken获取到用户信息 
		String userName = authService.getUserName(request);
		if(userName == null) return JsonResultBuilder.error(ReturnCode.TOKEN_VALID_ERROR);
		UserInfo userObj = new UserInfo();
		userObj.setUser_name(userName);
		leaveword.setUserObj(userObj);
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		leaveword.setLeaveTime(sdf.format(new java.util.Date()));
		leaveword.setReplyContent("--");
		leaveword.setReplyTime("--");
		
		if (br.hasErrors()) //验证输入参数
			return JsonResultBuilder.error(ReturnCode.INPUT_PARAM_ERROR);
        leavewordService.addLeaveword(leaveword); //添加到数据库
        return JsonResultBuilder.ok();
	}
	

	/*客户端ajax更新留言信息*/
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	public JsonResult update(@Validated Leaveword leaveword, BindingResult br, Model model, HttpServletRequest request,HttpServletResponse response) throws Exception {
		//通过accessToken获取到用户信息 
		String userName = authService.getUserName(request);
		if(userName == null) return JsonResultBuilder.error(ReturnCode.TOKEN_VALID_ERROR);
		if (br.hasErrors())  //验证输入参数
			return JsonResultBuilder.error(ReturnCode.INPUT_PARAM_ERROR); 
        leavewordService.updateLeaveword(leaveword);  //更新记录到数据库
        return JsonResultBuilder.ok(leavewordService.getLeaveword(leaveword.getLeaveWordId()));
	}

	/*ajax方式显示获取留言详细信息*/
	@RequestMapping(value="/get/{leaveWordId}",method=RequestMethod.POST)
	public JsonResult getLeaveword(@PathVariable int leaveWordId,Model model,HttpServletRequest request,HttpServletResponse response) throws Exception {
        /*根据主键leaveWordId获取Leaveword对象*/
        Leaveword leaveword = leavewordService.getLeaveword(leaveWordId); 
        return JsonResultBuilder.ok(leaveword);
	}

	/*ajax方式删除留言记录*/
	@RequestMapping(value="/delete/{leaveWordId}",method=RequestMethod.POST)
	public JsonResult deleteLeaveword(@PathVariable int leaveWordId,Model model,HttpServletRequest request,HttpServletResponse response) throws Exception {
		//通过accessToken获取到用户信息 
		String userName = authService.getUserName(request);
		if(userName == null) return JsonResultBuilder.error(ReturnCode.TOKEN_VALID_ERROR);
		try {
			leavewordService.deleteLeaveword(leaveWordId);
			return JsonResultBuilder.ok();
		} catch (Exception ex) {
			return JsonResultBuilder.error(ReturnCode.FOREIGN_KEY_CONSTRAINT_ERROR);
		}
	}

	//客户端查询留言信息
	@RequestMapping(value="/list",method=RequestMethod.POST)
	public JsonResult list(String leaveTitle,@ModelAttribute("userObj") UserInfo userObj,String leaveTime,Integer page,Integer rows, Model model, HttpServletRequest request,HttpServletResponse response) throws Exception {
		//通过accessToken获取到用户信息 
		String userName = authService.getUserName(request);
		if(userName == null) return JsonResultBuilder.error(ReturnCode.TOKEN_VALID_ERROR);
		userObj = new UserInfo();
		userObj.setUser_name(userName);
		if (page==null || page == 0) page = 1;
		if (leaveTitle == null) leaveTitle = "";
		if (leaveTime == null) leaveTime = "";
		if(rows != 0)leavewordService.setRows(rows);
		List<Leaveword> leavewordList = leavewordService.queryLeaveword(leaveTitle, userObj, leaveTime, page);
	    /*计算总的页数和总的记录数*/
	    leavewordService.queryTotalPageAndRecordNumber(leaveTitle, userObj, leaveTime);
	    /*获取到总的页码数目*/
	    int totalPage = leavewordService.getTotalPage();
	    /*当前查询条件下总记录数*/
	    int recordNumber = leavewordService.getRecordNumber();
	    HashMap<String, Object> resultMap = new HashMap<String, Object>();
	    resultMap.put("totalPage", totalPage);
	    resultMap.put("list", leavewordList);
	    return JsonResultBuilder.ok(resultMap);
	}

	//客户端ajax获取所有留言
	@RequestMapping(value="/listAll",method=RequestMethod.POST)
	public JsonResult listAll() throws Exception{
		List<Leaveword> leavewordList = leavewordService.queryAllLeaveword(); 
		return JsonResultBuilder.ok(leavewordList);
	}
}

