import React, { useState, useEffect } from 'react';
import { X, Mail, Key, CheckCircle, AlertCircle } from 'lucide-react';

interface EmailConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type EmailProvider = 'gmail' | 'outlook';

const EmailConfigModal: React.FC<EmailConfigModalProps> = ({ isOpen, onClose }) => {
  const [emailProvider, setEmailProvider] = useState<EmailProvider>('gmail');
  const [gmailUser, setGmailUser] = useState('');
  const [gmailAppPassword, setGmailAppPassword] = useState('');
  const [outlookUser, setOutlookUser] = useState('');
  const [outlookAppPassword, setOutlookAppPassword] = useState('');
  // Load existing settings when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedProvider = localStorage.getItem('email_provider') as EmailProvider;
      if (savedProvider && (savedProvider === 'gmail' || savedProvider === 'outlook')) {
        setEmailProvider(savedProvider);
      }
      
      setGmailUser(localStorage.getItem('gmail_user') || '');
      setGmailAppPassword(localStorage.getItem('gmail_app_password') || '');
      setOutlookUser(localStorage.getItem('outlook_user') || '');
      setOutlookAppPassword(localStorage.getItem('outlook_app_password') || '');
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('email_provider', emailProvider);
    
    if (emailProvider === 'gmail') {
      localStorage.setItem('gmail_user', gmailUser);
      localStorage.setItem('gmail_app_password', gmailAppPassword);
    } else {
      localStorage.setItem('outlook_user', outlookUser);
      localStorage.setItem('outlook_app_password', outlookAppPassword);
    }
    
    onClose();
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Email Configuration</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Provider Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Choose Email Provider</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setEmailProvider('gmail')}
              className={`p-4 rounded-lg border-2 transition-all ${
                emailProvider === 'gmail'
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">Gmail SMTP</div>
                  <div className="text-sm opacity-70">Use your Gmail account</div>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => setEmailProvider('outlook')}
              className={`p-4 rounded-lg border-2 transition-all ${
                emailProvider === 'outlook'
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">Outlook SMTP</div>
                  <div className="text-sm opacity-70">Use your Outlook account</div>
                </div>
              </div>
            </button>
          </div>
        </div>        {/* Gmail Instructions */}
        {emailProvider === 'gmail' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <Mail className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Gmail SMTP Setup</h3>
            </div>
            <div className="space-y-3 text-blue-800">
              <p><strong>✅ Perfect! You've already generated your App Password.</strong></p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Enter your Gmail address below</li>
                <li>Enter the 16-character App Password you generated</li>
                <li>Test by submitting a panel recut request</li>
              </ol>
            </div>
          </div>
        )}

        {/* Outlook Instructions */}
        {emailProvider === 'outlook' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <Mail className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-semibold text-orange-900">Outlook SMTP Setup</h3>
            </div>
            <div className="space-y-3 text-orange-800">
              <p><strong>🔧 Follow these steps to generate your App Password:</strong></p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Go to <strong>Security settings</strong> at account.microsoft.com</li>
                <li>Enable <strong>Two-factor authentication</strong> if not already enabled</li>
                <li>Go to <strong>App passwords</strong> and generate a new password</li>
                <li>Enter your Outlook email and the generated App Password below</li>
                <li>Test by submitting a panel recut request</li>
              </ol>
            </div>
          </div>
        )}        {/* Configuration Form */}
        <div className="space-y-6">
          {/* Gmail Configuration */}
          {emailProvider === 'gmail' && (
            <>
              {/* Gmail User */}
              <div>
                <label htmlFor="gmailUser" className="block text-sm font-medium text-slate-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-2" />
                  Gmail Address
                </label>
                <input
                  id="gmailUser"
                  type="email"
                  value={gmailUser}
                  onChange={(e) => setGmailUser(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="your.email@gmail.com"
                />
                <p className="text-xs text-slate-600 mt-1">
                  Your Gmail address that will send the notifications
                </p>
              </div>

              {/* Gmail App Password */}
              <div>
                <label htmlFor="gmailAppPassword" className="block text-sm font-medium text-slate-700 mb-2">
                  <Key className="inline w-4 h-4 mr-2" />
                  Gmail App Password
                </label>
                <input
                  id="gmailAppPassword"
                  type="password"
                  value={gmailAppPassword}
                  onChange={(e) => setGmailAppPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="xxxx xxxx xxxx xxxx (16 characters)"
                />
                <p className="text-xs text-slate-600 mt-1">
                  The 16-character App Password you generated in your Google Account settings
                </p>
              </div>
            </>
          )}

          {/* Outlook Configuration */}
          {emailProvider === 'outlook' && (
            <>
              {/* Outlook User */}
              <div>
                <label htmlFor="outlookUser" className="block text-sm font-medium text-slate-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-2" />
                  Outlook Email Address
                </label>
                <input
                  id="outlookUser"
                  type="email"
                  value={outlookUser}
                  onChange={(e) => setOutlookUser(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  placeholder="your.email@outlook.com"
                />
                <p className="text-xs text-slate-600 mt-1">
                  Your Outlook/Hotmail email address that will send the notifications
                </p>
              </div>

              {/* Outlook App Password */}
              <div>
                <label htmlFor="outlookAppPassword" className="block text-sm font-medium text-slate-700 mb-2">
                  <Key className="inline w-4 h-4 mr-2" />
                  Outlook App Password
                </label>
                <input
                  id="outlookAppPassword"
                  type="password"
                  value={outlookAppPassword}
                  onChange={(e) => setOutlookAppPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  placeholder="xxxx xxxx xxxx xxxx (16 characters)"
                />
                <p className="text-xs text-slate-600 mt-1">
                  The 16-character App Password you generated in your Microsoft Account settings
                </p>
              </div>
            </>
          )}          {/* Current Status */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">Current Configuration Status</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-700 font-medium">
                  Active Provider: {emailProvider === 'gmail' ? 'Gmail SMTP' : 'Outlook SMTP'}
                </span>
              </div>
              
              {emailProvider === 'gmail' && (
                <>
                  <div className="flex items-center space-x-2">
                    {gmailUser ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm text-slate-700">
                      Gmail: {gmailUser || 'Not configured'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {gmailAppPassword ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm text-slate-700">
                      App Password: {gmailAppPassword ? 'Configured' : 'Not configured'}
                    </span>
                  </div>
                </>
              )}
              
              {emailProvider === 'outlook' && (
                <>
                  <div className="flex items-center space-x-2">
                    {outlookUser ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm text-slate-700">
                      Outlook: {outlookUser || 'Not configured'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {outlookAppPassword ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm text-slate-700">
                      App Password: {outlookAppPassword ? 'Configured' : 'Not configured'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-slate-700 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <div className="space-x-3">            <button
              onClick={() => {
                if (emailProvider === 'gmail') {
                  setGmailUser('');
                  setGmailAppPassword('');
                } else {
                  setOutlookUser('');
                  setOutlookAppPassword('');
                }
              }}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfigModal;
