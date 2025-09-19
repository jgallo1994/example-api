export interface CreateUserRequestDto {
  name: string;
  lastName: string;
  email: string;
}

export interface CreateUserResponseDto {
  id: string;
  name: string;
  lastName: string;
  email: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetUserRequestDto {
  id: string;
}

export interface GetUserResponseDto {
  id: string;
  name: string;
  lastName: string;
  email: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetAllUsersResponseDto {
  users: GetUserResponseDto[];
  total: number;
}

export interface UpdateUserRequestDto {
  name?: string;
  lastName?: string;
  email?: string;
}

export interface UpdateUserResponseDto {
  id: string;
  name: string;
  lastName: string;
  email: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeleteUserRequestDto {
  id: string;
}

export interface DeleteUserResponseDto {
  id: string;
  message: string;
}
