export function generateNumber(length: number): string {
  const digits = '0123456789';
  let number = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    number += digits[randomIndex];
  }

  return number;
}
