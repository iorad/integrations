package it.com.iorad.confluence;

import com.iorad.confluence.api.EmbedPluginInterface;
import org.junit.Test;
import org.junit.runner.RunWith;
import com.atlassian.plugins.osgi.test.AtlassianPluginsTestRunner;
import com.atlassian.sal.api.ApplicationProperties;

import static org.junit.Assert.assertEquals;

@RunWith(AtlassianPluginsTestRunner.class)
public class EmbedPluginComponentWiredTest
{
    private final ApplicationProperties applicationProperties;
    private final EmbedPluginInterface embedPlugin;

    public EmbedPluginComponentWiredTest(ApplicationProperties applicationProperties, EmbedPluginInterface embedPlugin)
    {
        this.applicationProperties = applicationProperties;
        this.embedPlugin = embedPlugin;
    }

    @Test
    public void testMyName()
    {
        assertEquals("names do not match!", "EmbedPluginComponent:" + applicationProperties.getDisplayName(), embedPlugin.getName());
    }
}