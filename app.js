import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import methodOverride from 'method-override'
import indexRoutes from './server/routes/index.js';
import dashBoard from './server/routes/dashboard.js';
import connectDB from './server/config/db.js';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import auth from './server/routes/auth.js';

const app = express();
const port = 5000 || process.env.PORT;

app.use(session({
    secret: "MySecret",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie: {maxAge: new Date(Date.now() + (3600000))}
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));

// connect to database
connectDB();

// static files
app.use(express.static('public'));

// templating engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use('/', auth);
app.use('/', indexRoutes);
app.use('/', dashBoard);

//Handle 404
app.get('*', (req, res) => {
    // res.status(404).send('404 Page Not Found.');
    res.status(404).render('404');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});