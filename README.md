# Green Hero Darajat Hotel Demo

A Next.js App Router demo for Green Hero Darajat Hotel & Resort, using TypeScript, React, Tailwind CSS and Lucide icons.

## Requirements

- Node.js 24.x (also defined in `.nvmrc` and `package.json`).
- npm and the committed `package-lock.json`.

## Local development

```sh
nvm use
npm ci
npm run dev
```

Set `API_BASE_URL=http://localhost:4000/api/v1` in `.env.local` and run the API locally, then open http://localhost:3000.

## Manual production build

```sh
npm run build
npm start
```

Builds and testing are performed manually by the project owner.

## Deploy to Vercel

1. Import the GitHub repository `irvantaufik28/demo-darajat-green-hero-hotel` into Vercel.
2. Set the production branch to `main` and use the repository root as the Root Directory.
3. Use the **Next.js** framework preset and **Node.js 24.x**.
4. Install with `npm ci` and build with `npm run build`. These commands are defined in `vercel.json`.
5. Leave the Output Directory at the framework default. Vercel manages the Next.js build output.
6. Set `API_BASE_URL` to the API origin plus `/api/v1` (for example, `https://<your-api-domain>/api/v1`). Next.js proxies browser requests to this backend. The URL is configured in the Vercel project environment.
7. Deploy through Vercel. Future pushes to the connected production branch trigger deployments.

Keep the Next.js framework deployment mode: the application includes dynamic room routes and booking query parameters. Assets are served from `public/images`, and legacy route redirects are defined in `next.config.ts`.

Official documentation: [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs) and [supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

## Routes

- `/`: home
- `/rooms`: multiple room selection and booking price summary
- `/rooms/[slug]`: room details
- `/booking/extras`: optional packages and additional services
- `/booking/guest-details`: guest information with nationality and WhatsApp country code
- `/booking/payment`: BCA Virtual Account demo
- `/booking/payment/instructions`: simulated payment instructions
- `/facilities`: resort facilities
- `/gallery`: photo gallery and lightbox
- `/contact`: contact information and demo form
- `/reservation-check`: reservation lookup demo with loading and sample details

## Demo behavior

All rooms, stock, prices, policies and reservation results use static example data. Multiple room quantities and priced extras are carried through the booking steps. Guest information and booking drafts are stored temporarily in browser session storage. Payment and contact forms do not process real transactions or send messages. Downloaded demo vouchers are marked as simulations.
