package com.iorad.plugin;

import java.util.List;
import java.util.Map;

import com.atlassian.confluence.labels.Label;
import com.atlassian.confluence.content.render.xhtml.ConversionContext;
import com.atlassian.confluence.core.ContentEntityObject;
import com.atlassian.confluence.core.ContentPropertyManager;
import com.atlassian.confluence.labels.LabelManager;
import com.atlassian.confluence.labels.Labelable;
import com.atlassian.confluence.macro.DefaultImagePlaceholder;
import com.atlassian.confluence.macro.EditorImagePlaceholder;
import com.atlassian.confluence.macro.ImagePlaceholder;
import com.atlassian.confluence.macro.Macro;
import com.atlassian.confluence.macro.MacroExecutionException;
import com.atlassian.confluence.pages.Page;
import com.atlassian.confluence.pages.PageManager;
import com.atlassian.confluence.pages.thumbnail.Dimensions;
import com.atlassian.confluence.setup.BootstrapManager;
import com.atlassian.confluence.spaces.SpaceManager;
import com.atlassian.confluence.xhtml.api.XhtmlContent;
import com.atlassian.renderer.RenderContext;
import com.atlassian.renderer.v2.RenderMode;
import com.atlassian.renderer.v2.macro.BaseMacro;
import com.atlassian.renderer.v2.macro.MacroException;
import com.atlassian.renderer.v2.macro.ResourceAware;
import com.atlassian.spring.container.ContainerManager;
import com.iorad.util.ImageUtil;

public class IframeMacro extends BaseMacro implements Macro,
		EditorImagePlaceholder, ResourceAware {

	private final XhtmlContent xhtmlUtils;
	private LabelManager labelManager;
	private PageManager pageManager;
	private static final String IMAGE_PATH = "/download/resources/com.iorad.plugin.iorad-conf-plugin:macroeditor-resources/images/placeholdergraphic.jpg";
	SpaceManager spaceManager;
	private ContentPropertyManager contentPropertyManager;

	public IframeMacro(XhtmlContent xhtmlUtils, LabelManager lbm,
			PageManager pageManager,
			ContentPropertyManager contentPropertyManager) {
		this.labelManager = lbm;
		this.xhtmlUtils = xhtmlUtils;
		this.pageManager = pageManager;
		this.contentPropertyManager = contentPropertyManager;
		// TODO Auto-generated constructor stub
	}

	public void setSpaceManager(SpaceManager spaceManager) {
		this.spaceManager = spaceManager;
	}

	@Override
	public String execute(Map<String, String> parameters, String bodyContent,
			ConversionContext conversionContext) throws MacroExecutionException {
		// SpaceManager spaceManager = (SpaceManager)
		// ContainerManager.getComponent("spaceManager");
		ContentEntityObject contentObject = conversionContext.getEntity();
		String descriptions = parameters.get("labelContent");

		if (descriptions != null) {
			contentPropertyManager.setStringProperty(contentObject,
					"searchLabels", descriptions);

		}

		String iframePattern = "<iframe src=\"[srcplaceholder]\" width=\"[widthplaceholder]\" scrolling=\"no\" height=\"[heightplaceholder]\" style=\"border:0px;\" allowfullscreen=\"true\"></iframe>";
		if (parameters != null) {
			return iframePattern
					.replace("[srcplaceholder]", parameters.get("iframeSrc"))
					.replace("[widthplaceholder]",
							parameters.get("iframeWidth"))
					.replace("[heightplaceholder]",
							parameters.get("iframeHeight"));
		}

		return "";
	}

	@Override
	public ImagePlaceholder getImagePlaceholder(
			final Map<String, String> params, final ConversionContext ctx) {
		return new DefaultImagePlaceholder(IMAGE_PATH,
				new Dimensions(392, 110), false);
	}

	@Override
	public BodyType getBodyType() {
		return BodyType.NONE;
	}

	@Override
	public OutputType getOutputType() {
		return OutputType.BLOCK;
	}

	@Override
	public boolean isInline() {
		return false;
	}

	@Override
	public boolean hasBody() {
		return false;
	}

	@Override
	public RenderMode getBodyRenderMode() {
		return RenderMode.ALL;
	}

	@Override
	public boolean suppressMacroRenderingDuringWysiwyg() {
		return true;
	}

	@Override
	public boolean suppressSurroundingTagDuringWysiwygRendering() {
		return false;
	}

	@Override
	public String getResourcePath() {
		return "";
	}

	@Override
	public void setResourcePath(final String resourcePath) {
	}

	@Override
	public String execute(Map parameters, String body,
			RenderContext renderContext) throws MacroException {
		// TODO Auto-generated method stub
		return (String) parameters.get("iframeURL");
	}

}