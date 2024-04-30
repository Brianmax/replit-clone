import React from 'react';

const Terminal = ({ response }) => {
    return (
        <div className="terminal">
            <pre>{response}</pre>
        </div>
    );
};

export default Terminal;