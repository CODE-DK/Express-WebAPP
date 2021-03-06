'use strict';

const {Router} = require('express');
const Course = require('../models/course');
const router = Router();
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    const courses = await Course.find()
        .populate('userId')
        .select('email name');
    console.log(courses);

    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses
    });
});

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id);

    res.render('course', {
        layout: 'empty',
        title: `Курс ${course.title}`,
        course
    });
});

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({id: req.body.id});
        res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }
});

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }
    const course = await Course.findById(req.params.id);
    res.render('course-edit', {
        title: `Редактировать ${course.title}`,
        course
    });
});

router.post('/edit', auth, async (req, res) => {
    // const {id} = req.body;
    // delete req.params.id;
    await Course.findByIdAndUpdate(req.body.id, req.body);

    res.redirect('/courses');
});

module.exports = router;