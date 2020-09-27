
let that
let data = {
  title: '',
  content: ''
}

// connecting with firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDkXDizIJGL0XBdrb9iZHJ8AtvnqhEVZkI',
  authDomain: 'note-taking-9fc99.firebaseapp.com',
  databaseURL: 'https://note-taking-9fc99.firebaseio.com',
  projectId: 'note-taking-9fc99',
  storageBucket: 'note-taking-9fc99.appspot.com',
  messagingSenderId: '980610383856',
  appId: '1:980610383856:web:70978ff1cbc43c5c8de735'
}
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database()
const ref = database.ref('notes')


// main section js
class Tab {
  constructor (id) {
    // "this" includes, tab,lis and getName function
    that = this
    this.main = document.querySelector(id)
    this.add = this.main.querySelector('.tabadd i')
    this.ul = this.main.querySelector('.heading ul:first-child')
    this.fsection = this.main.querySelector('.tabscon')
    
    this.init()
    this.getData(ref)
  }

  init () {
    this.updateNode()

    this.add.onclick = this.addTab 
    for (let i = 0; i < this.lis.length; i++) {
      this.lis[i].index = i
      this.lis[i].onclick = this.toggleTab
      this.remove[i].onclick = this.removeTab
      this.spans[i].ondblclick = this.editTabOne
      this.sections[i].ondblclick = this.editTabTwo
    } 


  }
    getData (ref) {
       
      return new Promise((resolve, reject) => {
        const onError = error => reject(error)

        const onData = data => resolve(data.val())

        ref.on('value', onData, onError)
      })
      .then(function (result) {
        
        
        const keys = Object.keys(result)
        
        
               
        for (let i = 0; i < keys.length; i++) {
          let k = keys[i]
          data = {
            title: result[k].title,
            content: result[k].content
          }

          const li = `<li class="removeList"><span>${data.title}</span><i class="fa fa-times-circle" aria-hidden="true"></i></li>`
          that.ul.insertAdjacentHTML('beforeend', li)
          const section = `<section>${data.content}</section>`
          that.fsection.insertAdjacentHTML('beforeend', section)

          that.init()         
        }      
      })

      
      .catch(error => {
        console.log(error)
      })

    }

  
  
  updateNode () {
   
    
    this.lis = this.main.querySelectorAll('li')
    console.log(this.lis);
    this.sections = this.main.querySelectorAll('section')
    this.remove = this.main.querySelectorAll('.fa-times-circle')
    this.spans = this.main.querySelectorAll('.heading li span:first-child')
    this.input = this.main.querySelectorAll('.heading li input')
    
  }

  clearClass () {
    for (let i = 0; i < this.lis.length; i++) {
      this.lis[i].className = ''
      this.sections[i].className = ''
    }
  }
  // functions
  toggleTab () {
    that.clearClass()
    this.className = 'active'
    that.sections[this.index].className = 'conactive'
  }
  // add more tabs

  addTab () {
    that.clearClass()
    
    const li = `<li class="active"><span>new tab</span><i class="fa fa-times-circle" aria-hidden="true"></i></li>`
    that.ul.insertAdjacentHTML('beforeend', li)
    const section = `<section class="conactive">new content</section>`
    that.fsection.insertAdjacentHTML('beforeend', section)
    that.init()
    
  }

  removeTab (e) {
    e.stopPropagation()
    let index = this.parentNode.index
    console.log(index)
    that.lis[index].remove()
    that.sections[index].remove()
    // 如果当前li处于选定状态（背景为粉色）则删除别的li时仍然显示当前section，即不执行下面两行操作
    if (document.querySelector('.active')) return
    that.init()
    index--
    that.lis[index] && that.lis[index].click()
  }

  editTabOne () {
    let str = this.innerHTML
    window.getSelection
      ? window.getSelection().removeAllRanges()
      : document.selection.empty()
    this.innerHTML = `<input type="text"/>`
    const input = this.children[0]

    input.value = str
    input.select()
    input.onblur = function () {
      this.parentNode.innerHTML = this.value
      data.title = this.value
    }

    // 点击enter
    input.onkeyup = function (e) {
      if (e.keyCode === 13) {
        input.blur()
        data.title = this.value
        data.content && ref.push(data)
      }
    }
  }

  editTabTwo () {
    let str = this.innerHTML
    window.getSelection
      ? window.getSelection().removeAllRanges()
      : document.selection.empty()

    this.innerHTML = '<input type="text" />'
    const input = this.children[0]

    input.value = str
    input.select()
    input.onblur = function () {
      this.parentNode.innerHTML = this.value
      data.content = this.value
    }

    // 点击enter
    input.onkeyup = function (e) {
      if (e.keyCode === 13) {
        input.blur()
        data.content = this.value
        data.title && data.content && ref.push(data)
      }
    }
  }
}
new Tab('#tab')

