export function onlyDigits(value) {
  return value.replace(/\D/g, '');
}

export function onlyLetters(value) {
  return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
}

export function onlyLettersAndNumbers(value) {
  return value.replace(/[^a-zA-ZÀ-ÿ0-9\s\-]/g, '');
}

export function formatCEP(value) {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function formatPhone(value) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function onlyNumbers(value) {
  return value.replace(/\D/g, '');
}

export function validateCEP(value) {
  const digits = onlyDigits(value);
  return digits.length === 8;
}

export function validatePhone(value) {
  const digits = onlyDigits(value);
  return digits.length >= 10 && digits.length <= 11;
}

export function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function formatCNPJ(value) {
  const digits = onlyDigits(value).slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}
