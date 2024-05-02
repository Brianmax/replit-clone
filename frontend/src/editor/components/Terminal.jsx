import React from 'react';

const Terminal = ({ response = [], error }) => {
	return (
		<div className="terminal">
			{error ? (
				<pre className='terminal__pre'>{response}</pre>
			) : (
				response.map((line, index) => {
					console.log(line);
					return <pre className='terminal__pre' key={index}>{line}</pre>;
				})
			)}
		</div>
	);
};

export default Terminal;
