
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { SEO } from '@/components/SEO';
import { sendContactEmail } from '@/utils/emailService';
// Removed GoogleAnalytics import as it's now in App.tsx

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('Form data submitted:', formData);
      
      // Send email using our email service
      const emailSent = await sendContactEmail(formData);
      
      if (emailSent) {
        toast({
          title: "Message Received",
          description: "Thank you for contacting us. We'll get back to you soon.",
        });
        
        // Reset the form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error: any) {
      console.error('Contact form submission error:', error);
      
      toast({
        title: "Message Failed",
        description: "There was a problem sending your message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      {/* Removed GoogleAnalytics component */}
      <SEO 
        title="Contact Us"
        description="Reach out to Peace2Hearts for relationship counseling, legal consultation, or general inquiries. Our team is here to help you find peace in your relationships."
        keywords="contact Peace2Hearts, relationship counseling contact, legal consultation contact, relationship support"
      />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-16 wave-pattern">
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-lora font-bold text-gray-800 mb-6">Contact Us</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Have questions or ready to start your journey? Our team is here to help. Reach out to us today.
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="bg-peacefulBlue/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-7 w-7 text-peacefulBlue" />
              </div>
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">Call Us</h3>
              <p className="text-gray-600 mb-2">+91 7428564364</p>
              <p className="text-gray-500 text-sm">Monday-Friday: 9am-5pm</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="bg-peacefulBlue/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-7 w-7 text-peacefulBlue" />
              </div>
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">Email Us</h3>
              <p className="text-gray-600 mb-2">contact@peace2hearts.com</p>
              <p className="text-gray-500 text-sm">We typically respond within 24 hours</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="bg-peacefulBlue/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-7 w-7 text-peacefulBlue" />
              </div>
              <h3 className="text-xl font-lora font-semibold text-gray-800 mb-3">Visit Us</h3>
              <p className="text-gray-600 mb-2">134 N Block, Main Road, Mohan Nagar,</p>
              <p className="text-gray-600">Bhondsi, Gurgaon – 122102</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-peacefulBlue/50"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-peacefulBlue/50"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-peacefulBlue/50"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-peacefulBlue/50"
                  >
                    <option value="">Select a subject</option>
                    <option value="Mental Health Services">Mental Health Services</option>
                    <option value="Legal Support">Legal Support</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Feedback">Feedback</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    rows={5}
                    className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-peacefulBlue/50"
                  ></textarea>
                </div>
                
                <Button 
                  type="submit" 
                  className="bg-peacefulBlue hover:bg-peacefulBlue/90 text-white w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
            
            <div>
              <h2 className="text-2xl font-lora font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">How do I schedule a consultation?</h3>
                  <p className="text-gray-600">
                    You can schedule a consultation by clicking the "Book a Consultation" button at the top of our website, or by calling our office directly.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Are my consultations confidential?</h3>
                  <p className="text-gray-600">
                    Yes, all consultations and services at Peace2Hearts are strictly confidential. We adhere to professional ethics and privacy standards.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Do you offer virtual appointments?</h3>
                  <p className="text-gray-600">
                    Yes, we offer both in-person and virtual appointments to accommodate your schedule and preferences.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">How do I know which service is right for me?</h3>
                  <p className="text-gray-600">
                    Our initial consultation is designed to assess your needs and recommend the most appropriate services. We take a personalized approach to each client.
                  </p>
                </div>
                
                <div className="bg-peacefulBlue/10 p-6 rounded-xl">
                  <div className="flex items-start">
                    <MessageSquare className="h-5 w-5 text-peacefulBlue mt-1 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Still have questions?</h3>
                      <p className="text-gray-600 mb-4">
                        Our team is here to help. Contact us via phone, email, or the form on this page, and we'll get back to you as soon as possible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Contact;
