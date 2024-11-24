import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js'

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async function(accessToken, refreshToken, profile, done) {
    console.log(profile)
    const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage: profile.photos[0].value
    }

    try {
        let user = await User.findOne({ googleId: profile.id});
        if(user) {
            done(null, user);
        } else {
            user = await User.create(newUser);
            done(null, user);
        }

    } catch (error) {
        console.log(error)
    }
}     
));

// google login route
router.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }));

// retrieve user data
router.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: '/login-failure' ,
        successRedirect: '/dashboard'
    })
);

// route if something goes wrong
router.get('/login-failure', (req, res) => {
    res.send('Something went wrong...');
});

// logout
router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.log(error);
            res.send('Error logging out')
        } else {
            res.redirect('/')
        }
    })
})

// Presists user data after successful authentication
passport.serializeUser((user, done) =>{
    done(null, user.id);
});

// retrieves user data from session.
// passport.deserializeUser((id, done) => {
//     User.findById(id, (err, user) => {
//         done(err, user);
//     })
// })

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);  // Await the promise instead of using a callback
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});


export default router;