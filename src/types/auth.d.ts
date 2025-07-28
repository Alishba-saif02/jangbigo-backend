export interface register {
    username: string;
    email: string;
    password: string;
    role?: 'USER' | 'ADMIN';
}
export interface login {
    email: string;
    password: string;
}
