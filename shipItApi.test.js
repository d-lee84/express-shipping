"use strict";

const axios = require("axios");
const AxiosMockAdapter = require("axios-mock-adapter");
const axiosMock = new AxiosMockAdapter(axios);

const { shipProduct, SHIPIT_SHIP_URL } = require("./shipItApi");

test("shipProduct", async function () {
  axiosMock.onPost(SHIPIT_SHIP_URL).reply(200, {
    receipt: {
      shipId: 20,
    },
  });

  const shipId = await shipProduct({
    productId: 1000,
    name: "Test Tester",
    addr: "100 Test St",
    zip: "12345-6789",
  });

  expect(shipId).toEqual(20);
});
