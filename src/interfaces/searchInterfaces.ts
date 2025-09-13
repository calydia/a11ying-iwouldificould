export interface SearchResults {
  locale?: string,
  searchPageUrl?: string,
  title?: string,
  searchDescription?: string,
  totalDocs?: number
  doc: {
    relationTo: string;
  }
}
