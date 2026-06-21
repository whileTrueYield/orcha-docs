function getLineText(codeEl) {
	return codeEl.textContent?.replace(/\u00a0/g, ' ').trim() ?? '';
}

function enhanceTerminalFrames(root = document) {
	root.querySelectorAll('.expressive-code .frame.is-terminal').forEach((frame) => {
		if (frame.dataset.promptsEnhanced) return;
		frame.dataset.promptsEnhanced = 'true';

		const lines = frame.querySelectorAll('.ec-line');
		let continuation = false;

		for (const line of lines) {
			const code = line.querySelector('.code');
			if (!code || code.querySelector('.ec-prompt')) continue;

			const text = getLineText(code);
			if (!text) continue;

			if (continuation) {
				continuation = text.endsWith('\\');
				continue;
			}

			if (text.startsWith('#')) continue;

			const prompt = document.createElement('span');
			prompt.className = 'ec-prompt';
			prompt.setAttribute('aria-hidden', 'true');
			prompt.textContent = '$ ';
			code.insertBefore(prompt, code.firstChild);

			continuation = text.endsWith('\\');
		}
	});
}

enhanceTerminalFrames();
document.addEventListener('astro:page-load', () => enhanceTerminalFrames());