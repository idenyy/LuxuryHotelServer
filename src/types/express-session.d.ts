import 'express-session';

declare module 'express-session' {
  interface Session {
    verificationCode?: string;
    verificationCodeUsed?: boolean;
    signupData?: {
      fullName: string;
      email: string;
      password: string;
      verificationCode: string;
      verificationCodeExpiry: number;
    } | null;
  }
}
