const querySelector = document.querySelector.bind(document)
const ul = querySelector('#ruleList')
const noDataText = '<li class="rule-list-item">暂无过滤规则 <a class="btn" id="resetBtn">恢复默认</a></li>'

// 渲染规则列表
renderList()

// 渲染当前页拦截广告数
sendMessage({ action: 'getAdsCount' })

// 切换是否对当前网站启用
querySelector('#checkbox').addEventListener('click', function (e) {
  const classListAction = e.target.checked ? 'add' : 'remove'
  document.querySelector('.checkbox-label').classList[classListAction]('checkbox-label-checked')
})

// 展开收起规则配置列表
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

// 点击重置按钮时渲染规则列表并更新content样式
document.addEventListener('click', function (e) {
  if (e.target.id=='resetBtn') resetSelectors().then(function () {
    renderList()
    updateContentStyle()
  })
})

// 跳转到GitHub isssue
querySelector('#jumpToGitHub').addEventListener('click', function () {
  chrome.tabs.create({url: 'https://github.com/yeild/Noad/issues'})
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

function updateContentStyle () {
  sendMessage({ action: 'updateContentStyle' })
}

function sendMessage (data) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, data)
  })
}

chrome.runtime.onMessage.addListener(function ({ adsCount }) {
  querySelector('#hiddenAdsCount').innerHTML = adsCount
})
