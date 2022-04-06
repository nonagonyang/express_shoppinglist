process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
let items = require("./fakeDb");

let salt = { name: "salt",price:0.99 };

beforeEach(function() {
  items.push(salt);
});

afterEach(function() {
  // make sure this *mutates*, not redefines, `items`
  items.length = 0;
});
// end afterEach

/** GET /items - returns `{items: [item, ...]}` */

describe("GET /items", function() {
  test("Gets a list of items", async function() {
    const resp = await request(app).get(`/items`);
    expect(resp.statusCode).toBe(200);

    expect(resp.body).toEqual({items: [salt]});
  });
});
// end

/** GET /items/[name] - return data about one item: `{item: item}` */

describe("GET /items/:name", function() {
  test("Gets a single item", async function() {
    const resp = await request(app).get(`/items/${salt.name}`);
    expect(resp.statusCode).toBe(200);

    expect(resp.body).toEqual({item: salt});
  });

  test("Responds with 404 if can't find item", async function() {
    const resp = await request(app).get(`/items/x`);
    expect(resp.statusCode).toBe(404);
  });
});
// end

/** POST /items - create item from data; return `{item: item}` */

describe("POST /items", function() {
  test("Creates a new item", async function() {
    const resp = await request(app)
      .post(`/items`)
      .send({
        name: "water",
        price:0.14
      });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      added: { name: "water",price:0.14}
    });
  });
  test("responds with 404 if tries to post an invalid item", async function() {
    const resp = await request(app)
      .post(`/items`)
      .send({
        price:0.14
      });
    expect(resp.statusCode).toBe(400);
  });

});
// end

/** PATCH /items/[name] - update item; return `{item: item}` */

describe("PATCH /items/:name", function() {
  test("Updates a single item", async function() {
    const resp = await request(app)
      .patch(`/items/${salt.name}`)
      .send({
        name: "water",
      });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      item: { name: "water",price:0.99 }
    });
  });

  test("Responds with 404 if id invalid", async function() {
    const resp = await request(app).patch(`/items/x`);
    expect(resp.statusCode).toBe(404);
  });
});
// end

/** DELETE /items/[name] - delete cat,
 *  return `{message: "Cat deleted"}` */

describe("DELETE /items/:name", function() {
  test("Deletes a single item", async function() {
    const resp = await request(app).delete(`/items/${salt.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Deleted" });
  });
  test("Responds with 404 if id invalid", async function() {
    const resp = await request(app).delete(`/items/x`);
    expect(resp.statusCode).toBe(404);
  });
});
// end
