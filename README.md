# Microba Assessment

## Demo

[https://so-microba-assessment.surge.sh](https://so-microba-assessment.surge.sh)

## Requirements

> List all breeds with a checkbox (displaying the number of sub-breeds under every top-level breed)Max 2 breeds can be selected.

Added checkbox list. On mobile, stack order changes to: Header -> Filters -> Content

> Show 10 images from the selected breed, if two breeds are selected show 10 images in total 5 from each breed.

Made this a feature more flexible so we can set any number of selected breeds by changing `BREED_LIMIT`

> Ability to remove images, once all images of a breed are removed that breed should be unselected in the list.

Hover or tap on a image to reveal the trash icon. Tap the icon to remove the image. Breed deselected if all images of that breed are removed.

> Write service to communicate to external API components to call service to get data.

Kept fetch requests in App.vue

> User should be able to change the max number of images to be visible for the selected breed.

Debounced callback to update the images when this value changes

> If the browser is closed and reloaded app should remember user preference.

Store `selectedBreeds` in local storage and load images `onMounted`

> Looking for breed list and breed images to be a separate component.

Created `BreedList` and `ImageList` components

## Discussion

- I chose to use the Composition API mainly as a challenge to myself as I'm more familiar with the Options API of Vue 2. Composition API also has better Typescript support.
- I chose to use CSS for styling. For a larger project, I'd likely use SASS to utilise mixins, nesting, and partials.

## TODO Improvements

- Split the API requests into a separate service
- Break down resuable parts into components
- Add unit tests with Jest
- Masonry layout for images, since they are all different dimensions. There's a few ways to do this. CSS Grid masonry would be best but it's not widely supported yet.
- Cancel pending fetch requests when a new one comes in to prevent race conditions (`AbortController`)
- Project builds with `Vite` (esbuild) so production bundle targets latest browsers. If it's necessary to support older browsers, we can use `@vite/plugin-legacy` and `axios`
- Set the breeds through URL params eg. `https://example.com/?breeds[]=beagle&breeds[]=dalmation`. We'd need to validate that the values are real breeds before fetching images

## API Improvements

- could have a `limit` option to limit the number of images returned
- images by breed endpoint could accept multiple breeds
- images could return their height and width so we can precalulate their size and reduce cumulative layout shift
