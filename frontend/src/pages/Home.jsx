import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

import NavBar from "../components/NavBar";

import dashboard from "../assets/dashboard.webp";
import { StartNow, ThreeDots } from "../utils/Icons";

const Home = () => {
  const navigate = useNavigate();
  const userIsVerified = useSelector((state) => state.auth?.user?.verified);

  useEffect(() => {
    if (userIsVerified) {
      navigate("/dashboard");
    }
  }, [userIsVerified]);

  return (
    <main className={`${userIsVerified ? "hidden" : ""} w-full min-h-screen gradient-surface relative overflow-hidden`}>
      <NavBar />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 gradient-primary rounded-full opacity-10 blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 gradient-secondary rounded-full opacity-10 blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 gradient-accent rounded-full opacity-10 blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-violet-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-rose-400 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center px-6 py-3 glass rounded-full text-violet-700 text-sm font-semibold mb-8 animate-glow">
            ✨ Next-Gen Financial Intelligence
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight">
            Master your{" "}
            <span className="relative inline-block">
              <TypeAnimation
                sequence={["Wealth", 2000, "Future", 2000, "Dreams", 2000, "Goals", 2000]}
                wrapper="span"
                speed={40}
                className="gradient-primary bg-clip-text text-transparent animate-glow"
                repeat={Infinity}
              />
              <div className="absolute -bottom-4 left-0 right-0 h-2 gradient-primary rounded-full opacity-40 animate-pulse"></div>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
            Experience the future of{" "}
            <span className="font-bold gradient-primary bg-clip-text text-transparent">SpendSmart</span> - 
            where artificial intelligence meets personal finance. Transform your financial journey 
            with intelligent insights, predictive analytics, and seamless automation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <button
              className="btn-primary group relative overflow-hidden"
              onClick={() => navigate("/register")}
            >
              <span className="relative z-10 flex items-center gap-3">
                <StartNow className="w-5 h-5" />
                Begin Your Journey
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </button>
            
            <button
              className="btn-secondary group"
              onClick={() => navigate("/login")}
            >
              <span className="flex items-center gap-3">
                Welcome Back
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>
          
          <div className="flex justify-center animate-bounce">
            <ThreeDots
              className="text-violet-500 size-10 cursor-pointer hover:text-violet-600 transition-colors duration-300"
              onClick={() => {
                document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>
        </div>
          
        {/* Dashboard Preview */}
        <div className="relative mb-24 animate-slide-up" id="features">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10 pointer-events-none"></div>
          <div className="relative group">
            <div className="absolute -inset-4 gradient-primary rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <div className="card-modern p-8 text-center group hover:scale-105 transition-all duration-300 animate-slide-up">
            <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-glow">
              <span className="text-3xl">🧠</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Insights</h3>
            <p className="text-gray-600 leading-relaxed">Advanced machine learning algorithms analyze your spending patterns and provide personalized financial recommendations</p>
          </div>
          
          <div className="card-modern p-8 text-center group hover:scale-105 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="w-20 h-20 gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-glow">
              <span className="text-3xl">📈</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Predictive Analytics</h3>
            <p className="text-gray-600 leading-relaxed">Forecast your financial future with intelligent predictions and automated budget optimization strategies</p>
          </div>
          
          <div className="card-modern p-8 text-center group hover:scale-105 transition-all duration-300 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <div className="w-20 h-20 gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-glow">
              <span className="text-3xl">🛡️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Bank-Grade Security</h3>
            <p className="text-gray-600 leading-relaxed">Military-grade encryption and zero-knowledge architecture ensure your financial data remains completely private</p>
          </div>
        </div>
        
        {/* Enhanced CTA Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 gradient-primary opacity-90"></div>
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float" style={{animationDelay: '3s'}}></div>
          </div>
          
          <div className="relative z-10 text-center p-16 rounded-3xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Finances?</h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join the financial revolution. Experience the power of AI-driven wealth management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <button
                className="bg-white text-violet-600 font-bold px-10 py-5 rounded-2xl shadow-strong hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg"
                onClick={() => navigate("/register")}
              >
                Start Free Today
              </button>
              
              <Link
                to="https://github.com/Georgiandurgesh/Smart-Spend"
                target="_blank"
                className="inline-block"
              >
                <button className="glass text-white font-semibold px-10 py-5 rounded-2xl hover:bg-white/20 transition-all duration-300 text-lg">
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View Source
                  </span>
                </button>
              </Link>
            </div>
            
            <div className="flex justify-center space-x-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>No Credit Card</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Open Source</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
