import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type {
  CreateDiretoriaPayload,
  Diretoria,
  UpdateDiretoriaPayload,
} from '../services/diretoria.service'

interface DiretoriaModalProps {
  isOpen: boolean
  diretoria?: Diretoria | null
  onClose: () => void
  onSubmit: (
    payload: CreateDiretoriaPayload | UpdateDiretoriaPayload,
  ) => Promise<void>
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function DiretoriaModalForm({
  diretoria,
  onClose,
  onSubmit,
}: Omit<DiretoriaModalProps, 'isOpen'>) {
  const isEditing = Boolean(diretoria)

  const [nome, setNome] = useState(() => diretoria?.nome ?? '')
  const [email, setEmail] = useState(() => diretoria?.email ?? '')
  const [descontoSocio, setDescontoSocio] = useState(() =>
    diretoria ? String(Number(diretoria.descontoSocio ?? 0)) : '0',
  )
  const [exigeAprovacao, setExigeAprovacao] = useState(() =>
    diretoria ? Boolean(diretoria.exigeAprovacao) : true,
  )
  const [ativo, setAtivo] = useState(() =>
    diretoria ? Boolean(diretoria.ativo) : true,
  )
  const [errors, setErrors] = useState<{
    nome?: string
    email?: string
    descontoSocio?: string
    submit?: string
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const nextErrors: {
      nome?: string
      email?: string
      descontoSocio?: string
    } = {}

    if (!nome.trim()) {
      nextErrors.nome = 'O nome da atlética é obrigatório'
    }

    if (!email.trim()) {
      nextErrors.email = 'O e-mail é obrigatório'
    } else if (!EMAIL_REGEX.test(email.trim())) {
      nextErrors.email = 'Formato de e-mail inválido'
    }

    const parsedDesconto =
      descontoSocio.trim() === '' ? 0 : Number(descontoSocio)
    if (
      Number.isNaN(parsedDesconto) ||
      parsedDesconto < 0 ||
      parsedDesconto > 100
    ) {
      nextErrors.descontoSocio = 'Desconto deve estar entre 0 e 100'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)
    setErrors({})

    const parsedDesconto =
      descontoSocio.trim() === '' ? 0 : Number(descontoSocio)

    const payload: CreateDiretoriaPayload | UpdateDiretoriaPayload = isEditing
      ? {
          nome: nome.trim(),
          email: email.trim(),
          descontoSocio: parsedDesconto,
          exigeAprovacao,
          ativo,
        }
      : {
          nome: nome.trim(),
          email: email.trim(),
          descontoSocio: parsedDesconto,
          exigeAprovacao,
        }

    try {
      await onSubmit(payload)
      onClose()
    } catch (err: unknown) {
      let message = 'Não foi possível salvar a atlética. Tente novamente.'
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: unknown } } }).response
          ?.data?.message !== 'undefined'
      ) {
        const apiMessage = (
          err as { response?: { data?: { message?: string | string[] } } }
        ).response?.data?.message
        if (Array.isArray(apiMessage)) {
          message = apiMessage.join(', ')
        } else if (typeof apiMessage === 'string') {
          message = apiMessage
        }
      }
      setErrors({ submit: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="diretoria-modal-title"
    >
      <div className="flex max-h-[95vh] w-full flex-col overflow-hidden rounded-t-card bg-white shadow-xl sm:max-w-lg sm:rounded-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
          <h2
            id="diretoria-modal-title"
            className="text-lg font-extrabold uppercase tracking-wide text-primary sm:text-xl"
          >
            {isEditing ? 'EDITAR ATLÉTICA' : 'NOVA ATLÉTICA'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="flex h-9 w-9 items-center justify-center rounded-button text-text-muted transition-colors hover:bg-bg-muted hover:text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-1 flex-col overflow-y-auto"
        >
          <div className="space-y-4 px-4 py-5 sm:px-6">
            {errors.submit && (
              <div
                role="alert"
                className="rounded-button bg-error-bg px-4 py-3 text-sm font-medium text-error-text"
              >
                {errors.submit}
              </div>
            )}

            <div>
              <label
                htmlFor="diretoria-nome"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted"
              >
                Nome <span className="text-error-text">*</span>
              </label>
              <input
                id="diretoria-nome"
                name="nome"
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: A.A.A.I. Trojan"
                className="w-full rounded-button border border-border px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              {errors.nome && (
                <p className="mt-1 text-xs font-medium text-error-text">
                  {errors.nome}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="diretoria-email"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted"
              >
                E-mail <span className="text-error-text">*</span>
              </label>
              <input
                id="diretoria-email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex.: contato@atletica.ufms.br"
                className="w-full rounded-button border border-border px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              {errors.email && (
                <p className="mt-1 text-xs font-medium text-error-text">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="diretoria-desconto"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted"
              >
                Desconto de sócio (%)
              </label>
              <input
                id="diretoria-desconto"
                name="descontoSocio"
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={descontoSocio}
                onChange={(e) => setDescontoSocio(e.target.value)}
                placeholder="0"
                className="w-full rounded-button border border-border px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              {errors.descontoSocio && (
                <p className="mt-1 text-xs font-medium text-error-text">
                  {errors.descontoSocio}
                </p>
              )}
            </div>

            <div>
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                Exige aprovação de não-estudantes?
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setExigeAprovacao(true)}
                  aria-pressed={exigeAprovacao}
                  className={`min-h-[42px] rounded-button border px-4 py-2 text-sm font-semibold transition-colors ${
                    exigeAprovacao
                      ? 'border-accent bg-info-bg text-info-text'
                      : 'border-border bg-bg-muted text-text-muted hover:bg-gray-200'
                  }`}
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => setExigeAprovacao(false)}
                  aria-pressed={!exigeAprovacao}
                  className={`min-h-[42px] rounded-button border px-4 py-2 text-sm font-semibold transition-colors ${
                    !exigeAprovacao
                      ? 'border-accent bg-info-bg text-info-text'
                      : 'border-border bg-bg-muted text-text-muted hover:bg-gray-200'
                  }`}
                >
                  Não
                </button>
              </div>
            </div>

            {isEditing && (
              <div>
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Status
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAtivo(true)}
                    aria-pressed={ativo}
                    className={`min-h-[42px] rounded-button border px-4 py-2 text-sm font-semibold transition-colors ${
                      ativo
                        ? 'border-success-text bg-success-bg text-success-text'
                        : 'border-border bg-bg-muted text-text-muted hover:bg-gray-200'
                    }`}
                  >
                    Ativa
                  </button>
                  <button
                    type="button"
                    onClick={() => setAtivo(false)}
                    aria-pressed={!ativo}
                    className={`min-h-[42px] rounded-button border px-4 py-2 text-sm font-semibold transition-colors ${
                      !ativo
                        ? 'border-error-text bg-error-bg text-error-text'
                        : 'border-border bg-bg-muted text-text-muted hover:bg-gray-200'
                    }`}
                  >
                    Inativa
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-border bg-white px-4 py-4 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="min-h-[44px] flex-1 rounded-button bg-bg-muted px-4 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-200 disabled:opacity-50 sm:flex-none sm:px-5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[44px] flex-1 rounded-button bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary disabled:opacity-50 sm:flex-none sm:px-6"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function DiretoriaModal({
  isOpen,
  diretoria,
  onClose,
  onSubmit,
}: DiretoriaModalProps) {
  if (!isOpen) return null

  return (
    <DiretoriaModalForm
      key={diretoria?.id ?? 'new'}
      diretoria={diretoria}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  )
}

