# Interaction Patterns

Interaction must be predictable, fast, and tactile.

## 1. The Context Menu
- Right-clicking or clicking an ellipsis (`...`) should open a small, highly styled popover menu.
- **Styling:** `bg-popover border border-border rounded-md shadow-md p-1`.
- **Items:** Each item should have a very subtle hover state (e.g., `hover:bg-muted`) and ideally an icon and a keyboard shortcut hint aligned to the right.

## 2. The Destructive Action (Red Route)
- Never allow a destructive action (Delete, Remove) to happen immediately on click.
- **Pattern:** Click "Delete" -> Opens an alert dialog (`role="alertdialog"`). The dialog must have a red primary button and a neutral cancel button. 
- In elite apps, require the user to type the name of the resource to confirm deletion.

## 3. The Optimistic Update
- When a user clicks a button (e.g., "Save" or "Like"), the UI should instantly reflect the new state *before* the server responds. 
- If the server request fails, revert the state and show a toast notification. This makes the app feel infinitely faster.

## 4. Skeleton Loading
- Never use a generic spinning wheel for page loads.
- Use Skeleton components that mimic the exact layout of the data that is loading.
- **Styling:** A muted gray box with a pulsing animation (`animate-pulse bg-muted rounded-md`).
