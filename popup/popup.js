const querySelector = document.querySelector.bind(document)
const ul = querySelector('#selectorList')
const noDataText = '<li class="selector-list-item">暂无过滤规则</li>'

// 页面加载时渲染规则列表
getSelectors().then(function (selectors) {
  if (selectors.length === 0) ul.innerHTML = noDataText
  else {
    const fragment = document.createDocumentFragment()
    selectors.forEach(function (selector) {
      fragment.appendChild(createListItem(selector))
    })
    ul.appendChild(fragment)
  }
})

// 点击添加按钮向DOM添加一行li并存储到storage
querySelector('#addBtn').addEventListener('click', function () {
  const input = querySelector('#selectorInput')
  const selector = input.value.trim()
  if (!selector) return

  if (ul.innerHTML === noDataText) ul.innerHTML = ''
  ul.appendChild(createListItem(selector))
  addSelector(selector)

  // 清空输入框并且列表滚动到底部
  input.value = ''
  ul.scrollTop = ul.scrollHeight
})

// 点击移除按钮移除该行li并从storage移除该规则
ul.addEventListener('click', function ({ target }) {
  if (target.className === 'remove-btn') {
    const li = target.parentNode
    ul.removeChild(li)
    if (ul.children.length === 0) ul.innerHTML = noDataText
    removeSelector(li.childNodes[0].textContent)
  }
})

querySelector('#clearBtn').addEventListener('click', function () {
  chrome.storage.sync.set({ selectors: [] })
})

