let adsCount = 0

// 页面加载和
function updateContentStyle () {
  getSelectors().then(function (selectorList) {
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

chrome.runtime.onMessage.addListener(function ({ action }) {
  if (action === 'updateContentStyle') updateContentStyle()
  else if (action === 'getAdsCount') sendAdsCount(adsCount)
})

function sendAdsCount (adsCount) {
  chrome.runtime.sendMessage({ adsCount })
}
