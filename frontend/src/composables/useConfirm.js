import { ref } from 'vue'

// Estado compartilhado (módulo singleton): um único diálogo global,
// chamável de qualquer componente via `const { confirmar } = useConfirm()`.
const visible = ref(false)
const titulo = ref('Confirmar ação')
const mensagem = ref('')
const textoConfirmar = ref('Confirmar')
const textoCancelar = ref('Cancelar')
let resolvePromise = null

function confirmar(opcoes) {
  if (typeof opcoes === 'string') {
    mensagem.value = opcoes
    titulo.value = 'Confirmar ação'
    textoConfirmar.value = 'Confirmar'
    textoCancelar.value = 'Cancelar'
  } else {
    mensagem.value = opcoes.mensagem || 'Tem certeza?'
    titulo.value = opcoes.titulo || 'Confirmar ação'
    textoConfirmar.value = opcoes.textoConfirmar || 'Confirmar'
    textoCancelar.value = opcoes.textoCancelar || 'Cancelar'
  }
  visible.value = true
  return new Promise((resolve) => {
    resolvePromise = resolve
  })
}

function aoConfirmar() {
  visible.value = false
  if (resolvePromise) {
    resolvePromise(true)
    resolvePromise = null
  }
}

function aoCancelar() {
  visible.value = false
  if (resolvePromise) {
    resolvePromise(false)
    resolvePromise = null
  }
}

export function useConfirm() {
  return { visible, titulo, mensagem, textoConfirmar, textoCancelar, confirmar, aoConfirmar, aoCancelar }
}
