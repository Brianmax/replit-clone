const { Router } = require("express");
const { PythonShell } = require("python-shell");

const router = Router();

router.post('/python', async (req, res) => {
	// fs.writeFileSync('test.py', req.body.code);
	
	const options = {
		mode: 'text',
		pythonOptions: ['-u'],
	};

	try {
		const result = await PythonShell.runString(req.body.code, options);
		res.json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;