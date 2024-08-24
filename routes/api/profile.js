const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const Profile = require('../../models/Profile');

// @router  GET api/profile/me
// @desc    Get curreny users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @router  POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    console.log('1');
    const errors = validationResult(req);
    console.log('2');

    if (!errors.isEmpty) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log('3');

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    console.log('4');
    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    console.log('5');
    if (company) {
      profileFields.company = company;
    }
    console.log('6');
    if (website) {
      profileFields.website = website;
    }
    console.log('7');
    if (location) {
      profileFields.location = location;
    }
    console.log('8');
    if (bio) {
      profileFields.bio = bio;
    }
    console.log('9');
    if (status) {
      profileFields.status = status;
    }
    console.log('10');
    if (githubusername) {
      profileFields.githubusername = githubusername;
    }
    console.log('11');
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }
    console.log('12');

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.likedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    console.log('13');
    console.log(req.user.id);
    try {
      let profile = await Profile.findOne({ user: req.user.id });

      console.log('14');
      console.log(profile);
      if (profile) {
        // Update
        console.log('15');
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        console.log('16');
        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }

    // console.log(profileFields);
    // res.send('Hello');
  }
);

module.exports = router;
