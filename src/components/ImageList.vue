<template>
  <ul v-if="props.images && props.images.length > 0" class="grid-blocks-4 image-list">
    <li v-for="(image, index) in props.images" :key="image.src" :style="{ animationDelay: `${0.05 * index}s` }">
      <img :src="image.src" :alt="`Photo of a ${image.breed}`" :loading="index > 10 ? 'lazy' : undefined" />
      <button @click="(e) => removeImage(image.src)" class="button-remove" aria-label="Remove image">
        <svg height="18" viewBox="0 0 448 512">
          <title>Remove image</title>
          <path
            fill="currentColor"
            d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
        </svg>
      </button>
    </li>
  </ul>
  <div v-else-if="loading" class="callout">
    <svg width="32" height="32" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
        class="spinner" />
    </svg>
    Loading dog photos...
  </div>
  <div v-else-if="error" class="callout error">
    <svg height="28" viewBox="0 0 512 512" aria-hidden="true">
      <path
        fill="currentColor"
        d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c-13.3 0-24 10.7-24 24V264c0 13.3 10.7 24 24 24s24-10.7 24-24V152c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
    </svg>
    {{ error }}
  </div>
  <div v-else class="flex select-breed">
    <svg height="34" fill="none" viewBox="0 0 99 40" aria-hidden="true">
      <path
        fill="currentColor"
        d="M2 2.1V.6a1.5 1.5 0 0 0-1.4 2L2 2.2Zm23.8 11.1-1.2-.8-1 1.5 1.6.7.6-1.4Zm59.8 1.1 1.4-.5a1.5 1.5 0 0 0-2.2-.8l.8 1.3ZM96 33l.7 1.4 1.6-.8-1.1-1.5-1.2 1ZM24 22l1-1.3-1.3-1-.9 1.4 1.3.8ZM19 28.6l-1.2.9 1 1.4 1.3-1.3-1.1-1Zm-17-25a535.8 535.8 0 0 0 26.8.5 31 31 0 0 0 3.8-.4c.2-.1.7-.2 1-.6l-2-2.1.2-.2A532.8 532.8 0 0 1 2 .6l-.2 3Zm31.7-.5-.2.1-.4.2a1.5 1.5 0 0 1-1.7-1.8L31 2 29.4 5l-4.8 7.5 2.5 1.7a419.5 419.5 0 0 0 7-11.6s.2-.4 0-.8A1.5 1.5 0 0 0 32.5.5l-.7.3-.2.3 2 2Zm-8.4 11.4c6.3 2.7 16.8 5.8 28 6.9 11.3 1 23.6 0 33.2-6L84.8 13a50.5 50.5 0 0 1-31.2 5.5c-11-1-21.2-4.1-27.2-6.6l-1.2 2.7Zm59 .2 2 6a19.6 19.6 0 0 0 3.7 6.7c1 1.5 2.7 3.5 5 6.4l2.3-1.9-5-6.3a24 24 0 0 1-2-3l-1.2-3-2-5.9-2.8 1Zm11.1 16.8c-10.9 5.4-40.5 11-70.3-11L23.2 23C54 45.8 84.9 40.1 96.7 34.3l-1.4-2.7Zm-71.2-9.8-1.3-.8a22.5 22.5 0 0 1-1.6 2.3c-1 1.4-2.2 3-3.4 4.3l2.2 2a47.5 47.5 0 0 0 5.3-7l-1.2-.8Zm-4 6c-2.6-3.3-6.2-8.3-9.4-13.3-3.3-5-6.1-9.9-7.3-13L.6 2.8C1.9 6 4.9 11 8.2 16a205 205 0 0 0 9.5 13.5l2.4-1.9Z" />
    </svg>
    Select up to {{ limit }} breeds!
  </div>
</template>
<script setup lang="ts">
import type { IImage } from '../App.vue';
const emit = defineEmits<{
  (e: 'removeImage', src: string): void;
}>();

interface Props {
  images: IImage[] | null;
  limit: number;
  loading: boolean;
  error: string | null;
}

const props = defineProps<Props>();

const removeImage = (src: string) => {
  emit('removeImage', src);
};
</script>

<style scoped>
.image-list {
  min-height: 10rem;
}
.image-list li {
  position: relative;
  opacity: 0;
  transform: translate3d(0, 2.5rem, 0);
  animation: slideUp 0.2s forwards var(--easing-base);
}

.image-list img {
  background-color: var(--color-background);
  border-radius: var(--border-radius);
  min-height: 3rem;
  object-fit: contain;
  width: 100%;
}

.button-remove {
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 999px;
  color: var(--color-red);
  display: flex;
  height: 2rem;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  right: var(--padding-quarter);
  top: var(--padding-quarter);
  width: 2rem;
}

.button-remove:hover,
.button-remove:focus {
  background-color: var(--color-red);
  color: #fff;
}

.image-list li:hover .button-remove,
.image-list li:focus .button-remove,
.image-list li:focus-within .button-remove {
  opacity: 1;
  pointer-events: all;
}

.select-breed {
  font-weight: 600;
  justify-content: flex-start;
  padding-top: var(--padding-4x);
}

@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translate3d(0, 2rem, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
</style>
