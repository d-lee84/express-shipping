"use strict";

const express = require("express");
const router = new express.Router();
const jsonschema = require('jsonschema');

const { shipProduct } = require("../shipItApi");
const shipmentsSchema = require("../schemas/shipmentSchema.json");
const multiShipmentsSchema = require("../schemas/multiShipmentSchema.json");
const { BadRequestError } = require("../expressError");

/** POST /ship
 *
 * VShips an order coming from json body:
 *   { productId, name, addr, zip }
 *
 * Returns { shipped: shipId }
 */

router.post("/", async function (req, res, next) {
  const result = jsonschema.validate(req.body, shipmentsSchema);

  if(!result.valid) {
    let err = result.errors.map((err) => err.stack);
    throw new BadRequestError(err);
  }

  const { productId, name, addr, zip } = req.body;
  const shipId = await shipProduct({ productId, name, addr, zip });
  return res.json({ shipped: shipId });
});

/** POST /shipments/multi
 *
 * VShips several orders coming from json body:
 *   { productIds, name, addr, zip }
 *
 * Returns { shipped: [shipId, ...] }
 */

router.post("/multi", async function (req, res, next) {
  const result = jsonschema.validate(req.body, multiShipmentsSchema);

  if (!result.valid) {
    let err = result.errors.map((err) => err.stack);
    throw new BadRequestError(err);
  }

  const { productIds, name, addr, zip } = req.body;
  const shippedIdPromises = productIds
    .map(productId => shipProduct({ productId, name, addr, zip }));
  
  const shipIds = await Promise.all(shippedIdPromises);
  return res.json({ shipped: shipIds });
});

module.exports = router;