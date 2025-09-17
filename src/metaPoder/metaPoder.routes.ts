import express from 'express'
import {
  sanitizeMetaPoderInput,
  findAll,
  assignPoder,
  assignPoderToMetahumano,
  findAllForMetahumano,
  updateMetaPoder,
  remove
} from './metaPoder.controller.js'
const router = express.Router()

router.get('/', findAll)
router.post('/', sanitizeMetaPoderInput, assignPoder)
router.get('/metahumano/:metahumanoId', findAllForMetahumano)
router.post('/metahumano/:id', sanitizeMetaPoderInput, assignPoderToMetahumano)
router.put('/:id', sanitizeMetaPoderInput, updateMetaPoder)
router.delete('/:id', remove)

export default router
