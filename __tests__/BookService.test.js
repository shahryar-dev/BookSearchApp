import { BookService } from '../src/api/bookService';


global.fetch = jest.fn();

describe('BookService API Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('searchBooks returns an array of books on success', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [{ id: '1', volumeInfo: { title: 'Test Book' } }] }),
    });

    const result = await BookService.searchBooks('React Native');
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].volumeInfo.title).toBe('Test Book');
  });

  test('getBookReviews handles API errors gracefully', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const result = await BookService.getBookReviews('1234567890');
  
    expect(result).toBeNull();
  });
});