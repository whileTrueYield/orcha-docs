import { defineEcConfig } from '@astrojs/starlight/expressive-code';

export default defineEcConfig({
	styleOverrides: {
		borderRadius: '0.55rem',
		codeFontFamily: 'var(--sl-font-mono)',
		frames: {
			frameBoxShadowCssValue: 'none',
			terminalTitlebarDotsOpacity: '1',
			terminalTitlebarBorderBottomColor:
				'color-mix(in srgb, var(--sl-color-gray-4) 32%, var(--sl-color-gray-5))',
		},
	},
});