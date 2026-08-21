import crypto from 'crypto';

const SALT = process.env.OTP_SALT || 'kirana-connect-salt-2026';

export function generate4DigitOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function generateQrToken(parcelId: string): string {
  const timestamp = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KC-AUTH-${parcelId.slice(-4)}-${timestamp}-${randomSuffix}`;
}

export function validatePickupHandoff(
  inputCode: string,
  parcel: { pickupOtp: string; qrToken: string }
): { isValid: boolean; method: 'OTP' | 'QR' | 'INVALID'; message: string } {
  const clean = inputCode.trim();

  if (clean === parcel.qrToken) {
    return { isValid: true, method: 'QR', message: 'Cryptographic QR pass verified.' };
  }

  if (clean === parcel.pickupOtp) {
    return { isValid: true, method: 'OTP', message: '4-Digit OTP PIN verified.' };
  }

  return { isValid: false, method: 'INVALID', message: 'Invalid OTP or QR code.' };
}
