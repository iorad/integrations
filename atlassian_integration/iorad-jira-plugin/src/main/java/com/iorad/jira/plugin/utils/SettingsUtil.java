package com.iorad.jira.plugin.utils;

import java.util.Iterator;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.FileItem;

import com.atlassian.sal.api.pluginsettings.PluginSettings;
import com.atlassian.sal.api.pluginsettings.PluginSettingsFactory;
import com.iorad.jira.plugin.servlet.Constants;

public class SettingsUtil {

	public static void SaveIoradInSettings(String ifrmae_url, String width,
			String height, String tutor_id, String tutor_title,
			String tutor_uid, String issueId,
			PluginSettingsFactory pluginSettingsFactory) {
		PluginSettings settings = pluginSettingsFactory.createGlobalSettings();
		settings.put(issueId + Constants.IFRAME_URL, ifrmae_url);
		settings.put(issueId + Constants.WIDTH, width);
		settings.put(issueId + Constants.HEIGHT, height);
		settings.put(issueId + Constants.TUTOR_ID, tutor_id);
		settings.put(issueId + Constants.TUTOR_TITLE, tutor_title);
		settings.put(issueId + Constants.TUTOR_UID, tutor_uid);
	}

	public static String getCookieByName(Cookie[] cookies, String cookieName) {
		for (int i = 0; i < cookies.length; i++) {
			if (cookies[i].getName().equals(cookieName))
				return cookies[i].getValue();

		}
		return "";
	}

	public static String getParamByName(HttpServletRequest req, String name) {
		return req.getParameter(Constants.PARAM_PREFIX + name);
	}

	public static String getFieldFromMultypart(List<FileItem> fieldList,
			String name) {

		Iterator<FileItem> iter = fieldList.iterator();
		while (iter.hasNext()) {
			FileItem item = iter.next();

			if (item.isFormField()
					&& item.getFieldName()
							.equals(Constants.PARAM_PREFIX + name)) {
				// processFormField(item);
				return item.getString();
			}
		}

		return "";
	}
}
