const handleServiceWithContext = require("./handleServiceWithContext");
const serviceObject = require("../../fixtures/serviceObject").default;
const contextObject = require("../../fixtures/contextObject").default;

it("rejects the returned promise if no handler is found", done => {
  process.env.LOCAL_HANDLERS_PATH = "./fixtures/handlers";
  const handleService = handleServiceWithContext(contextObject);
  const promise = handleService(serviceObject);
  promise.then(context => {}).catch(error => {
    expect(error).toEqual("no handler found");
    done();
  });
});

describe("context service types", () => {
  it("resolves the returned promise if a handler is found", done => {
    process.env.LOCAL_HANDLERS_PATH = "./fixtures/handlers";
    process.env.COMPONENT_PATH_PREFIX = "./fixtures/test-platform";
    serviceObject.definition.handler.name = "test-context";
    serviceObject.definition.type = "context";
    const handleService = handleServiceWithContext(contextObject);
    const promise = handleService(serviceObject);
    promise.then(context => {
      expect(context.secrets).toEqual({ hello: "hi" });
      done();
    });
  });

  describe("self handlers", () => {
    it("uses a 'self' handler if commands are present on service", done => {
      process.env.LOCAL_HANDLERS_PATH = "./fixtures/handlers";
      process.env.COMPONENT_PATH_PREFIX = "./fixtures/test-platform";
      serviceObject.definition.handler = { name: "self" };
      serviceObject.definition.commands = { start: "cat package.json" };
      const handleService = handleServiceWithContext(contextObject);
      const promise = handleService(serviceObject);
      promise.then(context => {
        expect(context.secrets).toEqual({ hello: "hi" });
        done();
      });
    });
  });
});
