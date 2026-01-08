import type { Schema, Struct } from '@strapi/strapi';

export interface PageElementsFeature extends Struct.ComponentSchema {
  collectionName: 'components_page_elements_features';
  info: {
    displayName: 'Feature';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.String & Schema.Attribute.DefaultTo<'BookOpen'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'page-elements.feature': PageElementsFeature;
    }
  }
}
