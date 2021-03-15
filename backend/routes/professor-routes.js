const express = require('express')
const { check } = require('express-validator')

const profController = require('../controllers/prof-controller')
const router = express.Router()

router.patch('/:pid', profController.updateProfessor)

module.exports = router
