import 'express-session';

declare module 'express-session' {
  interface Session {
    verificationCode?: string;
    verificationCodeUsed?: boolean;
  }
}
