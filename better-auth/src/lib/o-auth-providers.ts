import type { ComponentType } from 'react';
import {
  FaApple,
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaGoogle,
} from 'react-icons/fa6';

type OAuthProvider = Readonly<{
  name: string;
  icon: ComponentType;
}>;

export const SUPPORTED_OAUTH_PROVIDERS: OAuthProvider[] = [
  { name: 'github', icon: FaGithub },
  { name: 'discord', icon: FaDiscord },
  { name: 'google', icon: FaGoogle },
  { name: 'facebook', icon: FaFacebook },
  { name: 'apple', icon: FaApple },
] as const;

export const SUPPORTED_OAUTH_PROVIDERS_MAPPING: Map<string, OAuthProvider> =
  new Map(SUPPORTED_OAUTH_PROVIDERS.map(provider => [provider.name, provider]));
