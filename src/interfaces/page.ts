import type { RichTextNode } from './RichText';
export default interface Page {
  id: number,
  slug: {
    en: string,
    fi: string
  }, 
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
  lead: {
    root: {
      children: RichTextNode[];
    }
  },
  content: {
    root: {
      children: RichTextNode[];
    }
  }
}