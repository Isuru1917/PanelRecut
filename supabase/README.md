# Supabase Setup Instructions

## Database Setup

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/xcafgsgwsawigehjinxl

2. Navigate to the SQL Editor in your Supabase dashboard

3. Copy and paste the contents of `supabase/setup.sql` into the SQL Editor

4. Execute the SQL script to create the necessary tables and sample data

## Configuration

Your Supabase client is already configured in `src/integrations/supabase/client.ts` with:
- Project URL: https://xcafgsgwsawigehjinxl.supabase.co
- API Key: Already set (the anon public key)

## Tables Created

### `damage_requests`
- Stores all panel recut requests
- Fields: id, glider_name, order_number, reason, panels (JSON), status, notes, timestamps

### `email_settings`
- Stores email configuration for notifications
- Fields: id, recipients (JSON), cc_recipients (JSON), notifications (JSON), timestamps
- Only one record is maintained (latest settings are used)

## Email Settings Feature

The application now includes a settings modal where you can:
- Add/remove primary email recipients
- Add/remove CC recipients  
- Configure notification preferences (new requests, status updates, completions)
- All settings are automatically saved to Supabase

### How Email Settings Work:
1. Click the Settings gear icon in the top-right corner
2. Add email addresses for primary recipients and CC recipients
3. Toggle notification preferences on/off
4. Click "Save Settings" - data is automatically saved to Supabase
5. Settings are loaded from the database when the app starts

### Email Settings Storage:
- Settings are stored in the `email_settings` table
- The app maintains only the latest settings record
- If database save fails, settings are kept locally as fallback

## Security

The tables have Row Level Security (RLS) enabled with policies that allow:
- Authenticated users: Full access
- You can modify the policies in the SQL script based on your security requirements

## Sample Data

The setup script includes sample damage requests to test the application.

## Testing

After running the SQL setup:
1. Start your development server: `bun dev`
2. Try submitting a new panel recut request
3. Check your Supabase dashboard to see the data being saved
4. Test status updates and deletions

## Troubleshooting

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Supabase project URL and API key
3. Ensure the SQL script ran successfully in your Supabase dashboard
4. Check the Network tab in browser dev tools for API calls
