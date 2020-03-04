// 获取留言列表
const messageList = document.getElementsByClassName('message-ul')[0];
window.onload = function () {
  // 获取信息列表
  const list = []
  
  getMessageList('/msg')
    .then(re => {
      console.log(re)
    })
}

// 封装请求数据方法
function getMessageList() {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest ();
    request.open('GET', '/msg', true)
    request.send(null)

    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        if (request.status === 200) {
          resolve(request.responseText)
        } else {
          reject(request.status)
        }
      }
    }
  })
}

// 定义显示提示函数
const showTip = (function() {
  // 创建提示载体元素
  const tip = document.createElement('div');
  tip.classList.toggle('tip');
  document.body.append(tip)
  
  // 定时器
  let timer = null;

  // 返回显示提示方法
  return function (msg) {
    if(tip.innerText !== msg) tip.innerText = msg;
    tip.classList.add('showTip');

    // 设置隐藏tip的定时器
    if (timer) window.clearTimeout(timer)
    timer = setTimeout(() => {
      tip.classList.remove('showTip')
    }, 1300)
  }
})();

// 添加留言项
function addMessage(msg) {
  const li = document.getElementsByClassName('message-item')[0];
  const clone = li.cloneNode(true)
  const content = li.children[0]
  const date = li.children[1]
  
  content.innerText = msg.content
  data.innerText = msg.data
  author.innerText = msg.author

  messageList.insertBefore(li, messageList.firstChild);
}
