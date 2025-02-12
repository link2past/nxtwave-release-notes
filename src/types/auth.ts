
export type UserRole = 'admin' | 'user';

export interface AuthFormProps {
  email: string;
  password: string;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface RegisterFormProps extends AuthFormProps {
  username: string;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAdmin?: boolean;
}
