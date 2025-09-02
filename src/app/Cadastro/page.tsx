"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

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

import { Tsukimi_Rounded } from "next/font/google";

const tsukimi = Tsukimi_Rounded({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

const schema = z
  .object({
    name: z.string().min(3, "Informe seu nome completo"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirm: z.string().min(6, "Confirme a senha"),
    terms: z.boolean().refine((v) => v, {
      message: "Aceite os termos de uso",
    }),
    farmName: z.string().min(3, "Informe o nome da fazenda"),
    address: z.string().min(5, "Informe o endereço"),
    city: z.string().min(2, "Informe a cidade"),
    size: z.number().min(1, "Informe o porte da fazenda"),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "As senhas não conferem",
  });

type FormValues = z.infer<typeof schema>;

export default function CadastroPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
      terms: false,
      farmName: "",
      address: "",
      city: "",
      size: 1,
    },
    mode: "onTouched",
  });

  function onSubmit(values: FormValues) {
    console.log("Payload (front-only):", values);
    toast.success("Cadastro enviado com sucesso!");
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-800 transition-colors duration-500">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-[1000px] h-[650px] rounded-lg overflow-hidden shadow-lg"
        >
          <div className="flex w-12 items-start justify-center bg-white">
            <Link
              href="/"
              className="mt-6 ml-4 text-black hover:text-red-900 transition-colors"
            >
              <ArrowLeft className="w-7 h-7" strokeWidth={1} />
            </Link>
          </div>
          <div className="flex items-center justify-center w-1/2 bg-white">
            <Card className="w-full max-w-md border-0 shadow-none py-10">
              <CardHeader>
                <CardTitle
                  className={`${tsukimi.className} text-3xl font-semibold text-red-900`}
                >
                  Cadastro
                </CardTitle>
                <CardDescription className="text-[12px] text-black">
                  Preencha os campos para fazer seu cadastro na plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-900 ">
                          Nome completo
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite seu nome..."
                            {...field}
                            className=" border-red-900 focus-visible:ring-0 focus:border-red-90"
                          />
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
                          <Input
                            type="email"
                            placeholder="Digite seu e-mail..."
                            {...field}
                            className=" border-red-900 focus-visible:ring-0 focus:border-red-90"
                          />
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
                          <Input
                            type="password"
                            placeholder="Digite sua senha..."
                            {...field}
                            className=" border-red-900 focus-visible:ring-0 focus:border-red-90"
                          />
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
                        <FormLabel className="text-red-900">
                          Confirmar senha
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Digite novamente sua senha..."
                            {...field}
                            className=" border-red-900 focus-visible:ring-0 focus:border-red-90"
                          />
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
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className=" border-red-900 focus-visible:ring-0 focus:border-red-90"
                          />
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
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex w-1/2 bg-white p-8 items-stretch">
            <Card className="w-full h-full bg-red-900 text-white flex flex-col border-0 shadow-none">
              <CardHeader>
                <CardTitle
                  className={`${tsukimi.className} text-2xl font-normal text-white items-center justify-center text-center`}
                >
                  Dados da Fazenda
                </CardTitle>
                <CardDescription className="text-[12px] !text-white/80 text-center">
                  Preencha os campos com os dados da sua fazenda
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name="farmName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Fazenda</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o nome da fazenda..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço / Localidade</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o endereço da fazenda..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite a cidade..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>Defina o porte</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <span>Pequena</span>
                          <Slider
                            onValueChange={(val: number[]) => onChange(val[0])}
                            defaultValue={[1]}
                            max={3}
                            step={1}
                            className="w-full"
                            trackClassName="bg-black"
                            rangeClassName="bg-pink-300"
                            thumbClassName="h-4 w-4 bg-pink-300 focus-visible:ring-pink-300"
                          />
                          <span>Grande</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter className="flex-col gap-2 p-6">
                <Button
                  type="submit"
                  className="w-1/3 mx-auto border border-white text-white bg-red-900 hover:bg-red-800 transition-colors flex items-center justify-center"
                >
                  Cadastrar <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </Form>
    </main>
  );
}
