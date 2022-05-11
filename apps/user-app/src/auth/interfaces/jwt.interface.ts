export interface IJwtPayLoad {
  id: number;
  nickname: string;
  imageUrl: string;
  isActive: boolean;
  accessToken: string;
  iat: number;
  exp: number;
}
