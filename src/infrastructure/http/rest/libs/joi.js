import Joi from "joi";

class JoiValidator {
    
    static validateSchema(schema) {
        const dataSchema = Joi.compile(schema);
        const { error, value } = dataSchema.validate(schema);
        if (error) {
            throw new Error("Data Invalid!")
        }
    
        return { ...value } ;
    }
}

export { JoiValidator }