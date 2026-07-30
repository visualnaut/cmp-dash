# Grand Luxe Hotel Operations Dashboard

A modern, responsive dashboard designed for hotel staff to monitor, triage, and process guest service orders (such as Room Service, Housekeeping, Laundry, and Spa) during daily operations.

## Tech Stack

- **Framework:** React 19, Vite
- **Routing:** React Router v8
- **State Management / Data Fetching:** TanStack React Query (v5)
- **Styling:** Tailwind CSS v4, DaisyUI v5
- **Icons:** Lucide React
- **Package Manager / Runtime:** Bun

## Installation Instructions

1. Ensure you have [Bun](https://bun.sh/) installed on your machine.
2. Clone the repository to your local machine.
3. Navigate to the project directory:
   ```bash
   cd cmp-dash
   ```
4. Install the dependencies:
   ```bash
   bun install
   ```

## How to run the project locally with Bun

To start the Vite development server, run:
```bash
bun run dev
```
Then, open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).

## How to run tests

To run the unit tests using Bun's built-in test runner, execute:
```bash
bun run test
```

## Architectural Decisions

- **Feature-Based Structure:** The application uses a feature-driven folder structure (e.g., `src/features/dashboard`, `src/features/orders`). This colocates components, hooks, and types related to specific business domains, making the codebase scalable and easy to maintain.
- **Shared Components:** Generic, highly reusable UI elements (e.g., badges, modals, layouts, feedback states) are organized in `src/components/ui` and `src/components/feedback`.
- **API Abstraction:** Data fetching logic and mock data management are isolated in the `src/api` layer, providing a clean contract for the UI to consume.

## State Management

State is categorized and managed based on its lifespan and source of truth:
1. **Server State (React Query):** Handles all asynchronous data fetching, caching, loading/error states, and data mutations (including optimistic UI updates).
2. **URL State (Query Parameters):** Search queries, filters, sorting preferences, and pagination are persisted in the URL. This ensures the application is highly shareable, supports browser history (back/forward), and prevents out-of-sync local state.
3. **Local UI State (React `useState`):** Kept to an absolute minimum, used only for ephemeral UI states like toggling a drawer, opening a confirmation modal, or tracking local form inputs.
4. **Global UI State (Context/LocalStorage):** Used for preferences like the Dark/Light theme toggle.

## API/Data

The application currently relies on a simulated, in-memory API layer:
- **Seed Data:** Initialized from `public/mocks/orders.json`.
- **Dynamic Adjustments:** The mock API dynamically shifts static JSON timestamps relative to the current time to ensure the dashboard always feels "live" when loaded.
- **Simulated Conditions:** The API layer purposefully injects realistic network delays and provides an interactive "Dev Tools" panel in the sidebar to simulate API failures for robust error state testing.
- **State Machine:** Orders strictly adhere to a defined lifecycle transition (`New` -> `Acknowledged` -> `In Progress` -> `Completed`/`Cancelled`).

---

## Technical Decisions

**Why you structured your components this way?**
I chose a feature-driven architecture because it keeps the codebase cohesive as it grows. Domain-specific logic and UI (like the `OrderTable` or `MetricsSection`) are encapsulated within their respective feature folders, while generic, atomic UI elements are stored in a shared `components` folder. This separation of concerns prevents a massive, unwieldy components directory and makes it obvious where to add new features.

**How you managed application state?**
I divided state into three categories. I used **React Query** for all remote data (server state), handling caching, loading, and error states natively. I utilized **URL Query Parameters** as the single source of truth for filtering, sorting, and pagination, making views easily linkable. Finally, standard React `useState` was reserved strictly for ephemeral UI interactions (like modals or drawers).

**How you handled loading and error states?**
I created a suite of generic feedback components (`LoadingState`, `ErrorState`, `EmptyState`) to provide consistent UX across the app. React Query handles the underlying flags (`isLoading`, `isError`). I implemented React Error Boundaries (`SectionErrorBoundary`) to catch runtime exceptions at the component level. This isolates crashes to specific sections of the dashboard rather than bringing down the entire application and provides the user with "Retry" action.

**What assumptions you made?**
- I assumed the dashboard is primarily utilized by hotel staff on desktop or tablet devices, though I ensured it gracefully degrades to mobile layouts.
- I assumed the "Needs Attention" SLA (Orders waiting in `New` status for >15 minutes) is evaluated dynamically on the client relative to the current time, but disappears optimistically when staff intervene.
- I assumed that all filtering and sorting can currently be handled client-side due to the nature of the mock dataset, though in a production app with thousands of orders, this would be delegated to the backend.

**What you would improve if you had another day?**
- **Real-time Updates:** I would replace manual polling with WebSockets or Server-Sent Events (SSE) to push live order updates instantly to the dashboard.
- **End-to-End Testing:** I would write integration/E2E tests using Playwright or Cypress to automate critical staff workflows (e.g., filtering, acknowledging an order, and verifying the SLA banner updates).
- **Server-Side Pagination & Filtering:** I would refactor the mock API to simulate true server-side pagination, sorting, and search to more accurately reflect how the real backend will behave.
- **Accessibility Enhancements:** I would conduct a deeper a11y audit, ensuring full keyboard navigability within the Order Drawer and better ARIA live region announcements when new orders arrive.
