import {
  APIResponse,
  APIRequestContext,
  test as base,
  request as newRequest,
} from "@playwright/test";


type Fixtures = {
 authRequest: APIRequestContext;
 createdBooking: number;
};

export const test = base.extend<Fixtures>({
  authRequest: async ({ request }, use) => {
    let token;
    const result: APIResponse = await request.post("/auth", {
        data: {
          username: "admin",
          password: "password123",
        },
      });
      const json = await result.json();
      token = json.token;

    const requestWithToken = await newRequest.newContext({
      extraHTTPHeaders: {
        Cookie: `token=${token}`,
      },
    });

    await use(requestWithToken);

  },

  createdBooking: async ({ request }, use) => {
 
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
  let bookingId = (await create.json()).bookingid;
  console.log(await create.json());
  await use(bookingId);

  },
});