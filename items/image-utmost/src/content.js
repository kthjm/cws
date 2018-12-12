let img = window.document.querySelector('img')
img.style.display = 'none'

chrome.storage.local.get('styles', items => {
   let { background, objectFit } = items.styles

   let newImg = new Image()
   newImg.src = img.src
   Object.entries({
      width: '100%',
      height: '100%',
      cursor: '',
      objectFit,
      background
   }).forEach(([key, val]) => {
      newImg.style[key] = val
   })

   document.body.removeChild(img)
   document.body.appendChild(newImg)
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
   if (location.href.includes('file://')) return false
   let { src } = window.document.querySelector('img')
   sendResponse({ src })
   return true
})
