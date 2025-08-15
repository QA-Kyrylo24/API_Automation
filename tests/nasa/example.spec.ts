import { test, expect } from '@playwright/test';

function scriptCheck(res) {
  expect(res.status()).toEqual(200);
  const contentType = res.headers()['content-type'];
  expect(contentType).toContain('application/json');
}

const today = new Date().toISOString().split('T')[0];
const apiKey = process.env.NASA_API_KEY;

test('ID_1 GET /planetary/apod with api_key', async ({ request }) => {

  const res = await request.get('/planetary/apod?api_key=' + apiKey);
  const json = await res.json();
  scriptCheck(res);
  expect(json.date).toEqual(today);
});

const testData = [
  {
    testID: 'ID_2_1',
    params: {
      start_date: '2025-07-01',
      end_date: '2025-07-31',
      api_key: apiKey,
    },
  },
    {
    testID: 'ID_2_2',
    params: {
      start_date: '2025-08-01',
      end_date: '2025-08-11',
      api_key: apiKey,
    },
  }
]

testData.forEach(({testID, params})=>{
test(`${testID} GET /planetary/apod start_date & end_date`,
  {
    tag: '@regression',
    annotation: {
      type: 'description',
      description: 'regression suite',
    }
  },
  async ({ request }) => {


    const res = await request.get(`/planetary/apod`, {
      params: params,
    });


    const json = await res.json();
    scriptCheck(res);

    expect(Array.isArray(json)).toBe(true);
    expect(json.length).toBe(31);


  });
})


test('ID_3 GET /planetary/apod date=2025-07-04', async ({ request }) => {
  const date = '2025-07-04';

  const res = await request.get(`/planetary/apod?date=${date}&api_key=${apiKey}`);
  const json = await res.json();

  scriptCheck(res);
  expect(json.date).toEqual(date);

});








