import { FaApple, FaDiscord, FaGithub, FaGoogle, FaX } from 'react-icons/fa6';

export const OAUTH_PROVIDERS = [
  { name: 'github', icon: FaGithub },
  { name: 'discord', icon: FaDiscord },
  { name: 'google', icon: FaGoogle },
  { name: 'twitter', icon: FaX },
  { name: 'apple', icon: FaApple },
] as const;

export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];
export type OAuthProviderName = OAuthProvider['name'];

export const OAUTH_PROVIDERS_BY_NAME: Map<OAuthProviderName, OAuthProvider> =
  new Map(OAUTH_PROVIDERS.map(provider => [provider.name, provider]));
