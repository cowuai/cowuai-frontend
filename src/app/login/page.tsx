import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-800 transition-colors duration-500">
      <div className="flex w-[900px] h-[500px] rounded-lg overflow-hidden shadow-lg">
        {/* Coluna esquerda */}
        <div className="flex items-center justify-center w-1/2 bg-white">
          <Image
            src="/images/cowuai-logo.png"
            alt="CowUai Logo"
            width={300}
            height={300}
            className="object-contain"
          />
        </div>

        {/* Coluna direita */}
        <div className="flex flex-col items-center justify-center w-1/2 bg-red-900 text-white p-8">
          <h2 className="text-3xl font-title mb-6">Login</h2>

          <div className="bg-white text-black rounded-xl p-6 w-80 shadow-md">
            <form className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium">E-mail</label>
                <input
                  type="email"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 bg-white text-black"
                />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Senha</label>
                  <a href="#" className="text-sm text-red-900 hover:underline">
                    Esqueceu sua senha?
                  </a>
                </div>
                <input
                  type="password"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 bg-white text-black"
                />
              </div>

              <button
                type="submit"
                className="bg-red-900 text-white py-2 rounded-lg hover:bg-red-800 transition"
              >
                Login
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Faça login com o Google
                <Image
                  src="/images/google-icon.png"
                  alt="Google"
                  width={20}
                  height={20}
                />
              </button>
            </form>

            <p className="text-sm text-center mt-4">
              Não possui uma conta?{" "}
              <a href="#" className="text-red-900 hover:underline">
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
