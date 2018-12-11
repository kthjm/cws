const appName = 'skewer'

chrome.runtime.onInstalled.addListener(details => {
   chrome.browserAction.setBadgeBackgroundColor({ color: '#f9f640' })
})

chrome.browserAction.onClicked.addListener(() => {
   chrome.browserAction.setBadgeText({ text: ' ' })

   chrome.tabs.query(
      {
         active: true,
         currentWindow: true
      },
      tabs => {
         if (!tabs.length) {
            chrome.browserAction.setBadgeText({ text: '' })
            return false
         }

         let tab = tabs[0]

         chrome.tabs.sendMessage(tab.id, {}, async res => {
            if (!res) {
               chrome.browserAction.setBadgeText({ text: '' })
               return false
            }

            let { domain, srcArr } = res,
               zipName = `${appName}.${domain}.${generateZipFileName()}`,
               zip = new JSZip()

            let blobs = await getImageBlobs(srcArr)
            blobs.forEach(info => {
               if (!info) return false
               let { filename, blob } = info
               zip.file(`${zipName}/${filename}`, blob)
            })
            let zipBlob = await zip.generateAsync({ type: 'blob' })

            let a = document.createElement('a')
            a.href = URL.createObjectURL(zipBlob)
            a.download = `${zipName}.zip`
            a.onclick = e => chrome.browserAction.setBadgeText({ text: '' })
            a.click()
         })
      }
   )
})

const getImageBlobs = async srcObject => {
   let fetchBlobs = await Promise.all(
      Object.entries(srcObject).map(([widthKey, srcArray]) =>
         Promise.all(
            srcArray.map(src =>
               fetch(src)
                  .then(res => res.blob())
                  .then(blob => {
                     let { type } = blob,
                        filename = `${widthKey}/${generateImageFileName(
                           src,
                           type
                        )}`
                     return { filename, blob }
                  })
                  .catch(err => false)
            )
         )
      )
   )

   return [].concat(...fetchBlobs)
}

const generateImageFileName = (filepath, type) => {
   let fragments = filepath.split('/').filter(fragment => fragment),
      filename = fragments[fragments.length - 1]

   if (!filename) return 'unknown'
   ;['?', ':'].forEach(unnecessary => {
      if (!filename.includes(unnecessary)) return false
      filename = filename.split(unnecessary)[0]
   })

   let invalid = invalidEvt(filename)
   if (invalid) {
      let evt = type.split('/')[1]
      filename = `${invalid}.${evt}`
   }

   return filename
}

const invalidEvt = filename => {
   let fragments = filename.split('.'),
      name = fragments[0],
      evt = fragments[1]

   if (evt === 'png' || evt === 'jpg' || evt === 'jpeg' || evt === 'gif') {
      return false
   } else {
      return name
   }
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
