package com.iorad.jira.plugin.servlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.atlassian.sal.api.auth.LoginUriProvider;
import com.atlassian.sal.api.pluginsettings.PluginSettings;
import com.atlassian.sal.api.pluginsettings.PluginSettingsFactory;
import com.atlassian.sal.api.user.UserManager;

import javax.servlet.*;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;

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

		PluginSettings settings = pluginSettingsFactory.createGlobalSettings();

		settings.put(req.getParameter(Constants.ISSUE_ID)
				+ Constants.IFRAME_URL, req.getParameter(Constants.IFRAME_URL));
		settings.put(req.getParameter(Constants.ISSUE_ID) + Constants.WIDTH,
				req.getParameter(Constants.WIDTH));
		settings.put(req.getParameter(Constants.ISSUE_ID) + Constants.HEIGHT,
				req.getParameter(Constants.HEIGHT));
		settings.put(req.getParameter(Constants.ISSUE_ID) + Constants.TUTOR_ID,
				req.getParameter(Constants.TUTOR_ID));
		settings.put(req.getParameter(Constants.ISSUE_ID)
				+ Constants.TUTOR_TITLE,
				req.getParameter(Constants.TUTOR_TITLE));
		settings.put(
				req.getParameter(Constants.ISSUE_ID) + Constants.TUTOR_UID,
				req.getParameter(Constants.TUTOR_UID));

		resp.setContentType("application/json");
		resp.getWriter().write("{\"result\":\"success\"}");
		resp.flushBuffer();
	}

}