---
description: Deploy the BLC Management System to Vercel
---

# Deployment Workflow

This workflow guides you through deploying the BLC Management System to Vercel.

## Prerequisites
- Vercel CLI installed (`npm i -g vercel`)
- A Vercel account

## Steps

1. **Login to Vercel** (if not already logged in)
   ```bash
   vercel login
   ```

2. **Run Production Build**
   Ensure the project builds correctly before deploying.
   ```bash
   npm run build
   ```

3. **Deploy to Preview/Production**
   // turbo
   ```bash
   vercel deploy --prod
   ```

4. **Verify Deployment**
   Open the URL provided by Vercel in your browser to verify all portals are functional.
