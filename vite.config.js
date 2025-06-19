import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
      		name: 'log-resolve-ids',
      		async resolveId(source, importer) {
        		console.log(`Resolving: source='${source}', importer='${importer}'`);
        		return null;
      		}
    	}
	],
	optimizeDeps: {
		include: [
			'@blockly/continuous-toolbox',
			'file-saver',
		]
	},
	build: {
		sourcemap: true
	}
});
