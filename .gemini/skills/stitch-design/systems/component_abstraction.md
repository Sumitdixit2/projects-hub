# Component Abstraction

Build UIs with reusable, isolated components.

## 1. The Atomic Design Approach
- **Atoms:** Buttons, Inputs, Badges, Typography components.
- **Molecules:** Search bars (Input + Button), Form Fields (Label + Input + Error).
- **Organisms:** Navigation bars, complex Cards, Hero sections.
- **Templates:** Page layouts.

## 2. Separation of Concerns
- A component should only care about its internal layout and logic. 
- Margins *around* a component should be handled by the parent container, not baked into the component itself.

## 3. Variant Management
- Use libraries like `cva` (Class Variance Authority) to manage component variants (e.g., `intent="primary"`, `size="lg"`).
- Keep variants distinct. Do not allow ad-hoc inline styles to override the component's defined system.

## 4. Composition over Configuration
- Instead of creating a massive `<Card title="..." subtitle="..." icon="..." />` component with dozens of props, use composition:
```tsx
<Card>
  <CardHeader>
    <CardTitle>...</CardTitle>
    <CardDescription>...</CardDescription>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```
This allows for maximum flexibility.
