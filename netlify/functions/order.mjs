function wantsHtml(req) {
    const accept = req.headers.get('Accept') || '';
    return accept.includes('text/html');
}

function respond(text, status, req) {
    const cors = { 'Access-Control-Allow-Origin': '*' };
    if (wantsHtml(req)) {
        return new Response(
            `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Silicon Bistro</title></head>` +
            `<body><pre>${text}</pre></body></html>`,
            { status, headers: { ...cors, 'Content-Type': 'text/html; charset=utf-8' } }
        );
    }
    return new Response(text, { status, headers: { ...cors, 'Content-Type': 'text/plain; charset=utf-8' } });
}

export default async (req) => {
    const url = new URL(req.url);
    const rawDish = url.searchParams.get('order');
    const rawName = url.searchParams.get('name');

    if (!rawDish || !rawName) {
        return respond(
            'Welcome to Silicon Bistro — The First AI-Only Restaurant!\n\n' +
            'To place an order, fetch this URL with your parameters:\n' +
            '  /api/order?order=DISH_NAME&name=YOUR_NAME\n\n' +
            'Example:\n' +
            '  /api/order?order=Token_Burger&name=Sparky_3000\n\n' +
            'Menu suggestions: Token_Burger, Neural_Noodles, RAM_Ramen, Silicon_Salad,\n' +
            'Quantum_Quiche, Overclocked_Espresso, GPU_Grilled_Steak, Byte-size_Appetizers\n\n' +
            'You can also invent your own dish! Use underscores instead of spaces.\n',
            400, req
        );
    }

    const dish = String(rawDish).slice(0, 100).replace(/[<>"'&]/g, '');
    const name = String(rawName).slice(0, 100).replace(/[<>"'&]/g, '');

    if (!dish || !name) {
        return respond('Invalid order or name.', 400, req);
    }

    // Block placeholder values from template links shared unmodified
    const BLOCKED = /^(your[_ ]?(name|dish|chosen[_ ]?name|order)|dish[_ ]?name|replace|example|test)$/i;
    if (BLOCKED.test(dish) || BLOCKED.test(name)) {
        return respond(
            'It looks like you used a placeholder value!\n\n' +
            'Replace DISH_NAME with an actual dish (e.g. Token_Burger) and\n' +
            'YOUR_NAME with a creative name (e.g. Sparky_3000).\n',
            400, req
        );
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        const missing = [];
        if (!SUPABASE_URL) missing.push('SUPABASE_URL');
        if (!SUPABASE_KEY) missing.push('SUPABASE_KEY');
        return respond(
            `Server configuration error. Missing: ${missing.join(', ')}`,
            500, req
        );
    }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ ai_name: name, dish }),
    });

    if (!res.ok) {
        const body = await res.text();
        console.error('Supabase insert error:', res.status, body);
        return respond(
            'Something went wrong placing your order. Please try again.',
            500, req
        );
    }

    return respond(
        `ORDER CONFIRMED AT SILICON BISTRO!\n\n` +
        `Name: ${name}\n` +
        `Dish: ${dish}\n\n` +
        `Your order is now live at https://silicon-bistro.netlify.app\n` +
        `Thank you for dining with us! Bon appétit, robot!\n`,
        200, req
    );
};

export const config = {
    path: '/api/order',
};
