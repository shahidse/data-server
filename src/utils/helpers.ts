type IdentityType = 'email' | 'phoneNumber' | 'userName';
export const getIdentity = (identity: string): IdentityType => {
  switch (true) {
    case identity.includes('@'):
      return 'email';
    case !isNaN(Number(identity)):
      return 'phoneNumber';
    default:
      return 'userName';
  }
};
export function generateDynamicCode(digits: number) {
  if (digits <= 0) throw new Error('Digits must be a positive number.');
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  return String(Math.floor(min + Math.random() * (max - min + 1)));
}
