# 🎁 GoodiesHub

> **Your ultimate directory for developer swag, hackathon goodies, and tech opportunities**

![GoodiesHub Banner](attached_assets/generated_images/ChatGPT%20Image%20Jan%202,%202026%20at%2002_20_16%20PM.png)

## ✨ Features

- 🔍 **Discover Opportunities** - Browse hackathons, internships, open source programs, and conferences
- 🎯 **India-Focused** - Curated programs specifically for Indian students and developers
- 📝 **Submit Programs** - Community-driven submissions with admin approval workflow
- 🔐 **Admin Dashboard** - Approve, reject, and edit submissions
- 🌙 **Dark Mode** - Beautiful dark theme with glassmorphism design
- 📱 **Responsive** - Works great on mobile, tablet, and desktop

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, TailwindCSS |
| **Backend** | Express.js, Node.js |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Drizzle ORM |
| **Auth** | Session-based with bcrypt |
| **Deployment** | Render |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Supabase account)

### Installation

```bash
# Clone the repository
git clone https://github.com/sidduk07/GoodiesHub.git
cd GoodiesHub

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL

# Push database schema
npm run db:push

# Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret-key
NODE_ENV=development
```

## 📂 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── hooks/         # Custom React hooks
├── server/                 # Express backend
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # Database operations
│   └── auth.ts            # Authentication
├── shared/                 # Shared types and schemas
└── attached_assets/        # Static images
```

## 🔒 Security Features

- ✅ Helmet.js security headers
- ✅ Rate limiting (20 login attempts/15min)
- ✅ CORS configuration
- ✅ Session-based authentication
- ✅ Password hashing with scrypt

## 📊 Current Data

- 28 curated swag opportunities
- Categories: Hackathons, Internships, Open Source, Conferences, Programs
- Focus on India-specific programs (Google India, Microsoft, GitHub, etc.)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Siddappa Fakkirappa Kurabar**

- GitHub: [@sidduk07](https://github.com/sidduk07)

---

<p align="center">
  Made with ❤️ for the developer community
</p>
