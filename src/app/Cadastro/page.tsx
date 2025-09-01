"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

// ✅ Substituindo o toast do shadcn pelo Sonner
import { toast } from "sonner";

const schema = z
  .object({
    name: z.string().min(3, "Informe seu nome completo"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirm: z.string().min(6, "Confirme a senha"),
    terms: z.boolean().refine((v) => v, {
      message: "Aceite os termos de uso",
    }),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "As senhas não conferem",
  });

type FormValues = z.infer<typeof schema>;

//Importando a fonte que está no FIGMA, pro card title
import { Tsukimi_Rounded } from "next/font/google";

const tsukimi = Tsukimi_Rounded({
  subsets: ["latin"],
 weight: ["300", "400", "600"], // inclui leve, normal e semibold
});

//Importando a seta pra esquerda de "Voltar"
import Link from "next/link";
import { ArrowLeft } from "lucide-react";



export default function CadastroPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
      terms: false,
    },
    mode: "onTouched",
  });

  function onSubmit(values: FormValues) {
    // Somente front: simulando envio
    console.log("Payload (front-only):", values);

    // ✅ Sonner toast
    toast.success("Cadastro enviado com sucesso!");
  }



  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-800 transition-colors duration-500">
      <div className="relative flex w-[900px] h-[500px] rounded-lg overflow-hidden shadow-lg">

        {/* Coluna da seta*/}
        <div className="flex w-12 items-start justify-center bg-white">
          <Link
            href="/"
            className="mt-6 ml-4 text-black hover:text-red-900 transition-colors"
          >
            <ArrowLeft className="w-7 h-7" strokeWidth={1} />
          </Link>
        </div>

        {/* Coluna esquerda */}
        <div className="flex items-center justify-center w-1/2 bg-white  ">

          <Card className="w-full max-w-md border-0 shadow-none py-10 ">
            <CardHeader>
              <CardTitle className={`${tsukimi.className} text-3xl font-semibold text-red-900`}>Cadastro</CardTitle>
              <CardDescription className="text-[12px] text-black">Preencha os campos para fazer seu cadastro na plataforma.</CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-900 ">Nome completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite seu nome..." {...field} className=" border-red-900 focus-visible:ring-0 focus:border-red-90" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-900 ">E-mail</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Digite seu e-mail..." {...field} className=" border-red-900 focus-visible:ring-0 focus:border-red-90" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-900 ">Senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Digite sua senha..." {...field} className=" border-red-900 focus-visible:ring-0 focus:border-red-90" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-900">Confirmar senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Digite novamente sua senha..." {...field} className=" border-red-900 focus-visible:ring-0 focus:border-red-90" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} className=" border-red-900 focus-visible:ring-0 focus:border-red-90" />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal">
                            Aceito os termos de uso
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />


                </form>
              </Form>
            </CardContent>

            <CardFooter className="text-sm text-muted-foreground">
              {/* Você pode colocar aqui um Link para /login depois */}
            </CardFooter>
          </Card>
        </div>

        {/* Coluna direita: estica e dá padding uniforme */}
        <div className="flex w-1/2 bg-white p-8 items-stretch">
          {/* Card vermelho esticando 100% da altura e largura */}
          <Card className="w-full h-full bg-red-900 text-white flex flex-col border-0 shadow-none">
            <CardHeader>
              <CardTitle className={`${tsukimi.className} text-2xl font-normal text-white items-center justify-center text-center`}>Dados da Fazenda</CardTitle>
              <CardDescription className="text-[12px] !text-white/80 text-center">
                Preencha os campos com os dados da sua fazenda
              </CardDescription>
            </CardHeader>

            {/* ... conteúdo da coluna direita ... */}
            <Button
              type="submit"
              className="w-1/3 mx-auto border border-white text-white bg-transparent hover:bg-white hover:text-red-900 transition-colors"
            >
              Cadastrar
            </Button>

          </Card>
        </div>
      </div>
    </main>
  );
}
