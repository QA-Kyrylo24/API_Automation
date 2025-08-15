import { test, expect } from '@playwright/test';
import Joi from "joi";
// curl -X POST \
//   https://restful-booker.herokuapp.com/auth \
//   -H 'Content-Type: application/json' \
//   -d '{
//     "username" : "admin",
//     "password" : "password123"
// }'
let token;
let bookingId: number;

test.beforeAll(async ({ request }) => {
  const auth = await request.post('/auth', {
    data: { username: 'admin', password: 'password123' }
  });
  expect(auth.status(), await auth.text()).toBe(200);
  token = (await auth.json()).token;

  const create = await request.post('/booking', {
    data: {
      firstname: 'John',
      lastname: 'Doe',
      totalprice: 123,
      depositpaid: true,
      bookingdates: { checkin: '2025-01-01', checkout: '2025-01-05' },
      additionalneeds: 'Breakfast'
    }
  });
  expect(create.status(), await create.text()).toBe(200);
  bookingId = (await create.json()).bookingid;
  expect(bookingId).toBeGreaterThan(0);
});


test('CreateBooking', async ({ request }) => {
  const headerKeysExpected = [
    'content-length',
    'content-type',
    'date',
    'etag',
    'nel',
    'report-to',
    'reporting-endpoints',
    'server',
    'via',
    'x-powered-by'
  ]
  const payload = {
    firstname: "John",
    lastname: "Doe",
    totalprice: 123,
    depositpaid: true,
    bookingdates: {
      checkin: "2025-01-01",
      checkout: "2025-01-05"
    },
    additionalneeds: "Breakfast"
  };


  const res = await request.post('/booking', { data: payload });
  expect(res.ok()).toBeTruthy();

  const body = await res.json();
  const headers = res.headers();
  expect(body).toHaveProperty('bookingid');
  console.log(headers);
  console.log(body);

  const headerKeysReceived = Object.keys(headers);

  for (let el in headers) {
    expect(headers[el]).toBeDefined()
  };

  expect(headerKeysReceived).toEqual(expect.arrayContaining(headerKeysExpected));

  const bookingSchema = Joi.object({
    additionalneeds: Joi.string().required(),
    totalprice: Joi.number().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    depositpaid: Joi.boolean().required(),
    bookingdates: Joi.object({
      checkin: Joi.date().required(),
      checkout: Joi.date().required(),
    }),
  });

  const schema = Joi.object({
    bookingid: Joi.number().required(),
    booking: bookingSchema,
  });

  const validationResult = schema.validate(body);
  expect(validationResult.error).toBeUndefined();

});

test('GetBookingIds', async ({ request }) => {
  const res = await request.get('/booking');
  expect(res.ok()).toBeTruthy();

  const body = await res.json();
  expect(Array.isArray(body)).toBeTruthy();
  expect(body[0]).toHaveProperty('bookingid');
});

test('GetBooking', async ({ request }) => {
  const res = await request.get(`/booking/${bookingId}`);
  expect(res.ok()).toBeTruthy();

  const body = await res.json();
  expect(body).toHaveProperty('firstname');
});

test('UpdateBooking', async ({ request }) => {

  const res = await request.put(`/booking/${bookingId}`, {
    data: {
      firstname: "Jane",
      lastname: "Dou",
      totalprice: 150,
      depositpaid: false,
      bookingdates: {
        checkin: "2025-02-01",
        checkout: "2025-02-05"
      },
      additionalneeds: "Dinner"
    },
    headers: {

      'Cookie': `token=${token}`
    }
  });
  const body = await res.json();
  expect(res.ok()).toBeTruthy();
  expect(body.firstname).toBe('Jane')
});

test('PartialUpdateBooking', async ({ request }) => {
  const res = await request.patch(`/booking/${bookingId}`, {
    data: { additionalneeds: 'Late checkout' },
    headers: {

      'Cookie': `token=${token}`
    }
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.firstname).toBe('John');
  expect(body.additionalneeds).toBe('Late checkout')
});

test('DeleteBooking', async ({ request }) => {
  const res = await request.delete(`/booking/${bookingId}`, {
    headers: { 'Cookie': `token=${token}` }
  });
  expect([200, 201, 204]).toContain(res.status());

  const checkDeleted = await request.get(`/booking/${bookingId}`);
  expect(checkDeleted.status()).toBe(404)

});










