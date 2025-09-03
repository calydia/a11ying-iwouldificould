export interface BlogData {
  data: [{ title: string, path: string, created: string, image?: string }]
}

export interface BlogPost {
  title: string;
  date: string;
  url: string;
  image?: {
    url: string;
  };
}

export type ExoveBlog = BlogPost[];