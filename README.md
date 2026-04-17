# LuxeBuy AI Assistant - AMD SlingShot Submission

## Vertical: Retail & E-commerce
**Solution Title:** LuxeBuy AI Assistant

## Approach and Logic
LuxeBuy is an "intelligent solution that enhances the shopping experience" by combining high-end luxury aesthetics with a context-aware AI shopping assistant.

### 1. Personalization Logic
The assistant uses Gemini to understand user intent and respond in a luxury retail tone. It provides:
- **Product Recommendations**: Analyzes keywords (e.g., "winter", "coat", "formal") to suggest relevant items from our curated catalog.
- **Styling Advice**: Offers details on material quality (e.g., S-grade cashmere) and occasion suitability.
- **Price Transparency**: Quickly answers price-related queries across the vertical range.
- **Scenario Curation**: A Concierge Edit lets shoppers switch between curated moments such as black-tie, executive arrival, and winter atelier to narrow the catalog instantly.

### 2. Design System
Built on a foundation of **Glassmorphism** and **Luxury Dark Mode**:
- **Contrast**: Deep Charcoal backgrounds paired with Soft Gold primary accents.
- **Micro-interactions**: Hover-triggered scaling, smooth slide-ins, and pulsed "thinking" states for the AI.
- **Responsiveness**: Mobile-first design ensuring the premium experience translates to all devices.

## How the Solution Works
1. **Explore**: Browse luxury collections with search/filter (Navbar search filters products by name/category).
2. **Personalize**: Use the Concierge Edit to shop by occasion and send a matching prompt into the assistant with one click.
3. **Cart**: Add/update quantity, persistent localStorage, checkout modal.
4. **AI Assistant**: Floating Gemini-powered chat for recommendations/styling with fallback from `gemini-2.5-flash` to `gemini-2.5-flash-lite` during peak demand.
5. **Responsive**: Glassmorphism UI, mobile-first.

## Quick Setup
1. `npm install`
2. Copy .env.example to .env, add `GEMINI_API_KEY`.
3. `npm run dev` - Frontend development (http://localhost:5173/)
4. `npm run build` - Build frontend assets.
5. `npm start` - Run the production Node.js server (http://localhost:8080/)
6. Docker: `docker build -t luxebuy . && docker run -p 8080:8080 -e GEMINI_API_KEY=your_key luxebuy`

## Features Added
- Node.js / Express Backend for secure API handling
- Search & Filter
- Concierge Edit for scenario-based discovery
- Cart with quantity/remove
- Gemini AI Assistant (Server-side)
- Local product artwork for reliable loading
- Docker deployment (Optimized for Cloud Run)

## Validation
- **Automated Tests**: Basic App structure and concierge logic verified with Vitest.
- **Manual Verification**: Search, cart operations, pricing, and AI assistant flow verified.

## Technology Stack
- **Frontend**: Vite + React
- **Backend**: Node.js + Express
- **AI Integration**: Google Gemini via `@google/generative-ai` (Server-side)
- **Styling**: Vanilla CSS
- **Aesthetics**: Google Fonts (Outfit), CSS Backdrop Filters, Handcrafted SVG Icons.

## Assumptions Made
- The demo focuses on the **Luxury Fashion** vertical within Retail.
- Product visuals are shipped locally so the storefront remains stable.
- The Gemini assistant requires a valid `GEMINI_API_KEY` environment variable.

---
*Developed for the AMD SlingShot - Campus Days Hackathon.*
