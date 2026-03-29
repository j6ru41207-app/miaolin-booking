// api/busy-dates.js
// Vercel 中繼端點：轉送到 Apps Script，取得 Google Calendar 忙碌日期
// 部署路徑：在 Vercel 專案根目錄的 /api/busy-dates.js

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbz9h9D2V4MpS9-jBGb3I_b4JuDMWqoZ0U75tEov2g6pKXvW-EHczuEO471aLbUNvfA/exec';

export default async function handler(req, res) {
  // 允許跨域（前端表單同網域，但保留彈性）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate'); // 快取 5 分鐘

  try {
    const { year, month } = req.query;

    // 把 year / month 帶給 Apps Script
    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.set('action', 'busyDates');
    if (year)  url.searchParams.set('year',  year);
    if (month) url.searchParams.set('month', month);

    const upstream = await fetch(url.toString(), { redirect: 'follow' });
    const data = await upstream.json();

    res.status(200).json(data);
  } catch (err) {
    // 若 Apps Script 掛掉，回傳空陣列讓表單仍可操作
    console.error('busy-dates proxy error:', err);
    res.status(200).json({ busyDates: [] });
  }
}
