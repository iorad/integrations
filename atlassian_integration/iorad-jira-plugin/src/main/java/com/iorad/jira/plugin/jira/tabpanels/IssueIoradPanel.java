package com.iorad.jira.plugin.jira.tabpanels;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.atlassian.core.util.collection.EasyList;
import com.atlassian.crowd.embedded.api.User;
import com.atlassian.jira.plugin.issuetabpanel.AbstractIssueTabPanel;
import com.atlassian.jira.plugin.issuetabpanel.IssueAction;
import com.atlassian.jira.plugin.issuetabpanel.IssueTabPanel;
import com.atlassian.jira.issue.tabpanels.GenericMessageAction;
import com.atlassian.jira.issue.Issue;
import com.atlassian.sal.api.pluginsettings.PluginSettingsFactory;

import java.util.Collections;
import java.util.List;

public class IssueIoradPanel extends AbstractIssueTabPanel implements IssueTabPanel
{
    private static final Logger log = LoggerFactory.getLogger(IssueIoradPanel.class);

	private  PluginSettingsFactory pluginSettingsFactory;
	
	public IssueIoradPanel(PluginSettingsFactory pluginSettingsFactory)
	{
		this.pluginSettingsFactory= pluginSettingsFactory;
	}
	
	@Override
	public List getActions(Issue issue, User arg1) {
		return EasyList.build(new TabAction(super.descriptor, issue.getProjectObject(),pluginSettingsFactory,issue));
	}

	@Override
	public boolean showPanel(Issue arg0, User arg1) {
		// TODO Auto-generated method stub
		return true;
	}
}
