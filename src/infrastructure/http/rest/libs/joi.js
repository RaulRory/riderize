import Joi from "joi";
import { InputValidatorPort } from "../../../../application/ports/input-validator.js";

class JoiValidatorAdapter extends InputValidatorPort {
    
    validate(schema, data) {
        const dataSchema = Joi.compile(schema);
        const { error, value } = dataSchema.validate(data, { abortEarly: false, stripUnknown: true });
        if (error) {
            throw new Error(`Data Invalid! ${error.message}`)
        }
    
        return { ...value } ;
    }
}

export { JoiValidatorAdapter }
