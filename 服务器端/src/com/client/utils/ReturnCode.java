package com.client.utils;

import java.util.HashMap;
import java.util.Map;

public enum ReturnCode {
	/*********************************************全局ReturnCode(请勿改动)*********************************************/
	NO_RESULT("10001", "查询无结果。"),
    MULTI_RESULT("10002", "查询结果不唯一。"),
	BUSSINESS_EXCEPTION("10003", "业务系统异常！"), 
	EXPORT_EXCEL_ERROR("30001", "导出Excel异常！"),
	
	SUCCESS("0000", "成功完成操作。"),
    SYSTEM_ERROR("99999", "系统错误！"), 
    ACCESS_FORBIDDEN("90000","无权限访问！"), 
    USER_NOT_LOGIN("90001", "用户未登录！"),
    ERROR_LOGIN("90002", "用户名或密码错误！"),
    FAIL_LOGIN("90003", "登录失败！"), 
    CACHE_SET_ERROR("90004", "Token缓存设置失败！"),
    TOKEN_VALID_ERROR("90005","Token值失效"),
    
    
    INPUT_PARAM_ERROR("90006","输入参数有错误"),
    PRIMARY_EXIST_ERROR("90007","主键冲突错误"),
	FOREIGN_KEY_CONSTRAINT_ERROR("90008","存在外键约束删除失败"), 
	ORDER_EXIST_ERROR("90009","当日这个医生你已经预约过了");

    /**
     * 返回码
     */
    private String code;

    /**
     * 返回信息
     */
    private String msg;

    ReturnCode(String code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public String code() {
        return this.code;
    }

    public String msg() {
        return this.msg;
    }
    
	public Map<String, String> toMap() {
		Map<String, String> map = new HashMap<String,String>();
		map.put("msg", this.msg);
		map.put("code", this.code);
		return map;
	}
}
