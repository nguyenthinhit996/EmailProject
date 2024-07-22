const sanitizeObject = (object, allowedProperties) => {
    const filteredObj = Object.keys(object)
        .filter((key) => allowedProperties.includes(key))
        .reduce((obj, key) => {
            obj[key] = object[key];
            return obj;
        }, {});
    return filteredObj;
}

export { sanitizeObject }