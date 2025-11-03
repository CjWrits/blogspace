const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google OAuth 
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      return done(null, user);
    }
    
    user = new User({
      name: profile.displayName,
      email: profile.emails[0].value,
      password: 'oauth_user',
      university: 'Not specified'
    });
    
    await user.save();
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

// GitHub OAuth 
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/api/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;
    let user = await User.findOne({ email });
    
    if (user) {
      return done(null, user);
    }
    
    user = new User({
      name: profile.displayName || profile.username,
      email,
      password: 'oauth_user',
      university: 'Not specified'
    });
    
    await user.save();
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

module.exports = passport;