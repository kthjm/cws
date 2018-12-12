console.log('options')
console.log(window)
console.log(window.chrome)

document.addEventListener('DOMContentLoaded', () => {
   let { tabs } = chrome
   tabs.query(
      {
         // active: true,
         // pinned: true
      },
      tabArray => {
         console.log(tabArray)
         tabArray.forEach(tab => {
            tabs.sendMessage(tab.id, { hello: 'hello' }, domcontent => {
               console.log(domcontent)
            })
         })
      }
   )
})
