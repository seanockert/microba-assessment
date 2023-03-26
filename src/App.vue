<template>
  <main class="grid-acb">
    <header class="header">
      <h1>
        <svg height="32" viewBox="0 0 512 512" aria-hidden="true">
          <path
            fill="currentColor"
            d="M253.4 2.9C249.2 1 244.7 0 240 0s-9.2 1-13.4 2.9L38.3 82.8C16.3 92.1-.1 113.8 0 140c.5 99.2 41.3 280.7 213.6 363.2c16.7 8 36.1 8 52.8 0C438.7 420.7 479.5 239.2 480 140c.1-26.2-16.3-47.9-38.3-57.2L253.4 2.9zM144.9 286.2c4.8 1.2 9.9 1.8 15.1 1.8c35.3 0 64-28.7 64-64V160h44.2c12.1 0 23.2 6.8 28.6 17.7L304 192h64c8.8 0 16 7.2 16 16v32c0 44.2-35.8 80-80 80H256v50.7c0 7.3-5.9 13.3-13.3 13.3c-1.8 0-3.6-.4-5.2-1.1l-98.7-42.3c-6.6-2.8-10.8-9.3-10.8-16.4c0-2.8 .6-5.5 1.9-8l15-30zM144 160h40 8v32 32c0 17.7-14.3 32-32 32s-32-14.3-32-32V176c0-8.8 7.2-16 16-16zm128 48a16 16 0 1 0 -32 0 16 16 0 1 0 32 0z" />
        </svg>
        Dog Breeds
      </h1>
    </header>
    <section class="content stack">
      <h2 v-show="images && images.length > 0">
        <span
          >Here's {{ images?.length }} cute photos of
          <span class="text-capitalize">{{ selectedBreeds.join(' &amp; ') }}</span></span
        >
      </h2>
      <ImageList
        :images="images"
        :limit="BREED_LIMIT"
        :loading="loadingImages"
        :error="imagesError"
        @remove-image="removeImage" />
    </section>
    <div class="filters stack">
      <div>
        <label for="image-count">Number of images</label>
        <input type="number" v-model="imageCount" id="image-count" />
      </div>
      <BreedList
        :breeds="breeds"
        :selectedBreeds="selectedBreeds"
        :limit="BREED_LIMIT"
        :loading="loadingBreeds"
        :error="breedsError"
        @update-selected-breeds="updateSelectedBreeds" />
    </div>
  </main>
</template>

<script lang="ts">
interface IBreeds {
  breeds: { [key: string]: string[] };
  timestamp: number;
}

interface IImage {
  src: string;
  breed: string;
}

export type { IBreeds, IImage };
</script>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ImageList from './components/ImageList.vue';
import BreedList from './components/BreedList.vue';
import { watchDebounced } from '@vueuse/core';
import { divideEqualParts, shuffleArray } from './utils';

const DOG_API = import.meta.env.VITE_DOG_API;
const STORAGE_KEY_BREEDS = import.meta.env.VITE_STORAGE_KEY_BREEDS;
const STORAGE_KEY_SELECTED_BREEDS = import.meta.env.VITE_STORAGE_KEY_SELECTED_BREEDS;

const BREED_LIMIT = 2; // App works with any limit where selectedBreeds is less than imageCount
const BREED_CACHE_TIME = 24; // In hour

const breeds = ref<IBreeds | null>(null);
const loadingBreeds = ref(false);
const breedsError = ref<string | null>(null);
const images = ref<IImage[] | null>(null);
const imagesError = ref<string | null>(null);
const loadingImages = ref(false);
const imageCount = ref<number>(10);
const selectedBreeds = ref<string[]>([]);

// Error handler helper
const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

/** API Requests
 * We could move these to a separate service but not necessary for a small app
 * functions could return a tuple, where either date or error is null
 * [data, error]
 * We'd have to handle the loading state outside of the service
 */

