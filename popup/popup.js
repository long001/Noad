const querySelector = document.querySelector.bind(document)

querySelector('#addBtn').addEventListener('click', function () {
  const selector = querySelector('#selectorInput').value.trim()
  if (!selector) return


  querySelector('#selectorList').appendChild(createListItem(selector))


  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'addSelector', selector })
  })
})

function createListItem (innerHtml) {
  const li = document.createElement('li')
  li.className = 'selector-list-item'
  li.innerHTML = innerHtml

  const removeBtn = document.createElement('a')
  removeBtn.className = 'remove-btn'
  removeBtn.innerHTML = '移除'
  li.appendChild(removeBtn)

  return li
}

function renderList (selectors) {

  const fragment = document.createDocumentFragment()
  
  console.log(selectors)
  selectors.forEach(function (selector) {
    const li = document.createElement('li')
    li.innerHTML = selector
    fragment.appendChild(li)
  })

  const ul = querySelector('#selectorList')
  console.dir(fragment)
  console.log(fragment.innerHTML)
  ul.innerHTML = fragment
}
