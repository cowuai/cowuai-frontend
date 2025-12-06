import { ApiRequestError } from "./apiRequestError";

export async function handleResponse(response: Response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new ApiRequestError(
            errorData.message || "Ocorreu um erro na requisição.",
            response.status,
            errorData.errors // Conforme o backend manda
        );
    }
    return response.json();
}