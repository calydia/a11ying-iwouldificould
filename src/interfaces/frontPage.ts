import type RichTextNode from './RichText';

export default interface FrontPage {
  id: number,
  pageUrl: {
    en: string,
    fi: string,
  },
  title: {
    en: string,
    fi: string,
  },
  metaDescription: {
    en: string,
    fi: string,
  },
  content: {
    root: {
      children: RichTextNode[];
    }
  }
}