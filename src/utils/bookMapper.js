export const enrichBooksWithGenres = async (sheetRows) => {
  return sheetRows.map((row) => ({
    id: row[0] || '',
    title: row[1] || '',
    vol: row[2] || '',
    author: row[3]?.trim() || 'Unknown',
    bookType: row[4] || '',
    inShelf: row[5] || '',
    coverUrl: row[6]?.startsWith('http') ? row[6] : '', // renamed + validated
    genres: row[7]
      ? row[7].split(',').map(g => g.trim()).filter(Boolean)
      : ['Uncategorized'],
    read: row[9]?.toLowerCase() === 'yes', // Column J
    rating: parseFloat(row[10]) || 0,        // Column K
  }));
};