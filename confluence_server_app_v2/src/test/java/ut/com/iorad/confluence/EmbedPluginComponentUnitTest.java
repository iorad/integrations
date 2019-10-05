package ut.com.iorad.confluence;

import org.junit.Test;
import com.iorad.confluence.plugin.EmbedPluginComponent;

import static org.junit.Assert.assertEquals;

public class EmbedPluginComponentUnitTest
{
    @Test
    public void testMyName()
    {
        EmbedPluginComponent component = new EmbedPluginComponent(null);
        assertEquals("names do not match!", "EmbedPluginComponent",component.getName());
    }
}