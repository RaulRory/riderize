import { describe, it } from "node:test";
import { deepStrictEqual, rejects } from "node:assert";
import Joi from "joi";
import { JoiValidatorAdapter } from "../../src/infrastructure/http/rest/libs/joi.js";

describe("JoiValidator", () => {
  const validator = new JoiValidatorAdapter();

  it("should validate payload using an explicit schema", () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().required(),
    });

    const value = validator.validate(schema, {
      name: "Rory",
      age: 25,
      ignored: true,
    });

    deepStrictEqual(value, { name: "Rory", age: 25 });
  });

  it("should throw when payload does not satisfy schema", async () => {
    const schema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().required(),
    });

    await rejects(
      async () => validator.validate(schema, { name: "Rory", age: "invalid" }),
      /Data Invalid!/
    );
  });
});
