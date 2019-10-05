package com.iorad.confluence.plugin;

import com.atlassian.plugin.spring.scanner.annotation.export.ExportAsService;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;
import com.atlassian.sal.api.ApplicationProperties;
import com.iorad.confluence.api.EmbedPluginInterface;

import javax.inject.Inject;
import javax.inject.Named;

@Named("EmbedPluginInterface")
@ExportAsService({EmbedPluginInterface.class})
public class EmbedPluginComponent implements EmbedPluginInterface
{
    @ComponentImport
    private final ApplicationProperties applicationProperties;

    @Inject
    public EmbedPluginComponent(final ApplicationProperties applicationProperties)
    {
        this.applicationProperties = applicationProperties;
    }

    public String getName()
    {
        if(null != applicationProperties)
        {
            return "EmbedPluginComponent:" + applicationProperties.getDisplayName();
        }
        
        return "EmbedPluginComponent";
    }
}