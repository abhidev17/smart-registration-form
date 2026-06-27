# Smart Registration Form

A complete, modern, responsive registration form built with pure HTML5, CSS3, and Vanilla JavaScript — no frameworks, no libraries.

## Features

- **HTML5 Form Validation** — native input types with custom client-side rules
- **Real-time Validation** — instant feedback as you type, per field
- **Password Strength Meter** — animated 4-level strength indicator
- **Live Profile Preview** — card that updates on every keystroke
- **Progress Indicator** — animated gradient progress bar tracking completion %
- **Dark Mode** — one-click light/dark toggle, preference saved to LocalStorage
- **Responsive Design** — works beautifully on desktop, tablet, and mobile
- **Local Storage** — submitted data persisted between sessions
- **Success Modal** — animated checkmark and data summary on submission
- **Accessibility Support** — ARIA labels, keyboard navigation, focus states, `aria-live` regions
- **Drag & Drop** file upload for avatar and resume
- **Auto-calculated Age** from Date of Birth
- **Character Counter** on the bio textarea
- **Password Visibility Toggle**
- **Satisfaction Rating** slider with dot visualisation

## Technologies Used

- HTML5
- CSS3 (custom properties, grid, glassmorphism, keyframe animations)
- JavaScript ES6+ (no build tools required)

## HTML5 Concepts Practiced

- Semantic HTML (`<section>`, `<fieldset>`, `<legend>`, `<main>`, `<aside>`, `<header>`)
- Input types: `text`, `email`, `password`, `tel`, `url`, `number`, `date`, `time`, `color`, `file`, `range`, `radio`, `checkbox`
- Form elements: `<select>`, `<textarea>`
- Attributes: `required`, `minlength`, `maxlength`, `accept`, `autocomplete`, `aria-*`, `novalidate`
- Accessibility: labels, `aria-describedby`, `aria-live`, `role`, keyboard focus management

## JavaScript Concepts

- DOM Manipulation (`querySelector`, `createElement`, `classList`)
- Events (`addEventListener`, `input`, `change`, `submit`, `keydown`, `dragover`, `drop`)
- Form Validation with Regular Expressions
- Local Storage (`setItem`, `getItem`)
- Arrays & Objects (data collection, `map`, `filter`, `forEach`)
- Conditionals & guard clauses
- Template Literals
- `FileReader` API for image preview
- `DataTransfer` API for drag & drop

## Project Structure

```
smart-registration-form/
├── index.html   — structure & markup
├── style.css    — design system & layout
├── script.js    — all JS logic, fully commented
└── README.md    — this file
```

## Installation

1. Download or clone this folder.
2. Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge).
3. No build step, no server, no dependencies.

## Future Improvements

- Backend integration (Node.js / Django / Laravel)
- Email verification flow
- CAPTCHA / bot protection
- Database storage
- Multi-step / wizard form
- User authentication & session management
- Server-side validation mirror
- Internationalisation (i18n) for error messages