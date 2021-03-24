const Client = require('@cyyjs/electron-router/lib/client')
const router = new Client()
export const exportFile = (data) => router.post('exportFile', data);
export const importFile = (data) => router.post('importFile', data);
