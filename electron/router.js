const router = require('@cyyjs/electron-router')
const { importFile, exportFile} = require('./lib/io')

router.post('exportFile', exportFile)
router.post('importFile', importFile)