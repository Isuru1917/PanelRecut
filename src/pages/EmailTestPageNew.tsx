import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, MailCheck, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

const EmailTestPage: React.FC = () => {
  const { toast } = useToast();
  const [provider, setProvider] = useState<'gmail' | 'outlook'>('gmail');
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // Credentials
  const [gmailUser, setGmailUser] = useState('');
  const [gmailAppPassword, setGmailAppPassword] = useState('');
  const [outlookUser, setOutlookUser] = useState('');
  const [outlookAppPassword, setOutlookAppPassword] = useState('');
  
  // Email details
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('Test Email from Panel Recut App');
  const [emailBody, setEmailBody] = useState('This is a test email sent from the Panel Recut Management System.');
  
  // Load stored credentials
  useEffect(() => {
    const savedGmailUser = localStorage.getItem('gmail_user') || '';
    const savedOutlookUser = localStorage.getItem('outlook_user') || '';
    
    setGmailUser(savedGmailUser);
    setOutlookUser(savedOutlookUser);
    
    // Don't load passwords automatically for security, but check if they exist
    const hasGmailPassword = !!localStorage.getItem('gmail_app_password');
    const hasOutlookPassword = !!localStorage.getItem('outlook_app_password');
    
    if (hasGmailPassword) {
      setGmailAppPassword('********');
    }
    
    if (hasOutlookPassword) {
      setOutlookAppPassword('********');
    }
    
    // Set default provider based on what's configured
    const savedProvider = localStorage.getItem('email_provider');
    if (savedProvider === 'gmail' || savedProvider === 'outlook') {
      setProvider(savedProvider);
    }
  }, []);
  
  // Test connection to email server
  const testConnection = async () => {
    try {
      setLoading(true);
      setTestResult(null);
      
      const response = await fetch('http://localhost:3001/health');
      
      if (!response.ok) {
        throw new Error(`Email server is not responding (${response.status})`);
      }
      
      const data = await response.json();
      
      if (data.status === 'OK') {
        setTestResult({
          success: true,
          message: 'Email server is running and responding correctly.'
        });
        
        toast({
          title: 'Connection Successful',
          description: 'Email server is running and healthy.',
        });
      } else {
        throw new Error('Email server returned an unexpected response');
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Failed to connect to email server: ${error.message || 'Unknown error'}`
      });
      
      toast({
        title: 'Connection Failed',
        description: 'Could not connect to the email server. Make sure it\'s running.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Send a test email
  const sendTestEmail = async () => {
    if (!recipient) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a recipient email address.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setLoading(true);
      setTestResult(null);
      
      let endpoint = '';
      let payload: any = {};
      
      if (provider === 'gmail') {
        // Get actual password if user hasn't changed it
        const actualPassword = gmailAppPassword === '********' 
          ? localStorage.getItem('gmail_app_password') 
          : gmailAppPassword;
          
        if (!gmailUser || !actualPassword) {
          throw new Error('Gmail credentials are not properly configured');
        }
        
        endpoint = 'http://localhost:3001/api/send-email';
        payload = {
          gmail: {
            user: gmailUser,
            appPassword: actualPassword
          },
          email: {
            from: gmailUser,
            to: [recipient],
            subject,
            html: `<p>${emailBody}</p>`,
            text: emailBody
          }
        };
      } else {
        // Get actual password if user hasn't changed it
        const actualPassword = outlookAppPassword === '********' 
          ? localStorage.getItem('outlook_app_password') 
          : outlookAppPassword;
          
        if (!outlookUser || !actualPassword) {
          throw new Error('Outlook credentials are not properly configured');
        }
        
        endpoint = 'http://localhost:3001/api/send-outlook-email';
        payload = {
          outlook: {
            user: outlookUser,
            appPassword: actualPassword
          },
          email: {
            from: outlookUser,
            to: [recipient],
            subject,
            html: `<p>${emailBody}</p>`,
            text: emailBody
          }
        };
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Email API responded with status: ${response.status} - ${errorData}`);
      }
      
      const data = await response.json();
      
      setTestResult({
        success: true,
        message: `Email sent successfully via ${provider.toUpperCase()}! Message ID: ${data.messageId}`
      });
      
      toast({
        title: 'Email Sent',
        description: `Test email was sent successfully via ${provider.toUpperCase()}`,
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: `Failed to send email: ${error.message || 'Unknown error'}`
      });
      
      toast({
        title: 'Email Failed',
        description: `Could not send email: ${error.message || 'Unknown error'}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Save credentials
  const saveCredentials = () => {
    try {
      if (provider === 'gmail' && gmailUser) {
        localStorage.setItem('gmail_user', gmailUser);
        
        if (gmailAppPassword && gmailAppPassword !== '********') {
          localStorage.setItem('gmail_app_password', gmailAppPassword);
        }
        
        localStorage.setItem('email_provider', 'gmail');
      } else if (provider === 'outlook' && outlookUser) {
        localStorage.setItem('outlook_user', outlookUser);
        
        if (outlookAppPassword && outlookAppPassword !== '********') {
          localStorage.setItem('outlook_app_password', outlookAppPassword);
        }
        
        localStorage.setItem('email_provider', 'outlook');
      }
      
      toast({
        title: 'Credentials Saved',
        description: `${provider.toUpperCase()} credentials have been saved.`,
      });
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: 'Failed to save credentials to local storage.',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <Mail className="mr-2" /> Email Configuration Test
      </h1>
      
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Email Server Connection</CardTitle>
            <CardDescription>
              Test the connection to the email server running on localhost:3001
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                The email server should be running at http://localhost:3001
              </p>
              <Button 
                onClick={testConnection}
                disabled={loading}
                variant="outline"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>Test Connection</>
                )}
              </Button>
            </div>
            
            {testResult && (
              <Alert className={`mt-4 ${testResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <AlertTitle>{testResult.success ? 'Success' : 'Error'}</AlertTitle>
                <AlertDescription>
                  {testResult.message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={provider} onValueChange={(v) => setProvider(v as 'gmail' | 'outlook')}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="gmail">Gmail SMTP</TabsTrigger>
          <TabsTrigger value="outlook">Outlook SMTP</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gmail">
          <Card>
            <CardHeader>
              <CardTitle>Gmail SMTP Configuration</CardTitle>
              <CardDescription>
                Test sending emails using Gmail SMTP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gmailUser">Gmail Address</Label>
                <Input 
                  id="gmailUser"
                  value={gmailUser}
                  onChange={(e) => setGmailUser(e.target.value)}
                  placeholder="your.email@gmail.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gmailAppPassword">App Password</Label>
                <Input 
                  id="gmailAppPassword"
                  type="password"
                  value={gmailAppPassword}
                  onChange={(e) => setGmailAppPassword(e.target.value)}
                  placeholder="16-character app password"
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={saveCredentials}
                  variant="secondary"
                  className="w-full"
                >
                  Save Gmail Credentials
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="outlook">
          <Card>
            <CardHeader>
              <CardTitle>Outlook SMTP Configuration</CardTitle>
              <CardDescription>
                Test sending emails using Outlook SMTP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="outlookUser">Outlook Email Address</Label>
                <Input 
                  id="outlookUser"
                  value={outlookUser}
                  onChange={(e) => setOutlookUser(e.target.value)}
                  placeholder="your.email@outlook.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="outlookAppPassword">App Password</Label>
                <Input 
                  id="outlookAppPassword"
                  type="password"
                  value={outlookAppPassword}
                  onChange={(e) => setOutlookAppPassword(e.target.value)}
                  placeholder="App password from Microsoft account"
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={saveCredentials}
                  variant="secondary"
                  className="w-full"
                >
                  Save Outlook Credentials
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Send Test Email</CardTitle>
          <CardDescription>
            Send a test email using the selected provider
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider">Email Provider</Label>
            <Select value={provider} onValueChange={(v) => setProvider(v as 'gmail' | 'outlook')}>
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gmail">Gmail SMTP</SelectItem>
                <SelectItem value="outlook">Outlook SMTP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Email</Label>
            <Input 
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="recipient@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Test Email Subject"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="body">Email Body</Label>
            <Textarea 
              id="body"
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              placeholder="Enter email content here..."
              rows={5}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={sendTestEmail}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <MailCheck className="mr-2 h-4 w-4" />
                Send Test Email via {provider.toUpperCase()}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailTestPage;