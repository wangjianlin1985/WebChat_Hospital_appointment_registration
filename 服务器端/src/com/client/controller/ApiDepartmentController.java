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
import com.chengxusheji.po.Department;
import com.chengxusheji.service.DepartmentService;
import com.client.service.AuthService;
import com.client.utils.JsonResult;
import com.client.utils.JsonResultBuilder;
import com.client.utils.ReturnCode;

@RestController
@RequestMapping("/api/department") 
public class ApiDepartmentController {
	@Resource DepartmentService departmentService;
	@Resource AuthService authService;

	@InitBinder("department")
	public void initBinderDepartment(WebDataBinder binder) {
		binder.setFieldDefaultPrefix("department.");
	}

	/*客户端ajax方式添加科室信息信息*/
	@RequestMapping(value = "/add", method = RequestMethod.POST)
	public JsonResult add(@Validated Department department, BindingResult br, Model model, HttpServletRequest request,HttpServletResponse response) throws Exception {
		//通过accessToken获取到用户信息 
		String userName = authService.getUserName(request);
		if(userName == null) return JsonResultBuilder.error(ReturnCode.TOKEN_VALID_ERROR);
		if (br.hasErrors()) //验证输入参数
			return JsonResultBuilder.error(ReturnCode.INPUT_PARAM_ERROR);
        departmentService.addDepartment(department); //添加到数据库
        return JsonResultBuilder.ok();
	}

	/*客户端ajax更新科室信息信息*/
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	public JsonResult update(@Validated Department department, BindingResult br, Model model, HttpServletRequest request,HttpServletResponse response) throws Exception {
		//通过accessToken获取到用户信息 
		String userName = authService.getUserName(request);
		if(userName == null) return JsonResultBuilder.error(ReturnCode.TOKEN_VALID_ERROR);
		if (br.hasErrors())  //验证输入参数
			return JsonResultBuilder.error(ReturnCode.INPUT_PARAM_ERROR); 
        departmentService.updateDepartment(department);  //更新记录到数据库
        return JsonResultBuilder.ok(departmentService.getDepartment(department.getDepartmentId()));
	}

	/*ajax方式显示获取科室信息详细信息*/
	@RequestMapping(value="/get/{departmentId}",method=RequestMethod.POST)
	public JsonResult getDepartment(@PathVariable int departmentId,Model model,HttpServletRequest request,HttpServletResponse response) throws Exception {
        /*根据主键departmentId获取Department对象*/
        Department department = departmentService.getDepartment(departmentId); 
        return JsonResultBuilder.ok(department);
	}

	/*ajax方式删除科室信息记录*/
	@RequestMapping(value="/delete/{departmentId}",method=RequestMethod.POST)
	public JsonResult deleteDepartment(@PathVariable int departmentId,Model model,HttpServletRequest request,HttpServletResponse response) throws Exception {
		//通过accessToken获取到用户信息 
		String userName = authService.getUserName(request);
		if(userName == null) return JsonResultBuilder.error(ReturnCode.TOKEN_VALID_ERROR);
		try {
			departmentService.deleteDepartment(departmentId);
			return JsonResultBuilder.ok();
		} catch (Exception ex) {
			return JsonResultBuilder.error(ReturnCode.FOREIGN_KEY_CONSTRAINT_ERROR);
		}
	}

	//客户端查询科室信息信息
	@RequestMapping(value="/list",method=RequestMethod.POST)
	public JsonResult list(String departmentName,String birthDate,Integer page,Integer rows, Model model, HttpServletRequest request,HttpServletResponse response) throws Exception {
		if (page==null || page == 0) page = 1;
		if (departmentName == null) departmentName = "";
		if (birthDate == null) birthDate = "";
		if(rows != 0)departmentService.setRows(rows);
		List<Department> departmentList = departmentService.queryDepartment(departmentName, birthDate, page);
	    /*计算总的页数和总的记录数*/
	    departmentService.queryTotalPageAndRecordNumber(departmentName, birthDate);
	    /*获取到总的页码数目*/
	    int totalPage = departmentService.getTotalPage();
	    /*当前查询条件下总记录数*/
	    int recordNumber = departmentService.getRecordNumber();
	    HashMap<String, Object> resultMap = new HashMap<String, Object>();
	    resultMap.put("totalPage", totalPage);
	    resultMap.put("list", departmentList);
	    return JsonResultBuilder.ok(resultMap);
	}

	//客户端ajax获取所有科室信息
	@RequestMapping(value="/listAll",method=RequestMethod.POST)
	public JsonResult listAll() throws Exception{
		List<Department> departmentList = departmentService.queryAllDepartment(); 
		return JsonResultBuilder.ok(departmentList);
	}
}

