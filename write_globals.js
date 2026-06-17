const fs = require('fs');
const path = require('path');

// globals.css
const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 4%;
    --foreground: 30 10% 90%;
    --card: 0 0% 8%;
    --card-foreground: 30 10% 90%;
    --popover: 0 0% 8%;
    --popover-foreground: 30 10% 90%;
    --primary: 28 91% 52%;
    --primary-foreground: 0 0% 4%;
    --secondary: 160 30% 20%;
    --secondary-foreground: 30 10% 90%;
    --muted: 0 0% 15%;
    --muted-foreground: 30 5% 60%;
    --accent: 28 91% 52%;
    --accent-foreground: 0 0% 4%;
    --destructive: 0 70% 50%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 20%;
    --input: 0 0% 20%;
    --ring: 28 91% 52%;
    --radius: 0.75rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-body), system-ui, sans-serif;
  }
}`;

fs.writeFileSync(path.join(__dirname, 'app', 'globals.css'), globalsCss);
console.log('globals.css written');