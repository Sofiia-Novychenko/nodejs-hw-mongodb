export const getEnvVar = (name, defaultValue) => {
  const value = process.env[name];

  if (value) return value;
  if (defaultValue) return defaultValue;

  //* Якщо змінної оточення з такою назвою
  //* не було вказано і не було передано дефолтного значення,
  //* то виклик цієї функції викине помилку
  throw new Error(`Missing: process.env["${name}"]`);
};
