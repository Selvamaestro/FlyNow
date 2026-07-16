export type Role = 'user' | 'company' | 'admin';

export type CompanyStatus = 'pending' | 'approved' | 'suspended';
export type CouponStatus = 'pending' | 'approved' | 'rejected';
export type ProfileStatus = 'active' | 'suspended';

export interface Profile {
  id: string;
  role: Role;
  display_name: string;
  avatar_url: string | null;
  status: ProfileStatus;
  email?: string | null;
  created_at: string;
}

export interface Company {
  id: string;
  owner_id: string;
  name: string;
  logo_url: string | null;
  description: string;
  contact_email: string;
  phone: string;
  address: string;
  website: string;
  status: CompanyStatus;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
  created_at: string;
}

export interface Coupon {
  id: string;
  company_id: string;
  category_id: string | null;
  title: string;
  description: string;
  flyer_image_url: string;
  logo_url: string | null;
  discount: string;
  coupon_code: string;
  terms: string;
  expiry_date: string;
  status: CouponStatus;
  views: number;
  retail_price?: number | null;
  discount_price?: number | null;
  created_at: string;
  // joined fields

  company?: Pick<Company, 'id' | 'name' | 'logo_url' | 'description' | 'contact_email' | 'phone' | 'website'>;
  category?: Pick<Category, 'id' | 'name' | 'slug' | 'color' | 'icon'> | null;
}

export interface SavedCoupon {
  id: string;
  user_id: string;
  coupon_id: string;
  created_at: string;
  coupon?: Coupon;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  target_role: Role | 'all';
  ref_id: string | null;
  read: boolean;
  created_at: string;
}
