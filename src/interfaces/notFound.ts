import type { RichTextNode } from 'a11ying-ui';

export default interface NotFound {
  title: string,
  content: { root: { children: RichTextNode[] } } | null;
}