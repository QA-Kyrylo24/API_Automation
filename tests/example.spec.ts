import { test, expect } from '@playwright/test';

function scriptCheck(res) {
  expect(res.status()).toEqual(200);
  const contentType = res.headers()['content-type'];
  expect(contentType).toContain('application/json');
}

const today = new Date().toISOString().split('T')[0];
const apiKey = process.env.NASA_API_KEY;

test('GET /planetary/apod with api_key', async ({ request }) => {

  const res = await request.get('/planetary/apod?api_key=' + apiKey);
  const json = await res.json();
  scriptCheck(res);
  expect(json.date).toEqual(today);
});


test('GET /planetary/apod start_date & end_date', async ({ request }) => {
  const start = '2025-07-01';
  const end = '2025-07-31';
  const res = await request.get(`/planetary/apod?start_date=${start}&end_date=${end}&api_key=${apiKey}`);
  const json = await res.json();
  scriptCheck(res);

  expect(Array.isArray(json)).toBe(true);
  expect(json.length).toBe(31);

  console.log(res);


});

test('GET /planetary/apod date=2025-07-04', async ({ request }) => {
  const date = '2025-07-04';

  const res = await request.get(`/planetary/apod?date=${date}&api_key=${apiKey}`);
  const json = await res.json();

  scriptCheck(res);
  expect(json.date).toEqual(date);

});





