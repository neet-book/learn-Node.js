// 获取元素
// 发布按钮
const submitBtn = document.querySelector('.submit-btn');
// 留言列表
const form = document.forms[0]


// 定义显示提示函数
const showTip = (function() {
  // 检查是否已经创建过tip
  const tips = document.getElementsByClassName('tip')
  if (tips.length > 0) throw new Error('不可重复创建Tip')

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

// 添加提交按钮响应事件
submitBtn.addEventListener('click', () => {
  const msg = serializeForm(form)

  submitMessage(msg).then(re => {
    showTip(re)
    // 重置表单
    form.reset()
  })
  .catch(e => {
    showTip(e)
  })
})

// 序列化Form
function serializeForm(form) {
  const data = {}
  Array.from(form).forEach(item => {
    data[item.name] = item.value
  })

  return data
}

// 提交留言
function submitMessage(msg) {
  
  return new Promise((resolve, reject) => {
    fetch('/submit', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      params: msg
    })
  }).then(response => {
    console.log(response)
    resolve()
  })
}