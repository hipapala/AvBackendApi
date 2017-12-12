import validator from 'validator';
  
export const isRequired = (value) => {
  return value ? true : false;
};

export const isEmail = (value) => {
  return !value ? true : validator.isEmail(value);
};

export const summary = (value) => {
  var result = { isValid: true };
  Object.keys(value).map((fieldName, i) => {
    result[fieldName] = true;
    value[fieldName].forEach((valid) => {
         if(!valid) {result.isValid = false; result[fieldName] = false};
    });
  });
  return result;
}

export const errorClass = (valid, isTouched) => {
  return(isTouched !== false && !valid ? 'has-error' : '');
};