import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  CheckCircle, 
  Settings, 
  Webhook, 
  CreditCard, 
  Mail, 
  Database,
  TestTube,
  FileText,
  Clock
} from 'lucide-react';

const TestDashboard = () => {
  const testSuites = [
    {
      title: "End-to-End Booking Test",
      description: "Comprehensive test of the complete booking flow after webhook hotfix",
      path: "/end-to-end-booking-test",
      icon: <TestTube className="h-5 w-5" />,
      priority: "high",
      status: "recommended",
      features: [
        "Schema compatibility verification",
        "Payment processing simulation", 
        "Consultation record creation",
        "Email trigger logic",
        "Backward compatibility",
        "Failed payment handling"
      ]
    },
    {
      title: "Quick Webhook Test",
      description: "Fast test to verify webhook hotfix schema compatibility",
      path: "/quick-webhook-test",
      icon: <Webhook className="h-5 w-5" />,
      priority: "high",
      status: "quick",
      features: [
        "Database schema validation",
        "Column mapping verification",
        "CRUD operations test",
        "Data cleanup"
      ]
    },
    {
      title: "Webhook Integration Test",
      description: "Comprehensive webhook and API endpoint testing",
      path: "/webhook-integration-test",
      icon: <Settings className="h-5 w-5" />,
      priority: "medium",
      status: "detailed",
      features: [
        "Payment status endpoint",
        "Reconcile payment endpoint",
        "Manual verification test",
        "Health checks"
      ]
    },
    {
      title: "Manual Payment Test",
      description: "Manual testing interface for payment operations",
      path: "/manual-payment-test",
      icon: <CreditCard className="h-5 w-5" />,
      priority: "low",
      status: "manual",
      features: [
        "Payment creation",
        "Status updates",
        "Manual verification",
        "Debug tools"
      ]
    },
    {
      title: "Edge Function Test",
      description: "Direct testing of Supabase edge functions",
      path: "/edge-function-test",
      icon: <Database className="h-5 w-5" />,
      priority: "medium",
      status: "technical",
      features: [
        "Function invocation",
        "Response validation",
        "Error handling",
        "Performance metrics"
      ]
    },
    {
      title: "Test Simulation",
      description: "Simulated booking scenarios and edge cases",
      path: "/test-simulation",
      icon: <Play className="h-5 w-5" />,
      priority: "low",
      status: "simulation",
      features: [
        "Booking flow simulation",
        "Edge case testing",
        "Error scenarios",
        "Recovery testing"
      ]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'recommended': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'quick': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'detailed': return <FileText className="h-4 w-4 text-purple-600" />;
      case 'manual': return <Settings className="h-4 w-4 text-orange-600" />;
      case 'technical': return <Database className="h-4 w-4 text-indigo-600" />;
      case 'simulation': return <Play className="h-4 w-4 text-gray-600" />;
      default: return <TestTube className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Peace2Hearts QA Test Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Comprehensive testing suite for the webhook-first Razorpay integration after the schema hotfix.
            Use these tools to validate the booking flow, payment processing, and email functionality.
          </p>
        </div>

        {/* Test Status Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Hotfix Status
            </CardTitle>
            <CardDescription>
              Critical webhook schema mismatch has been resolved
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-800 mb-1">✅ Fixed</h3>
                <ul className="text-green-700 space-y-1">
                  <li>• Consultation table uses payment_id/order_id</li>
                  <li>• Webhook processing updated</li>
                  <li>• Email triggers work correctly</li>
                  <li>• Backward compatibility maintained</li>
                </ul>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-1">🧪 Ready to Test</h3>
                <ul className="text-blue-700 space-y-1">
                  <li>• Payment record creation</li>
                  <li>• Consultation upsert logic</li>
                  <li>• Email deduplication</li>
                  <li>• Failed payment handling</li>
                </ul>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="font-medium text-yellow-800 mb-1">⚠️ Limitations</h3>
                <ul className="text-yellow-700 space-y-1">
                  <li>• Can't test real webhooks</li>
                  <li>• Email sending needs config</li>
                  <li>• Razorpay in test mode only</li>
                  <li>• Frontend flow needs manual test</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Suites Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {testSuites.map((suite, index) => (
            <Card key={index} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {suite.icon}
                    <CardTitle className="text-lg">{suite.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(suite.status)}
                    <Badge 
                      variant="secondary"
                      className={getPriorityColor(suite.priority)}
                    >
                      {suite.priority}
                    </Badge>
                  </div>
                </div>
                <CardDescription>{suite.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-sm">Test Coverage:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {suite.features.map((feature, idx) => (
                      <li key={idx}>• {feature}</li>
                    ))}
                  </ul>
                </div>
                <Button asChild className="w-full">
                  <Link to={suite.path}>
                    Run {suite.title}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommended Testing Flow */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recommended Testing Flow
            </CardTitle>
            <CardDescription>
              Follow this sequence for comprehensive validation of the webhook hotfix
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                <Badge className="bg-blue-600">1</Badge>
                <div>
                  <div className="font-medium">Start with Quick Webhook Test</div>
                  <div className="text-sm text-muted-foreground">
                    Fast validation of schema compatibility and basic operations
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/quick-webhook-test">Run Quick Test</Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                <Badge className="bg-green-600">2</Badge>
                <div>
                  <div className="font-medium">Run End-to-End Booking Test</div>
                  <div className="text-sm text-muted-foreground">
                    Comprehensive test of the complete booking and payment flow
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/end-to-end-booking-test">Run E2E Test</Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                <Badge className="bg-purple-600">3</Badge>
                <div>
                  <div className="font-medium">Validate API Endpoints</div>
                  <div className="text-sm text-muted-foreground">
                    Test payment-status and reconcile-payment endpoints
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/webhook-integration-test">Test APIs</Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
                <Badge className="bg-orange-600">4</Badge>
                <div>
                  <div className="font-medium">Manual Frontend Testing</div>
                  <div className="text-sm text-muted-foreground">
                    Test actual booking form with Razorpay test mode
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to="/book-consultation">Go to Booking</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestDashboard;