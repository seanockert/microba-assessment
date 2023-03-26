<template>
  <div class="flex header-breeds">
    Select breeds ({{ selectedBreeds.length }}/{{ props.limit }})<button
      v-show="selectedBreeds.length > 0"
      @click="(e) => (selectedBreeds = [])"
      class="button-clear">
      Clear
    </button>
  </div>
  <div v-if="props.breeds" class="scroll-container">
    <ul class="stack">
      <li v-for="(subBreed, breed) in props.breeds.breeds" :key="breed">
        <input
          type="checkbox"
          :id="`breed-${breed}`"
          :value="breed"
          :disabled="!selectedBreeds.includes(breed.toString()) && selectedBreeds.length >= props.limit"
          v-model="selectedBreeds" />
        <label :for="`breed-${breed}`">
          <div>
            <span class="text-capitalize">{{ breed }}</span>
            <div v-if="subBreed.length > 0" class="sub-breeds">
              {{ subBreed.length }} sub-breed{{ subBreed.length !== 1 ? 's' : null }}
            </div>
          </div>
        </label>
      </li>
    </ul>
  </div>
  <div v-else-if="loading" class="callout">
    <svg width="32" height="32" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
        class="spinner" />
    </svg>
    Loading...
  </div>
  <div v-else-if="error" class="callout error">
    <svg height="28" viewBox="0 0 512 512" aria-hidden="true">
      <path
        fill="currentColor"
        d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c-13.3 0-24 10.7-24 24V264c0 13.3 10.7 24 24 24s24-10.7 24-24V152c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
    </svg>
    {{ error }}
  </div>
</template>

<script setup async lang="ts">
import { ref, watch } from 'vue';
import type { IBreeds } from '../App.vue';

const props = defineProps<Props>();
const selectedBreeds = ref<string[]>(props.selectedBreeds);
const emit = defineEmits<{
  (e: 'updateSelectedBreeds', breeds: string[]): void;
}>();

interface Props {
  breeds: IBreeds | null;
  selectedBreeds: string[];
  limit: number;
  loading: boolean;
  error: string | null;
}

watch(selectedBreeds, (breeds: string[]) => {
  if (selectedBreeds.value.length <= props.limit) {
    // Sort breeds alphabetically
    emit('updateSelectedBreeds', breeds.sort());
  }
});

watch(
  () => props.selectedBreeds,
  (breeds) => {
    selectedBreeds.value = breeds;
  }
);
</script>

<style scoped>
.header-breeds {
  font-size: var(--font-size-small);
  justify-content: space-between;
}

.button-clear {
  color: var(--color-brand);
  text-decoration: underline;
  white-space: nowrap;
  margin: calc(var(--padding-half) * -1) 0;
}

.scroll-container {
  overflow: auto;
}

.scroll-container ul {
  overflow: hidden;
}

.sub-breeds {
  font-size: var(--font-size-small);
  color: var(--color-light);
  font-weight: normal;
}

/* Custom checkboxes */

label {
  cursor: pointer;
  display: block;
  outline: 0;
  display: flex;
  gap: var(--padding-half);
  align-items: center;
  padding: var(--padding-half);
}

input[type='checkbox'] {
  height: 1.5rem;
  margin: 0;
  opacity: 0;
  position: absolute;
  width: 1.5rem;
  z-index: 0;
  zoom: 1;
}

input[type='checkbox'] + label::before {
  border-radius: var(--border-radius);
  background: transparent;
  border: 2px solid var(--color-light);
  content: '';
  height: 1.5rem;
  flex: 0 0 auto;
  width: 1.5rem;
  align-self: flex-start;
}

input:checked + label {
  font-weight: 600;
}

input:checked + label::before {
  border-color: var(--color-background);
  background-color: var(--color-brand);
  box-shadow: 0 0 0 3px var(--color-brand-light);
}

input:focus + label::before {
  border-color: var(--color-brand);
  box-shadow: 0 0 0 3px var(--color-brand-light);
}

input:disabled + label,
input:disabled + label::before {
  cursor: not-allowed;
  opacity: 0.5;
}

@media screen and (max-width: 40rem) {
  .scroll-container {
    max-height: 15rem;
  }
}
</style>
