package ut.com.iorad.jira.plugin;

import org.junit.Test;
import com.iorad.jira.plugin.MyPluginComponent;
import com.iorad.jira.plugin.MyPluginComponentImpl;

import static org.junit.Assert.assertEquals;

public class MyComponentUnitTest
{
    @Test
    public void testMyName()
    {
        MyPluginComponent component = new MyPluginComponentImpl(null);
        assertEquals("names do not match!", "myComponent",component.getName());
    }
}