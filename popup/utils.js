/**
 * 向storage添加一条规则
 * @param {String} selector
 * @returns {Promise}
 */
async function addSelector (selector) {
  const selectors = await getSelectors()
  selectors.push(selector)

  return new Promise(function (resolve) {
    storage.set({ selectors }, resolve)
  })
}

/**
 * 从storage移除一条规则
 * @param {String} selectorToRemove
 * @returns {Promise}
 */
async function removeSelector (selectorToRemove) {
  const selectors = await getSelectors()
  const newSelectors = selectors.filter(function (selector) {
    return selector !== selectorToRemove
  })

  return new Promise(function (resolve) {
    storage.set({ selectors: newSelectors }, resolve)
  })
}

/**
 * 创建带样式和移除按钮的li元素
 * @param {String} innerHtml
 * @returns {Element}
 */
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