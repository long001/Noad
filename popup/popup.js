const querySelector = document.querySelector.bind(document)
const ul = querySelector('#ruleList')
const noDataText = '<li class="rule-list-item">暂无过滤规则 <a class="btn" id="resetBtn">恢复默认</a></li>'

// 页面加载时渲染规则列表
function renderList () {
  getSelectors().then(function (selectors) {
    if (selectors.length === 0) ul.innerHTML = noDataText
    else {
      const fragment = document.createDocumentFragment()
      selectors.forEach(function (selector) {
        fragment.appendChild(createListItem(selector))
      })
      ul.innerHTML = ''
      ul.appendChild(fragment)
    }
  })
}
renderList()

// 点击添加按钮向DOM添加一行li并存储到storage
querySelector('#addBtn').addEventListener('click', function () {
  const input = querySelector('#ruleInput')
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
  if (target.action === 'remove') {
    confirm('确认删除？')
    const li = target.parentNode
    ul.removeChild(li)
    if (ul.children.length === 0) ul.innerHTML = noDataText
    removeSelector(li.childNodes[0].textContent)
  }
})

querySelector('#checkbox').addEventListener('click', function (e) {
  const action = e.target.checked ? 'add' : 'remove'
  document.querySelector('.checkbox-label').classList[action]('checkbox-label-checked')
})

a = 1

querySelector('#collapseBtn').addEventListener('click', function () {
  if (a==1) {
    querySelector('#ruleContainer').style.display = 'block'
    a = 0
  } else {
    a =1
    querySelector('#ruleContainer').style.display = 'none'
  }
})

document.addEventListener('click', function (e) {
  if (e.target.id=='resetBtn') resetSelectors().then(renderList)
})

querySelector('#jumpToGitHub').addEventListener('click', function () {
  chrome.tabs.create({url: 'https://github.com/yeild/Noad/issues'})
})
