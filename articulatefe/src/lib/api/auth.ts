import api from "./axios";
import { auth } from "../firebase/config";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import type { AuthState, User } from "../../types/auth";

export const authAPI = {
  register: async (params: {
    email: string;
    displayName?: string;
    password: string;
  }): Promise<AuthState> => {
    const { email, displayName, password } = params;
    const userCredential = await createUserWithEmailAndPassword(
      auth!,
      email,
      password
    );
    const firebaseToken = await userCredential.user.getIdToken();
    const response = await api.post<AuthState>("/auth/register", {
      firebase_token: firebaseToken,
      display_name: displayName ?? email.split("@")[0],
    });
    return response.data;
  },

  login: async (params: {
    email: string;
    password: string;
  }): Promise<AuthState> => {
    const { email, password } = params;
    const userCredential = await signInWithEmailAndPassword(
      auth!,
      email,
      password
    );
    const firebaseToken = await userCredential.user.getIdToken();
    const response = await api.post<AuthState>("/auth/login", {
      firebase_token: firebaseToken,
    });
    console.log("Response: ", response);
    return response.data;
  },

  googleSignIn: async (): Promise<AuthState> => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth!, provider);
    const firebaseToken = await userCredential.user.getIdToken();
    const response = await api.post<AuthState>("/auth/google-signin", {
      firebase_token: firebaseToken,
    });
    return response.data;
  },

  logout: async (): Promise<void> => {
    console.log("Logging out...");
    await api.post("/auth/logout");
    await auth?.signOut();
    localStorage.removeItem("auth_token");
  },

  me: async (): Promise<User> => {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },
};
