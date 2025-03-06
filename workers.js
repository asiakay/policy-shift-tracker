export default {
  async fetch(request, env) {
    if (request.method === 'POST') {
      try {
        const { email } = await request.json();

        // Basic validation
        if (!email || !email.includes('@')) {
          return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 });
        }

        // Store email in KV (or D1 if using SQL)
        await env.EMAIL_SUBSCRIBERS.put(email, JSON.stringify({ subscribed: true, timestamp: Date.now() }));

        return new Response(JSON.stringify({ success: true, message: 'Subscribed successfully' }), { status: 200 });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
      }
    }

    return new Response('Method not allowed', { status: 405 });
  }
};