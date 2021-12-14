const env = require('dotenv');
const path = require('path');

//Express App
const express = require('express');
const expressHbs = require('express-handlebars');
const csrf = require('csurf');
const flash = require('connect-flash');

//Express session
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);

//Add middlewares
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

//Connect .env variables to global scope
env.config();

//Global variables
const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI;

//Create App
const app = express();

//Fix for handlebars
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const hbs = expressHbs.create({
    extname: 'hbs',
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(require('handlebars'))
});

//Add session mongo storage
const store = new MongoStore({
    collection: 'sessions',
    uri: DB_URI
});


//Config engine for handlebar
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

//Register session
app.use(session({
    secret: 'MEGA secret KEY',
    resave: false,
    saveUninitialized: false,
    store: store
}));

//Register middlewares
app.use(csrf({}));
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

//Config routes
app.use('/', require('./routes/home'));
app.use('/add', require('./routes/add'));
app.use('/courses', require('./routes/courses'));
app.use('/card', require('./routes/card'));
app.use('/orders', require('./routes/orders'));
app.use('/auth', require('./routes/auth'));

//Config mongo DB
const mongoose = require('mongoose');

//Start App func
async function start() {
    try {
        await mongoose.connect(DB_URI, {
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
