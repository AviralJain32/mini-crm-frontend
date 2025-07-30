
# Mini CRM – Frontend

This is the frontend for the **Mini CRM** platform, built with **Next.js**, **Tailwind CSS**, and **React Query Builder**, designed to empower marketing teams to manage customer segmentation, run personalized campaigns, and leverage AI for intelligent messaging.

## 🚀 Features

- ✨ **Next.js 15** + **React 19** with full SSR support.
- 🎨 **ShadCN UI** and **Tailwind CSS** for a beautiful and responsive design.
- 🧠 **Google Gemini AI Integration** to generate smart campaign messages.
- 📊 Dynamic **rule-based segment creation** using `react-querybuilder`.
- 🔐 **Google OAuth2.0 login** with session via cookies.
- 📦 Fully typed with **TypeScript**.
- 🔄 Seamless interaction with backend Kafka-powered APIs.
- 📷 AI-driven message 

---


## Local Setup Instructions

Clone the repository:

```bash
git clone https://github.com/your-username/mini-crm.git
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```bash
# .env.example

NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_GEMINI_API_KEY=your_google_gemini_api_key_here
```

Run the backend (development mode):

```bash
npm run dev
```
Visit http://localhost:3000 to view the app.
## Tech Stack


- Next.js (App Router)
- Tailwind CSS
- ShadCN UI
- React Query Builder (with DnD + Ant Design)
- React Hook Form + Zod
- Google Gemini API (client-side)
- Axios for API interaction


## AI Features (Google Gemini)

AI Features
The platform uses Google Gemini API to supercharge user experience:

1. ✉️ Smart Campaign Message Generator

- When a marketer defines a goal (e.g., “bring back inactive users”), Gemini generates:
- 2–3 human-like, brand-safe message suggestions


2. 📐 Intelligent Segment Rule Builder

- Input a business objective like “engaged but low-spending users” and Gemini suggests:
- A rule group like: visits > 5 AND totalSpend < 1000
- Ready-to-edit queries for easy campaign targeting


Why Google Gemini API?
- Free for developers – avoids costly token-based services
- Fast response – ideal for real-time UX
- Securely handled on the frontend, no backend proxy needed


## Authors

- [Aviral Jain](https://github.com/AviralJain32)
Built with ❤️ as part of the Xeno SDE Internship Assignment – 2025

