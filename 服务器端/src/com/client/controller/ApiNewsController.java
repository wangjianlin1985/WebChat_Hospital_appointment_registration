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
import com.chengxusheji.po.News;
import com.chengxusheji.service.NewsService;
import com.client.service.AuthService;
import com.client.utils.JsonResult;
import com.client.utils.JsonResultBuilder;
import com.client.utils.ReturnCode;

@RestController
@RequestMapping("/api/news") 
public class ApiNewsController {
	@Resource NewsService newsService;
	@Resource AuthService authService;

	@InitBinder("news")
	public void initBinderNews(WebDataBinder binder) {
		binder.setFieldDefaultPrefix("news.");
	}

	/*客户端ajax方式添加新闻信息信息*/
	@RequestMapping(value = "/add", method = RequestMethod.POST)
	public JsonResult add(@Validated News news, BindingResult br, Model model, HttpServletRequest request,HttpServletResponse response) throws Exception {
		//通过accessToken获取到用户信息 
		String userName = authService.getUserName(request);
		if(userName == null) return JsonResultBuilder.error(ReturnCode.TOKEN_VALID_ERROR);
		if (br.hasErrors()) //验证输入参数
			return JsonResultBuilder.error(ReturnCode.INPUT_PARAM_ERROR);
        newsService.addNews(news); //添加到数据库
        return JsonResultBuilder.ok();
	}

	/*客户端ajax更新新闻信息信息*/
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	public JsonResult update(@Validated News news, BindingResult br, Model model, HttpServletRequest request,HttpServletResponse response) throws Exception {
		//通过accessToken获取到用户信息 
		String userName = authService.getUserName(request);
		if(userName == null) return JsonResultBuilder.error(ReturnCode.TOKEN_VALID_ERROR);
		if (br.hasErrors())  //验证输入参数
			return JsonResultBuilder.error(ReturnCode.INPUT_PARAM_ERROR); 
        newsService.updateNews(news);  //更新记录到数据库
        return JsonResultBuilder.ok(newsService.getNews(news.getNewsId()));
	}

	/*ajax方式显示获取新闻信息详细信息*/
	@RequestMapping(value="/get/{newsId}",method=RequestMethod.POST)
	public JsonResult getNews(@PathVariable int newsId,Model model,HttpServletRequest request,HttpServletResponse response) throws Exception {
        /*根据主键newsId获取News对象*/
        News news = newsService.getNews(newsId); 
        return JsonResultBuilder.ok(news);
	}

	/*ajax方式删除新闻信息记录*/
	@RequestMapping(value="/delete/{newsId}",method=RequestMethod.POST)
	public JsonResult deleteNews(@PathVariable int newsId,Model model,HttpServletRequest request,HttpServletResponse response) throws Exception {
		//通过accessToken获取到用户信息 
		String userName = authService.getUserName(request);
		if(userName == null) return JsonResultBuilder.error(ReturnCode.TOKEN_VALID_ERROR);
		try {
			newsService.deleteNews(newsId);
			return JsonResultBuilder.ok();
		} catch (Exception ex) {
			return JsonResultBuilder.error(ReturnCode.FOREIGN_KEY_CONSTRAINT_ERROR);
		}
	}

	//客户端查询新闻信息信息
	@RequestMapping(value="/list",method=RequestMethod.POST)
	public JsonResult list(String newsTitle,String newsDate,Integer page,Integer rows, Model model, HttpServletRequest request,HttpServletResponse response) throws Exception {
		if (page==null || page == 0) page = 1;
		if (newsTitle == null) newsTitle = "";
		if (newsDate == null) newsDate = "";
		if(rows != 0)newsService.setRows(rows);
		List<News> newsList = newsService.queryNews(newsTitle, newsDate, page);
	    /*计算总的页数和总的记录数*/
	    newsService.queryTotalPageAndRecordNumber(newsTitle, newsDate);
	    /*获取到总的页码数目*/
	    int totalPage = newsService.getTotalPage();
	    /*当前查询条件下总记录数*/
	    int recordNumber = newsService.getRecordNumber();
	    HashMap<String, Object> resultMap = new HashMap<String, Object>();
	    resultMap.put("totalPage", totalPage);
	    resultMap.put("list", newsList);
	    return JsonResultBuilder.ok(resultMap);
	}

	//客户端ajax获取所有新闻信息
	@RequestMapping(value="/listAll",method=RequestMethod.POST)
	public JsonResult listAll() throws Exception{
		List<News> newsList = newsService.queryAllNews(); 
		return JsonResultBuilder.ok(newsList);
	}
}

