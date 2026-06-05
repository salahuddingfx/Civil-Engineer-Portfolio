import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../lib/api";
import gsap from "gsap";
import { useLanguage } from "../../context/LanguageContext";
import SeoHead from "../../components/SeoHead";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Copy,
  HelpCircle,
} from "lucide-react";
import "../../styles/admin.css";

const STEP_EMAIL = 0;
const STEP_QUESTION = 1;
const STEP_NEW_PASSWORD = 2;
const STEP_DONE = 3;

export default function AdminForgotPasswordPage() {
  const { language } = useLanguage();
  const [step, setStep] = useState(STEP_EMAIL);
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [devToken, setDevToken] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "power4.out" }
      );
    }
  }, [step]);

  const animateOut = (cb) => {
    gsap.to(cardRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      ease: "power2.in",
      onComplete: cb,
    });
  };

  const onEmailSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;
    setError("");
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      if (data.requiresSecurityQuestion) {
        setSecurityQuestion(data.securityQuestion);
        animateOut(() => setStep(STEP_QUESTION));
      } else if (data.devResetToken) {
        setDevToken(data.devResetToken);
        animateOut(() => setStep(STEP_DONE));
      } else {
        setError(language === "en"
          ? "If that email exists, a reset link has been sent."
          : "যদি ইমেইলটি থাকে, রিসেট লিংক পাঠানো হয়েছে।");
        animateOut(() => setStep(STEP_DONE));
      }
    } catch (err) {
      setError(language === "en" ? "Request failed. Try again." : "অনুরোধ ব্যর্থ হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  };

  const onAnswerSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;
    setError("");
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password/verify", {
        email,
        securityAnswer,
      });
      if (data.devResetToken) {
        setDevToken(data.devResetToken);
        animateOut(() => setStep(STEP_NEW_PASSWORD));
      } else {
        setError(data.message || (language === "en" ? "Verification failed." : "যাচাই ব্যর্থ।"));
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          (language === "en" ? "Incorrect answer." : "উত্তর ভুল।")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;
    setError("");
    if (newPassword.length < 8) {
      setError(language === "en" ? "Password must be at least 8 characters." : "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(language === "en" ? "Passwords do not match." : "পাসওয়ার্ড মিলছে না।");
      return;
    }
    setIsLoading(true);
    try {
      await api.post("/auth/reset-password", { token: devToken, newPassword });
      animateOut(() => setStep(STEP_DONE + 1));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          (language === "en" ? "Reset failed." : "রিসেট ব্যর্থ।")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToken = () => {
    if (!devToken) return;
    navigator.clipboard.writeText(devToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const goBack = () => {
    animateOut(() => {
      setError("");
      if (step === STEP_QUESTION) setStep(STEP_EMAIL);
      else if (step === STEP_NEW_PASSWORD) setStep(STEP_QUESTION);
      else navigate("/admin");
    });
  };

  const renderHeader = (icon, title, subtitle) => (
    <div className="mb-10 text-center">
      <div className="flex justify-center mb-6">
        <div className="p-4 rounded-2xl bg-[var(--admin-card)] border border-[color:var(--admin-border)] text-sky-600 shadow-inner">
          {icon}
        </div>
      </div>
      <h1 className="text-xl sm:text-2xl font-black text-[color:var(--admin-text-heading)] tracking-tight uppercase">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-[10px] font-bold text-[color:var(--admin-text-muted)] opacity-80 uppercase tracking-widest">
          {subtitle}
        </p>
      )}
    </div>
  );

  const renderError = () =>
    error && (
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest">
        <AlertCircle size={14} />
        {error}
      </div>
    );

  return (
    <div className="admin-layout min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <SeoHead
        title="Forgot Password — Admin"
        description="Reset your admin password."
        path="/admin/forgot-password"
      />
      <div className="admin-blueprint-grid" />
      <div className="absolute top-0 right-0 h-1/2 w-1/2 bg-sky-500/[0.03] blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 h-1/2 w-1/2 bg-blue-500/[0.02] blur-[120px] rounded-full" />

      <div ref={cardRef} className="w-full max-w-[420px] relative">
        <div className="admin-card p-6 sm:p-10 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-1 w-32 bg-gradient-to-l from-[#19D2FF]/20 to-transparent" />

          {step === STEP_EMAIL && (
            <form onSubmit={onEmailSubmit} className="space-y-6">
              {renderHeader(
                <KeyRound size={32} strokeWidth={1.5} />,
                "Forgot Password",
                "Recover Admin Access"
              )}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-[color:var(--admin-text-muted)] uppercase tracking-widest ml-1">
                  <Mail size={12} /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="admin-input w-full"
                  placeholder="admin@agency.com"
                  required
                  autoFocus
                />
              </div>
              {renderError()}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-sky-500 text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_24px_rgba(25,210,255,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight size={18} strokeWidth={2} />
                  </>
                )}
              </button>
            </form>
          )}

          {step === STEP_QUESTION && (
            <form onSubmit={onAnswerSubmit} className="space-y-6">
              {renderHeader(
                <HelpCircle size={32} strokeWidth={1.5} />,
                "Security Question",
                "Verify Your Identity"
              )}
              <div className="p-4 rounded-xl bg-[var(--admin-card)] border border-[color:var(--admin-border)]">
                <p className="text-[10px] font-black text-[color:var(--admin-text-muted)] uppercase tracking-widest">
                  Question
                </p>
                <p className="mt-1 text-sm text-[color:var(--admin-text-heading)] font-bold">
                  {securityQuestion}
                </p>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-[color:var(--admin-text-muted)] uppercase tracking-widest ml-1">
                  <Lock size={12} /> Your Answer
                </label>
                <input
                  type="text"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  className="admin-input w-full"
                  placeholder="Type your answer..."
                  required
                  autoFocus
                />
              </div>
              {renderError()}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 h-14 border border-[color:var(--admin-border)] text-[color:var(--admin-text-label)] text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={18} strokeWidth={2} />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] h-14 bg-sky-500 text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_24px_rgba(25,210,255,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify
                      <ChevronRight size={18} strokeWidth={2} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === STEP_NEW_PASSWORD && (
            <form onSubmit={onResetSubmit} className="space-y-6">
              {renderHeader(
                <Lock size={32} strokeWidth={1.5} />,
                "New Password",
                "Set New Credentials"
              )}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-[color:var(--admin-text-muted)] uppercase tracking-widest ml-1">
                  <Lock size={12} /> New Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="admin-input w-full pr-12"
                    placeholder="••••••••••••"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--admin-text-label)] hover:text-sky-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-[color:var(--admin-text-muted)] uppercase tracking-widest ml-1">
                  <Lock size={12} /> Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="admin-input w-full"
                  placeholder="••••••••••••"
                  required
                />
              </div>
              {renderError()}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 h-14 border border-[color:var(--admin-border)] text-[color:var(--admin-text-label)] text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={18} strokeWidth={2} />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] h-14 bg-sky-500 text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_24px_rgba(25,210,255,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ChevronRight size={18} strokeWidth={2} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {(step === STEP_DONE || step === STEP_DONE + 1) && (
            <div className="space-y-6">
              {renderHeader(
                <CheckCircle2 size={32} strokeWidth={1.5} />,
                step === STEP_DONE + 1 ? "Password Reset" : "Check Your Email",
                "Recovery Initiated"
              )}
              {step === STEP_DONE + 1 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 size={14} />
                    Password has been reset successfully
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/admin")}
                    className="w-full h-14 bg-sky-500 text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_24px_rgba(25,210,255,0.2)] flex items-center justify-center gap-2"
                  >
                    Go To Login
                    <ChevronRight size={18} strokeWidth={2} />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[var(--admin-card)] border border-[color:var(--admin-border)] space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-[color:var(--admin-text-muted)] uppercase tracking-widest">
                        Dev Reset Token (SMTP off)
                      </p>
                      <button
                        type="button"
                        onClick={copyToken}
                        className="text-sky-600 hover:text-sky-500 transition-colors"
                      >
                        {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                    <p className="text-[10px] font-mono text-[color:var(--admin-text-heading)] break-all bg-[var(--admin-bg)] p-3 rounded-lg border border-[color:var(--admin-border)]">
                      {devToken}
                    </p>
                    <p className="text-[9px] text-[color:var(--admin-text-secondary)] italic">
                      Use this on the next screen or call /api/auth/reset-password directly.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(STEP_NEW_PASSWORD)}
                    className="w-full h-14 bg-sky-500 text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_24px_rgba(25,210,255,0.2)] flex items-center justify-center gap-2"
                  >
                    Continue With Token
                    <ChevronRight size={18} strokeWidth={2} />
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex justify-center border-t border-[color:var(--admin-border)] pt-8">
            <Link
              to="/admin"
              className="text-[9px] font-black text-[color:var(--admin-text-muted)] opacity-60 uppercase tracking-[0.3em] hover:opacity-100 transition-opacity"
            >
              ← Back To Login
            </Link>
          </div>
        </div>
        <p className="mt-10 text-center text-[9px] font-black text-[color:var(--admin-text-secondary)] uppercase tracking-[0.3em] italic">
          © 2026 Studio Arch Consultancy
        </p>
      </div>
    </div>
  );
}
