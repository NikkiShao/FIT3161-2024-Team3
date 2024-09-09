import assert from "assert";
//import './task.tests.js';
//import './team.tests.js';
//import './board.tests.js';
// import './user.tests.js';
import './logentry.tests.js';


describe("task-management-system", function () {
  it("package.json has correct name", async function () {
    const { name } = await import("../package.json");
    assert.strictEqual(name, "task-management-system");
  });

  if (Meteor.isClient) {
    it("client is not server", function () {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

  if (Meteor.isServer) {
    it("server is not client", function () {
      assert.strictEqual(Meteor.isClient, false);
    });
  }
});
