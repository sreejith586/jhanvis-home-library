// utils/sheetFetcher.js
export const fetchSheetData = async () => {
  const SHEET_ID = '1agbGWFVoz8_zrOi-3DnTZAd6uShJK7u4q3Xs6UTPn8Y';
  const RANGE = 'Sheet1!A2:K';
  const API_KEY = 'AIzaSyDN9AywbsWbcSVvZuGvcAPqAUD-vkilU4I';

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.values; // Array of rows
  } catch (error) {
    console.error('Failed to fetch sheet data:', error);
    return [];
  }
};