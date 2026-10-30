// Run with `npm test`. Guards the rule that only a successful live product read
// can make a fabric page noindex; sample (seed) products never decide anything.
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  FABRIC_PAGES,
  fabricPageState,
  findFabricPage,
  indexablePages,
} from "../src/data/fabricPages.ts";

const tshirt = findFabricPage("t-shirt-fabric");
const live = (n) =>
  Array.from({ length: n }, (_, i) => ({ name: `Tee ${i}`, category: "T-Shirt Fabric" }));

test("failed or empty live read: no products shown and never noindex", () => {
  assert.deepEqual(fabricPageState(tshirt, null), { products: [], noindex: false });
});

test("successful read with fewer than 3 matches: noindex", () => {
  assert.equal(fabricPageState(tshirt, live(2)).noindex, true);
  assert.equal(fabricPageState(tshirt, []).noindex, true);
});

test("successful read with 3 or more matches: indexable", () => {
  const state = fabricPageState(tshirt, live(3));
  assert.equal(state.noindex, false);
  assert.equal(state.products.length, 3);
});

test("only pages with 3 live matches are listed", () => {
  assert.deepEqual(
    indexablePages(live(3)).map((p) => p.slug),
    ["t-shirt-fabric"],
  );
  assert.deepEqual(indexablePages(live(2)), []);
});

test("matching works by category or by name, and slugs are unique", () => {
  const matty = findFabricPage("matty-fabric");
  assert.ok(matty.matches({ name: "Double Matty", category: "Bottomwear and T-Shirt Fabric" }));
  assert.equal(new Set(FABRIC_PAGES.map((p) => p.slug)).size, FABRIC_PAGES.length);
});
