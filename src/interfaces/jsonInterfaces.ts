export interface NodeArticle {
  type: string,
  id: string,
  links: {
    self: {
      href: string
    };
  };
  attributes: {
    drupal_internal__nid: number;
    langcode: string,
    status: boolean,
    title: string,
    created: string,
    path: {
      alias: string,
      pid: number,
      langcode: string
    };
  };
  relationships: {
    node_type: {
      data: null;
      links: {
        self: {
          href: string;
        };
      };
    };
    field_blog_category: {
      data: {
        type: string,
        id: string,
        meta: {
          drupal_internal__target_id: number
        };
      };
      links: {
        related: {
          href: string
        };
        self: {
          href: string
        };
      };
    };
    field_blog_listing_image: {
      data: {
        type: string,
        id: string,
        meta: {
          drupal_internal__target_id: number
        };
      };
      links: {
        related: {
          href: string
        };
        self: {
          href: string
        };
      };
    };
  };
}

export interface MediaType {
  'type': string,
  'id': string,
  links: object,
  attributes: object,
  relationships: object
}
