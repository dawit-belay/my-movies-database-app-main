# Movie Searching Database

This is a Movie searching database app built with React, Vite, and Appwrite.

## Features

- Search for movies using The Movie Database (TMDB) API
- View trending movies based on search popularity
- Track search counts in Appwrite database

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- TMDB API key (get one at [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api))
- Appwrite account (optional, for trending movies feature)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# TMDB API Key (Required)
VITE_TMDB_API_KEY=your_tmdb_api_key_here

# Appwrite Configuration (Optional - for trending movies feature)
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=your_database_id_here
VITE_APPWRITE_COLLECTION_ID=your_collection_id_here
```

#### Getting Your TMDB API Key:
1. Go to [https://www.themoviedb.org/](https://www.themoviedb.org/)
2. Create an account or log in
3. Go to Settings → API
4. Request an API key
5. Copy your API key and add it to `.env` as `VITE_TMDB_API_KEY`

#### Getting Your Appwrite Credentials (Optional):
1. Go to [https://cloud.appwrite.io/](https://cloud.appwrite.io/)
2. Create a project
3. Create a database and collection
4. Copy your Project ID, Database ID, and Collection ID
5. Add them to your `.env` file

**Note:** The app will work without Appwrite credentials, but the trending movies feature will be disabled.

### 3. Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Troubleshooting

### "Missing required parameter: databaseId" Error
This means your Appwrite environment variables are not set. Either:
- Add the Appwrite credentials to your `.env` file, or
- The app will continue to work, but trending movies won't be available

### "401 Unauthorized" Error
This means your TMDB API key is missing or invalid. Make sure:
- You've created a `.env` file in the root directory
- The variable is named exactly `VITE_TMDB_API_KEY`
- Your API key is valid and active

### "Cannot read properties of undefined" Error
This has been fixed in the latest version. Make sure you're using the updated code.
