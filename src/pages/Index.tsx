import React, { useState, useEffect } from 'react';
import { Settings, Mail } from 'lucide-react';
import DamageReportForm from '../components/DamageReportForm';
import RecentRequests from '../components/RecentRequests';
import SettingsModal from '../components/SettingsModal';
import EmailConfigModal from '../components/EmailConfigModal';
import AquaDynamicsLogo from '../components/ui/aqua-dynamics-logo';
import { DamageRequest, EmailSettings } from '../types/types';
import { damageRequestService } from '../services/damageRequestService';
import { emailSettingsService } from '../services/emailSettingsService';
import { useToast } from '@/hooks/use-toast';
import { testSupabaseConnection } from '../utils/testSupabase';

const Index = () => {
  const { toast } = useToast();  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEmailConfigOpen, setIsEmailConfigOpen] = useState(false);
  const [requests, setRequests] = useState<DamageRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    recipients: ['production@paragliderpro.com', 'quality@paragliderpro.com'],
    ccRecipients: ['manager@paragliderpro.com'],
    notifications: {
      newRequest: true,
      statusUpdate: true,
      completion: true
    }
  });
  // Load damage requests and email settings from Supabase on component mount
  useEffect(() => {
    testSupabaseConnection();
    loadDamageRequests();
    loadEmailSettings();
  }, []);
  const loadEmailSettings = async () => {
    try {
      console.log('Loading email settings from Supabase...');
      const settings = await emailSettingsService.getEmailSettings();
      console.log('Loaded email settings:', settings);
      if (settings) {
        setEmailSettings(settings);
        console.log('Email settings updated in state');
      } else {
        console.log('No email settings found, keeping defaults');
      }
    } catch (error) {
      console.error('Error loading email settings:', error);
      // Keep default settings if loading fails
    }
  };

  const loadDamageRequests = async () => {
    try {
      setIsLoading(true);
      const data = await damageRequestService.getDamageRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error loading damage requests:', error);
      toast({
        title: "Error",
        description: "Failed to load damage requests. Please check your Supabase configuration.",
        variant: "destructive",
      });
      // Fallback to sample data if Supabase fails
      setRequests([
        {
          id: '1',
          gliderName: 'Advance Alpha 7',
          orderNumber: 'ORD-2024-001',
          reason: 'Small tear near leading edge, approximately 3cm',
          panels: [
            {
              panelType: 'Top Surface',
              panelNumber: 'P-42',
              material: 'Dominico N20D',
              quantity: 1,
              side: 'Left Side'
            }
          ],
          status: 'In Progress',
          submittedAt: new Date('2024-06-01T10:30:00'),
          updatedAt: new Date('2024-06-01T14:15:00')
        },
        {
          id: '2',
          gliderName: 'Ozone Rush 5',
          orderNumber: 'ORD-2024-002',
          reason: 'UV damage causing discoloration and fabric weakening',
          panels: [
            {
              panelType: 'Bottom Surface',
              panelNumber: 'P-15',
              material: 'Porcher Skytex 27',
              quantity: 2,
              side: 'Left & Right Side'
            }
          ],
          status: 'Pending',
          submittedAt: new Date('2024-06-02T09:15:00'),
          updatedAt: new Date('2024-06-02T09:15:00')
        },
        {
          id: '3',
          gliderName: 'Gin Boomerang 12',
          orderNumber: 'ORD-2024-003',
          reason: 'Complete panel replacement needed after tree landing',
          panels: [
            {
              panelType: 'Stabilizer',
              panelNumber: 'P-8',
              material: 'Porcher Skytex 38',
              quantity: 1,
              side: 'Right Side'
            },
            {
              panelType: 'Leading Edge',
              panelNumber: 'P-3',
              material: 'Dokdo 40D',
              quantity: 1,
              side: 'Right Side'
            }
          ],
          status: 'Done',
          submittedAt: new Date('2024-05-30T16:45:00'),
          updatedAt: new Date('2024-06-01T11:20:00')
        }
      ]);    } finally {
      setIsLoading(false);
    }
  };

  const handleNewRequest = async (newRequest: Omit<DamageRequest, 'id' | 'submittedAt' | 'updatedAt'>) => {
    try {      // Save to Supabase
      const savedRequest = await damageRequestService.createDamageRequest({
        gliderName: newRequest.gliderName,
        orderNumber: newRequest.orderNumber,
        reason: newRequest.reason,
        requestedBy: newRequest.requestedBy,
        panels: newRequest.panels,
        notes: newRequest.notes,
        status: newRequest.status
      });

      // Update local state
      setRequests(prev => [savedRequest, ...prev]);
      
      toast({
        title: "Success",
        description: "Panel recut request has been saved successfully!",
      });

      console.log('New panel recut request submitted:', savedRequest);
      console.log('Email would be sent to:', emailSettings.recipients);
    } catch (error) {
      console.error('Error saving damage request:', error);
      toast({
        title: "Error",
        description: "Failed to save damage request. Please try again.",
        variant: "destructive",
      });
      
      // Fallback: still add to local state if save fails
      const request: DamageRequest = {
        ...newRequest,
        id: Date.now().toString(),
        submittedAt: new Date(),
        updatedAt: new Date()
      };
      setRequests(prev => [request, ...prev]);
    }
  };

  const handleStatusUpdate = async (id: string, status: DamageRequest['status']) => {
    try {
      await damageRequestService.updateDamageRequestStatus(id, status);
      
      setRequests(prev => prev.map(req => 
        req.id === id 
          ? { ...req, status, updatedAt: new Date() }
          : req
      ));
      
      toast({
        title: "Success",
        description: `Request status updated to ${status}`,
      });

      console.log(`Request ${id} status updated to:`, status);
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update request status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRequest = async (id: string) => {
    try {
      await damageRequestService.deleteDamageRequest(id);
      
      setRequests(prev => prev.filter(req => req.id !== id));
      
      toast({
        title: "Success",
        description: "Request has been deleted successfully.",
      });

      console.log(`Request ${id} has been deleted`);
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: "Error",
        description: "Failed to delete request.",
        variant: "destructive",
      });
    }
  };
  const handleSaveEmailSettings = async (settings: EmailSettings) => {
    try {
      console.log('Saving email settings from UI:', settings);
      
      await emailSettingsService.saveEmailSettings({
        recipients: settings.recipients,
        ccRecipients: settings.ccRecipients,
        notifications: settings.notifications
      });

      setEmailSettings(settings);
      
      toast({
        title: "Success",
        description: "Email settings have been saved to database successfully!",
      });

      console.log('Email settings saved to Supabase:', settings);
      
      // Reload settings to verify they were saved correctly
      setTimeout(() => {
        loadEmailSettings();
      }, 1000);
      
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast({
        title: "Error",
        description: "Failed to save email settings to database. Settings will be kept locally.",
        variant: "destructive",
      });
      
      // Still update local state even if save fails
      setEmailSettings(settings);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">          <div className="flex justify-between items-center h-16">            <div className="flex items-center space-x-4">
              <AquaDynamicsLogo size="md" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">Damage Recut Request</h1>
                <p className="text-sm text-slate-600">Aqua Dynamics</p>
              </div>
            </div>
              {/* Right side - Settings */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsEmailConfigOpen(true)}
                className="p-3 rounded-lg bg-green-100 hover:bg-green-200 transition-all duration-200 hover:shadow-md active:scale-95"
                aria-label="Email Configuration"
                title="Configure Email Notifications"
              >
                <Mail className="w-5 h-5 text-green-700" />
              </button>
              
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-3 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all duration-200 hover:shadow-md active:scale-95"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 text-slate-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">          {/* Left Column - Panel Recut Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <DamageReportForm onSubmit={handleNewRequest} />
            </div>
          </div>

          {/* Right Column - Recent Requests */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">Recent Requests</h2>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2 text-slate-600">Loading requests...</span>
                </div>
              ) : (
                <RecentRequests 
                  requests={requests} 
                  onStatusUpdate={handleStatusUpdate}
                  onDeleteRequest={handleDeleteRequest}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-600">
            © 2024 Aqua Dynamics. All rights reserved.
          </p>
        </div>
      </footer>      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={emailSettings}
        onSave={handleSaveEmailSettings}      />

      {/* Email Configuration Modal */}
      <EmailConfigModal
        isOpen={isEmailConfigOpen}
        onClose={() => setIsEmailConfigOpen(false)}
      />
    </div>
  );
};

export default Index;
