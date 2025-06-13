<div align="center">
  <img src="https://avatars.githubusercontent.com/u/140808788?v=4" alt="Authora Logo" width="150" />
</div>

# Authora

**Authora** is a modern, frictionless Web3 onboarding platform. It provides a seamless experience for users with a single link for verified identity, an embedded wallet, and the ability to accept crypto payments with zero friction.

---

## ✨ Features

- **Frictionless Onboarding:** Simple and fast user onboarding to the Web3 ecosystem.
- **Verified Identity:** Integrated with [Civic](https://www.civic.com/) for secure and verified digital identity.
- **Embedded Wallet:** Built-in wallet functionality for easy management of crypto assets.
- **Crypto Payments:** Accept cryptocurrency payments directly through the platform.
- **Modern Tech Stack:** Built with Next.js, React, and Tailwind CSS for a fast and responsive user experience.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/TadashiJei/Authora.git
    cd Authora
    ```

2.  **Install dependencies:**
    This project has some peer dependency conflicts. Use the `--legacy-peer-deps` flag to resolve them.
    ```bash
    npm install --legacy-peer-deps
    ```

3.  **Set up environment variables:**
    The application requires several environment variables to run correctly.
    - Copy the example environment file:
      ```bash
      cp .env.example .env
      ```
    - **Get a Civic Client ID:** You need to register your application with Civic to get a Client ID. You can sign up at [auth.civic.com](https://auth.civic.com).
    - Open the `.env` file and replace `YOUR_CIVIC_CLIENT_ID_HERE` with your actual Civic Client ID. You will also need to provide an SMTP password if you want to enable email notifications.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running at [http://localhost:3000](http://localhost:3000).

---

## 🚢 Deployment

This project is configured for easy deployment on [Vercel](https://vercel.com/).

When deploying, you must set up the same environment variables in your Vercel project settings that you defined in your local `.env` file. Vercel does not use the `.env` file from your repository for security reasons.

1.  Go to your Vercel Dashboard and open your project.
2.  Navigate to **Settings > Environment Variables**.
3.  Add all the necessary variables from your `.env.example` file.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Authentication:** [Civic Auth](https://docs.civic.com/auth)
- **Web3:** [Wagmi](https://wagmi.sh/), [Viem](https://viem.sh/), [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)

---

## 👥 About Us

This project was proudly developed by **Hacktivators.com / Tomeku**.

### Team

- **Software Engineer:** [SyntaxSurge](https://github.com/syntaxsurge)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
