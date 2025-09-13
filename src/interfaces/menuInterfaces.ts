export interface FooterMenu {
  navigationLinks: [
    {
      iconClass: string,
      menuLink?: {
        value: {
          title: string,
          pageUrl: string,
        }
      }
    }
  ]
}

export interface FooterMenuItem {
  iconClass: string,
  menuLink?: {
    title: string,
    pageUrl: string,
  }
}

export interface MainMenu {
  firstLevel: [
    {
      element: string,
      iconClass?: string,
      button?: string,
      mainPath?: string,
      menuPath?: string,
      menuLink?: {
        value: {
          title: string,
          pageUrl: string,
        }
      }
      secondLevel?: MainMenuItem[],
      thirdLevel?: MainMenuItem[]
    }
  ]
}

export interface MainMenuItem {
  element: string,
  iconClass?: string,
  button?: string,
  mainPath?: string,
  menuPath?: string,
  menuLink?: {
    value: {
      title: string,
      pageUrl: string,
    }
  }
  secondLevel?: MainMenuItem[],
  thirdLevel?: MainMenuItem[]
}
