package com.iorad.jira.plugin;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import com.atlassian.event.api.EventListener;
import com.atlassian.event.api.EventPublisher;
import com.atlassian.jira.event.issue.IssueEvent;
import com.atlassian.jira.event.type.EventType;
import com.atlassian.jira.issue.Issue;
import com.atlassian.sal.api.pluginsettings.PluginSettingsFactory;
import com.atlassian.sal.api.web.context.HttpContext;
import com.iorad.jira.plugin.servlet.Constants;
import com.iorad.jira.plugin.utils.SettingsUtil;

public class EventHandler implements InitializingBean, DisposableBean {
	private final EventPublisher eventPublisher;
	private final HttpContext context;
	private final PluginSettingsFactory pluginSettingsFactory;

	public EventHandler(EventPublisher eventPublisher, HttpContext context,
			PluginSettingsFactory pluginSettingsFactory) {
		this.eventPublisher = eventPublisher;
		this.context = context;
		this.pluginSettingsFactory = pluginSettingsFactory;
	}

	@EventListener
	public void onIssueEvent(IssueEvent issueEvent) {
		Long eventTypeId = issueEvent.getEventTypeId();
		Issue issue = issueEvent.getIssue();

		if (eventTypeId.equals(EventType.ISSUE_CREATED_ID)) {
			Long issue_id = issue.getId();

			HttpServletRequest request = context.getRequest();

			boolean isMultipart = ServletFileUpload.isMultipartContent(request);

			if (isMultipart) {
				// here it might not work, just keeped for safety. In some cases
				// request has already been read by JIRA so the FileItem list
				// will be empty.
				try {
					DiskFileItemFactory factory = new DiskFileItemFactory();
					ServletFileUpload upload = new ServletFileUpload(factory);
					List<FileItem> items = upload.parseRequest(request);
					String iframeUrl = SettingsUtil.getFieldFromMultypart(
							items, Constants.IFRAME_URL);
					if (!(iframeUrl == null || iframeUrl.isEmpty()))
						SettingsUtil.SaveIoradInSettings(SettingsUtil
								.getFieldFromMultypart(items,
										Constants.IFRAME_URL)

						, SettingsUtil.getFieldFromMultypart(items,
								Constants.WIDTH),
								SettingsUtil.getFieldFromMultypart(items,
										Constants.HEIGHT), SettingsUtil
										.getFieldFromMultypart(items,
												Constants.TUTOR_ID),
								SettingsUtil.getFieldFromMultypart(items,
										Constants.TUTOR_TITLE), SettingsUtil
										.getFieldFromMultypart(items,
												Constants.TUTOR_UID), ""
										+ issue_id, pluginSettingsFactory);

				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

			} else {

				String iframeUrl = SettingsUtil.getParamByName(request,
						Constants.IFRAME_URL);
				if (!(iframeUrl == null || iframeUrl.isEmpty()))
					SettingsUtil.SaveIoradInSettings(SettingsUtil
							.getParamByName(request, Constants.IFRAME_URL)

					, SettingsUtil.getParamByName(request, Constants.WIDTH),
							SettingsUtil.getParamByName(request,
									Constants.HEIGHT),
							SettingsUtil.getParamByName(request,
									Constants.TUTOR_ID), SettingsUtil
									.getParamByName(request,
											Constants.TUTOR_TITLE),
							SettingsUtil.getParamByName(request,
									Constants.TUTOR_UID), "" + issue_id,
							pluginSettingsFactory);
			}
		}
	}

	@Override
	public void destroy() throws Exception {
		// TODO Auto-generated method stub
		eventPublisher.unregister(this);

	}

	@Override
	public void afterPropertiesSet() throws Exception {
		// TODO Auto-generated method stub
		eventPublisher.register(this);

	}
}