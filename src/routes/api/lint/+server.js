import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { ESLint } = require('eslint');

async function checkForErrors(code) {
    const eslint = new ESLint({ useEslintrc: false, baseConfig: { extends: "eslint:recommended" } });
    window.ESLINT = eslint
    const results = await eslint.lintText(code);
    return results[0].messages;
}

export async function POST({ request }) {
    const code = await request.text();
    const results = await checkForErrors(code);
    return new Response(JSON.stringify(results), { status: 200 });
}