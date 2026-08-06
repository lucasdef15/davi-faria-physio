'use client';

import { useEffect } from 'react';

import { lockDocumentScroll } from '@/lib/scroll-lock';

export function useBodyScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked) {
      return undefined;
    }

    return lockDocumentScroll();
  }, [isLocked]);
}
