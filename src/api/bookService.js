
const NYT_API_KEY = 'YOUR_ACTUAL_NYT_KEY';

export const BookService = {

  searchBooks: async (term) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(term)}&maxResults=20`
      );
      if (!response.ok) return [];
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error("Google Books Search Error:", error);
      return [];
    }
  },

  
  getBookReviews: async (isbn) => {
    if (!isbn) return null;
    try {
      const response = await fetch(
        `https://api.nytimes.com/svc/books/v3/reviews.json?isbn=${isbn}&api-key=${NYT_API_KEY}`
      );
      
     
      if (!response.ok) return null;
      
      const data = await response.json();
      return data.results || null;
    } catch (error) {
      
      console.log("NYT API connectivity issue suppressed for app stability.");
      return null; 
    }
  }
};