import React from 'react';
import { X, Mail, Shield, User, Settings } from 'lucide-react';

interface AuthGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthGuideModal: React.FC<AuthGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Welcome to Aqua Dynamics</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Authentication Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Secure Access</h3>
            </div>
            <p className="text-blue-800 mb-3">
              To get started, you'll need to create an account or sign in. This ensures your damage reports are secure and properly tracked.
            </p>
            <div className="bg-white rounded-md p-3 border border-blue-200">
              <h4 className="font-medium text-slate-900 mb-2">Quick Start:</h4>
              <ol className="text-sm text-slate-700 space-y-1 list-decimal list-inside">
                <li>Click the "Sign In" button in the top-right corner</li>
                <li>Choose "Create Account" if you're new</li>
                <li>Enter your email and create a password (minimum 6 characters)</li>
                <li>Start submitting damage recut requests!</li>
              </ol>
            </div>
          </div>

          {/* Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="w-5 h-5 text-slate-600" />
                <h4 className="font-medium text-slate-900">Damage Reports</h4>
              </div>
              <p className="text-sm text-slate-700">
                Submit detailed panel recut requests with glider information, panel details, and damage descriptions.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-5 h-5 text-slate-600" />
                <h4 className="font-medium text-slate-900">Request Tracking</h4>
              </div>
              <p className="text-sm text-slate-700">
                View your recent requests and track their status from pending to completion.
              </p>
            </div>
          </div>

          {/* Settings Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Settings className="w-5 h-5 text-yellow-600" />
              <h4 className="font-medium text-yellow-900">Admin Settings</h4>
            </div>
            <p className="text-sm text-yellow-800">
              The settings panel allows administrators to configure email recipients and notification preferences for damage reports.
            </p>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">🔒 Your Data is Secure</h4>
            <p className="text-sm text-green-800">
              All data is encrypted and stored securely. Your email is only used for authentication and will not be shared with third parties.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthGuideModal;
