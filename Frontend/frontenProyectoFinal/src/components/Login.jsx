import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import logoImg from '../assets/Logo_Proyecto.png';
import '../css/Login.css'; 

export default function Login({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistering && password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (onLoginSuccess) {
      onLoginSuccess({
        name: isRegistering ? name : 'Carlos G.',
        email,
      });
    }
  };

  const handleGoogleAuth = () => {};

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
            {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {isRegistering && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700">
                Nombre Completo
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre completo"
                className="w-full px-4 py-2 bg-[#E2E8F0]/70 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
              />
            </div>
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
              className="w-full px-4 py-2 bg-[#E2E8F0]/70 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
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
                className="w-full pl-4 pr-10 py-2 bg-[#E2E8F0]/70 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                className="w-full px-4 py-2 bg-[#E2E8F0]/70 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A78BFA] transition-all"
              />
            </div>
          )}

          {!isRegistering && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer text-[#60A5FA]">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-[#A78BFA] focus:ring-[#A78BFA]"
                />
                <span>Mostrar contraseña</span>
              </label>
              <a
                href="#forgot"
                onClick={(e) => e.preventDefault()}
                className="text-[#60A5FA] hover:underline"
              >
                ¿Olvidaste la contraseña?
              </a>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 bg-[#B896FF] hover:bg-[#A78BFA] text-white font-medium py-2.5 px-4 rounded-xl border border-purple-400 shadow-md transition-all duration-200 cursor-pointer text-sm"
          >
            {isRegistering ? 'Registrarse' : 'Iniciar Sesion'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-200/50">
          {isRegistering ? (
            <p className="text-xs text-gray-500">
              ¿Ya tienes una cuenta?{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
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
                onClick={() => setIsRegistering(true)}
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