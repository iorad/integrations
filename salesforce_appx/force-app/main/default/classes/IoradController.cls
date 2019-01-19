public with sharing class IoradController {

    public String ioradPlayer { get; set; }
    public SObject article { get; set; }

    public IoradController() {
        String id = Apexpages.currentPage().getParameters().get('id');
        if (id != null) {
            this.populateArticle(id);
        }
    }

    private void populateArticle(String id) {
        System.debug('Start=====================');
        Schema.DescribeSObjectResult objectType = this.getObjectTypeByKeyPrefixOrId(id);
        if (objectType != null) {
            List<String> customFields = new List<String>();

            Map<String, Schema.SObjectField> fields = objectType.fields.getMap();
            for (Schema.SObjectField field : fields.values()) {
                Schema.DescribeFieldResult detail = field.getDescribe();
                if (detail.isCustom()) {
                    customFields.add(detail.getName());
                }
            }

            if (customFields.size() > 0) {
                String textFields = String.join(customFields, ', ');
                System.debug('SELECT ' + textFields + ' FROM ' + objectType.getSObjectType() + ' WHERE Id = :id LIMIT 1');
                SObject obj = Database.query('SELECT ' + textFields + ' FROM ' + objectType.getSObjectType() + ' WHERE Id = :id LIMIT 1');
                if (obj != null) {
                    for (String key : customFields) {
                        String textValue = (String) obj.get(key);
                        if (textValue != null && textValue != '') {
                            this.article = obj;
                            this.ioradPlayer = this.getIoradPlayerLink(textValue);
                        }
                    }
                }
            }
        }   

        System.debug('Start=====================');
    }

    /**
     * Get the version of the SFDX demo app
     */
    public String getAppVersion() {
        return '1.0.0';
    }

    private Schema.DescribeSObjectResult getObjectTypeByKeyPrefixOrId(String keyPrefixOrId) {

        Schema.DescribeSObjectResult result = null;
        String keyPrefix = keyPrefixOrId.substring(0, 3);

        Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
        for (Schema.SObjectType item : gd.values()) {
            Schema.DescribeSObjectResult detail = item.getDescribe();
            if (detail.getKeyPrefix() == keyPrefix) {
                result = detail;
            }
        }

        return result;
    }

    private String getIoradPlayerLink(String text)
    {
        String result = null;
        List<String> playerLinks = new List<String>();
        playerLinks.add('http://dev.iorad.local/player');
        playerLinks.add('https://dev.iorad.local/player');
        playerLinks.add('http://test.iorad.com/player');
        playerLinks.add('https://test.iorad.com/player');
        playerLinks.add('http://www.iorad.com/player');
        playerLinks.add('https://www.iorad.com/player');
        playerLinks.add('http://iorad.com/player');
        playerLinks.add('https://iorad.com/player');

        List<String> tags = new List<String>();
        Pattern pattern = Pattern.compile('<a[\\s\\t]+([^>]+)>');
        Matcher matcher = pattern.matcher(text);
        while (matcher.find()) {
            tags.add(matcher.group() + 'link</a>');
        }
        if (tags.size() == 0) {
            return null;
        }

        XmlStreamReader reader = new XmlStreamReader('<div>' + String.join(tags, '') + '</div>');
        boolean isSafeToGetNextXmlElement = true;
        while(isSafeToGetNextXmlElement) {
            if (reader.getEventType() == XmlTag.START_ELEMENT) {
                if (reader.getLocalName() == 'A' || reader.getLocalName() == 'a') {
                    String link = reader.getAttributeValue(null, 'href');
                    if (link != null && link != '') {
                        for (String player : playerLinks) {
                           if (link.startsWith(player)) {
                               result = link;
                           }
                        }
                    }
                }
            }

            if (reader.hasNext()) {
                reader.next();
            } else {
                isSafeToGetNextXmlElement = false;
                break;
            }
        }

        return result;
    }
}