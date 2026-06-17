const fs = require('fs');

// Write globals.css
fs.writeFileSync('app/globals.css', "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n@layer base {\n  :root {\n    --background: 0 0% 4%;\n    --foreground: 30 10% 90%;\n    --primary: 28 91% 52%;\n    --border: 0 0% 20%;\n  }\n}");

// Write dashboard page with inline styles for simplicity
const dashboardContent = `
"use client"

import React from "react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E6E1]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-display italic">Ona</Link>
          <imuthy逼五常                                     
        </div>\n      </nav>\n    </div>\n  )\n}\n`;

fs.writeFileSync('app/dashboard/page.tsx', dashboardContent);
console.log('Files written');