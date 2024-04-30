const { Router } = require('express');
const { User, Script } = require('../models');

const router = Router();

router.get('/:scriptId/owners', async (req, res) => {
	const { scriptId } = req.params;
	const script = await Script.findById(scriptId).populate('owners');
	res.json(script.owners);
});

router.get('/:scriptId', async (req, res) => {
	const { scriptId } = req.params;
	const script = await Script.findById(scriptId).populate('owners');
	
	console.log('[GET]', script.content)
	
	res.json(script);
});

router.post('/', async (req, res) => {
	const { uid, name } = req.body;

	const newScript = await new Script({ name, owners: [uid] });
	await newScript.save();
	const user = await User.findById(uid);
	await user.scripts.push(newScript._id.toString());
	await user.save();

	res.status(201).json(newScript);
});

// router.post('/create', async (req, res) => {
// 	const { name } = req.body;
//     const newScript = await new Script({ name });
//     await newScript.save();
//     res.json(newScript);
// });

router.put('/:scriptId', async (req, res) => {
	const { scriptId } = req.params;
	const { content } = req.body;
	await Script.findByIdAndUpdate(scriptId, { content });

	res.json({ message: 'Script actualizado!' });
});

router.put('share/', async (req, res) => {
	const { scriptId } = req.query;
	const { ownerId } = req.body;
	await User.findByIdAndUpdate(ownerId, { $addToSet: { scrips: scriptId } });
	await Script.findByIdAndUpdate(scriptId, { $addToSet: { owners: ownerId } });
	res.json({ message: 'Script agregado exitosamente' });
});

router.delete('/', async (req, res) => {
	const { ownerId, scriptId } = req.query;
	await User.findByIdAndUpdate(ownerId, { $pull: { scrips: scriptId } });
	await Script.findByIdAndUpdate(scriptId, { $pull: { owners: ownerId } });
	res.json({ message: 'Se borro el script del usuario' });
});

module.exports = router;
