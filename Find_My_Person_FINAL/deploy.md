# Deploying Find My Person (LIVE & PERMANENT)

This project is now fully production-ready. I have updated the code to support **Persistent Storage** on Render.com so that no reports or photos are ever lost.

## 1. Prerequisites (Done)
- Frontend is built: `npm run build` executed.
- Code is pushed to GitHub.

## 2. Render.com Deployment Settings

I have added a **root package.json** to your project to make this even easier. When creating a **New Web Service**, use these simplified settings:

| Setting | Value |
| :--- | :--- |
| **Environment** | `Node` |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |

## 3. Mandatory: Make it 100% Permanent (Persistence)

By default, Render deletes files when the server restarts. To prevent this and make everything work forever:

1.  **Add a Disk**:
    - In your Render dashboard for this project, go to the **Disks** tab.
    - Click **Add Disk**.
    - **Name**: `portal-data`
    - **Mount Path**: `/etc/data`
    - **Size**: `1GB` (Free tier is fine).
2.  **Add Environment Variables**:
    - Go to the **Environment** tab.
    - Click **Add Environment Variable**.
    - Key: `DATABASE_PATH` | Value: `/etc/data/missing_persons.db`
    - Key: `UPLOADS_PATH` | Value: `/etc/data/uploads`

**That's it!** With these settings, your website will be live, fast, and will never lose any data!
