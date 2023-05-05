package com.chengxusheji.po;

import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.NotEmpty;
import org.json.JSONException;
import org.json.JSONObject;
import com.client.utils.JsonUtils;
import com.client.utils.SessionConsts;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class News {
    /*新闻id*/
    private Integer newsId;
    public Integer getNewsId(){
        return newsId;
    }
    public void setNewsId(Integer newsId){
        this.newsId = newsId;
    }

    /*新闻标题*/
    @NotEmpty(message="新闻标题不能为空")
    private String newsTitle;
    public String getNewsTitle() {
        return newsTitle;
    }
    public void setNewsTitle(String newsTitle) {
        this.newsTitle = newsTitle;
    }

    /*新闻图片*/
    private String newsPhoto;
    public String getNewsPhoto() {
        return newsPhoto;
    }
    public void setNewsPhoto(String newsPhoto) {
        this.newsPhoto = newsPhoto;
    }

    private String newsPhotoUrl;
    public void setNewsPhotoUrl(String newsPhotoUrl) {
		this.newsPhotoUrl = newsPhotoUrl;
	}
	public String getNewsPhotoUrl() {
		return  SessionConsts.BASE_URL + newsPhoto;
	}
    /*新闻内容*/
    @NotEmpty(message="新闻内容不能为空")
    private String newsContent;
    public String getNewsContent() {
        return newsContent;
    }
    public void setNewsContent(String newsContent) {
        this.newsContent = newsContent;
    }

    /*新闻日期*/
    @NotEmpty(message="新闻日期不能为空")
    private String newsDate;
    public String getNewsDate() {
        return newsDate;
    }
    public void setNewsDate(String newsDate) {
        this.newsDate = newsDate;
    }

    /*新闻来源*/
    private String newsFrom;
    public String getNewsFrom() {
        return newsFrom;
    }
    public void setNewsFrom(String newsFrom) {
        this.newsFrom = newsFrom;
    }

    @JsonIgnore
    public JSONObject getJsonObject() throws JSONException {
    	JSONObject jsonNews=new JSONObject(); 
		jsonNews.accumulate("newsId", this.getNewsId());
		jsonNews.accumulate("newsTitle", this.getNewsTitle());
		jsonNews.accumulate("newsPhoto", this.getNewsPhoto());
		jsonNews.accumulate("newsContent", this.getNewsContent());
		jsonNews.accumulate("newsDate", this.getNewsDate().length()>19?this.getNewsDate().substring(0,19):this.getNewsDate());
		jsonNews.accumulate("newsFrom", this.getNewsFrom());
		return jsonNews;
    }

    @Override
	public String toString() {
		return JsonUtils.toJson(this);
	}
}