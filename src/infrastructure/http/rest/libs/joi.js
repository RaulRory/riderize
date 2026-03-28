import Joi from "joi";

class JoiValidator {
    
    static validateSchema(schema, data) {
        const dataSchema = Joi.compile(schema);
        const { error, value } = dataSchema.validate(data, { abortEarly: false, stripUnknown: true });
        if (error) {
            throw new Error(`Data Invalid! ${error.message}`)
        }
    
        return { ...value } ;
    }
}

export { JoiValidator }
