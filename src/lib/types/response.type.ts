export type ErrorType = {
    message: string;
    error: any;
}

export type ResponseType = {
    message: string;
    data?: any | null;
    error?: ErrorType | null;
}