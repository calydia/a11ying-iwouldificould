import type RichTextNode from './RichText';


export type LocalizedField = {
  fi: string;
  en: string;
};

export type RichTextField = {
  fi: { root: { children: RichTextNode[] } } | null;
  en: { root: { children: RichTextNode[] } } | null;
};

export default interface Page {
  id: number,
  slug: LocalizedField, 
  pageUrl: LocalizedField,
  title: LocalizedField,
  metaDescription: LocalizedField,
  content: RichTextField;
  lead: RichTextField;
}