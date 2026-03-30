# Sandwi4 SMP Stripe setup

## Deploy to Vercel

1. Push the project to GitHub.
2. In Vercel click `Add New` -> `Project`.
3. Import the GitHub repository.
4. In project settings add these environment variables:
   `STRIPE_SECRET_KEY`
   `STRIPE_WEBHOOK_SECRET`
   `SITE_URL`
   `RANK_COMMAND_TEMPLATE`
5. Deploy the project.
6. After deployment your webhook URL will be:
   `https://your-vercel-domain.vercel.app/api/stripe-webhook`
7. Add this exact URL in Stripe Webhooks.

## Run locally

1. Install Node.js 18 or newer.
2. Copy `.env.example` to `.env`.
3. Put your new Stripe secret key in `.env` as `STRIPE_SECRET_KEY`.
4. Create a Stripe webhook endpoint pointing to `/api/stripe-webhook`.
5. Put the webhook signing secret in `.env` as `STRIPE_WEBHOOK_SECRET`.
6. Optionally set `RANK_COMMAND_TEMPLATE` if you want a ready command preview, for example `lp user {username} parent set {rank}`.
7. Optionally set `SITE_URL` if you deploy on a domain.
8. Run `npm start`.
9. Open `http://localhost:4242`.

## Important

- Do not put the Stripe secret key in `index.html`, `script.js`, or any client-side file.
- Rotate the current live secret key in Stripe dashboard because it was shared in chat.
- The webhook stores successful purchases in `data/purchases.json`.
- To make rank delivery fully automatic, you still need a real command bridge from this backend to the Minecraft server or a supported plugin/service that can receive fulfillment commands.
- Vercel does not provide reliable persistent local filesystem storage for webhook fulfillment data. The Vercel webhook function currently logs paid purchases in deployment logs. For durable storage, move purchase records to a database or storage service.
