import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scale } from "lucide-react";
import { AtSignIcon, LockIcon, EyeIcon, EyeOffIcon } from "lucide-react"; // Asume que los íconos los extraes a otro archivo si quieres
import { RoutesConfig } from "@/config/routes.config";
import { useAuth } from "@/contexts/AuthContext";
const { rootPaths } = RoutesConfig;

const Register: React.FC = () => {
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
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [isPasswordStrong, setIsPasswordStrong] = useState<boolean>(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setIsPasswordStrong(validatePasswordStrength(value));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }

    try {
      // Aquí va tu lógica de registro (API call, etc)
      console.log("Registrando:", formData);
      const success = await register(
        formData.email,
        formData.password,
        formData.username,
        formData.firstName,
        formData.lastName
      );
      // Simula éxito
      if (success) {
        navigate("/login");
      }
    } catch (err) {
      setError("Error al registrar. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex">
      {/* Left panel igual al login */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(https://images.pexels.com/photos/16282306/pexels-photo-16282306.jpeg)`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full h-full hover:backdrop-blur-md transition-all duration-300">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">LedgrFlow</h1>
          <p className="text-xl text-center text-white/90 max-w-md">
            Gestiona tus finanzas personales con precisión y control total
            usando la potencia del texto plano y el sistema Ledger.
          </p>
        </div>
      </div>

      {/* Right - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Crear cuenta
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Empieza a gestionar tus finanzas personales
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Formulario */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Nombre y Apellido */}
            <div className="flex space-x-4">
              <input
                name="firstName"
                type="text"
                placeholder="Nombre"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-1/2 px-3 py-2 border rounded-md bg-white dark:bg-black"
              />
              <input
                name="lastName"
                type="text"
                placeholder="Apellido"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-1/2 px-3 py-2 border rounded-md bg-white dark:bg-black"
              />
            </div>

            {/* Nombre de usuario */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Nombre de usuario
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  readOnly
                  className="w-full pl-3 py-2 border rounded-md bg-gray-100 text-gray-500 dark:bg-neutral-900 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <AtSignIcon className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 py-2 border rounded-md bg-white dark:bg-black"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-2 border rounded-md bg-white dark:bg-black"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Confirmar contraseña
              </label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-2 border rounded-md bg-white dark:bg-black"
                />
              </div>
            </div>

            {formData.password && (
              <p
                className={`text-sm mt-1 ${
                  isPasswordStrong ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPasswordStrong
                  ? "Contraseña segura"
                  : "Debe tener al menos 6 caracteres, mayúsculas, minúsculas, número y símbolo"}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || !isPasswordStrong}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-md font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
            >
              {isLoading ? "Creando cuenta..." : "Registrarse"}
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to={rootPaths?.auth.login.href}
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
