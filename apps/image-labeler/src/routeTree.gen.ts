/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as ProjectProjectIdImport } from './routes/project.$projectId'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const ProjectProjectIdRoute = ProjectProjectIdImport.update({
  id: '/project/$projectId',
  path: '/project/$projectId',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/project.$projectId.lazy').then((d) => d.Route),
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/project/$projectId': {
      id: '/project/$projectId'
      path: '/project/$projectId'
      fullPath: '/project/$projectId'
      preLoaderRoute: typeof ProjectProjectIdImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/project/$projectId': typeof ProjectProjectIdRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/project/$projectId': typeof ProjectProjectIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/project/$projectId': typeof ProjectProjectIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/project/$projectId'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/project/$projectId'
  id: '__root__' | '/' | '/project/$projectId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  ProjectProjectIdRoute: typeof ProjectProjectIdRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  ProjectProjectIdRoute: ProjectProjectIdRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/project/$projectId"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/project/$projectId": {
      "filePath": "project.$projectId.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
