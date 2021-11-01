const path = require('path');
const express = require('express');
const expressHbs = require('express-handlebars');

const app = express();

const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const hbs = expressHbs.create({
    extname: 'hbs',
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(require('handlebars'))
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

app.use('/', require('./routes/home'));
app.use('/add', require('./routes/add'));
app.use('/courses', require('./routes/courses'));
app.use('/card', require('./routes/card'));

const PORT = process.env.PORT || 3000;

//Mongo config
const mongoose = require('mongoose');

async function start() {
    try {
        const url = 'mongodb+srv://mongo:mongo@mern.azpfv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
        await mongoose.connect(url, {
            useNewUrlParser: true
        });
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}...`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();
