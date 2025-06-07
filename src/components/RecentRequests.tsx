import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DamageRequest } from '../types/types';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

interface RecentRequestsProps {
  requests: DamageRequest[];
  onStatusUpdate: (id: string, status: DamageRequest['status']) => void;
  onDeleteRequest: (id: string) => void;
}

const RecentRequests: React.FC<RecentRequestsProps> = ({ requests, onStatusUpdate, onDeleteRequest }) => {
  const { toast } = useToast();

  const getStatusColor = (status: DamageRequest['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Done':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusChange = (id: string, newStatus: DamageRequest['status']) => {
    onStatusUpdate(id, newStatus);
    toast({
      title: "Status Updated",
      description: `Request status changed to ${newStatus}`,
    });
  };

  const handleDeleteRequest = (id: string) => {
    onDeleteRequest(id);
    toast({
      title: "Request Deleted",
      description: "The request has been removed",
      variant: "destructive",
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
          <span className="text-2xl text-slate-400">📋</span>
        </div>
        <p className="text-slate-500">No damage requests yet</p>
        <p className="text-sm text-slate-400 mt-1">Submitted requests will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      {requests.map((request) => (
        <div
          key={request.id}
          className="border border-slate-200 rounded-lg p-4 bg-gradient-to-r from-white to-slate-50 hover:shadow-md transition-all duration-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium text-slate-900">{request.gliderName}</h3>
                <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                  {request.status}
                </Badge>
              </div>
              
              <div className="text-sm text-slate-600 space-y-1">
                <p><span className="font-medium">Order Number:</span> {request.orderNumber}</p>
                <p><span className="font-medium">Requested by:</span> {request.requestedBy}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span>Submitted: {formatDate(request.submittedAt)}</span>
                {request.updatedAt.getTime() !== request.submittedAt.getTime() && (
                  <span>Updated: {formatDate(request.updatedAt)}</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:flex-col sm:min-w-[120px]">
              {request.status !== 'Done' && (
                <>
                  {request.status === 'Pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(request.id, 'In Progress')}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 transition-all duration-200 active:scale-95"
                    >
                      Start Work
                    </Button>
                  )}
                  {request.status === 'In Progress' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(request.id, 'Done')}
                      className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200 active:scale-95"
                    >
                      Complete
                    </Button>
                  )}
                </>
              )}
              
              {request.status === 'Done' && (
                <div className="flex items-center justify-center p-2 bg-green-50 rounded-md">
                  <span className="text-green-600 text-sm font-medium">✓ Completed</span>
                </div>
              )}
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteRequest(request.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200 active:scale-95 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentRequests;
