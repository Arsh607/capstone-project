import api from "./axios";

interface SignInResponse {
  message: string;
  data: {
    idToken: string;
    email: string;
    localId: string;
    expiresIn: string;
    refreshToken: string;
  };
}

export const signIn = async (email: string, password: string) => {
    const response = await api.post<SignInResponse>("/auth/signIn", {
        email,
        password
    });

    return response.data;
};