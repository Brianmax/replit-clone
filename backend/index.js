const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
const { PythonShell } = require('python-shell');
const { User } = require('./models');

const app = express();
const port = 3000;

dbConnection()
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hola xd');
});

app.post('/python', async (req, res) => {
	// fs.writeFileSync('test.py', req.body.code);

	const options = {
		mode: 'text',
		pythonOptions: ['-u'],
	};

	try {
		const result = await PythonShell.runString(req.body.code, options);
		res.json({ result });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get('/user', async (req, res) => {
	const { username } = req.body;
	const user = await User.findOne({ username });
	res.json(user);
	if (!user) {
		const newUser = await new User({ username });
		await newUser.save();
		res.json(newUser);
	}
});

app.listen(port, () => {
	console.log(`listening at ${port}`);
});
