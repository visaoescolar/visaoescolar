<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-bold text-slate-800 mb-2">{{ titulo }}</h3>
        <p class="text-sm text-slate-500 mb-6">{{ mensagem }}</p>
        <div class="flex justify-end gap-3">
          <button @click="aoCancelar"
            class="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 transition text-sm font-semibold">
            {{ textoCancelar }}
          </button>
          <button @click="aoConfirmar"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold shadow-sm">
            {{ textoConfirmar }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useConfirm } from '../composables/useConfirm.js'

const { visible, titulo, mensagem, textoConfirmar, textoCancelar, aoConfirmar, aoCancelar } = useConfirm()
</script>
