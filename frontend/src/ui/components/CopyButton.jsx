import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import toast, { Toaster } from 'react-hot-toast';


export const CopyButton = ({textToCopy, content}) => {
	const [copyStatus, setCopyStatus] = useState(false);

	const onCopyText = () => {
		setCopyStatus(true);
        toast.success('El link se copió a tu portapapeles', {
            duration: 2000,
            position: 'bottom-center',
        });
        setTimeout(() => setCopyStatus(false), 2000);
	};



	return (
		<div>
			<CopyToClipboard text={textToCopy} onCopy={onCopyText}>
				<button>{content}</button>
			</CopyToClipboard>
			<Toaster />
		</div>
	);
};
