let adsCount = 0

// 页面加载和
function updateContentStyle () {
  Promise.all([getSelectors(), getWhiteList()]).then(function ([selectorList, whiteList]) {
    if (whiteList.includes(location.host)) { // 跳过白名单网站
      const styleElem = document.querySelector('#Noad-style')
      if (styleElem) styleElem.parentNode.removeChild(styleElem)
      sendAdsCount(0)
      return
    }

    // 插入style
    const styleElem = document.querySelector('#Noad-style') || (function () {
        const style = document.createElement('style')
        style.id = 'Noad-style'
        document.head.appendChild(style)
        return style
      }())
    styleElem.innerHTML = selectorList.join(',') + '{ display:none !important }'

    // 计算屏蔽广告的个数
    adsCount = selectorList.reduce(function (count, selector) {
      return count + document.querySelectorAll(selector).length
    }, 0)
    sendAdsCount(adsCount)
  })
}
updateContentStyle()

chrome.runtime.onMessage.addListener(function ({ action, data }, sender, sendResponse) {
  if (action === 'updateContentStyle') updateContentStyle()
  else if (action === 'getData') {
    getWhiteList().then(function (whiteList) {
      const isEffective = !whiteList.includes(location.host)
      sendResponse({ adsCount, isEffective })
    })
    return true
  } else if (action === 'toggleEffective') {
    getWhiteList().then(function (whiteList) {
      const host = location.host
      const includes = whiteList.includes(host)
      let list = []
      if (!data.isEffective && !includes) list = whiteList.concat(host)
      else if (data.isEffective && includes) list = whiteList.filter(function (existedHost) {
        return existedHost !== host
      })
      setWhiteList(list)
    })
  }
})

function sendAdsCount (adsCount) {
  chrome.runtime.sendMessage({ adsCount })
}

function getWhiteList () {
  return new Promise(function (resolve) {
    storage.get('whiteList', function ({ whiteList }) {
      if (!whiteList) {
        resolve([])
        setWhiteList([])
      } else resolve(whiteList)
    })
  })
}

function setWhiteList (whiteList) {
  storage.set({ whiteList }, updateContentStyle)
}
