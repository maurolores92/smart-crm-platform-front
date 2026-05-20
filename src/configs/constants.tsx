
let host = 'https://maurodev.online/'; //prod
if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
  host = 'http://localhost:5002/'
}
let hostApi = 'https://maurodev.online/api' //prod
if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
  hostApi = 'http://localhost:5002/api'
}

export const constants = {
  imageHost: host,
  urlPath: '',
  imageUrl: host + '',
  api: hostApi,
}
