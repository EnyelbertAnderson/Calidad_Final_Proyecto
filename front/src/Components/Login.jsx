import { useState } from "react";
import axios from "axios";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
        const { data } = await axios.post("http://localhost:8000/api/login/", {
        email,
        password,
    });

    localStorage.setItem("token", data.token);
    window.location.href = "/dashboard";

    } catch (error) {
        setError("Credenciales incorrectas");
    }
};
    return (
        <section className="bg-background-light dark:bg-background-dark font-display text-white">
            <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#111714] p-4">
                <div className="layout-container flex h-full grow flex-col justify-center">
                    <div className="flex flex-col items-center justify-center">
                        <div className="layout-content-container flex w-full max-w-md flex-col items-center gap-6 rounded-xl border border-[#3d5245] bg-[#1c2620]/50 p-6 md:p-8">
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#3d5245]">
                                </div>
                                <h1 className="text-white tracking-light text-center text-3xl font-bold leading-tight">Bienvenido</h1>
                            </div>
                            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
                                <div className="flex w-full flex-wrap items-end">
                                    <label className="flex w-full flex-col">
                                        <p className="pb-2 text-base font-medium leading-normal text-white">Correo Electronico</p>
                                        <input 
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-input flex h-14 min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-[#3d5245] bg-[#1c2620] p-[15px] text-base font-normal leading-normal text-white placeholder:text-[#9eb7a8] focus:border-[#38e07b] focus:outline-0 focus:ring-1 focus:ring-[#38e07b]" placeholder="Ingrese su usuario o correo"  />
                                    </label>
                                </div>
                                <div className="flex w-full flex-wrap items-end">
                                    <label className="flex w-full flex-col">
                                        <p className="pb-2 text-base font-medium leading-normal text-white">Contraseña</p>
                                        <div className="relative flex w-full flex-1 items-stretch">
                                            <input 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="form-input flex h-14 min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-[#3d5245] bg-[#1c2620] p-[15px] pr-12 text-base font-normal leading-normal text-white placeholder:text-[#9eb7a8] focus:border-[#38e07b] focus:outline-0 focus:ring-1 focus:ring-[#38e07b]" placeholder="Ingrese su contraseña" type="password"/>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                {/* <button className="text-[#9eb7a8] hover:text-white" type="button">
                                                    <span className="material-symbols-outlined">visibility</span>
                                                </button> */}
                                            </div>
                                        </div>
                                    </label>
                                </div>
                                <div className="pt-4">
                                    <button className="flex h-12 min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#38e07b] px-5 text-base font-bold leading-normal tracking-[0.015em] text-[#111714] transition-colors hover:bg-[#85f8b3]">
                                        <span className="truncate">Iniciar Sesión</span>
                                    </button>
                                </div>
                            </form>
                            <div className="flex w-full justify-center">
                                <a className="text-sm text-[#9eb7a8] hover:text-primary hover:underline" href="#">¿Olvidaste tu Contraseña?</a>
                            </div>
                        </div>
                        <footer className="mt-8 text-center text-sm text-[#9eb7a8]">
                            <p>© 2024 Municipalidad Distrital de La Perla. Todos los derechos reservados.</p>
                        </footer>
                    </div>
                </div>
            </div>
        </section>
    )
}