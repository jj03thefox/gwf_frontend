/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim, WorkboxPlugin } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute, createHandlerBoundToURL, PrecacheController } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { BackgroundSyncPlugin } from 'workbox-background-sync'
import { API_GATEWAY, BASE_URL, LANDMASS_OFFLINE_GEOJSON } from './constants'

declare const self: ServiceWorkerGlobalScope

clientsClaim()

console.log({ API_GATEWAY, BASE_URL, LANDMASS_OFFLINE_GEOJSON })

const precacheController = new PrecacheController()

self.addEventListener('install', (event) => {
  const plugins: WorkboxPlugin[] = [
    {
      cacheWillUpdate: async ({ event, request, response }) => {
        if (response && response.status && response.status >= 300) {
          return null
        }
        return response
      },
    },
  ]

  event.waitUntil(precacheController.install({ event, plugins }))
})

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST)

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$')
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }: { request: Request; url: URL }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false
    }

    // If this is a URL that starts with /_, skip.
    if (url.pathname.startsWith('/_')) {
      return false
    }

    // If this looks like a URL for a resource, because it contains
    // a file extension, skip.
    if (url.pathname.match(fileExtensionRegexp)) {
      return false
    }

    // Return true to signal that we want to use the handler.
    return true
  },
  createHandlerBoundToURL(BASE_URL + '/index.html')
)

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Any other custom service worker logic can go here.

// Precache GeoJson for offline use
precacheAndRoute([{ url: LANDMASS_OFFLINE_GEOJSON }])

// // Cache all requests to /public folder like /icons and manifest.json
// registerRoute(
//   ({ url }) =>
//     (url.origin === self.location.origin && url.pathname.startsWith('/icons')) ||
//     url.pathname.endsWith('manifest.json'),
//   new StaleWhileRevalidate({
//     cacheName: 'public',
//     plugins: [
//       // Ensure that once this runtime cache reaches a maximum size the
//       // least-recently used images are removed.
//       new ExpirationPlugin({ maxEntries: 100 }),
//       new BackgroundSyncPlugin('public-bg-sync', {
//         maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
//       }),
//     ],
//   })
// )

// // Cache gstatic resources (css and fonts)
// registerRoute(
//   ({ url }) => ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'].includes(url.origin),
//   new StaleWhileRevalidate({
//     cacheName: 'fonts',
//     plugins: [
//       // Ensure that once this runtime cache reaches a maximum size the
//       // least-recently used fonts are removed.
//       new ExpirationPlugin({ maxEntries: 10 }),
//       new BackgroundSyncPlugin('fonts-bg-sync', {
//         maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
//       }),
//     ],
//   })
// )

// // Cache locales
// registerRoute(
//   /\/locales\/.*/,
//   new StaleWhileRevalidate({
//     cacheName: 'locales',
//     plugins: [
//       new ExpirationPlugin({ maxEntries: 50 }),
//       new BackgroundSyncPlugin('locales-bg-sync', {
//         maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
//       }),
//     ],
//   })
// )

// // Cache API Auth Calls
// registerRoute(
//   ({ url }) => API_GATEWAY && url.origin === API_GATEWAY && url.pathname.match(/^\/auth\//),
//   new NetworkFirst({
//     cacheName: 'auth',
//     plugins: [
//       new ExpirationPlugin({
//         maxAgeSeconds: 24 * 60 * 60, // Auth requests cached expires in 24 hours
//       }),
//       new BackgroundSyncPlugin('auth-bg-sync', {
//         maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
//       }),
//     ],
//   })
// )

// // Cache API Calls
// registerRoute(
//   ({ url }) => API_GATEWAY && url.origin === API_GATEWAY && !url.pathname.match(/^\/auth\//),
//   new NetworkFirst({
//     cacheName: 'api',
//     plugins: [
//       new BackgroundSyncPlugin('api-bg-sync', {
//         maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
//       }),
//     ],
//   })
// )

// // Cache Public Tiles API Calls (bathymetry pngs & default pbfs)
// registerRoute(
//   ({ url }) =>
//     url.origin === 'https://storage.googleapis.com' &&
//     url.pathname.match(/^\/public-tiles\/basemap\//),
//   new StaleWhileRevalidate({
//     cacheName: 'tiles',
//     plugins: [
//       new BackgroundSyncPlugin('tiles-bg-sync', {
//         maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
//       }),
//     ],
//   })
// )

// // Cache map resources
// registerRoute(
//   ({ url }) =>
//     url.origin === 'https://raw.githubusercontent.com' &&
//     url.pathname.match(/^\/GlobalFishingWatch\/map-gl-sprites/),
//   new StaleWhileRevalidate({
//     cacheName: 'map-resources',
//     plugins: [
//       new BackgroundSyncPlugin('map-resources-bg-sync', {
//         maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
//       }),
//     ],
//   })
// )
