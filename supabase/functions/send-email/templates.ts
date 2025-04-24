
import { formatDate, formatServiceName, formatTimeSlot, formatTimeframe } from "./helpers.ts";

// Email template types
export interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  isResend?: boolean;
}

export interface BookingEmailRequest {
  clientName: string;
  email: string;
  referenceId: string;
  consultationType: string;
  services: string[];
  date?: string | Date;
  timeSlot?: string;
  timeframe?: string;
  message?: string;
  isResend?: boolean;
  packageName?: string;
}

// Generate contact confirmation email for user
export function getContactUserEmailTemplate(data: ContactEmailRequest): string {
  const { name, subject, message, isResend } = data;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f0f7ff; padding: 30px; text-align: center;">
        <h1 style="color: #2c5282; margin-bottom: 10px;">Thank You for Contacting Us</h1>
        ${isResend ? "<p style='font-weight: bold; color: #e53e3e;'>This is a resent confirmation of your original message.</p>" : ""}
      </div>
      <div style="padding: 30px;">
        <p>Dear ${name},</p>
        <p>We have received your message regarding: <strong>${subject}</strong>.</p>
        <p>Our team will review your inquiry and get back to you as soon as possible.</p>
        <p>For your reference, here's a copy of your message:</p>
        <div style="background-color: #f8f8f8; padding: 15px; border-left: 4px solid #2c5282; margin: 20px 0;">
          <p style="margin: 0;">${message}</p>
        </div>
        <p>Best regards,<br>The Peace2Hearts Team</p>
      </div>
      <div style="background-color: #f0f7ff; padding: 20px; text-align: center; font-size: 14px; color: #4a5568;">
        <p>&copy; 2025 Peace2Hearts. All rights reserved.</p>
      </div>
    </div>
  `;
}

// Generate contact notification email for admin
export function getContactAdminEmailTemplate(data: ContactEmailRequest): string {
  const { name, email, subject, message, phone, isResend } = data;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="padding: 20px;">
        <h2>${isResend ? "[RESENT] " : ""}New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f8f8f8; padding: 15px; border-left: 4px solid #2c5282; margin: 10px 0;">
          <p style="margin: 0;">${message}</p>
        </div>
      </div>
    </div>
  `;
}

// Generate booking confirmation email for client
export function getBookingUserEmailTemplate(data: BookingEmailRequest): string {
  const { clientName, referenceId, services, date, timeSlot, timeframe, isResend, packageName } = data;
  
  console.log("Formatting booking email with date:", date);
  
  // Determine if this is a holistic package (which uses timeframe instead of date/time)
  const isHolisticPackage = !date && timeframe;
  
  // Generate service content based on whether it's a holistic package or not
  let serviceContent;
  if (isHolisticPackage && packageName) {
    // For holistic packages, just show the package name, not individual services
    serviceContent = `<p><strong>Package Selected:</strong> ${packageName}</p>`;
  } else {
    // For individual services, list them all
    const servicesList = services.map(service => {
      return `<li>${formatServiceName(service)}</li>`;
    }).join('');
    
    serviceContent = `
      <p><strong>Services Selected:</strong></p>
      <ul>
        ${servicesList}
      </ul>
    `;
  }

  // Generate the appropriate date/time or timeframe information
  const appointmentTimeInfo = isHolisticPackage 
    ? `<p><strong>Preferred Timeframe:</strong> ${formatTimeframe(timeframe || '')}</p>` 
    : `<p><strong>Appointment Date:</strong> ${formatDate(date)}<br>
       <strong>Time:</strong> ${formatTimeSlot(timeSlot || '')}</p>`;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f0f7ff; padding: 30px; text-align: center;">
        <h1 style="color: #2c5282; margin-bottom: 10px;">Booking Confirmation</h1>
        <p style="font-size: 18px; margin-top: 0;">Reference ID: ${referenceId}</p>
        ${isResend ? "<p style='font-weight: bold; color: #e53e3e;'>This is a resent copy of your booking confirmation.</p>" : ""}
      </div>
      <div style="padding: 30px;">
        <p>Dear ${clientName},</p>
        <p>Thank you for booking a consultation with Peace2Hearts. We have received your request and will contact you shortly to confirm your appointment details.</p>
        
        <h3>Booking Details:</h3>
        <div style="background-color: #f8f8f8; padding: 20px; margin: 20px 0;">
          ${serviceContent}
          ${appointmentTimeInfo}
        </div>
        
        <h3>What happens next?</h3>
        <ul>
          <li>Our team will review your booking details</li>
          <li>We'll send connection details for your video consultation 24 hours before your appointment</li>
          <li>Please join 5 minutes before your scheduled time</li>
        </ul>
        
        <p>If you need to reschedule or have any questions, please contact us at <a href="mailto:contact@peace2hearts.com">contact@peace2hearts.com</a> or call us at +91 7428564364.</p>
        
        <p>Best regards,<br>The Peace2Hearts Team</p>
      </div>
      <div style="background-color: #f0f7ff; padding: 20px; text-align: center; font-size: 14px; color: #4a5568;">
        <p>&copy; 2025 Peace2Hearts. All rights reserved.</p>
      </div>
    </div>
  `;
}

// Generate booking notification email for admin
export function getBookingAdminEmailTemplate(data: BookingEmailRequest): string {
  const { clientName, email, referenceId, services, date, timeSlot, timeframe, message, isResend, packageName } = data;
  
  // Determine if this is a holistic package
  const isHolisticPackage = !date && timeframe;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="padding: 20px;">
        <h2>${isResend ? "[RESENT] " : ""}New Consultation Booking</h2>
        <p><strong>Reference ID:</strong> ${referenceId}</p>
        <p><strong>Client:</strong> ${clientName}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${isHolisticPackage && packageName 
          ? `<p><strong>Package Selected:</strong> ${packageName}</p>` 
          : `<p><strong>Services Requested:</strong></p>
            <ul>${services.map(s => `<li>${formatServiceName(s)}</li>`).join('')}</ul>`
        }
        ${isHolisticPackage 
          ? `<p><strong>Preferred Timeframe:</strong> ${formatTimeframe(timeframe || '')}</p>` 
          : `<p><strong>Appointment Date:</strong> ${formatDate(date)}</p>
             <p><strong>Time:</strong> ${formatTimeSlot(timeSlot || '')}</p>`}
        ${message ? `<p><strong>Client Message:</strong> ${message}</p>` : ''}
      </div>
    </div>
  `;
}
