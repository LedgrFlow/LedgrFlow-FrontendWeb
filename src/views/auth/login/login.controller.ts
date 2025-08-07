import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoutesConfig } from "@/config/routes.config";
const { rootPaths } = RoutesConfig;

export const useLogin = () => {
  // Global Context
  const { login } = useAuth();
  const navigate = useNavigate();

  // Hook States
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [state, setState] = useState({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: "",
  });

  const handleStatesChange = (newStates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...newStates }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleStatesChange({ isLoading: true, isError: false, error: "" });

    if (!email || !password) {
      handleStatesChange({
        isSuccess: false,
        isError: true,
        error: "Por favor, rellena todos los campos.",
        isLoading: false,
      });
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        navigate(rootPaths?.menu.darhboard.href);
        handleStatesChange({
          isSuccess: true,
          isError: false,
          error: "",
          isLoading: false,
        });
      } else {
        handleStatesChange({
          isSuccess: false,
          isError: true,
          error: "Credenciales inválidas. Por favor, intenta de nuevo.",
          isLoading: false,
        });
      }
    } catch (error) {
      handleStatesChange({
        isSuccess: false,
        isError: true,
        error: "Error al iniciar sesión. Por favor, intenta de nuevo.",
        isLoading: false,
      });
    } finally {
      handleStatesChange({ isLoading: false });
    }
  };

  return {
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
    togglePasswordVisibility,
    email,
    password,
    state,
    showPassword,
  };
};
