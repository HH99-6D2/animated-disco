type ifString = string | null;

interface IKakaoPropertiesData {
  nickname: string;
  profile_image: ifString;
  thumbnail_image: ifString;
}

interface IKakaoProfileData {
  nickname: string;
  thumbnail_image: ifString;
  profile_image: ifString;
  is_default_image: boolean;
}

interface IkakaoAccountData {
  profile_nickname_needs_agreement: boolean;
  profile_image_needs_agreement?: boolean;
  profile: IKakaoProfileData;
  has_email: boolean;
  email_needs_agreement: boolean;
  is_email_valid: boolean;
  is_email_verified: boolean;
  email: ifString;
}

export interface IkakaoSocialData {
  id: string;
  connected_at: string;
  properties: IKakaoProfileData;
  kakao_account: IkakaoAccountData;
}
