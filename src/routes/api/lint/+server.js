import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { checkForErrors } = require('$lib/checkForErrors.cjs');

export async function POST({ request }) {
    const { code } = await request.json();
    const results = await checkForErrors(code);
    return new Response(JSON.stringify(results), { status: 200 });
}