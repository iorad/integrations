package com.iorad.jira.plugin.jira.tabpanels;

import java.util.Date;
import java.util.Map;

import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.plugin.issuetabpanel.AbstractIssueAction;
import com.atlassian.jira.plugin.issuetabpanel.IssueTabPanelModuleDescriptor;
import com.atlassian.jira.project.Project;
import com.atlassian.sal.api.pluginsettings.PluginSettings;
import com.atlassian.sal.api.pluginsettings.PluginSettingsFactory;
import com.iorad.jira.plugin.servlet.Constants;
import com.iorad.jira.plugin.servlet.IframeParams;

public class TabAction extends AbstractIssueAction {
	private PluginSettingsFactory pluginSettingsFactory;
	private Issue issue;

	public TabAction(IssueTabPanelModuleDescriptor descriptor, Project pro,
			PluginSettingsFactory pluginSettingsFactory, Issue issue) {
		super(descriptor);
		this.pluginSettingsFactory = pluginSettingsFactory;
		this.issue = issue;
		// TODO Auto-generated constructor stub
	}

	@Override
	public Date getTimePerformed() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected void populateVelocityParams(Map params) {
		// TODO Auto-generated method stub
		PluginSettings setting = pluginSettingsFactory.createGlobalSettings();
		IframeParams ifparams = new IframeParams();
		Long issue_id = issue.getId();
		ifparams.setHeight((String) setting.get(issue_id + Constants.HEIGHT));
		ifparams.setWidth((String) setting.get(issue_id + Constants.WIDTH));

		String iframURL = (String) setting.get(issue_id + Constants.IFRAME_URL);
		if (iframURL == null) {
			ifparams.setHasURL(false);
		} else {

			iframURL = iframURL.indexOf("plugin_type=jira") != -1 ? iframURL
					: iframURL + "&plugin_type=jira";
		}

		ifparams.setIframeURL(iframURL);
		
		params.put("ifparams", ifparams);
	}

}
