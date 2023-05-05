package com.client.utils;
 
import java.util.HashMap;
import java.util.Map;


public class UserToken {
	 

	/**
     * 当前用户帐号
     */
    private Long userId;

    /**
     * 当前用户名称
     */
    private String userName;

    /**
     * 用户存存储容器
     */
    private Map<String, Object> userContext;

    public Long getUserId() {
        return userId;
    }

    public UserToken setUserId(Long userId) {
        this.userId = userId;
        return this;
    }

    public String getUserName() {
        return userName;
    }

    public UserToken setUserName(String userName) {
        this.userName = userName;
        return this;
    }

    public Map<String, Object> getUserContext() {
        return userContext;
    }

    public UserToken setUserContext(HashMap<String, Object> userContext) {
        this.userContext = userContext;
        return this;
    }

    @Override
    public String toString() {
        return JsonUtils.toJson(this);
    }
}

  
