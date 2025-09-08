const { ESLint } = require('eslint');

async function checkForErrors(code) {
    const eslint = new ESLint({ useEslintrc: false, baseConfig: { extends: "eslint:recommended" } });
    const results = await eslint.lintText(code);
    return results[0].messages;
}

module.exports = { checkForErrors };