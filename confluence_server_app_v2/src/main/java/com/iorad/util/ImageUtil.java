package com.iorad.util;

import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

import javax.imageio.ImageIO;
public class ImageUtil {
    public static String getImagePath() throws MalformedURLException, IOException {
    	final BufferedImage image = ImageIO.read(new URL(
    	        "http://upload.wikimedia.org/wikipedia/en/2/24/Lenna.png"));

    	    Graphics g = image.getGraphics();
    	    g.setFont(g.getFont().deriveFont(30f));
    	    g.drawString("Hello World!", 100, 100);
    	    g.dispose();

    	    ImageIO.write(image, "png", new File("test.png"));  
    	    
    	    return "";
    }
    
}