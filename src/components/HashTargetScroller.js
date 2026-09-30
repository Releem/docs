import {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';
import {scheduleHashTargetScroll} from './hashTargetScroll.mjs';

export default function HashTargetScroller() {
  const {search, hash} = useLocation();

  useEffect(
    () =>
      scheduleHashTargetScroll({
        hash,
        documentObject: document,
        requestFrame: window.requestAnimationFrame.bind(window),
        cancelFrame: window.cancelAnimationFrame.bind(window),
      }),
    [search, hash],
  );

  return null;
}
