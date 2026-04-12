import { createClient } from '@supabase/supabase-js';
import { appConfig } from '../config';

const supabase = createClient(appConfig.supabaseUrl, appConfig.supabaseAnonKey);

export default supabase;
