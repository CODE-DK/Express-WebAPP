'use strict';

const {Router} = require('express');
const router = Router();
const Course = require('../models/course');
const auth = require('../middleware/auth');

router.post('/add', auth, async (req, res) => {
    const course = await Course.findById(req.body.id);

    await req.user.addToCart(course);
    res.redirect('/card');
});

router.delete('/remove/:id', auth, async (req, res) => {
    await req.user.removeFromCart(req.params.id);

    const user = await req.user.populate('cart.items.courseId');
    const courses = mapCartItems(user.cart);
    const cart = {
        courses, price: computePrice(courses)
    };
    res.status(200).json(cart);
});

router.get('/', auth, async (req, res) => {
    const user = await req.user.populate('cart.items.courseId');

    const courses = mapCartItems(user.cart);
    const price = computePrice(courses);

    res.render('card', {
        title: 'Корзина',
        isCard: true,
        courses: courses,
        price: price
    });
});

function mapCartItems(cart) {
    return cart.items.map(item => ({
        ...item.courseId._doc,
        id: item.courseId.id,
        count: item.count
    }));
}

function computePrice(courses) {
    return courses.reduce((total, course) => total += course.price * course.count, 0);
}

module.exports = router;