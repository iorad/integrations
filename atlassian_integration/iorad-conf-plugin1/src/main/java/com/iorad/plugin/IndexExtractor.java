package com.iorad.plugin;

import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field.Store;
import org.apache.lucene.document.StringField;
import org.apache.lucene.index.IndexableField;

import com.atlassian.bonnie.Searchable;
import com.atlassian.bonnie.search.Extractor;
import com.atlassian.confluence.core.ContentEntityObject;
import com.atlassian.confluence.core.ContentPropertyManager;
import com.atlassian.lucene36.document.Field;

public class IndexExtractor implements Extractor {

	private ContentPropertyManager contentPropertyManager;

	public IndexExtractor(ContentPropertyManager contentPropertyManager) {
		this.contentPropertyManager = contentPropertyManager;
	}

	@Override
	public void addFields(Document document,
			StringBuffer defaultSearchableText, Searchable searchable) {
		// TODO Auto-generated method stub
		// document.add(new StringField("somindex", "somevaue", Store.YES));

		if (searchable instanceof ContentEntityObject) {
			ContentEntityObject contentEntityObject = (ContentEntityObject) searchable;

			String valueForINdex = contentPropertyManager.getStringProperty(
					contentEntityObject, "searchLabels");
			defaultSearchableText.append(valueForINdex);
		}
	}

}
