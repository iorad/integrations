package com.iorad.jira.plugin.servlet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.atlassian.sal.api.pluginsettings.PluginSettings;
import com.atlassian.sal.api.pluginsettings.PluginSettingsFactory;

import javax.servlet.*;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;

public class PluginStatusServlet extends HttpServlet {
	private static final Logger log = LoggerFactory
			.getLogger(PluginStatusServlet.class);

	private PluginSettingsFactory pluginSettingsFactory;

	public PluginStatusServlet(PluginSettingsFactory pluginSettingsFactory) {

		this.pluginSettingsFactory = pluginSettingsFactory;
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		resp.setContentType("application/json");

		PluginSettings settings = pluginSettingsFactory.createGlobalSettings();

		String issue_id = req.getParameter(Constants.ISSUE_ID);
		String iframURL = (String) settings
				.get(issue_id + Constants.IFRAME_URL);

		String successreponsetemp = "{\"result\":\"{result}\",\"width\": \"{width}\",\"height\":\"{height}\",\"iframeURL\":\"{iframeURl}\", \"uid\":\"{uid}\",\"tutorialId\":\"{tutorialId}\",\"tutorialTitle\":\"{tutorialTitle}\"}";

		if (iframURL != null) {
			successreponsetemp = successreponsetemp.replace("{result}",
					"existing");
			successreponsetemp = successreponsetemp.replace("{width}",
					(String) settings.get(issue_id + Constants.WIDTH));
			successreponsetemp = successreponsetemp.replace("{iframeURl}",
					iframURL);
			successreponsetemp = successreponsetemp.replace("{height}",
					(String) settings.get(issue_id + Constants.HEIGHT));
			successreponsetemp = successreponsetemp.replace("{uid}",
					(String) settings.get(issue_id + Constants.TUTOR_UID));
			successreponsetemp = successreponsetemp.replace("{tutorialId}",
					(String) settings.get(issue_id + Constants.TUTOR_ID));
			successreponsetemp = successreponsetemp.replace("{tutorialTitle}",
					(String) settings.get(issue_id + Constants.TUTOR_TITLE));

			resp.getWriter().write(successreponsetemp);
		} else {
			resp.getWriter().write("{\"result\":\"new\"}");
		}

		resp.flushBuffer();
	}

}