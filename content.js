
const storage = chrome.storage.sync

function getAdsList () {
  let adsSelectors = [
    '.adsbygoogle',
    '.pc_ad',
    '.ps_1',
    '.ps_2',
    '.ps_3',
    '.ps_4',
    '.ps_5',
    '.ps_6',
    '.ps_7',
    '.ps_26',
    '.ps_27'
  ]
  storage.get('customSelectors', function ({ customSelectors }) {
    if (customSelectors.length) adsSelectors = adsSelectors.concat(customSelectors)
  })
  
 /* const adsList = []
  adsSelectors.forEach(function (selector) {
    let elements = document.querySelectorAll(selector)
    if (elements) Array.from(elements).forEach(function (element) {
      adsList.push(element)
    })
  })
  return adsList */
 return adsSelectors.join(',')
}

function clean () {
  const ads = getAdsList()

  const style = document.createElement('style')
  style.innerHTML = ads + '{ display:none }'
  document.head.appendChild(style)

/*  if (ads.length) {
    ads.forEach(function (ad) {
      ad.parentNode.removeChild(ad)
    })
  } */
}

requestAnimationFrame(clean)
