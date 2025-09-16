import type { FormEvent, ReactNode } from 'react';
import { useState } from 'react';
import type { SearchResults } from '../interfaces/searchInterfaces';
import fetchApi from '../lib/payload';

import { stringify } from 'qs-esm'


export default function SearchComponent({ searchLabel, searchButton, searchMainHeading,
  searchResultLabel, searchNoResults, searchLocale, searchSiteName, searchContentType }: {
  searchLabel: string,
  searchButton: string,
  searchMainHeading: string,
  searchResultLabel: string,
  searchNoResults: string
  searchLocale: string,
  searchSiteName: string,
  searchContentType: string,
}) {

  

  const [searchWords, setSearchWords] = useState("");
  const [searchPageResult, setSearchPageResult] = useState<any>();
  const [totalEstimatedHits, setTotalEstimatedHits] = useState<ReactNode>();
  const [sentSearchWords, setSentSearchWords] = useState("");
  const [site, setSite] = useState("");

  const getSiteName = (name: string, locale: string) => {
    const subSiteTypes = [
      'reqpages',
      'criteria',
      'guidelines',
      'principles'
    ]

    let siteName = 'Toki, jos voisin';
    if (locale == 'en') {
      siteName = 'I would if I could';
    }

    if (subSiteTypes.includes(name)) {
      siteName = 'Melkein, mutta ei ihan';
      if (locale == 'en') {
        siteName = 'Almost, but not quite';
      }
    }

    return siteName;
  }

  const getSiteUrl = (name: string) => {
    const subSiteTypes = [
      'reqpages',
      'criteria',
      'guidelines',
      'principles'
    ]

    let url = '/';

    if (subSiteTypes.includes(name)) {
      url = 'https://wcag.a11y.ing/';
    }

    return url;
  }

  const getContentType = (name: string, locale: string) => {
    let contentType = '';
    
    if (name == 'criteria') {
      contentType = 'WCAG-kriteeri';
      if (locale == 'en') {
        contentType = 'WCAG criterion';
      }
    }

    if (name == 'guidelines') {
      contentType = 'WCAG-ohje';
      if (locale == 'en') {
        contentType = 'WCAG guideline';
      }
    }

    if (name == 'principles') {
      contentType = 'WCAG-periaate';
      if (locale == 'en') {
        contentType = 'WCAG principle';
      }
    }

    return contentType;
  }
  
  const searchDocs = async (search: string, locale: string) => {
    const queryObj = {
      where: {
        and: [
          {
            or: [
              {
                title: {
                  like: search,
                },
              },
              {
                searchLead: {
                  like: search
                }
              },
              {
                searchContent: {
                  like: search
                }
              },
              {
                searchDescription: {
                  like: search
                }
              },
            ],
          },
        ],
      },
    };

    const searchItems = await fetchApi<SearchResults>({
      endpoint: 'search',
      global: false,
      lang: locale,
      searchString: stringify(queryObj),
    });

    setSearchPageResult(searchItems);
    setTotalEstimatedHits(searchItems.totalDocs)
  };

  const GetSearchResults = async (searchWords: string) => {
    try {
      searchDocs(searchWords, searchLocale);
    }
    catch (e) {
      console.error(e);
    }
  }

  const handleChange = (event: React.FormEvent<HTMLInputElement>): void => {
    setSearchWords(event.currentTarget.value);
  }

  const formSubmit = (event: FormEvent) => {
    event.preventDefault();

    GetSearchResults(searchWords);
    setSentSearchWords(searchWords);
  }

  return (
    <div>
      <div className="text-lt-gray dark:text-dk-gray py-2 px-4-px max-w-xl mx-auto md:py-6 md:px-8-px lg:max-w-4xl">
        <form id="site-search" onSubmit={formSubmit} role="search" className="flex flex-col flex-wrap w-full md:items-center md:gap-x-6 md:gap-y-2 md:flex-row">
          <label htmlFor="search-input" className="text-lt-gray dark:text-dk-gray w-full">{searchLabel}</label>
          <input id="search-input" type="text" className="w-full md:max-w-sm" onChange={handleChange} />
          <button type="submit" className="button item--transition max-md:my-4">{searchButton}</button>
        </form>
      </div>
      <div className="sr-only" role="status">
        {(totalEstimatedHits as number > 0) ? totalEstimatedHits + ' ' + searchResultLabel : searchNoResults}
      </div>
      <div className="text-lt-gray dark:text-dk-gray pt-4 pb-2 px-4-px max-w-xl mx-auto md:py-6 md:px-8-px lg:max-w-4xl">
        { (totalEstimatedHits as number > 0) ?
          <div className="border-t-4 gradient-border-light dark:gradient-border-dark pt-4">
            <h2>{searchMainHeading} {sentSearchWords}, {totalEstimatedHits} {searchResultLabel}</h2>
          </div>
        : null }

        { (searchPageResult) ?
        <>
          <ul>
            {searchPageResult.docs.map((result: SearchResults, index: number) => {
              const siteName = getSiteName(result.doc.relationTo, searchLocale);
              const contentType = getContentType(result.doc.relationTo, searchLocale);
              const siteUrl = getSiteUrl(result.doc.relationTo);

              return (
                  <li key={`result-${index}`} className="my-2 py-6 flex flex-col border-t-2
                  ">
                    <a className="my-2 text-xl order-3" href={`${siteUrl}${searchLocale}/${result.searchPageUrl}/`}>
                      <h3 className="search-heading mt-0 mb-0.5 text-lg lg:text-xl inline">{result.title}</h3>
                    </a>
                    <span className="w-full self-end text-sm text-right order-1">{ searchSiteName } { siteName }</span>
                    { contentType && 
                      <span className="w-full self-end text-sm order-2">{ searchContentType } { contentType }</span>
                    }
                    <span className="block text-lg order-4">{result.searchDescription}</span>
                  </li>
              );
            })}
          </ul>
        </>
      : null }

      {(totalEstimatedHits as number == 0) ?
      <p>{ searchNoResults }</p>
      : null}
    </div>
    </div>
  );
}