package com.iorad.jira.plugin.servlet;

public class IframeParams {
	private String iframeURL;
	private String width;
	private String Height;
	private boolean hasURL=true;
	public String getIframeURL() {
		return iframeURL;
	}
	public void setIframeURL(String iframeURL) {
		this.iframeURL = iframeURL;
	}
	public String getWidth() {
		return width;
	}
	public void setWidth(String width) {
		this.width = width;
	}
	public String getHeight() {
		return Height;
	}
	public void setHeight(String height) {
		Height = height;
	}
	public boolean isHasURL() {
		return hasURL;
	}
	public void setHasURL(boolean hasURL) {
		this.hasURL = hasURL;
	}
	
	
	
}
