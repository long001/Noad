getSelectors().then(function (selectorList) {
  const selectors = selectorList.join(',')
  const style = document.createElement('style')
  style.innerHTML = selectors + '{ display:none !important }'

  document.head.appendChild(style)
})
