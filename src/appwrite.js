import { Client,Databases, ID, Query } from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

// Check if Appwrite environment variables are set
const isAppwriteConfigured = PROJECT_ID && DATABASE_ID && COLLECTION_ID;

const client = isAppwriteConfigured 
    ? new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(PROJECT_ID)
    : null;

const database = client ? new Databases(client) : null;

export const updateSearchCount = async (searchTerm,movie) => {
    // Skip if Appwrite is not configured
    if (!isAppwriteConfigured) {
        console.warn('Appwrite is not configured. Skipping search count update.');
        return;
    }

    // 1. Use the Appwrite SDK to check if the searchTerm exists in the database
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, 
            [Query.equal('searchTerm', searchTerm),]);
    
        // 2. If it does, update the count
        if(result.documents.length > 0) {
            const document = result.documents[0];
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, document.$id, {count: document.count +1,});

        // 3. If it doesn't, create a new document with the searchTerm and count set as 1
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(),{
                searchTerm: searchTerm,
                 count: 1,
                  movie_id: movie.id,
                  poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                });
        }
    } catch (error) {
        console.error('Error updating search count:', error);
    }
}

export const getTrendingMovies = async () => {
    // Skip if Appwrite is not configured
    if (!isAppwriteConfigured) {
        console.warn('Appwrite is not configured. Returning empty trending movies.');
        return [];
    }

    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, 
           [Query.limit(5),
            Query.orderDesc('count',)]);

        return result.documents || [];
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return [];
    }
}