/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import { Button } from "@/src/components/Button";

export default function LoginPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); //

  const { logIn, signUp, logInWithGoogle } = useAuth();
  const router = useRouter();

  const translateFirebaseError = (errorCode: string): string => {
    switch (errorCode) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "E-mail ou senha inválidos. Tente novamente.";
      case "auth/email-already-in-use":
        return "Este e-mail já está em uso.";
      case "auth/weak-password":
        return "A senha é muito fraca. Tente uma senha mais forte.";
      case "auth/popup-closed-by-user":
        return "A janela de login do Google foi fechada.";
      default:
        return "Ocorreu um erro. Tente novamente mais tarde.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isLoginView) {
      try {
        await logIn(email, password);
        router.push("/");
      } catch (err: any) {
        setError(translateFirebaseError(err.code));
        setLoading(false);
      }
    } else {
      if (password !== repeatPassword) {
        setError("As senhas não coincidem.");
        setLoading(false);
        return;
      }
      try {
        await signUp(email, password);
        router.push("/");
      } catch (err: any) {
        setError(translateFirebaseError(err.code));
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await logInWithGoogle();
      router.push("/");
    } catch (err: any) {
      setError(translateFirebaseError(err.code));
      setLoading(false);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError(null);
    setEmail("");
    setPassword("");
    setRepeatPassword("");
  };

  return (
    <div className="bg-blue-900 p-8 rounded-2xl shadow-lg w-full">
      <h1 className="text-heading-lg mb-8">
        {isLoginView ? "Login" : "Cadastro"}
      </h1>

      {error && <p className="text-red-500 text-body-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="email"
          placeholder="Endereço de e-mail"
          className="input-custom"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="input-custom"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {!isLoginView && (
          <input
            type="password"
            placeholder="Repetir Senha"
            className="input-custom"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
          />
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading
            ? "Carregando..."
            : isLoginView
            ? "Entrar na conta"
            : "Criar uma conta"}
        </Button>
      </form>

      <div className="text-center mt-8">
        <p className="text-body-sm text-white">
          {isLoginView ? "Não tem uma conta?" : "Já tem uma conta?"}
          <button
            type="button"
            onClick={toggleView}
            className="text-red-500 ml-2 font-medium hover:underline cursor-pointer"
          >
            {isLoginView ? "Cadastre-se" : "Faça login"}
          </button>
        </p>
      </div>

      <div className="flex items-center my-6">
        <hr className="grow border-t border-blue-500" />
        <span className="px-4 text-body-sm text-blue-500">OU</span>
        <hr className="grow border-t border-blue-500" />
      </div>

      <Button
        type="button"
        variant="white"
        className="w-full"
        onClick={handleGoogleLogin}
        disabled={loading}
        iconSrc="/google-icon.svg"
      >
        Entrar com Google
      </Button>
    </div>
  );
}
