import type RichTextNode from './RichText';

export default interface NotFound {
  title: string,
  content: { root: { children: RichTextNode[] } } | null;
}