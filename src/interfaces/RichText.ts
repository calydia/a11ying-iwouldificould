export default interface RichTextNode {
  demoContent: boolean;
  format?: number | string;
  tag?: number;
  text?: string;
  type: string;
  fields?: {
    abbreviation?: string;
    blockType?: string;
    boxContent?: {
      root?: {
        children?: RichTextNode[];
      }
    };
    cite?: string;
    content: {
      root?: {
        children?: RichTextNode[];
      }
    }
    cssClass?: string;
    definition?: string;
    Heading?: string;
    heading?: string;
    HTMLContent?: string;
    language?: string;
    languageContent?: string;
    newTab?: boolean;  
    quote?: string;
    renderField?: boolean;
    url?: string;
  };
  listType?: 'ordered' | 'bullet';
  value?: {
    alt?: string;
    url?: string;
  };
  children?: RichTextNode[];
}
