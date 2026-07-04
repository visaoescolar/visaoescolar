import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useAuth() {
  const router = useRouter()

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const nomeUsuario = ref(usuario.nome || 'Usuário')
  const userRole = ref(usuario.tipo_usuario || usuario.tipo || 'professor')

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    router.push('/')
  }

  return { usuario, nomeUsuario, userRole, logout }
}
