# Framer Motion Patterns

How to bring Stitch designs to life with professional-grade physics.

## 1. The Smooth Reveal
Use this for hero sections and large text blocks.

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
>
  <h1>Hero Text</h1>
</motion.div>
```

## 2. The Staggered Grid
Use this when a Stitch design features a Bento grid or a list of cards.

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

// Usage:
<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(i => <motion.li variants={item}>{i}</motion.li>)}
</motion.ul>
```

## 3. The Shared Layout Animation (Magic UI)
When a user clicks a tab, the active background indicator should slide smoothly to the new tab, rather than instantly snapping.

```tsx
{tabs.map((tab) => (
  <button onClick={() => setActiveTab(tab.id)} className="relative px-4 py-2">
    {activeTab === tab.id && (
      <motion.div
        layoutId="active-tab-indicator"
        className="absolute inset-0 bg-zinc-800 rounded-md"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    )}
    <span className="relative z-10">{tab.label}</span>
  </button>
))}
```
