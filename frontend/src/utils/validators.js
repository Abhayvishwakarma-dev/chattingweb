import { validateLogin, validateRegistration } from '../utils/validators';

// Validate login
const result = validateLogin({ identifier, password });
if (!result.valid) {
  // Show errors
  console.log(result.errors);
}

// Validate registration
const regResult = validateRegistration(userData);
if (!regResult.valid) {
  // Show errors
  console.log(regResult.errors);
}