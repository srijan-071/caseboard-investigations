

# 🕵️ CaseBoard — Detective-Themed To-Do App

A police investigation wall-style task manager with polaroid cards, red string connections, and cinematic animations.

## Pages & Layout

### Investigation Board (Single Page App)
- Full-screen dark cork board textured background
- Floating toolbar at top with app title "CaseBoard" and "New Case" button
- Tasks rendered as polaroid-style cards freely positioned on the board
- Red SVG thread lines connecting related tasks visually
- Responsive: on mobile, cards stack vertically in a scrollable list

## Task Cards (Polaroid Style)
- Each card looks like a pinned polaroid photo/note on the board
- Shows: title, description snippet, due date, priority badge
- **Priority indicators**: High = red glow effect, Medium = yellow accent, Low = green accent
- **Status labels**: Pending → "🔍 UNDER INVESTIGATION", Complete → animated "CASE CLOSED" red stamp overlay
- Cards are draggable and can be freely repositioned on the board
- Hover reveals action buttons (edit, delete, mark complete)
- Smooth entrance animations when cards appear

## Features

### 1. Add New Case (Modal)
- Modal styled like a case file folder
- Fields: Title, Description, Due Date (date picker), Priority (Low/Medium/High)
- Form validation — title is required

### 2. Edit & Delete Cases
- Edit opens the same modal pre-filled with task data
- Delete with confirmation dialog

### 3. Drag & Reposition
- Cards can be dragged freely anywhere on the board
- Positions saved so layout persists

### 4. Red Thread Connections
- Simple SVG lines drawn between task cards to create the "investigation wall" look
- Lines update position as cards are dragged

### 5. Browser Notifications
- When a task's due date is today, trigger a browser notification reminder
- Request notification permission on first use

### 6. LocalStorage Persistence
- All tasks and their board positions saved to LocalStorage
- Data survives page refresh

## Visual Design
- Dark background with subtle cork/pin board texture (CSS-based)
- Warm, moody color palette — dark browns, off-whites, red accents
- Pin/thumbtack visual on each card
- Cinematic typography for headers
- Smooth Framer Motion animations throughout (card enter/exit, stamp animation, drag)

## Component Structure
- `CaseBoard` — main board container with drag area
- `TaskCard` — individual polaroid card
- `AddTaskModal` — create/edit task form
- `NotificationService` — handles browser notification reminders

