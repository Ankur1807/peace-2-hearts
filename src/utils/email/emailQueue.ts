
// Email sending queue to handle retries
const emailQueue: Map<string, {
  attempts: number,
  lastAttempt: number,
  payload: any
}> = new Map();

// Maximum retries for emails
const MAX_RETRY_ATTEMPTS = 5;
// Retry intervals in milliseconds (increasing backoff)
const RETRY_INTERVALS = [1000, 5000, 15000, 30000, 60000];

// Process email retry queue
export function processEmailQueue() {
  const now = Date.now();
  
  emailQueue.forEach((item, id) => {
    // Skip if not ready for retry yet
    if (now - item.lastAttempt < RETRY_INTERVALS[Math.min(item.attempts - 1, RETRY_INTERVALS.length - 1)]) {
      return;
    }
    
    // Remove from queue if max attempts reached
    if (item.attempts >= MAX_RETRY_ATTEMPTS) {
      console.error(`Email ${id} failed after ${MAX_RETRY_ATTEMPTS} attempts, giving up`);
      emailQueue.delete(id);
      return;
    }
    
    console.log(`Retrying email ${id}, attempt ${item.attempts + 1}`);
    
    // Try sending email again based on type
    if (item.payload.type === 'booking-confirmation') {
      import('./bookingEmails').then(bookingModule => {
        bookingModule.sendBookingConfirmationEmailInternal(item.payload)
          .then(success => {
            if (success) {
              console.log(`Retry successful for email ${id}`);
              emailQueue.delete(id);
            } else {
              item.attempts++;
              item.lastAttempt = now;
            }
          })
          .catch(() => {
            item.attempts++;
            item.lastAttempt = now;
          });
      });
    } else if (item.payload.type === 'contact') {
      import('./contactEmails').then(contactModule => {
        contactModule.sendContactEmailInternal(item.payload)
          .then(success => {
            if (success) {
              emailQueue.delete(id);
            } else {
              item.attempts++;
              item.lastAttempt = now;
            }
          })
          .catch(() => {
            item.attempts++;
            item.lastAttempt = now;
          });
      });
    }
  });
}

// Add email to retry queue
export function addToEmailQueue(emailId: string, payload: any): void {
  emailQueue.set(emailId, {
    attempts: 1,
    lastAttempt: Date.now(),
    payload
  });
  console.log(`Added email to retry queue with ID ${emailId}`);
}

// Set up email retry timer in browser environment
if (typeof window !== 'undefined') {
  setInterval(processEmailQueue, 10000);
}
