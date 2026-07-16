import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Company } from '../../lib/types';

export function useCompany() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { setLoading(false); return; }
      const { data: prof } = await supabase.from('profiles').select('role').eq('id', data.session.user.id).maybeSingle();
      if (prof?.role !== 'company') { setLoading(false); return; }
      const { data: co } = await supabase.from('companies').select('*').eq('owner_id', data.session.user.id).maybeSingle();
      setCompany(co as Company | null);
      setLoading(false);
    });
  }, []);

  return { company, loading, setCompany };
}
