# Task Scheduler

A web application for optimally scheduling tasks based on their deadlines and benefits using a greedy algorithm approach.

🔗 [Live Demo](https://taskscheduler-0.vercel.app)

## Features

- ✨ Add tasks with name, deadline, and benefit values
- 📅 Calendar-based deadline selection
- 🔄 Automatic task scheduling optimization
- 📊 View total benefit calculation
- 📱 Responsive design
- 🌐 Spanish date localization

## How It Works

The application uses a greedy algorithm to schedule tasks optimally:

1. Tasks are sorted by benefit (highest to lowest)
2. Each task is scheduled as late as possible within its deadline
3. The algorithm maximizes total benefit while respecting deadlines

## Technology Stack

- Next.js 13+ with App Router
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- date-fns for date manipulation

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This project is deployed on [Vercel](https://vercel.com) and can be accessed at [taskscheduler-0.vercel.app](https://taskscheduler-0.vercel.app)

## Contributors

- Isabella Sofía Arrieta Guardo
- José Fernando González Ortiz
- Daniel David Herrera Acevedo

## License

MIT License - feel free to use this project for your own purposes.