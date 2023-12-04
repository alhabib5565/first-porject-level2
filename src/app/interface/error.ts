export type TerrorSources = {
    path: string | number,
    message: string
}[]


export type TGenericErrorResponse = {
    statusCode: number,
    message: string,
    errorSource: TerrorSources
}