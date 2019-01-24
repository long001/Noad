const querySelector = document.querySelector.bind(document)
const ul = querySelector('#ruleList')
const noDataText = '<li class="rule-list-item">暂无过滤规则 <a class="btn" id="resetBtn">恢复默认</a></li>'
const updateContentStyle = sendMessage.bind(null, 'updateContentStyle')

// 渲染规则列表
renderList()

// 渲染是否启用的checkbox和当前页拦截广告数
renderStatus()

// 切换是否对当前网站启用
querySelector('#checkbox').addEventListener('click', function ({ target }) {
  const classListAction = target.checked ? 'add' : 'remove'
  document.querySelector('.checkbox-label').classList[classListAction]('checkbox-label-checked')
  sendMessage('toggleEffective', { isEffective: target.checked })
})

// 展开/收起规则列表
querySelector('#collapseBtn').addEventListener('click', function () {
  querySelector('#ruleContainer').style.display = (this.open = !this.open) ? 'block' : 'none'
})

// 点击添加按钮向DOM添加一行li并存储到storage
querySelector('#addBtn').addEventListener('click', function () {
  const input = querySelector('#ruleInput')
  const selector = input.value.trim()
  if (!selector) return

  if (ul.innerHTML === noDataText) ul.innerHTML = ''
  ul.appendChild(createListItem(selector))
  addSelector(selector).then(updateContentStyle) //添加成功后content更新页面样式

  // 清空输入框并且列表滚动到底部
  input.value = ''
  ul.scrollTop = ul.scrollHeight
})

// 点击移除按钮移除该行li并从storage移除该规则
ul.addEventListener('click', function ({ target }) {
  if (target.action === 'remove') {
    const li = target.parentNode
    ul.removeChild(li)
    if (ul.children.length === 0) ul.innerHTML = noDataText
    removeSelector(li.childNodes[0].textContent).then(updateContentStyle) //移除成功后content更新页面样式
  }
})

// 点击重置按钮时store恢复默认规则并重新渲染规则列表
document.addEventListener('click', function (e) {
  if (e.target.id=='resetBtn') resetSelectors().then(function () {
    renderList()
    updateContentStyle() // 更新content样式
  })
})

// 添加/删除/重置后更新已拦截广告数
chrome.runtime.onMessage.addListener(function ({ adsCount }) {
  querySelector('#hiddenAdsCount').innerHTML = adsCount
})

// 跳转到GitHub isssue
querySelector('#jumpToGitHub').addEventListener('click', function () {
  chrome.tabs.create({url: 'https://github.com/yeild/Noad/issues'})
})

// 跳转到css参考手册
querySelector('#guideBtn').addEventListener('click', function () {
  chrome.tabs.create({url: 'http://www.w3school.com.cn/cssref/css_selectors.asp'})
})


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

function renderStatus () {
  sendMessage('getData').then(function ({ isEffective, adsCount }) {
    if (!isEffective) {
      document.querySelector('.checkbox-label').classList.remove('checkbox-label-checked')
      document.querySelector('#checkbox').checked = false
    }
    querySelector('#hiddenAdsCount').innerHTML = adsCount
  })
}
