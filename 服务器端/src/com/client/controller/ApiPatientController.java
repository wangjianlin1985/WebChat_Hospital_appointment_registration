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
import com.chengxusheji.po.Patient;
import com.chengxusheji.po.Doctor;
import com.chengxusheji.service.PatientService;
import com.client.service.AuthService;
import com.client.utils.JsonResult;
import com.client.utils.JsonResultBuilder;
import com.client.utils.ReturnCode;

@RestController
@RequestMapping("/api/patient") 
public class ApiPatientController {
	@Resource PatientService patientService;
	@Resource AuthService authService;

	@InitBinder("doctorObj")
	public void initBinderdoctorObj(WebDataBinder binder) {
		binder.setFieldDefaultPrefix("doctorObj.");
	}
	@InitBinder("patient")
	public void initBinderPatient(WebDataBinder binder) {
		binder.setFieldDefaultPrefix("patient.");
	}

	/*客户端ajax方式添加病人信息信息*/
	@RequestMapping(value = "/add", method = RequestMethod.POST)
	public JsonResult add(@Validated Patient patient, BindingResult br, Model model, HttpServletRequest request,HttpServletResponse response) throws Exception {
		//通过accessToken获取到用户信息 
		String userName = authService.getUserName(request);
		if(userName == null) return JsonResultBuilder.error(ReturnCode.TOKEN_VALID_ERROR);
		if (br.hasErrors()) //验证输入参数
			return JsonResultBuilder.error(ReturnCode.INPUT_PARAM_ERROR);
        patientService.addPatient(patient); //添加到数据库
        return JsonResultBuilder.ok();
	}

	/*客户端ajax更新病人信息信息*/
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	public JsonResult update(@Validated Patient patient, BindingResult br, Model model, HttpServletRequest request,HttpServletResponse response) throws Exception {
		//通过accessToken获取到用户信息 
		String userName = authService.getUserName(request);
		if(userName == null) return JsonResultBuilder.error(ReturnCode.TOKEN_VALID_ERROR);
		if (br.hasErrors())  //验证输入参数
			return JsonResultBuilder.error(ReturnCode.INPUT_PARAM_ERROR); 
        patientService.updatePatient(patient);  //更新记录到数据库
        return JsonResultBuilder.ok(patientService.getPatient(patient.getPatientId()));
	}

	/*ajax方式显示获取病人信息详细信息*/
	@RequestMapping(value="/get/{patientId}",method=RequestMethod.POST)
	public JsonResult getPatient(@PathVariable int patientId,Model model,HttpServletRequest request,HttpServletResponse response) throws Exception {
        /*根据主键patientId获取Patient对象*/
        Patient patient = patientService.getPatient(patientId); 
        return JsonResultBuilder.ok(patient);
	}

	/*ajax方式删除病人信息记录*/
	@RequestMapping(value="/delete/{patientId}",method=RequestMethod.POST)
	public JsonResult deletePatient(@PathVariable int patientId,Model model,HttpServletRequest request,HttpServletResponse response) throws Exception {
		//通过accessToken获取到用户信息 
		String userName = authService.getUserName(request);
		if(userName == null) return JsonResultBuilder.error(ReturnCode.TOKEN_VALID_ERROR);
		try {
			patientService.deletePatient(patientId);
			return JsonResultBuilder.ok();
		} catch (Exception ex) {
			return JsonResultBuilder.error(ReturnCode.FOREIGN_KEY_CONSTRAINT_ERROR);
		}
	}

	//客户端查询病人信息信息
	@RequestMapping(value="/list",method=RequestMethod.POST)
	public JsonResult list(@ModelAttribute("doctorObj") Doctor doctorObj,String patientName,String cardNumber,String telephone,String addTime,Integer page,Integer rows, Model model, HttpServletRequest request,HttpServletResponse response) throws Exception {
		if (page==null || page == 0) page = 1;
		if (patientName == null) patientName = "";
		if (cardNumber == null) cardNumber = "";
		if (telephone == null) telephone = "";
		if (addTime == null) addTime = "";
		if(rows != 0)patientService.setRows(rows);
		List<Patient> patientList = patientService.queryPatient(doctorObj, patientName, cardNumber, telephone, addTime, page);
	    /*计算总的页数和总的记录数*/
	    patientService.queryTotalPageAndRecordNumber(doctorObj, patientName, cardNumber, telephone, addTime);
	    /*获取到总的页码数目*/
	    int totalPage = patientService.getTotalPage();
	    /*当前查询条件下总记录数*/
	    int recordNumber = patientService.getRecordNumber();
	    HashMap<String, Object> resultMap = new HashMap<String, Object>();
	    resultMap.put("totalPage", totalPage);
	    resultMap.put("list", patientList);
	    return JsonResultBuilder.ok(resultMap);
	}

	//客户端ajax获取所有病人信息
	@RequestMapping(value="/listAll",method=RequestMethod.POST)
	public JsonResult listAll() throws Exception{
		List<Patient> patientList = patientService.queryAllPatient(); 
		return JsonResultBuilder.ok(patientList);
	}
}

