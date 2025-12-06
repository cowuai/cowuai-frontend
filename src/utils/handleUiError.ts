import { toast } from "sonner";
import { ZodError } from "zod";
import { ApiRequestError } from "./apiRequestError";

interface HandleUiErrorOptions {
    defaultMessage?: string;
    logError?: boolean;
}

export function handleUiError(err: unknown, options: HandleUiErrorOptions = {}) {
    const {
        defaultMessage = "Ocorreu um erro inesperado.",
        logError = true
    } = options;

    if (logError) {
        // Isso ajuda a debugar erros reais vs validação
        if (err instanceof ZodError) {
            console.warn("Erro de validação (Zod Front-end):", err.issues);
        } else {
            console.error("Erro capturado na UI:", err);
        }
    }

    // Cenario 1: Erro de Validação do Frontend (disparado pelo .parse do Zod)
    if (err instanceof ZodError) {
        const validationMessages = err.issues.map((e) => `- ${e.message}`).join("\n");

        toast.error(`Verifique os campos abaixo:\n${validationMessages}`, {
            style: { whiteSpace: "pre-line" },
            duration: 5000,
        });
        return;
    }

    // Cenario 2: Erro vindo do Backend (ApiRequestError)
    if (err instanceof ApiRequestError) {
        // Sub-cenário: Erros de validação retornados pela API
        if (err.errors && err.errors.length > 0) {
            // Formata igual ao erro do front para manter consistência visual
            const validationMessages = err.errors.map((e) => `- ${e.message}`).join("\n");

            toast.error(`Erros de validação:\n${validationMessages}`, {
                style: { whiteSpace: "pre-line" },
                duration: 5000,
            });
            return;
        }

        // Sub-cenário: Erro de regra de negócio (ex: "ID não encontrado")
        toast.error(err.message);
        return;
    }

    // Cenario 3: Erro genérico
    const genericMessage = (err instanceof Error && err.message)
        ? err.message
        : defaultMessage;

    // Se a mensagem for o JSON bruto (acontece as vezes se o erro for mal formado), forçamos o default
    const finalMessage = genericMessage.startsWith("[") || genericMessage.startsWith("{")
        ? defaultMessage
        : genericMessage;

    toast.error(finalMessage);
}