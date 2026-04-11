# Student Guide — Frontend

A React.js web application for university students.

## Quick Start

```bash
npm install
npm start
```

## Stack & Library Choices (with reasoning)

| Concern      | Library               | Why                                                              |
| ------------ | --------------------- | ---------------------------------------------------------------- |
| Routing      | react-router-dom v6   | Industry standard, nested routes for the layout shell            |
| i18n         | react-i18next         | Most mature i18n solution for React; supports RTL out-of-the-box |
| API requests | axios                 | Interceptors for auth tokens and response unwrapping             |
| Server state | @tanstack/react-query | Automatic caching, loading/error states, background refetch      |
| Global state | zustand               | Tiny, no boilerplate, perfect for session-level student data     |
| Forms        | react-hook-form       | Performant (uncontrolled), built-in validation, easy integration |

## Folder Structure

```
src/
├── components/
│   └── layout/          # Sidebar, Navbar, AppLayout
├── hooks/               # useStudent (React Query wrapper)
├── i18n/
│   ├── locales/
│   │   ├── en.json
│   │   └── ar.json
│   └── index.js         # i18next config
├── pages/
│   ├── GpaCalculator/   # GpaCalculator.jsx + .css
│   └── StudentProfile/  # StudentProfile.jsx + .css
├── services/
│   └── api.js           # Axios instance + endpoint helpers
├── store/
│   └── useStudentStore.js  # Zustand store
├── utils/
│   └── gpaUtils.js      # Pure GPA math functions
├── App.jsx              # Router + QueryClientProvider
└── index.js             # Entry point + dir/lang init
```

## Language Switching (EN ↔ AR + RTL)

Click the language button in the top navbar.  
The app:

1. Calls `i18n.changeLanguage(next)`
2. Saves the choice to `localStorage`
3. Sets `document.documentElement.dir` and `lang` attributes
4. CSS uses `[dir="rtl"]` selectors for layout flips

## API Connection

`src/services/api.js` exports:

- `studentService` — GET /students, GET /students/:id, PATCH /students/:id
- `departmentService` — GET /departments
- `subjectService` — GET /subjects
- etc.

All calls go through a single Axios instance with the base URL:
`https://ahmedamara.pythonanywhere.com/api`

## GPA Calculation

See `src/utils/gpaUtils.js`:

- `calculateSemesterGPA(subjects)` — weighted average using 4.0 scale
- `calculateProjectedCGPA(currentCGPA, earnedCredits, semGPA, semCredits)`
- `GRADE_POINTS` — full A+/A/B+… → 4.0/3.3… mapping
