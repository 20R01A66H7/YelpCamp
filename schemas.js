const BaseJoi = require("joi");
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = BaseJoi.extend(extension)


const campgroundSchema = joi.object({
    title:joi.string().required().escapeHTML(),
    price:joi.number().min(0).required(),
    description:joi.string().required().escapeHTML(),
    // image:joi.string().required(),
    location:joi.string().required().escapeHTML(),
    deleteImage:joi.array()
})
const reviewSchema = joi.object({
    body:joi.string().required().escapeHTML(),
    review:joi.number().required()
})
module.exports.reviewSchema = reviewSchema;
module.exports.campgroundSchema = campgroundSchema;
