const storage = chrome.storage.sync

storage.clear()
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
].join(',')

function getSelectors () {
  return new Promise(function (resolve) {
    storage.get('selectors', function ({ selectors }) {
      if (selectors) resolve(selectors)
      resolve([])
    })
  })
}

/**
 * @param selectors {Array}
 */
function setSelectors (selectors) {
  storage.set({ selectors })
}

async function addSelector (selector) {
  const selectors = await getSelectors()
  selectors.push(selector)
  return new Promise(function (resolve) {
    storage.set({ selectors }, resolve)
  })
}

async function removeSelector (index) {
  const selectors = await getSelectors()
  const newSelectors = selectors.filter(function (selector, idx) {
    return idx !== index
  })

  return new Promise(function (resolve) {
    storage.set({ selectors: newSelectors }, resolve)
  })
}

requestAnimationFrame(async function () {
  const selectorList = await getSelectors()
  const selectors = selectorList.join(',') || defaultSelectors
  const style = document.createElement('style')
  style.innerHTML = selectors + '{ display:none !important }'

  document.head.appendChild(style)
})

chrome.runtime.onMessage.addListener(function ({ action, selector }, sender, sendResponse) {
  window[action](selector).then(function () {
    getSelectors().then(selectors => {
      sendResponse(selectors)
    })
  })
  return true
})