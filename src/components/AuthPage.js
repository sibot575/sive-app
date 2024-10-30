import React, { useState } from 'react';
import { LogIn, UserPlus, ArrowRight, Mail, Lock } from 'lucide-react';

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-[360px] relative">
        {/* Cercles décoratifs d'arrière-plan */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-blue-500 rounded-full opacity-10 blur-xl animate-pulse"></div>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-purple-500 rounded-full opacity-10 blur-xl animate-pulse delay-1000"></div>
        
        {/* Logo et Titre */}
        <div className="text-center mb-6 relative">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg transform hover:scale-105 transition-transform rotate-3">
            <span className="text-white text-xl font-bold">S.</span>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {isLogin ? 'Bienvenue' : 'Rejoignez-nous'}
          </h2>
          <p className="text-gray-600 mt-1 text-sm">
            {isLogin 
              ? 'Ravi de vous revoir !' 
              : 'Commencez votre voyage avec nous'
            }
          </p>
        </div>

        {/* Formulaire */}
        <div className="backdrop-blur-lg bg-white/80 p-6 rounded-2xl shadow-xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-3 w-3 text-purple-600 rounded border-gray-300"
                  />
                  <label htmlFor="remember" className="ml-2 text-gray-600">
                    Se souvenir de moi
                  </label>
                </div>
                <button type="button" className="text-purple-600 hover:text-purple-700 font-medium">
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transform hover:-translate-y-0.5 transition-all duration-150 flex items-center justify-center space-x-2 text-sm font-medium shadow-lg shadow-purple-500/30"
            >
              <span>{isLogin ? 'Se connecter' : "S'inscrire"}</span>
              <ArrowRight className="animate-pulse" size={16} />
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white/80 text-gray-500">
                  {isLogin ? 'Nouveau sur SIVE ?' : 'Déjà inscrit ?'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="mt-3 w-full flex items-center justify-center px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 
                border border-transparent hover:border-purple-200 hover:bg-purple-50/50 text-gray-700 space-x-2"
            >
              {isLogin ? (
                <>
                  <UserPlus size={14} />
                  <span>Créer un compte</span>
                </>
              ) : (
                <>
                  <LogIn size={14} />
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;