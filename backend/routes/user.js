const { Router } = require('express');
const { User, Script } = require('../models');

const router = Router();

router.get('/', async (req, res) => {
	const [total, users] = await Promise.all([
		User.countDocuments(),
		User.find().populate('scripts')
	]);

	res.json({
		total,
		users,
	});
});
router.get('/login', async (req, res) => {
	const { username } = req.query;
	const user = await User.findOne({ username }).populate('scripts');
    res.json(user);
});

router.post('/register', async (req, res) => {
	const { username } = req.body;
	const newUser = await new User({ username });
	await newUser.save();
	res.json(newUser);
});

router.get('/scripts', async (req, res) => {
	const { uid } = req.query;
	const user = await User.findById(uid).populate('scripts');
	res.json(user.scripts);
});

module.exports = router;
