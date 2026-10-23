import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, Building2, Loader2, Pencil, RefreshCw } from 'lucide-react'
import { DiretoriaModal } from '../components/DiretoriaModal'
import {
  criarDiretoria,
  editarDiretoria,
  listarDiretorias,
  type CreateDiretoriaPayload,
  type Diretoria,
  type UpdateDiretoriaPayload,
} from '../services/diretoria.service'

function formatDesconto(value: number | string | undefined): string {
  const num = Number(value ?? 0)
  if (Number.isNaN(num)) return '0%'
  return `${num}%`
}

export function DiretoriasPage() {
  const [diretorias, setDiretorias] = useState<Diretoria[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDiretoria, setSelectedDiretoria] = useState<Diretoria | null>(
    null,
  )

  const reloadDiretorias = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await listarDiretorias()
      setDiretorias(Array.isArray(data) ? data : [])
    } catch {
      setError(
        'Não foi possível carregar as atléticas. Verifique sua conexão e tente novamente.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    listarDiretorias()
      .then((data) => {
        if (!active) return
        setDiretorias(Array.isArray(data) ? data : [])
        setError(null)
      })
      .catch(() => {
        if (!active) return
        setError(
          'Não foi possível carregar as atléticas. Verifique sua conexão e tente novamente.',
        )
      })
      .finally(() => {
        if (!active) return
        setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const handleOpenCreate = () => {
    setSelectedDiretoria(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (diretoria: Diretoria) => {
    setSelectedDiretoria(diretoria)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedDiretoria(null)
  }

  const handleSubmitModal = async (
    payload: CreateDiretoriaPayload | UpdateDiretoriaPayload,
  ) => {
    if (selectedDiretoria) {
      const updated = await editarDiretoria(selectedDiretoria.id, payload)
      setDiretorias((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      )
    } else {
      const created = await criarDiretoria(payload as CreateDiretoriaPayload)
      setDiretorias((prev) => [...prev, created])
    }
    const freshList = await listarDiretorias()
    if (Array.isArray(freshList)) {
      setDiretorias(freshList)
    }
  }

  return (
    <div className="min-h-screen bg-bg-muted px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold uppercase tracking-tight text-primary sm:text-3xl">
              GESTÃO DE ATLÉTICAS
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              Cadastre e edite as atléticas da plataforma
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-button bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary sm:w-auto"
          >
            + Nova Atlética
          </button>
        </header>

        <section className="overflow-hidden rounded-card border border-border bg-white shadow-sm">
          {isLoading ? (
            <div
              role="status"
              className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center"
            >
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <p className="text-sm font-medium text-text-muted">
                Carregando atléticas...
              </p>
            </div>
          ) : error ? (
            <div
              role="alert"
              className="flex flex-col items-center justify-center gap-4 px-4 py-12 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-bg text-error-text">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="max-w-md space-y-1">
                <p className="text-base font-semibold text-gray-900">
                  Erro ao carregar dados
                </p>
                <p className="text-sm text-text-muted">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => void reloadDiretorias()}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-button bg-bg-muted px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-gray-200"
              >
                <RefreshCw className="h-4 w-4" />
                Tentar novamente
              </button>
            </div>
          ) : diretorias.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-info-bg text-info-text">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-gray-900">
                  Nenhuma atlética cadastrada
                </p>
                <p className="text-sm text-text-muted">
                  Clique em &quot;+ Nova Atlética&quot; para cadastrar a
                  primeira atlética.
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted sm:px-6"
                    >
                      NOME
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted sm:px-6"
                    >
                      E-MAIL
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted sm:px-6"
                    >
                      DESC. SÓCIO
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted sm:px-6"
                    >
                      APROVAÇÃO
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted sm:px-6"
                    >
                      STATUS
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-text-muted sm:px-6"
                    >
                      AÇÕES
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm text-gray-900">
                  {diretorias.map((diretoria) => (
                    <tr
                      key={diretoria.id}
                      className="transition-colors hover:bg-bg-muted/60"
                    >
                      <td className="px-3 py-4 font-semibold text-gray-900 sm:px-6">
                        {diretoria.nome}
                      </td>
                      <td className="px-3 py-4 text-text-muted sm:px-6">
                        {diretoria.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 font-semibold text-primary sm:px-6">
                        {formatDesconto(diretoria.descontoSocio)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-gray-800 sm:px-6">
                        {diretoria.exigeAprovacao ? 'Exige' : 'Não exige'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 sm:px-6">
                        {diretoria.ativo ? (
                          <span className="inline-flex items-center rounded-full bg-success-bg px-3 py-1 text-xs font-semibold text-success-text">
                            Ativa
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-error-bg px-3 py-1 text-xs font-semibold text-error-text">
                            Inativa
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-right sm:px-6">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(diretoria)}
                          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-button border border-border bg-white px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-bg-muted"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <DiretoriaModal
        isOpen={isModalOpen}
        diretoria={selectedDiretoria}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
      />
    </div>
  )
}

export default DiretoriasPage

