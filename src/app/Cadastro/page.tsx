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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>Preencha seus dados para se cadastrar.</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Maria Silva" {...field} />
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
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="maria@email.com" {...field} />
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
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
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
                    <FormLabel>Confirmar senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
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
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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

              <Button type="submit" className="w-full">
                Cadastrar
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="text-sm text-muted-foreground">
          {/* Você pode colocar aqui um Link para /login depois */}
        </CardFooter>
      </Card>
    </div>
  );
}
