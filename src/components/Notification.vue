<template>
  <div aria-live="assertive" v-if="show" class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6">
    <div class="flex w-full h-full flex-col items-center space-y-5 sm:items-center sm:justify-end">
      <transition enter-active-class="transform ease-out duration-300 transition" enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2" enter-to-class="translate-y-0 opacity-100 sm:translate-x-0" leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="p-4">
            <div class="flex items-start">
              <!-- Si la réponse est vraie, affiche ceci -->
              <div v-if="isValid" class="w-full">
                <div class="flex-shrink-0">
                  <CheckCircleIcon class="h-6 w-6 text-green-400" aria-hidden="true" />
                </div>
                <div class="ml-3 w-full flex-1 pt-0.5">
                  <p class="text-sm font-medium text-gray-900">Bonne réponse</p>
                  <p class="mt-1 text-sm text-gray-500">Continue comme cela</p>
                </div>
              </div>
              <!-- Si la réponse est fausse, affiche ceci -->
              <div v-else class="w-full">
                <div class="flex-shrink-0">
                  <XCircleIcon class="h-6 w-6 text-red-400" aria-hidden="true" />
                </div>
                <div class="ml-3 w-full flex-1 pt-0.5">
                  <p class="text-sm font-medium text-gray-900">Mauvaise réponse</p>
                  <p class="mt-1 text-sm text-gray-500">La réponse était : {{ correctAnswer }}</p>
                </div>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button type="button" @click="show = false" class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import { XCircleIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/20/solid'

import { defineProps } from 'vue';

const props = defineProps({
  show: Boolean,
  isValid: Boolean, // Nouvelle prop pour indiquer si la réponse est valide ou non
  correctAnswer: String // Nouvelle prop pour afficher la réponse correcte en cas de réponse incorrecte
});
</script>
