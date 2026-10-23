import { api } from './api'

export interface Diretoria {
  id: string
  nome: string
  email: string
  descontoSocio: number | string
  exigeAprovacao: boolean
  ativo: boolean
  criadoEm?: string
  atualizadoEm?: string
}

export interface CreateDiretoriaPayload {
  nome: string
  email: string
  descontoSocio?: number
  exigeAprovacao?: boolean
}

export interface UpdateDiretoriaPayload {
  nome?: string
  email?: string
  descontoSocio?: number
  exigeAprovacao?: boolean
  ativo?: boolean
}

export async function listarDiretorias(): Promise<Diretoria[]> {
  const response = await api.get<Diretoria[]>('/admin/diretorias')
  return response.data
}

export async function criarDiretoria(
  data: CreateDiretoriaPayload,
): Promise<Diretoria> {
  const response = await api.post<Diretoria>('/admin/diretorias', data)
  return response.data
}

export async function editarDiretoria(
  id: string,
  data: UpdateDiretoriaPayload,
): Promise<Diretoria> {
  const response = await api.patch<Diretoria>(`/admin/diretorias/${id}`, data)
  return response.data
}

export const diretoriaService = {
  findAll: listarDiretorias,
  listar: listarDiretorias,
  getAll: listarDiretorias,
  create: criarDiretoria,
  criar: criarDiretoria,
  update: editarDiretoria,
  editar: editarDiretoria,
}

