# Dashboard Layouts

Dashboards are operational workspaces. Clarity and density are the priorities.

## 1. The Classic SaaS Console
- **Sidebar:** Left side, ~240px wide. Contains primary navigation, user profile, and workspace switcher.
- **Top Bar:** Contains breadcrumbs, global search (Cmd+K), and secondary actions (notifications, settings).
- **Main Content:** A `max-w-7xl` container. Usually starts with a Page Header (Title + primary action button), followed by a grid of stat cards, followed by a primary data table.

## 2. The Focused Editor (Notion/Linear)
- **Sidebar:** Collapsible, minimal, left-aligned.
- **Main Content:** Full width or a centered reading column (`max-w-3xl`). 
- **Toolbar:** Contextual. It only appears when an item is selected or the user is typing. The interface gets out of the way of the content.

## 3. The Split Pane (Email/Messages)
- **Sidebar:** Primary navigation.
- **List Pane:** A vertically scrollable list of items (e.g., emails, tickets, errors). Takes up ~30% of the screen.
- **Detail Pane:** The main viewing area for the selected item. Takes up ~70% of the screen.
- **Borders:** Separated by crisp 1px vertical borders. No shadows between panes.
