"use strict";

const request = require("supertest");

const shipItApi = require("../shipItApi");
shipItApi.shipProduct = jest.fn();

const app = require("../app");

describe("POST /", function () {

  test("valid", async function () {
    shipItApi.shipProduct.mockReturnValue(11);

    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: 11 });

    shipItApi.shipProduct.mockReturnValue(11);
  });

  test("valid: different zip code", async function () {
    shipItApi.shipProduct.mockReturnValue(24);

    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345",
    });

    expect(resp.body).toEqual({ shipped: 24 });
  });

  test("invalid: productId less than 1000", async function () {
    
    const resp = await request(app).post("/shipments").send({
      productId: 999,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.statusCode).toEqual(400);
  });

  test("invalid: missing field", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1203,
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.statusCode).toEqual(400);
  });

  test("invalid: wrong type", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1203,
      name: 41920481,
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.statusCode).toEqual(400);
  });

  test("invalid: wrong zipcode pattern", async function () {
    let resp = await request(app).post("/shipments").send({
      productId: 1203,
      name: "41920481",
      addr: "100 Test St",
      zip: "A5-6789",
    });

    expect(resp.statusCode).toEqual(400);

    resp = await request(app).post("/shipments").send({
      productId: 1203,
      name: "41920481",
      addr: "100 Test St",
      zip: "12345-12",
    });

    expect(resp.statusCode).toEqual(400);

    resp = await request(app).post("/shipments").send({
      productId: 1203,
      name: "41920481",
      addr: "100 Test St",
      zip: "12345-112342",
    });

    expect(resp.statusCode).toEqual(400);

    resp = await request(app).post("/shipments").send({
      productId: 1203,
      name: "41920481",
      addr: "100 Test St",
      zip: "12345-",
    });

    expect(resp.statusCode).toEqual(400);
  });
});

describe("POST /multi", function () {
  test("valid", async function () {
    shipItApi.shipProduct
      .mockReturnValueOnce(24)
      .mockReturnValueOnce(12);

    const resp = await request(app).post("/shipments/multi").send({
      productIds: [1000, 1002],
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: [24, 12] });
  });

  test("invalid: productId less than 1000", async function () {
    const resp = await request(app).post("/shipments/multi").send({
      productIds: [999, 1000],
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.statusCode).toEqual(400);
  });

  test("invalid: missing field", async function () {
    const resp = await request(app).post("/shipments/multi").send({
      productIds: [1203],
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.statusCode).toEqual(400);
  });

  test("invalid: wrong type", async function () {
    const resp = await request(app).post("/shipments/multi").send({
      productIds: "1203",
      name: "hey",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.statusCode).toEqual(400);
  });
});