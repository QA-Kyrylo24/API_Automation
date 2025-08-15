import { expect } from '@playwright/test';
import { test } from '../../fixtures/fixtures';

test('UpdateBooking', async ({ authRequest, createdBooking }) => {

  const res = await authRequest.put(`/booking/${createdBooking}`, {
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

  });
  const body = await res.json();
  expect(res.ok()).toBeTruthy();
  expect(body.firstname).toBe('Jane')
  console.log(body);
});