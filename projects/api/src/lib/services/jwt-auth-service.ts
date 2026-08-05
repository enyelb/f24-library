
import { BaseAuthService, BaseAuthServiceRequest } from './base-auth-service';

/**
 * Authentication
 */
interface Authentication {
  email: string;
  password: string;
}
/**
 * Token
 */
interface Token {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

/**
 * JWTAuthServiceRequest
 */
interface JWTAuthServiceRequest<Authorized> extends 
  Omit<BaseAuthServiceRequest<Authentication, Authorized, Token>, 'expiresAt' | 'headers'> {}

/**
 * JWTAuthService
 */
export abstract class JWTAuthService<Authorized> extends BaseAuthService<Authentication, Authorized, Token> {
  /**
   * type
   */
  public readonly type = 'JWT';
  /**
   * constructor
   * @param request
   */
  constructor(request: JWTAuthServiceRequest<Authorized>) {
    super({
      ...request, 
      expiresAt: (token: Token) => {
        try {
          const payload = JSON.parse(atob(token.accessToken.split('.')[1]));
          return payload.exp * 1000;
        } catch (e) {
          console.error('Invalid token, fallback', e);
          return Date.now() + (token.expiresIn || 3600) * 1000;
        }
      }, 
      headers: (token: Token) => {
        return {
          'Authorization': `${token.tokenType} ${token.accessToken}`
        };
      }
    });
  }
}
