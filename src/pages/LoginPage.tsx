import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (login(id, password)) {
      navigate("/home");
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#fafafa] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[320px]"
      >
        <div className="mb-8">
          <p className="text-[13px] tracking-[4px] text-zinc-400 font-light uppercase">
            JavaScript
          </p>
          <h1 className="mt-1 text-[28px] font-bold tracking-tight text-zinc-900">
            Deep Dive
          </h1>
          <div className="mt-2 h-[3px] w-8 bg-zinc-900" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-1.5 block text-[11px] tracking-[1px] text-zinc-400 uppercase">
              ID
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              autoComplete="username"
              required
              className="w-full border-0 border-b-[1.5px] border-zinc-300 bg-transparent py-2.5 text-[15px] text-zinc-900 outline-none transition focus:border-zinc-900"
            />
          </div>

          <div className="mb-8">
            <label className="mb-1.5 block text-[11px] tracking-[1px] text-zinc-400 uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full border-0 border-b-[1.5px] border-zinc-300 bg-transparent py-2.5 text-[15px] text-zinc-900 outline-none transition focus:border-zinc-900"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 text-sm text-red-500"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-sm bg-zinc-900 text-[14px] font-medium tracking-[1px] text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "확인 중..." : "로그인"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
