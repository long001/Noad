const storage = chrome.storage.sync

const defaultSelectors = [
  // google
  '.adsbygoogle',
  '[id^=google_ads_iframe]',
  // 知乎
  '.TopstoryItem--advertCard',
  'img[alt=广告]',
  // 其他
  '.pc_ad',
  '[class^=ps_]'
]

function getSelectors () {
  return new Promise(function (resolve) {
    storage.get('selectors', function ({ selectors }) {
      if (!selectors) {
        setSelectors(defaultSelectors)
        resolve(defaultSelectors)
      } else resolve(selectors)
    })
  })
}

/**
 * @param selectors {Array}
 */
function setSelectors (selectors) {
  storage.set({ selectors })
}
