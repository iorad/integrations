package com.iorad.jira.plugin.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.atlassian.sal.api.pluginsettings.PluginSettingsFactory;
import com.iorad.jira.plugin.utils.SettingsUtil;

public class PluginDataServlet extends HttpServlet {
	private static final Logger log = LoggerFactory
			.getLogger(PluginDataServlet.class);

	private PluginSettingsFactory pluginSettingsFactory;

	public PluginDataServlet(PluginSettingsFactory pluginSettingsFactory) {

		this.pluginSettingsFactory = pluginSettingsFactory;
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		SettingsUtil.SaveIoradInSettings(
				req.getParameter(Constants.IFRAME_URL),
				req.getParameter(Constants.WIDTH),
				req.getParameter(Constants.HEIGHT),
				req.getParameter(Constants.TUTOR_ID),
				req.getParameter(Constants.TUTOR_TITLE),
				req.getParameter(Constants.TUTOR_UID),
				req.getParameter(Constants.ISSUE_ID), pluginSettingsFactory);

		resp.setContentType("application/json");
		resp.getWriter().write("{\"result\":\"success\"}");
		resp.flushBuffer();
	}

}