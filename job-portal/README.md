# Job Portal

A modern job portal built with React, TypeScript, and Tailwind CSS. This application allows employers to post jobs and manage applications, while job seekers can browse and apply for positions.

## Features

- Job listing and search
- Job application system with CV upload
- Admin dashboard for managing jobs and applications
- Responsive design with Tailwind CSS
- TypeScript for type safety
- Modern React with Vite

## Prerequisites

- Node.js (v14 or higher)
- pnpm (v6 or higher)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd job-portal
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
  ├── components/     # React components
  ├── types/         # TypeScript type definitions
  ├── data/          # Mock data for development
  ├── App.tsx        # Main application component
  └── main.tsx       # Application entry point
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking

## API Integration

The application is designed to be API-ready. Currently, it uses mock data for development purposes. To integrate with a real API:

1. Replace the mock data in `src/data/mockData.ts` with actual API calls
2. Update the state management in `App.tsx` to handle API responses
3. Implement proper error handling and loading states

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
