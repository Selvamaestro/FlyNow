import { supabase, STORAGE_BUCKET } from './supabase';
import type { Category, Company, Coupon, NotificationItem, SavedCoupon } from './types';

export async function uploadFlyer(file: File): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) return { url: null, error: error.message };
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

export const couponService = {
  listApproved: async (): Promise<Coupon[]> => {
    const { data, error } = await supabase
      .from('coupons')
      .select('*, company:companies(id,name,logo_url), category:categories(id,name,slug,color,icon)')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Coupon[];
  },
  listByCompany: async (companyId: string): Promise<Coupon[]> => {
    const { data, error } = await supabase
      .from('coupons')
      .select('*, company:companies(id,name,logo_url), category:categories(id,name,slug,color,icon)')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Coupon[];
  },
  listAll: async (): Promise<Coupon[]> => {
    const { data, error } = await supabase
      .from('coupons')
      .select('*, company:companies(id,name,logo_url), category:categories(id,name,slug,color,icon)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Coupon[];
  },
  get: async (id: string): Promise<Coupon | null> => {
    const { data, error } = await supabase
      .from('coupons')
      .select('*, company:companies(id,name,logo_url,description,contact_email,phone,website), category:categories(id,name,slug,color,icon)')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data as Coupon | null;
  },
  create: async (payload: Omit<Coupon, 'id' | 'views' | 'created_at' | 'status' | 'company' | 'category'>) => {
    const { data, error } = await supabase.from('coupons').insert({ ...payload, status: 'pending' }).select().single();
    if (error) throw error;
    return data as Coupon;
  },
  update: async (id: string, patch: Partial<Coupon>) => {
    const { data, error } = await supabase.from('coupons').update(patch).eq('id', id).select().single();
    if (error) throw error;
    return data as Coupon;
  },
  remove: async (id: string) => {
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (error) throw error;
  },
  incrementViews: async (id: string) => {
    const { data } = await supabase.from('coupons').select('views').eq('id', id).maybeSingle();
    const next = (data?.views ?? 0) + 1;
    await supabase.from('coupons').update({ views: next }).eq('id', id);
  },
};

export const companyService = {
  listApproved: async (): Promise<Company[]> => {
    const { data, error } = await supabase.from('companies').select('*').eq('status', 'approved').order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Company[];
  },
  listAll: async (): Promise<Company[]> => {
    const { data, error } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Company[];
  },
  getByOwner: async (ownerId: string): Promise<Company | null> => {
    const { data, error } = await supabase.from('companies').select('*').eq('owner_id', ownerId).maybeSingle();
    if (error) throw error;
    return data as Company | null;
  },
  create: async (payload: Omit<Company, 'id' | 'status' | 'created_at'>) => {
    const { data, error } = await supabase.from('companies').insert({ ...payload, status: 'pending' }).select().single();
    if (error) throw error;
    return data as Company;
  },
  update: async (id: string, patch: Partial<Company>) => {
    const { data, error } = await supabase.from('companies').update(patch).eq('id', id).select().single();
    if (error) throw error;
    return data as Company;
  },
  remove: async (id: string) => {
    const { error } = await supabase.from('companies').delete().eq('id', id);
    if (error) throw error;
  },
};

export const categoryService = {
  list: async (): Promise<Category[]> => {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) throw error;
    return (data ?? []) as Category[];
  },
  create: async (payload: Omit<Category, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('categories').insert(payload).select().single();
    if (error) throw error;
    return data as Category;
  },
  update: async (id: string, patch: Partial<Category>) => {
    const { data, error } = await supabase.from('categories').update(patch).eq('id', id).select().single();
    if (error) throw error;
    return data as Category;
  },
  remove: async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  },
};

export const userService = {
  list: async () => {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
  updateStatus: async (id: string, status: 'active' | 'suspended') => {
    const { error } = await supabase.from('profiles').update({ status }).eq('id', id);
    if (error) throw error;
  },
  remove: async (id: string) => {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) throw error;
  },
};

export const savedCouponService = {
  list: async (userId: string): Promise<SavedCoupon[]> => {
    const { data, error } = await supabase
      .from('saved_coupons')
      .select('*, coupon:coupons(*, company:companies(id,name,logo_url), category:categories(id,name,slug,color,icon))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as SavedCoupon[];
  },
  toggle: async (userId: string, couponId: string): Promise<boolean> => {
    const { data } = await supabase.from('saved_coupons').select('id').eq('user_id', userId).eq('coupon_id', couponId).maybeSingle();
    if (data) {
      await supabase.from('saved_coupons').delete().eq('id', data.id);
      return false;
    }
    await supabase.from('saved_coupons').insert({ user_id: userId, coupon_id: couponId });
    return true;
  },
  redeem: async (savedCouponId: string) => {
  console.log("Redeeming saved_coupon id:", savedCouponId);

  const { data, error } = await supabase
    .from("saved_coupons")
    .update({
      redeemed: true,
      redeemed_at: new Date().toISOString(),
    })
    .eq("id", savedCouponId)
    .select();

  console.log("Updated rows:", data);
  console.log("Error:", error);

  if (error) throw error;
},
  isSaved: async (userId: string, couponId: string): Promise<boolean> => {
    const { data } = await supabase.from('saved_coupons').select('id').eq('user_id', userId).eq('coupon_id', couponId).maybeSingle();
    return !!data;
  },
  savedIds: async (userId: string): Promise<Set<string>> => {
    const { data } = await supabase.from('saved_coupons').select('coupon_id').eq('user_id', userId);
    return new Set((data ?? []).map((r) => r.coupon_id));
  },
};

export const notificationService = {
  list: async (role: string): Promise<NotificationItem[]> => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .or(`target_role.eq.${role},target_role.eq.all`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as NotificationItem[];
  },
  listAll: async (): Promise<NotificationItem[]> => {
    const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as NotificationItem[];
  },
  create: async (payload: Omit<NotificationItem, 'id' | 'created_at' | 'read'>) => {
    const { error } = await supabase.from('notifications').insert({ ...payload, read: false });
    if (error) throw error;
  },
  markRead: async (id: string) => {
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
    if (error) throw error;
  },
  markAllRead: async (role: string) => {
    const { error } = await supabase.from('notifications').update({ read: true }).or(`target_role.eq.${role},target_role.eq.all`);
    if (error) throw error;
  },
  remove: async (id: string) => {
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (error) throw error;
  },
};
