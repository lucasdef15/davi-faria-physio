export interface ScrollLockDocument {
  body: { style: StyleTarget };
  documentElement: { style: StyleTarget };
}

interface StyleTarget {
  overflow: string;
}

export function lockDocumentScroll(documentLike: ScrollLockDocument): () => void {
  const previousBodyOverflow = documentLike.body.style.overflow;
  const previousHtmlOverflow = documentLike.documentElement.style.overflow;

  documentLike.body.style.overflow = 'hidden';
  documentLike.documentElement.style.overflow = 'hidden';

  return () => {
    documentLike.body.style.overflow = previousBodyOverflow;
    documentLike.documentElement.style.overflow = previousHtmlOverflow;
  };
}
