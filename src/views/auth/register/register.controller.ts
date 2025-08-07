import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoutesConfig } from "@/config/routes.config";
const { rootPaths } = RoutesConfig;

export const useRegister = () => {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [isPasswordStrong, setIsPasswordStrong] = useState<boolean>(false);
  const [state, setState] = useState({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: "",
  });

  const handleStatesChange = (newStates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...newStates }));
  };

  const validatePasswordStrength = (password: string): boolean => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[\W_]/.test(password);
    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSymbol
    );
  };

  // Genera el nombre de usuario automáticamente con @
  useEffect(() => {
    const username =
      formData.firstName && formData.lastName
        ? `@${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`
        : "";
    setFormData((prev) => ({ ...prev, username }));
  }, [formData.firstName, formData.lastName]);

  // Valida el contraseña
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setIsPasswordStrong(validatePasswordStrength(value));
    }
  };

  // Valida el contraseña
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Registra el usuario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleStatesChange({
      isLoading: true,
      isError: false,
      error: "",
      isSuccess: false,
    });

    if (formData.password !== formData.confirmPassword) {
      handleStatesChange({
        isSuccess: false,
        isError: true,
        error: "Las contraseñas no coinciden. Por favor, intenta de nuevo.",
        isLoading: false,
      });
      return;
    }

    try {
      // Aquí va tu lógica de registro (API call, etc)
      const success = await register(
        formData.email,
        formData.password,
        formData.username,
        formData.firstName,
        formData.lastName
      );

      if (success) {
        handleStatesChange({
          isSuccess: true,
          isError: false,
          error: "",
          isLoading: false,
        });
        navigate(rootPaths.menu.darhboard.href);
      }
    } catch (err) {
      handleStatesChange({
        isSuccess: false,
        isError: true,
        error: "Error al registrar. Por favor, intenta de nuevo.",
        isLoading: false,
      });
    } finally {
      handleStatesChange({ isLoading: false });
    }
  };

  return {
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
    formData,
    isPasswordStrong,
    state,
    showPassword,
  };
};
