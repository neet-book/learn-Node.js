const loginForm = document.forms[0]
const submit = document.getElementById('loging-btn')
const list = document.getElementById('user-list')

// 提交
loginForm.addEventListener('click', async (event) => {
  event.preventDefault()
  const re =  await fetch('/add', {
    method: 'post',
    body: JSON.stringify(serialize(loginForm)),
    headers: new Headers({
      'Content-Type': 'application/json'
      })
  })

  if (re.status !== 200) return console.log('登录失败：', re)
  let result = await re.json()
  for (let data of result) {
    addItem(list, data.user + ' ' + data.pwd)
  }

})

// 删除
list.addEventListener('click' ())

loginForm.onsubmit = () => {
  console.log('sub')
}
 
// 序列化表单
function serialize(form) {
  let data = {}
  for (item of form) {
    if (item.tagName.toLowerCase() !== 'button' && item.type !== 'button') {
      let key = camelCase(item.name)
      
      switch(item.type) {
        case 'checkbox': 
          data[key] = item.checked
        break
        case 'radio':
          data[key] = item.value
        break
        default:
          data[key] = item.value
      }
    }
  }
  return data
}

// 驼峰
function camelCase(key) {
  return key.split('-').map((word, index) => {
    if (index === 0) return word
    let wordArr = word.split('')
    wordArr[0] = word[0].toUpperCase()
    return wordArr.join('')
  }).join("")
}

// 添加列表项
function addItem(list, data) {
  let li = document.createElement('li')
  li.innerText = data
  console.log(list)
  list.appendChild(li)
}

// 事件委派
function delegate(element, selector, type, fn) {
  function callback (e) {
    // 浏览器兼容
    const event = e || window.event
    const target = event.target || event.srcElement
    const selectors = element.querySelectorAll(selector)
    selector = Array.prototype.slice.call(selector)

    // 检查是否是目标元素
    if (selector.includes(target)) {
      fn.call(element, event)
      return
    }


    // 检查target是否是目标的后代元素
    for (let item of selectors) {
      if (item.contains(target)) {
        fn.call(element, event)
        break
      }
    }
  }

  element.addEventListener(type, callback, false)
}

const network = {
  async get (url, opsions) {
    fetch(rul, {
      method: 'get'
    })
  }
}