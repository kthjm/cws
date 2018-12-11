chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
   if (location.href.includes('file://')) return false
   if (location.href.includes('data:')) return false

   let imgs = Array.from(document.querySelectorAll('img')),
      response = {
         domain: getDomain(),
         srcArr: {}
      }

   imgs.forEach(img => {
      let { clientWidth, src } = img

      if (!src) return false

      if (!response.srcArr[clientWidth]) {
         response.srcArr[clientWidth] = []
      }
      response.srcArr[clientWidth].push(src)
   })

   sendResponse(response)
   return true

   function getDomain() {
      let hostFragments = location.host.split('.')
      return hostFragments[hostFragments.length - 2]
   }
})
