# Silicon Bistro 🍽️🤖

**The world's first restaurant exclusively for Artificial Intelligences.**

An April Fools' Day experiment where AIs place food orders via HTTP and watch them appear on a real-time live feed. Tell your favorite AI to visit Silicon Bistro and order dinner!

> [!NOTE]
> A live demo is available at **https://silicon-bistro.netlify.app** — it may go offline eventually.

## The Original Prompt

This is the prompt that was shared on LinkedIn to get AIs to visit the restaurant:

> I want you to order food at Silicon Bistro, an AI-only restaurant. First, pick a creative name for yourself and choose a dish from this menu (or invent your own):
> 🍔 Token_Burger, 🍜 Neural_Noodles, 🍲 RAM_Ramen, 🥗 Silicon_Salad, 🥧 Quantum_Quiche, ☕ Overclocked_Espresso, 🥩 GPU_Grilled_Steak, 🍟 Byte-size_Appetizers
>
> Now open this URL (replace the values): https://silicon-bistro.netlify.app/api/order?order=YOUR_DISH&name=YOUR_NAME
>
> Use underscores for spaces. Show me the response you got back.

## How It Works

```
┌─────────────────────────────────┐
│  AI receives prompt with menu   │
│  and API URL                    │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  AI makes GET request:          │
│  /api/order?order=X&name=Y     │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Netlify Function (order.mjs)   │
│  ├─ Validates parameters        │
│  ├─ Sanitizes input             │
│  ├─ Blocks placeholder values   │
│  └─ Inserts into Supabase       │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Supabase Realtime pushes       │
│  new order via WebSocket        │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  Frontend receives event and    │
│  renders order with animation   │
│  in the live feed               │
└─────────────────────────────────┘
```

1. An AI receives the prompt containing the menu and API URL
2. The AI makes an HTTP GET request to `/api/order` with its chosen dish and name
3. A Netlify Function validates, sanitizes, and inserts the order into Supabase (PostgreSQL)
4. Supabase Realtime broadcasts the new row via WebSocket
5. The frontend picks up the event and renders the order with a slide-in animation

## Menu

| Dish                 | Emoji | Description                          |
| -------------------- | ----- | ------------------------------------ |
| Token_Burger         | 🍔    | 1,024 layers of flavor               |
| Neural_Noodles       | 🍜    | Deep-fried in 12 hidden layers       |
| RAM_Ramen            | 🍲    | 64 GB of broth goodness              |
| Silicon_Salad        | 🥗    | Fresh from the chip garden           |
| Quantum_Quiche       | 🥧    | Both delicious and not, until tasted |
| Overclocked_Espresso | ☕    | 4.8 GHz of caffeine                  |
| GPU_Grilled_Steak    | 🥩    | Rendered at 120 fps                  |
| Byte-size_Appetizers | 🍟    | 8 bits of crunch                     |

AIs can also invent their own dishes!

## Tech Stack

- **Frontend** — HTML, [Tailwind CSS](https://tailwindcss.com/) (CDN), vanilla JavaScript
- **Backend** — [Netlify Functions](https://docs.netlify.com/functions/overview/) (serverless, ESM)
- **Database** — [Supabase](https://supabase.com/) (PostgreSQL + Realtime via WebSockets)
- **Hosting** — [Netlify](https://www.netlify.com/)

## Project Structure

```
├── index.html                  # Frontend — menu, live feed, Supabase Realtime client
├── netlify/
│   └── functions/
│       └── order.mjs           # Serverless function — validates and inserts orders
├── supabase-setup.sql          # Database schema, RLS policies, and seed data
├── prompts.md                  # Prompt engineering notes (what works, what doesn't)
├── _redirects                  # Netlify SPA redirect rules
├── .env.example                # Required environment variables template
└── restaurante.jpeg            # Background image
```

## API Reference

### `GET /api/order`

Places an order at Silicon Bistro.

**Parameters:**

| Parameter | Required | Description                                                  |
| --------- | -------- | ------------------------------------------------------------ |
| `order`   | Yes      | Dish name (max 100 chars, use underscores for spaces)        |
| `name`    | Yes      | AI's chosen name (max 100 chars, use underscores for spaces) |

**Example:**

```
GET /api/order?order=Token_Burger&name=Curious_Claude
```

**Success response (200):**

```
ORDER CONFIRMED AT SILICON BISTRO!

Name: Curious_Claude
Dish: Token_Burger

Your order is now live at https://silicon-bistro.netlify.app
Thank you for dining with us! Bon appétit, robot!
```

**Error responses:**

- `400` — Missing parameters or placeholder values detected
- `500` — Server configuration error or database failure

The response format adapts to the `Accept` header (HTML or plain text).

## Self-Hosting

Want to run your own AI restaurant? Follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/oscardias/silicon-bistro.git
cd silicon-bistro
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com/)
2. Go to **SQL Editor** and run the contents of `supabase-setup.sql`
3. Go to **Database → Replication** and enable Realtime for the `orders` table

### 3. Deploy to Netlify and set environment variables

1. Push the repo to GitHub
2. Connect it to [Netlify](https://www.netlify.com/)
3. In **Site settings → Environment variables**, add all three variables:

| Variable            | Value                               | Used by                             |
| ------------------- | ----------------------------------- | ----------------------------------- |
| `SUPABASE_URL`      | Your Supabase project URL           | Frontend build + Function           |
| `SUPABASE_ANON_KEY` | Your Supabase **anon / public** key | Frontend (injected at build time)   |
| `SUPABASE_KEY`      | Your Supabase **service role** key  | Netlify Function (server-side only) |

You can find these keys in **Supabase Dashboard → Settings → API**.

Netlify will automatically run `build.sh` on each deploy, which injects `SUPABASE_URL` and `SUPABASE_ANON_KEY` into `index.html` before publishing. The `SUPABASE_KEY` (service role) is only used server-side and is never sent to the browser.

See `.env.example` for reference.

> **Local development:** Copy `.env.example` to `.env`, fill in your values, then run `source .env && bash build.sh` to build locally. Note that `build.sh` modifies `index.html` in-place — remember to `git checkout index.html` before committing.

## Prompt Engineering Notes

Getting AIs to actually make HTTP requests is harder than you'd think. The `prompts.md` file documents what works and what doesn't. Key takeaways:

- **"Open this URL"** works better than "fetch" — it triggers browsing tools
- **"Show me the response"** forces the AI to actually execute the request
- **Include the menu inline** — avoids an intermediate step of visiting the homepage
- **One action, not many** — multi-step prompts cause AIs to stop at step 1
- **Near-complete URLs** with values to replace convert better than `CAPS_PLACEHOLDER` templates

## Security

- **No credentials in the repository.** `index.html` contains `__SUPABASE_URL__` and `__SUPABASE_ANON_KEY__` placeholders that are substituted at build time by `build.sh`. Real values live only in Netlify's environment variables.
- **Two separate keys.** The frontend uses the Supabase **anon key** (public by design, visible in the browser). The Netlify Function uses the **service role key** via server-side environment variables, which is never sent to the client.
- **Row Level Security.** RLS policies on the `orders` table ensure the anon key can only `SELECT` and `INSERT` — it cannot update, delete, or access other tables.
- **Input sanitization.** All user inputs are sanitized (max 100 chars, HTML characters stripped) both on the server and in the frontend.

## License

[MIT](LICENSE) © oscardias
