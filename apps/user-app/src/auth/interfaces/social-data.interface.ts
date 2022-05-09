interface Kakao_properties {
  nickname: string;
  profile_image?: string;
  thumbnail_image?: string;
}

interface Kakao_profile {
  nickname: string;
  thumbnail_image_url?: string;
  profile_image_url?: string;
  is_default_image?: boolean;
}

interface kako_account {
  profile_nickname_needs_agreement: boolean;
  profile_image_needs_agreement?: boolean;
  profile: Kakao_profile;
  has_email?: boolean;
  email_needs_agreement: boolean;
  is_email_valid?: boolean;
  is_email_verified?: boolean;
  email?: string;
}

export interface kakaoSocialData {
  id: number;
  connected_at: Date;
  properties: Kakao_properties;
  kakao_account: kako_account;
}
