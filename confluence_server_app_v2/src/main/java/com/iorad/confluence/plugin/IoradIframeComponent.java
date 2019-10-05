package com.iorad.confluence.plugin;

import com.atlassian.confluence.content.render.image.ImageDimensions;
import com.atlassian.confluence.content.render.xhtml.ConversionContext;
import com.atlassian.confluence.core.ContentEntityObject;
import com.atlassian.confluence.core.ContentPropertyManager;
import com.atlassian.confluence.macro.*;
import com.atlassian.confluence.renderer.radeox.macros.MacroUtils;
import com.atlassian.confluence.setup.settings.SettingsManager;
import com.atlassian.confluence.util.velocity.VelocityUtils;
import com.atlassian.confluence.xhtml.api.XhtmlContent;
import com.atlassian.plugin.spring.scanner.annotation.component.Scanned;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import java.util.Map;

@Scanned
public class IoradIframeComponent implements Macro, EditorImagePlaceholder {

    private static final Logger logger = LoggerFactory.getLogger(IoradIframeComponent.class);
    private static final String IMAGE_PATH = "/download/resources/com.iorad.confluence.iorad_for_confluence_server:main-web-resources/images/tutorial_embedded.png";

    @ComponentImport
    private final XhtmlContent xhtmlContent;

    @ComponentImport
    private final SettingsManager settingsManager;

    @Inject
    public IoradIframeComponent(XhtmlContent xhtmlContent, SettingsManager settingsManager) {
        this.xhtmlContent = xhtmlContent;
        this.settingsManager = settingsManager;
    }

    @Override
    public String execute(Map<String, String> params, String s, ConversionContext conversionContext) throws MacroExecutionException {

        if (params != null) {

            String ioradTutorialUrl = params.get("iframeSrc");
            String ioradTutorialEmbed = params.get("embedCode");

            Map context = MacroUtils.defaultVelocityContext();

            if (ioradTutorialUrl != null && !ioradTutorialUrl.trim().equals("")) {
                context.put("iframeSrc", ioradTutorialUrl);
                return VelocityUtils.getRenderedTemplate("templates/iorad-iframe.vm", context);

            } else if (ioradTutorialEmbed != null && !ioradTutorialEmbed.trim().equals("")) {
                context.put("embedCode", ioradTutorialEmbed);
                return VelocityUtils.getRenderedTemplate("templates/iorad-embed.vm", context);
            }
        }

        return "";
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
    public ImagePlaceholder getImagePlaceholder(final Map<String, String> params, final ConversionContext ctx) {
        String baseUrl = settingsManager.getGlobalSettings().getBaseUrl();
        return new DefaultImagePlaceholder(baseUrl + IMAGE_PATH, false, new ImageDimensions(392, 110));
    }
}
