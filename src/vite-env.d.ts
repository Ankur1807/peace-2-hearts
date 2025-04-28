
/// <reference types="vite/client" />

interface Window {
  Razorpay: any;
  recoverEmailByReferenceId?: (referenceId: string) => Promise<boolean>;
  automatedEmailRecovery?: () => Promise<void>;
  recoverEmails?: () => Promise<void>;
}
