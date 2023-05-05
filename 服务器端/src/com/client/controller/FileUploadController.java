package com.client.controller;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
 
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.chengxusheji.utils.UserException;
import com.client.utils.JsonResult;
import com.client.utils.JsonResultBuilder;


@RestController
@RequestMapping("/upload")
public class FileUploadController {

	/**
	 * 处理图片文件的上传接口
	 * @param request
	 * @return
	 * @throws IllegalStateException
	 * @throws IOException
	 */
	@RequestMapping(value = "/image", method = RequestMethod.POST)
	public JsonResult handlePhotoUpload(HttpServletRequest request) throws IllegalStateException, IOException {
		String filePath = "upload/NoImage.jpg";
		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request; 
        /**构建图片保存的目录**/    
        String baseDir = "/upload";     
        /**得到图片保存目录的真实路径**/    
        String realPathDir = request.getSession().getServletContext().getRealPath(baseDir);     
        /**根据真实路径创建目录**/    
        File saveDir = new File(realPathDir);     
        if(!saveDir.exists())     
        	saveDir.mkdirs();           
        /**页面控件的文件流**/    
        MultipartFile multipartFile = multipartRequest.getFile("image");    
        if(!multipartFile.isEmpty()) {
        	/**获取文件的后缀**/    
            String suffix = multipartFile.getOriginalFilename().substring  
                            (multipartFile.getOriginalFilename().lastIndexOf("."));  
            String smallSuffix = suffix.toLowerCase();
            if(!smallSuffix.equals(".jpg") && !smallSuffix.equals(".gif") && !smallSuffix.equals(".png") )
            	throw new UserException("图片格式不正确！");
            /**使用UUID生成文件名称**/    
            String fileName = UUID.randomUUID().toString()+ suffix;//构建文件名称     
            
            /**拼成完整的文件保存路径加文件**/    
            String savePath = realPathDir + File.separator  + fileName;                
            File saveFile = new File(savePath);          
           
            multipartFile.transferTo(saveFile);     
            
            filePath = "upload/" + fileName;
        } 

		return JsonResultBuilder.ok(filePath);
	}
	
	
	/** 
	 * 处理普通文件上传，返回保存的文件名路径 
	 */
	@RequestMapping(value = "/file", method = RequestMethod.POST)
	public JsonResult handleFileUpload(HttpServletRequest request) throws IllegalStateException, IOException {
		String filePath = "";
		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request; 
        /**构建图片保存的目录**/    
        String baseDir = "/upload";     
        /**得到图片保存目录的真实路径**/    
        String realPathDir = request.getSession().getServletContext().getRealPath(baseDir);     
        /**根据真实路径创建目录**/    
        File saveDir = new File(realPathDir);     
        if(!saveDir.exists())     
        	saveDir.mkdirs();           
        /**页面控件的文件流**/    
        MultipartFile multipartFile = multipartRequest.getFile("file");    
        if(!multipartFile.isEmpty()) {
        	/**获取文件的后缀**/    
            String suffix = multipartFile.getOriginalFilename().substring  
                            (multipartFile.getOriginalFilename().lastIndexOf("."));
            /**使用UUID生成文件名称**/    
            String fileName = UUID.randomUUID().toString()+ suffix;//构建文件名称     
            //String logImageName = multipartFile.getOriginalFilename();  
            /**拼成完整的文件保存路径加文件**/    
            String photoBookFilePath = realPathDir + File.separator  + fileName;                
            File uploadFile = new File(photoBookFilePath);          
           
            multipartFile.transferTo(uploadFile);     
            
            filePath = "upload/" + fileName;
        } 
		
        return JsonResultBuilder.ok(filePath);
	}
	
	
}
