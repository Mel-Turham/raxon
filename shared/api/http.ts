import axios, { type AxiosRequestConfig } from "axios"

export const createHttpClient = (
  baseURL: string,
  headers?: Record<string, string>
) => axios.create({ baseURL, headers, timeout: 10_000, adapter: "fetch" })

export const revalidate = (seconds: number): AxiosRequestConfig => ({
  fetchOptions: { next: { revalidate: seconds } },
})

export const apiClient = createHttpClient("/api")

export const getJson = async <T>(path: string) =>
  (await apiClient.get<T>(path)).data
