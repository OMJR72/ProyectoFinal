import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import logoImg from '../assets/Logo_Proyecto.png';
import { loginUser, registerUser } from '../services/authService';
import '../css/Login.css';

export default function Login({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);

  const [name, setName] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    if (isRegistering && password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      if (isRegistering) {
        await registerUser(
          name,
          apellido,
          email,
          password
        );

        setIsRegistering(false);

        setName('');
        setApellido('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        setSuccessMessage(
          '¡Registro exitoso! Ya puedes iniciar sesión.'
        );
      } else {
        const response = await loginUser(
          email,
          password
        );

        if (onLoginSuccess) {
          onLoginSuccess({
            email: email
          });
        }
      }
    } catch (error) {
      setErrorMessage(
        error.message || 'Ocurrió un error inesperado'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangeToRegister = () => {
    setIsRegistering(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleChangeToLogin = () => {
    setIsRegistering(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="login-container">

      <div className="login-card-grid w-full max-w-sm bg-white/95 rounded-[28px] shadow-2xl border-2 border-white/60 p-8 space-y-5 transition-all duration-300 relative overflow-hidden">

        <div className="text-center space-y-2">

          {logoImg && (
            <div className="flex justify-center mb-1">
              <img
                src={logoImg}
                alt="Logo del proyecto"
                className="w-14 h-14 object-contain"
              />
            </div>
          )}

          <h1 className="text-3xl font-semibold text-[#A78BFA] tracking-tight">
            {isRegistering
              ? 'Crear Cuenta'
              : 'Iniciar Sesión'}
          </h1>

        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-300 text-green-700 text-xs p-3 rounded-xl text-center">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 border border-red-300 text-red-600 text-xs p-3 rounded-xl text-center">
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 text-left"
        >

          {isRegistering && (
            <>
              <div className="space-y-1">

                <label className="block text-xs font-semibold text-gray-700">
                  Nombre
                </label>

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-2 bg-[#E2E8F0]/70 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                />

              </div>

              <div className="space-y-1">

                <label className="block text-xs font-semibold text-gray-700">
                  Apellido
                </label>

                <input
                  type="text"
                  required
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Tu apellido"
                  className="w-full px-4 py-2 bg-[#E2E8F0]/70 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
                />

              </div>
            </>
          )}

          <div className="space-y-1">

            <label className="block text-xs font-semibold text-gray-700">
              Correo Electrónico
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-2 bg-[#E2E8F0]/70 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
            />

          </div>

          <div className="space-y-1">

            <label className="block text-xs font-semibold text-gray-700">
              Contraseña
            </label>

            <div className="relative">

              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-4 pr-10 py-2 bg-[#E2E8F0]/70 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword
                  ? <EyeOff className="w-4 h-4" />
                  : <Eye className="w-4 h-4" />
                }
              </button>

            </div>

          </div>

          {isRegistering && (
            <div className="space-y-1">

              <label className="block text-xs font-semibold text-gray-700">
                Confirmar Contraseña
              </label>

              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2 bg-[#E2E8F0]/70 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]"
              />

            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#B896FF] hover:bg-[#A78BFA] text-white font-medium py-2.5 px-4 rounded-xl border border-purple-400 shadow-md transition-all duration-200 cursor-pointer text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >

            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Cargando...</span>
              </>
            ) : (
              <span>
                {isRegistering
                  ? 'Registrarse'
                  : 'Iniciar Sesión'}
              </span>
            )}

          </button>

        </form>

        <div className="text-center pt-2 border-t border-gray-200/50">

          {isRegistering ? (

            <p className="text-xs text-gray-500">
              ¿Ya tienes una cuenta?{' '}

              <button
                type="button"
                onClick={handleChangeToLogin}
                className="text-[#60A5FA] font-semibold hover:underline cursor-pointer bg-transparent border-0"
              >
                Inicia sesión aquí
              </button>
            </p>

          ) : (

            <p className="text-xs text-gray-500">
              ¿No tienes una cuenta?{' '}

              <button
                type="button"
                onClick={handleChangeToRegister}
                className="text-[#60A5FA] font-semibold hover:underline cursor-pointer bg-transparent border-0"
              >
                Regístrate aquí
              </button>
            </p>

          )}

        </div>

      </div>

    </div>
  );
}