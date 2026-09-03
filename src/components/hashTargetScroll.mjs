export function decodeHashTarget(hash) {
  if (typeof hash !== 'string' || hash.length < 2 || hash[0] !== '#') {
    return null;
  }

  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return null;
  }
}

export function scheduleHashTargetScroll({
  hash,
  documentObject = globalThis.document,
  requestFrame = globalThis.requestAnimationFrame,
  cancelFrame = globalThis.cancelAnimationFrame,
}) {
  const targetId = decodeHashTarget(hash);
  if (
    targetId === null ||
    typeof documentObject?.getElementById !== 'function' ||
    typeof requestFrame !== 'function' ||
    typeof cancelFrame !== 'function'
  ) {
    return () => {};
  }

  let innerFrame = null;
  const outerFrame = requestFrame(() => {
    innerFrame = requestFrame(() => {
      documentObject.getElementById(targetId)?.scrollIntoView({block: 'start'});
    });
  });

  return () => {
    cancelFrame(outerFrame);
    if (innerFrame !== null) cancelFrame(innerFrame);
  };
}
