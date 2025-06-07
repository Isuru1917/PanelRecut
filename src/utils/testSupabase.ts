import { supabase } from '@/integrations/supabase/client';

export const testSupabaseConnection = async () => {
  console.log('Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('email_settings')
      .select('count', { count: 'exact', head: true });
    
    if (testError) {
      console.error('Supabase connection test failed:', testError);
      return false;
    }
    
    console.log('Supabase connection successful. Email settings count:', testData);
    
    // Test actual data retrieval
    const { data: allData, error: dataError } = await supabase
      .from('email_settings')
      .select('*');
    
    if (dataError) {
      console.error('Failed to fetch email settings data:', dataError);
      return false;
    }
    
    console.log('All email settings in database:', allData);
    return true;
    
  } catch (error) {
    console.error('Unexpected error testing Supabase:', error);
    return false;
  }
};
