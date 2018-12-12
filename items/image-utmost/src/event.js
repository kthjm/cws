const appName = 'utmost'

chrome.runtime.onInstalled.addListener(details => {
   let { reason, previousVersion } = details

   if (reason === 'install') {
      chrome.storage.local.set({
         styles: {
            background: '#000000',
            objectFit: 'contain'
         }
      })
   }

   chrome.browserAction.setBadgeBackgroundColor({ color: '#f9f640' })
})

chrome.browserAction.onClicked.addListener(() => {
   chrome.browserAction.setBadgeText({ text: ' ' })

   chrome.tabs.query({}, tabs => {
      let srcArray = [],
         zipName = `${appName}.${generateZipFileName()}`

      setTimeout(async () => {
         if (!srcArray.length) {
            chrome.browserAction.setBadgeText({ text: '' })
            return false
         }

         let zip = new JSZip()
         let blobs = await getImageBlobs(srcArray)
         blobs.forEach(info => {
            let { filename, blob } = info
            zip.file(`${zipName}/${filename}`, blob)
         })

         let zipBlob = await zip.generateAsync({ type: 'blob' })
         let a = document.createElement('a')
         a.href = URL.createObjectURL(zipBlob)
         a.download = `${zipName}.zip`
         a.onclick = e => {
            chrome.browserAction.setBadgeText({ text: '' })
            tabRemoveRecursive(tabRemoveGfn(srcArray))
         }
         a.click()
      }, 1000)

      tabs.forEach(tab =>
         chrome.tabs.sendMessage(
            tab.id,
            {},
            res =>
               !res
                  ? false
                  : srcArray.push({
                       tabId: tab.id,
                       src: res.src
                    })
         )
      )
   })
})

function* tabRemoveGfn(srcArray) {
   let index = 0
   while (index < srcArray.length) {
      let { tabId } = srcArray[index]
      yield () => chrome.tabs.remove([tabId])
      index++
   }
}

const tabRemoveRecursive = iterator => {
   let { value, done } = iterator.next()
   if (done) {
      return false
   } else {
      value()
      return setTimeout(() => tabRemoveRecursive(iterator), 60)
   }
}

const getImageBlobs = srcArray =>
   Promise.all(
      srcArray.map(({ src }) =>
         fetch(src)
            .then(res => res.blob())
            .then(blob => ({
               filename: generateImageFileName(src),
               blob
            }))
      )
   )

const generateImageFileName = filepath => {
   let fragments = filepath.split('/').filter(fragment => fragment),
      domain = fragments[1]
         .split('.')
         .filter(
            (fragment, fragmentIndex, fragments) =>
               fragmentIndex >= fragments.length - 2
         )
         .join('.'),
      lastPath = fragments[fragments.length - 1]
   ;['?', ':'].forEach(unnecessary => {
      if (!lastPath.includes(unnecessary)) return false
      lastPath = lastPath.split(unnecessary)[0]
   })

   return `${domain}/${lastPath}`
}

const generateZipFileName = () => {
   let instance = new Date(Date.now())
   return [
      'getFullYear',
      'getMonth',
      'getDate',
      'getHours',
      'getMinutes',
      'getSeconds'
   ]
      .map(
         method =>
            method === 'getMonth' ? instance[method]() + 1 : instance[method]()
      )
      .join('.')
}
