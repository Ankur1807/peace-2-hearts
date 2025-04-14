
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Consultant, getConsultantById } from "@/utils/consultants";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Clock, Award, FileText, Phone, Mail } from "lucide-react";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ConsultantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    
    const fetchConsultant = async () => {
      try {
        setLoading(true);
        const data = await getConsultantById(id);
        setConsultant(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load consultant details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConsultant();
  }, [id, toast]);

  if (loading) {
    return (
      <>
        <GoogleAnalytics />
        <SEO 
          title="Loading Consultant Details - Peace2Hearts"
          description="Loading consultant information"
        />
        <Navigation />
        <main className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <p>Loading consultant details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!consultant) {
    return (
      <>
        <GoogleAnalytics />
        <SEO 
          title="Consultant Not Found - Peace2Hearts"
          description="The requested consultant could not be found"
        />
        <Navigation />
        <main className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Consultant Not Found</h1>
            <p className="mb-6">The consultant you're looking for could not be found.</p>
            <Link to="/services">
              <Button>Browse Our Services</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Generate consultant initials for avatar fallback
  const getInitials = () => {
    if (!consultant.name) return "CN";
    return consultant.name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format specialization for better display
  const formatSpecialization = (specialization: string): string => {
    return specialization
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <>
      <GoogleAnalytics />
      <SEO 
        title={`${consultant.name || 'Consultant'} - Peace2Hearts`}
        description={`Learn about ${consultant.name || 'our consultant'} specializing in ${formatSpecialization(consultant.specialization)} at Peace2Hearts.`}
      />
      <Navigation />
      <main className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumbs */}
            <div className="text-sm breadcrumbs mb-6">
              <ul className="flex items-center space-x-2">
                <li><Link to="/" className="text-gray-500 hover:text-primary">Home</Link></li>
                <li className="text-gray-500">/</li>
                <li><Link to="/consultants" className="text-gray-500 hover:text-primary">Consultants</Link></li>
                <li className="text-gray-500">/</li>
                <li className="text-primary">{consultant.name || "Consultant Profile"}</li>
              </ul>
            </div>
            
            {/* Hero section */}
            <Card className="mb-8 overflow-hidden border-none shadow-lg">
              <div className="bg-gradient-to-r from-peacefulBlue to-softGreen h-40"></div>
              <div className="px-6 md:px-10 pb-8">
                <div className="flex flex-col md:flex-row gap-6 -mt-16">
                  <Avatar className="h-32 w-32 border-4 border-white bg-white shadow-lg">
                    {consultant.profile_picture_url ? (
                      <AvatarImage src={consultant.profile_picture_url} alt={consultant.name || "Consultant"} />
                    ) : (
                      <AvatarFallback className="text-3xl bg-primary/10">{getInitials()}</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="pt-4 md:pt-0">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 font-lora">{consultant.name || "Consultant"}</h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="text-sm px-3 py-1">
                        {formatSpecialization(consultant.specialization)}
                      </Badge>
                      {consultant.experience && consultant.experience > 0 ? (
                        <Badge variant="outline" className="text-sm px-3 py-1">
                          {consultant.experience} Years Experience
                        </Badge>
                      ) : null}
                      {consultant.is_available ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-sm px-3 py-1">
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 text-sm px-3 py-1">
                          Currently Unavailable
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {consultant.bio || "This consultant specializes in providing expert guidance and support tailored to your needs."}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary/70" />
                        <span>Virtual Consultations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary/70" />
                        <span>{consultant.available_days?.join(", ") || "Flexible schedule"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tabs Section */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="expertise">Expertise</TabsTrigger>
                <TabsTrigger value="booking">Book</TabsTrigger>
              </TabsList>
              
              {/* About Tab */}
              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                    <CardDescription>Professional background and information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Bio</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {consultant.bio || 
                          "This consultant brings a wealth of experience and expertise to help clients navigate complex situations. With a commitment to providing compassionate and effective guidance, they work diligently to help you find peace in your personal relationships and legal matters."}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Qualifications</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {consultant.qualifications || 
                          "Our consultant holds relevant qualifications and certifications in their field, ensuring they can provide professional, knowledgeable guidance tailored to your specific needs."}
                      </p>
                    </div>
                    
                    {consultant.experience && consultant.experience > 0 ? (
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-primary" />
                        <span className="text-gray-700 font-medium">{consultant.experience} years of professional experience</span>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Availability</CardTitle>
                    <CardDescription>When you can book a consultation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Available Days</p>
                        <p className="text-gray-600">{consultant.available_days?.join(", ") || "Contact for availability details"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Typical Hours</p>
                        <p className="text-gray-600">9:00 AM - 5:00 PM</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Expertise Tab */}
              <TabsContent value="expertise" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Areas of Expertise</CardTitle>
                    <CardDescription>Specialized knowledge and skills</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">{formatSpecialization(consultant.specialization)}</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {consultant.specialization === 'legal' ? 
                          "Providing expert legal guidance on matters related to relationships, marriage, and family law. Specialized in helping clients understand their legal rights and options during challenging times." :
                          consultant.specialization === 'mental_health' ?
                          "Offering professional mental health support focused on relationship dynamics, personal growth, and emotional wellbeing. Specialized in providing strategies for healing and moving forward." :
                          "Delivering specialized consultation services to help clients navigate complex personal challenges with expert guidance and support."}
                      </p>
                      
                      <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                        <h4 className="font-medium mb-2">What to expect during consultations:</h4>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                          {consultant.specialization === 'legal' ? (
                            <>
                              <li>Comprehensive assessment of your legal situation</li>
                              <li>Clear explanation of your legal rights and options</li>
                              <li>Strategic guidance on possible next steps</li>
                              <li>Answers to your specific legal questions</li>
                              <li>Documentation review and analysis when applicable</li>
                            </>
                          ) : consultant.specialization === 'mental_health' ? (
                            <>
                              <li>Supportive space to discuss your concerns</li>
                              <li>Assessment of your emotional wellbeing</li>
                              <li>Practical coping strategies and tools</li>
                              <li>Personalized guidance for your situation</li>
                              <li>Ongoing support for your emotional journey</li>
                            </>
                          ) : (
                            <>
                              <li>Professional assessment of your situation</li>
                              <li>Tailored advice based on your specific needs</li>
                              <li>Practical strategies for moving forward</li>
                              <li>Answers to your most pressing questions</li>
                              <li>Follow-up recommendations when needed</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Resources</CardTitle>
                    <CardDescription>Supporting materials and information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="h-5 w-5 text-primary" />
                      <Link to="/resources" className="text-primary hover:underline">
                        Visit our resources section
                      </Link>
                    </div>
                    <p className="text-gray-600">
                      Peace2Hearts offers a variety of resources related to mental health, 
                      legal support, and relationship guidance to complement your consultation.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Booking Tab */}
              <TabsContent value="booking" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Consultation Details</CardTitle>
                    <CardDescription>Information about booking a session</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-primary/5 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Pricing</h3>
                        <div className="flex items-baseline mb-2">
                          <span className="text-3xl font-bold">₹{consultant.hourly_rate}</span>
                          <span className="text-gray-600 ml-2">/ hour</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                          Professional consultation with personalized guidance
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            Virtual consultation
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            Expert guidance
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            Follow-up recommendations
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            Confidential session
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-primary/70" />
                            <div>
                              <p className="font-medium">Phone</p>
                              <p className="text-gray-600">Contact through our booking system</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-primary/70" />
                            <div>
                              <p className="font-medium">Email</p>
                              <p className="text-gray-600">info@peace2hearts.com</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="text-center">
                  <Link to={`/book-consultation?consultant=${consultant.id}`}>
                    <Button size="lg" className="px-8">
                      Book a Consultation
                    </Button>
                  </Link>
                  <p className="text-gray-500 text-sm mt-2">
                    Book now or contact us for more information
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ConsultantDetail;
