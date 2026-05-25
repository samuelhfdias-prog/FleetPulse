export class LoginDto {
  email: string;
  password: string;
}

export class AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    companyId: string;
  };
}

export class CreateUserDto {
  email: string;
  password: string;
  fullName: string;
  companyId: string;
  role?: 'ADMIN' | 'USER';
}
