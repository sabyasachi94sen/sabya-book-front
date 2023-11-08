import { Link, Outlet, RootRoute, Route, Router } from '@tanstack/react-router';
import { Login } from './component/login';
import { Home } from './component/home';
import { Register } from './component/register';
import React from "react";
import Layout from "./pages/layout";
import getLocalStorage from './helpers/getLocalStorage';
import { Dashboard } from './component/dashboard';
import NotificationPost from './component/notificationPost';
import Profile from './component/profile';


const rootRoute = new RootRoute({
  component: Layout,
})


const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
})


const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: Register,
})

const homeRoute = new Route({
  getParentRoute: () => indexRoute,
  path: '/home',
  component: Home,
})

const postRoute = new Route({
  getParentRoute: () => indexRoute,
  path: '/post/$id',
  component: NotificationPost,
})

const profileRoute = new Route({
  getParentRoute: () => indexRoute,
  path: '/profile/$id',
  component: Profile,
})



// Create the route tree using your routes
const routeTree = rootRoute.addChildren([
  indexRoute.addChildren([homeRoute, postRoute,profileRoute]),
  registerRoute
])

// Create the router using your route tree
const router = new Router({ routeTree })
export default router;
