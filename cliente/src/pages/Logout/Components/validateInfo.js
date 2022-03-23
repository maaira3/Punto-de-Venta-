export default function validateInfo(values) {
    let errors = {};
  
    if (!values.username.trim()) {
      errors.username = 'Ingresa un usuario válido';
    }

    if (!values.password) {
      errors.password = 'Ingresa una contraseña válida (al menos 8 digitos)';
    } else if (values.password.length < 8) {
      errors.password = 'Ingresa una contraseña válida (al menos 8 digitos)';
    }
    return errors;
  }