import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { login } from "@/services/userManagement";

const Icons = {
  spinner: Loader2,
  gitHub: Github,
  google: FcGoogle,
};

export default function LoginPage({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const navigate = useNavigate();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const user = await login({ email, password }, "credentials");

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        navigate("/dashboard");
      } else {
        alert("Invalid credentials");
      }
    } catch {
      alert("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={`flex justify-center items-center h-screen bg-gradient-to-br from-blue-900 to-purple-900 ${className}`}
      {...props}
    >
      <form
        onSubmit={onSubmit}
        className="p-8 space-y-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg w-96"
      >
        <h2 className="mb-4 text-2xl text-center text-white">Welcome back!</h2>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="text-gray-300" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              className="text-white placeholder-gray-400 bg-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-1 pt-6">
            <Label className="text-gray-300" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              disabled={isLoading}
              className="text-white placeholder-gray-400 bg-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="transition-colors bg-blue-600 hover:bg-blue-500"
          >
            {isLoading
              ? <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
              : (
                "Sign In with Email"
              )}
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-600" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 text-gray-400 bg-gray-800">
              Or continue with
            </span>
          </div>
        </div>
        <div className="flex justify-center space-x-10">
          <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            className="flex items-center justify-center text-gray-400 transition-colors border border-gray-600 hover:bg-gray-700"
          >
            {isLoading ? <Icons.spinner className="w-4 h-4 animate-spin" /> : (
              <>
                <Icons.gitHub className="w-4 h-4" />
                <span>GitHub</span>
              </>
            )}
          </Button>
          <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 text-gray-400 transition-colors border border-gray-600 hover:bg-gray-700"
          >
            {isLoading ? <Icons.spinner className="w-4 h-4 animate-spin" /> : (
              <>
                <Icons.google className="w-5 h-5" />
                <span>Google</span>
              </>
            )}
          </Button>
        </div>
        <div className="relative flex justify-center mt-4 text-xs">
          <span className="px-2 text-gray-400 bg-gray-800">
            Don't have an account yet?{" "}
            <a
              onClick={() => navigate("/signup")}
              className="text-blue-500 cursor-pointer hover:text-blue-400"
            >
              Sign up
            </a>
          </span>
        </div>
      </form>
    </div>
  );
}