// Get the breeds from API
const fetchBreeds = async () => {
  loadingBreeds.value = true;
  try {
    const res = await fetch(`${DOG_API}breeds/list/all`);
    breeds.value = await res.json().then((data) => {
      return {
        breeds: data.message as IBreeds['breeds'],
        timestamp: new Date().getTime()
      };
    });

    localStorage.setItem(STORAGE_KEY_BREEDS, JSON.stringify(breeds.value));
  } catch (error) {
    breedsError.value = getErrorMessage(error);
  } finally {
    loadingBreeds.value = false;
  }
};

// Get dog images from API by breed
// Flexible to handle any number of breeds
const fetchBreedImages = async () => {
  try {
    loadingImages.value = true;
    const imagesByBreed = await Promise.all(
      selectedBreeds.value.map(async (breed, index) => {
        const res = await fetch(`${DOG_API}breed/${breed}/images`);
        return res.json().then((data) => {
          return { images: data.message, breed: selectedBreeds.value[index] };
        });
      })
    );
    selectImages(imagesByBreed);
  } catch (error) {
    imagesError.value = getErrorMessage(error);
  } finally {
    loadingImages.value = false;
  }
};

/* Select N random images from multiple dog breeds and combine into one array
 * An alternative output to send to ImageList would be:
 * {
 *  breedA: [img1, img2, ...],
 *  breedB: [img3, img4, ...],
 * }
 * Then we could add subheadings for each breed
 */
const selectImages = (imagesByBreed: { images: any; breed: string }[]) => {
  // Show an equal amount of images from each breed
  const equalParts = divideEqualParts(imageCount.value, selectedBreeds.value.length);
  images.value = imagesByBreed
    .map((breedImages, index) => {
      // Randomise the selected images
      return shuffleArray(breedImages.images)
        .slice(0, equalParts[index])
        .map((src) => {
          return {
            src,
            breed: breedImages.breed
          };
        });
    })
    .flat();
};

// Callback from BreedList - update the breed images
const updateSelectedBreeds = (breeds: string[]) => {
  selectedBreeds.value = breeds;
  if (selectedBreeds.value.length > 0) {
    fetchBreedImages();
    localStorage.setItem(STORAGE_KEY_SELECTED_BREEDS, JSON.stringify(selectedBreeds.value));
  } else {
    images.value = null;
    localStorage.removeItem(STORAGE_KEY_SELECTED_BREEDS);
  }
};

// Callback from ImageList = remove an image from the list
const removeImage = (src: string) => {
  if (images.value) {
    images.value = images.value.filter((image) => image.src !== src);
    const updatedBreeds = [...new Set(images.value.map((image) => image.breed))];

    if (updatedBreeds.length !== selectedBreeds.value.length) {
      selectedBreeds.value = updatedBreeds.sort();
    }
  }
};

onMounted(async () => {
  const storedSelectedBreeds = localStorage.getItem(STORAGE_KEY_SELECTED_BREEDS);
  const storedBreeds = localStorage.getItem(STORAGE_KEY_BREEDS);

  // Load the breeds from local storage, if available.
  // This list probably doesn't change often so we can update it once every 24 hrs
  if (storedBreeds && (Date.now() - JSON.parse(storedBreeds).timestamp) / 3600000 < BREED_CACHE_TIME) {
    breeds.value = JSON.parse(storedBreeds);
  } else {
    fetchBreeds();
  }

  // Load the selected breeds from local storage, if available
  if (storedSelectedBreeds) {
    selectedBreeds.value = JSON.parse(storedSelectedBreeds);
    fetchBreedImages();
  }
});

// Update images when imageCount is changed
watchDebounced(
  imageCount,
  () => {
    if (imageCount.value > 0 && selectedBreeds.value.length > 0) {
      fetchBreedImages();
    }
  },
  { debounce: 300, maxWait: 1000 }
);
</script>

<style scoped>
h2 span {
  text-transform: capitalize;
}
</style>
