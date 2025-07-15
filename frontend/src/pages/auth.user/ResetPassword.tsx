import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "../../api/auth/auth.api";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await resetPassword(token, password);
      setMessage(res.data.message || "Password reset successful.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading || !token} className="w-full">
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
      {message && <div className="mt-4 text-green-600">{message}</div>}
      {error && <div className="mt-4 text-red-600">{error}</div>}
      {!token && (
        <div className="mt-4 text-yellow-600">Invalid or missing token.</div>
      )}
    </div>
  );
};

export default ResetPassword;
