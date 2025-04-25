
// Add your templates here
export interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isResend?: boolean;
}

export interface BookingEmailRequest {
  clientName: string;
  email: string;
  referenceId: string;
  consultationType: string;
  services: string[];
  date?: string;
  formattedDate?: string; // Added for formatted date
  timeSlot?: string;
  timeframe?: string;
  message?: string;
  isResend?: boolean;
  packageName?: string;
  serviceCategory?: string;
}

export function getContactUserEmailTemplate(data: ContactEmailRequest): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #3399cc;">Thank You for Contacting Peace2Hearts</h2>
      <p>Dear ${data.name},</p>
      <p>We have received your message regarding "${data.subject}" and will get back to you as soon as possible.</p>
      <p>Here's a copy of your message:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        <p style="margin: 0;">${data.message}</p>
      </div>
      <p>If you have any additional questions or information to share, please don't hesitate to reply to this email.</p>
      <p>Warm regards,<br>The Peace2Hearts Team</p>
    </div>
  `;
}

export function getContactAdminEmailTemplate(data: ContactEmailRequest): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #3399cc;">New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        <p style="margin: 0;">${data.message}</p>
      </div>
      <p>${data.isResend ? '<strong>Note:</strong> This is a resent notification.' : ''}</p>
    </div>
  `;
}

export function getBookingUserEmailTemplate(data: BookingEmailRequest): string {
  const isHolisticBooking = data.serviceCategory === 'holistic';
  const servicesList = data.services.map(service => `<li>${service}</li>`).join('');
  
  let dateTimeSection = '';
  if (isHolisticBooking && data.timeframe) {
    dateTimeSection = `<p><strong>Preferred Timeframe:</strong> ${data.timeframe}</p>`;
  } else if (data.formattedDate && data.timeSlot) {
    dateTimeSection = `
      <p><strong>Date:</strong> ${data.formattedDate}</p>
      <p><strong>Time Slot:</strong> ${data.timeSlot}</p>
    `;
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #3399cc;">Booking Confirmation</h2>
      <p>Dear ${data.clientName},</p>
      <p>Thank you for booking a consultation with Peace2Hearts. Here are the details of your booking:</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Reference ID:</strong> ${data.referenceId}</p>
        ${data.packageName ? `<p><strong>Package:</strong> ${data.packageName}</p>` : ''}
        <p><strong>Service(s):</strong></p>
        <ul>
          ${servicesList}
        </ul>
        ${dateTimeSection}
      </div>
      
      <p>Our team will be in touch with you shortly to confirm the details and provide any additional information you might need.</p>
      ${data.message ? `
        <p><strong>Your Message:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          <p style="margin: 0;">${data.message}</p>
        </div>
      ` : ''}
      <p>If you have any questions or need to make changes to your booking, please contact us at <a href="mailto:contact@peace2hearts.com">contact@peace2hearts.com</a> with your Reference ID.</p>
      <p>Warm regards,<br>The Peace2Hearts Team</p>
    </div>
  `;
}

export function getBookingAdminEmailTemplate(data: BookingEmailRequest): string {
  const isHolisticBooking = data.serviceCategory === 'holistic';
  const servicesList = data.services.map(service => `<li>${service}</li>`).join('');
  
  let dateTimeSection = '';
  if (isHolisticBooking && data.timeframe) {
    dateTimeSection = `<p><strong>Preferred Timeframe:</strong> ${data.timeframe}</p>`;
  } else if (data.date) {
    dateTimeSection = `
      <p><strong>Date:</strong> ${data.formattedDate || data.date}</p>
      ${data.timeSlot ? `<p><strong>Time Slot:</strong> ${data.timeSlot}</p>` : ''}
    `;
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #3399cc;">New Consultation Booking</h2>
      <p><strong>Client:</strong> ${data.clientName}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Reference ID:</strong> ${data.referenceId}</p>
      ${data.packageName ? `<p><strong>Package:</strong> ${data.packageName}</p>` : ''}
      <p><strong>Service(s):</strong></p>
      <ul>
        ${servicesList}
      </ul>
      ${dateTimeSection}
      ${data.message ? `
        <p><strong>Client Message:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          <p style="margin: 0;">${data.message}</p>
        </div>
      ` : ''}
      <p>${data.isResend ? '<strong>Note:</strong> This is a resent notification.' : ''}</p>
    </div>
  `;
}
