declare module 'a11ying-ui' {
  export interface BreadcrumbItem {
    label: string;
    href?: string;
  }

  export interface FooterMenu {
    navigationLinks: FooterMenuItem[];
  }

  export interface FooterMenuRaw extends FooterMenuItem {
    iconClass: string;
    menuLink?: {
      title?: string;
      pageUrl?: string;
      value: {
        title: string;
        pageUrl: string;
      };
    };
  }

  export interface FooterMenuItem {
    iconClass: string;
    menuLink?: {
      title: string;
      pageUrl: string;
      value?: {
        title: string;
        pageUrl: string;
      };
    };
  }

  export interface MainMenu {
    firstLevel: MainMenuItem[];
  }

  export interface MainMenuItem {
    element: string;
    iconClass?: string;
    button?: string;
    mainPath?: string;
    menuPath?: string;
    menuLink?: {
      relationTo?: string;
      value: { title: string; pageUrl: string };
    };
    secondLevel?: MainMenuItem[];
    thirdLevel?: MainMenuItem[];
  }

  export interface RichTextNode {
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
        };
      };
      cite?: string;
      content: {
        root?: {
          children?: RichTextNode[];
        };
      };
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

  export interface SearchResults {
    locale?: string;
    searchPageUrl?: string;
    title?: string;
    searchDescription?: string;
    totalDocs?: number;
    doc: {
      relationTo: string;
    };
  }

  export interface SearchResultsResponse {
    docs: SearchResults[];
    totalDocs: number;
  }

  export const Breadcrumb: any;
  export const Button: any;
  export const Box: any;
  export const LanguageSwitcher: any;
  export const MainImage: any;
  export const RichText: any;
  export const SearchBlock: any;
  export const SearchComponent: any;
  export const SkipLink: any;
  export const ThemeToggle: any;
}

declare module 'a11ying-ui/styles';
declare module '@fontsource/*';
