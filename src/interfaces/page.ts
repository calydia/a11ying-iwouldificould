export default interface Page {
  id: number,
  pageUrl: {
    en: string,
    fi: string,
  },
  title: {
    en: string,
    fi: string,
  },
  demoContent: boolean,
  metaDescription: {
    en: string,
    fi: string,
  },
}