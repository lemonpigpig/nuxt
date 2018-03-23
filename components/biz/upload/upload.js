const getImgBase64 = (file, callback) => {
    const reader = new FileReader(); // eslint-disable-line
  reader.readAsDataURL(file)
  reader.onloadend = () => callback(reader.result)
}

const upload = (serverUrl, file, callback, error) => {
    const data = new FormData();// eslint-disable-line
  data.append('files', file, 'image.jpg')
    const xhr = new XMLHttpRequest();// eslint-disable-line
  xhr.open('POST', serverUrl, true)
  xhr.send(data)
  xhr.onload = () => {
        xhr.status === 200 ? callback(JSON.parse(xhr.response)) : null;// eslint-disable-line
  }
  xhr.onerror = () => {
    if (error && typeof error === 'function') {
      error('上传失败')
    }
  }
}
export default {
  getImgBase64,
  upload
}
