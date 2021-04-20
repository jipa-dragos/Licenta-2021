const express = require('express')
const { check } = require('express-validator')
const courseController = require('../controllers/course-controller')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')

router.use(checkAuth)

router.get('/', courseController.getCourses)
router.get('/One/:id', courseController.getCourseById)
router.get('/:title', courseController.getCourseByTitle)
router.patch('/:id', courseController.updateCourse)
router.delete('/:id', courseController.deleteCourse)
router.post('/', courseController.createCourse)

module.exports = router
