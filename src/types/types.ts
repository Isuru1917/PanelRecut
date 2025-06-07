export interface PanelInfo {
  panelType: string;
  panelNumber: string;
  material: string;
  quantity: number;
  side: 'Left Side' | 'Right Side' | 'Left & Right Side';
}

export interface DamageRequest {
  id: string;
  gliderName: string;
  orderNumber: string;
  reason: string;
  requestedBy: string;
  panels: PanelInfo[];
  status: 'Pending' | 'In Progress' | 'Done';
  submittedAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface EmailSettings {
  recipients: string[];
  ccRecipients: string[];
  notifications: {
    newRequest: boolean;
    statusUpdate: boolean;
    completion: boolean;
  };
}
