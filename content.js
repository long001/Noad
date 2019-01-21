function getAdsList () {
  let adsSelectors = ['.adsbygoogle']
  const customSelectors = JSON.parse(localStorage.getItem('Noad_custom_selectors'))

  if (customSelectors) adsSelectors = adsSelectors.concat(customSelectors)

  const adsList = []

  adsSelectors.forEach(function (selector) {
    let elements = document.querySelectorAll(selector)
    if (elements) Array.from(elements).forEach(function (element) {
      adsList.push(element)
    })
  })
  return adsList
}

function clean () {
  const ads = getAdsList()
  if (ads.length) {
    ads.forEach(function (ad) {
      ad.parentNode.removeChild(ad)
    })
  }
}

requestAnimationFrame(clean)
