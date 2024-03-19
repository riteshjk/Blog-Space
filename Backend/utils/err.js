export const errHandler =(stattusCode,message) => {
    const err = new Error();
    err.statusCode = stattusCode;
    err.message = message;
    return err
}