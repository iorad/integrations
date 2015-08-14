package ut.com.iorad.jira.plugin;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import com.iorad.jira.plugin.MyPluginComponent;
import com.iorad.jira.plugin.MyPluginComponentImpl;

public class MyComponentUnitTest
{
    @Test
    public void testMyName()
    {
        MyPluginComponent component = new MyPluginComponentImpl(null);
        assertEquals("names do not match!", "myComponent",component.getName());
    }
}