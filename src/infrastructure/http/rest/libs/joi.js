import Joi from "joi";
import { InputValidatorPort } from "../../../../application/ports/input-validator.js";
import { AppError } from "../../../../application/errors/app-error.js";

class JoiValidatorAdapter extends InputValidatorPort {
    
    validate(schema, data) {
        const dataSchema = Joi.compile(schema);
        const { error, value } = dataSchema.validate(data, { abortEarly: false, stripUnknown: true });
        if (error) {
            throw new AppError("Data Invalid!", {
                code: "VALIDATION_ERROR",
                statusCode: 422,
                details: error.details.map((item) => ({
                    message: item.message,
                    path: item.path,
                })),
            });
        }
    
        return { ...value } ;
    }
}

export { JoiValidatorAdapter }
