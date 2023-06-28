export function generateAccountNumber(): string {
  const digits = '0123456789';
  const accountNumberLength = 10;
  let accountNumber = '';

  for (let i = 0; i < accountNumberLength; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    accountNumber += digits[randomIndex];
  }

  return accountNumber;
}
