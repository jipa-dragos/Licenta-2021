const express = require('express')
const { check } = require('express-validator')
const courseController = require('../controllers/course-controller')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')

router.use(checkAuth)

router.get('/', courseController.getCourses)
router.get('/:title', courseController.getCourseByTitle)
router.post('/', courseController.createCourse)

module.exports = router