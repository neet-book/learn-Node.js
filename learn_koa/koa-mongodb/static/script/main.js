const loginForm = document.forms[0]
const submit = document.getElementById('loging-btn')

submit.addEventListener('click', async (event) => {
  event.preventDefault()
  window.setTimeout(() => {
    console.log(document.cookie)
  })
  const re =  await fetch('/login', {
    method: 'post',
    body: JSON.stringify(serialize(loginForm)),
    headers: new Headers({
      'Content-Type': 'application/json'
      })
  })

  if (re.status !== 200) return console.log('登录失败：', re)
  console.log(await re.json())
})

loginForm.onsubmit = () => {
  console.log('sub')
}
 

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
function camelCase(key) {
  return key.split('-').map((word, index) => {
    if (index === 0) return word
    let wordArr = word.split('')
    wordArr[0] = word[0].toUpperCase()
    return wordArr.join('')
  }).join("")
}