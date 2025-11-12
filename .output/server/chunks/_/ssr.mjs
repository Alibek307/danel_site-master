import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useQuery, QueryClient, QueryClientProvider, dehydrate, hydrate } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, redirect as redirect$1, RouterProvider, Link, useRouter, useMatch, rootRouteId as rootRouteId$1, ErrorComponent, useLocation, useNavigate, createRouter as createRouter$1 } from '@tanstack/react-router';
import * as React from 'react';
import { createContext, useEffect, useContext, useState, Fragment as Fragment$1 } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { ChefHat, Salad, Flame, Cookie, Cake, Phone, Mail, Instagram, MapPin, Monitor, Moon, Sun, Languages, PanelLeftOpen, PanelLeftClose, User, Settings, LogOut, ShoppingCart, Minus, Plus, Trash2, XIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Toaster as Toaster$1 } from 'sonner';
import { c as splitSetCookieString } from './nitro.mjs';
import { AsyncLocalStorage } from 'node:async_hooks';
import { defineHandlerCallback, renderRouterToStream } from '@tanstack/react-router/ssr/server';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'node:path';
import 'node:crypto';

function StartServer(props) {
  return /* @__PURE__ */ jsx(RouterProvider, { router: props.router });
}
const defaultStreamHandler = defineHandlerCallback(
  ({ request, router, responseHeaders }) => renderRouterToStream({
    request,
    router,
    responseHeaders,
    children: /* @__PURE__ */ jsx(StartServer, { router })
  })
);
const stateIndexKey = "__TSR_index";
function createHistory(opts) {
  let location = opts.getLocation();
  const subscribers = /* @__PURE__ */ new Set();
  const notify = (action) => {
    location = opts.getLocation();
    subscribers.forEach((subscriber) => subscriber({ location, action }));
  };
  const handleIndexChange = (action) => {
    if (opts.notifyOnIndexChange ?? true) notify(action);
    else location = opts.getLocation();
  };
  const tryNavigation = async ({
    task,
    navigateOpts,
    ...actionInfo
  }) => {
    var _a, _b;
    const ignoreBlocker = (navigateOpts == null ? void 0 : navigateOpts.ignoreBlocker) ?? false;
    if (ignoreBlocker) {
      task();
      return;
    }
    const blockers = ((_a = opts.getBlockers) == null ? void 0 : _a.call(opts)) ?? [];
    const isPushOrReplace = actionInfo.type === "PUSH" || actionInfo.type === "REPLACE";
    if (typeof document !== "undefined" && blockers.length && isPushOrReplace) {
      for (const blocker of blockers) {
        const nextLocation = parseHref(actionInfo.path, actionInfo.state);
        const isBlocked = await blocker.blockerFn({
          currentLocation: location,
          nextLocation,
          action: actionInfo.type
        });
        if (isBlocked) {
          (_b = opts.onBlocked) == null ? void 0 : _b.call(opts);
          return;
        }
      }
    }
    task();
  };
  return {
    get location() {
      return location;
    },
    get length() {
      return opts.getLength();
    },
    subscribers,
    subscribe: (cb) => {
      subscribers.add(cb);
      return () => {
        subscribers.delete(cb);
      };
    },
    push: (path, state, navigateOpts) => {
      const currentIndex = location.state[stateIndexKey];
      state = assignKeyAndIndex(currentIndex + 1, state);
      tryNavigation({
        task: () => {
          opts.pushState(path, state);
          notify({ type: "PUSH" });
        },
        navigateOpts,
        type: "PUSH",
        path,
        state
      });
    },
    replace: (path, state, navigateOpts) => {
      const currentIndex = location.state[stateIndexKey];
      state = assignKeyAndIndex(currentIndex, state);
      tryNavigation({
        task: () => {
          opts.replaceState(path, state);
          notify({ type: "REPLACE" });
        },
        navigateOpts,
        type: "REPLACE",
        path,
        state
      });
    },
    go: (index, navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.go(index);
          handleIndexChange({ type: "GO", index });
        },
        navigateOpts,
        type: "GO"
      });
    },
    back: (navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.back((navigateOpts == null ? void 0 : navigateOpts.ignoreBlocker) ?? false);
          handleIndexChange({ type: "BACK" });
        },
        navigateOpts,
        type: "BACK"
      });
    },
    forward: (navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.forward((navigateOpts == null ? void 0 : navigateOpts.ignoreBlocker) ?? false);
          handleIndexChange({ type: "FORWARD" });
        },
        navigateOpts,
        type: "FORWARD"
      });
    },
    canGoBack: () => location.state[stateIndexKey] !== 0,
    createHref: (str) => opts.createHref(str),
    block: (blocker) => {
      var _a;
      if (!opts.setBlockers) return () => {
      };
      const blockers = ((_a = opts.getBlockers) == null ? void 0 : _a.call(opts)) ?? [];
      opts.setBlockers([...blockers, blocker]);
      return () => {
        var _a2, _b;
        const blockers2 = ((_a2 = opts.getBlockers) == null ? void 0 : _a2.call(opts)) ?? [];
        (_b = opts.setBlockers) == null ? void 0 : _b.call(opts, blockers2.filter((b2) => b2 !== blocker));
      };
    },
    flush: () => {
      var _a;
      return (_a = opts.flush) == null ? void 0 : _a.call(opts);
    },
    destroy: () => {
      var _a;
      return (_a = opts.destroy) == null ? void 0 : _a.call(opts);
    },
    notify
  };
}
function assignKeyAndIndex(index, state) {
  if (!state) {
    state = {};
  }
  const key = createRandomKey();
  return {
    ...state,
    key,
    // TODO: Remove in v2 - use __TSR_key instead
    __TSR_key: key,
    [stateIndexKey]: index
  };
}
function createMemoryHistory(opts = {
  initialEntries: ["/"]
}) {
  const entries = opts.initialEntries;
  let index = opts.initialIndex ? Math.min(Math.max(opts.initialIndex, 0), entries.length - 1) : entries.length - 1;
  const states = entries.map(
    (_entry, index2) => assignKeyAndIndex(index2, void 0)
  );
  const getLocation = () => parseHref(entries[index], states[index]);
  return createHistory({
    getLocation,
    getLength: () => entries.length,
    pushState: (path, state) => {
      if (index < entries.length - 1) {
        entries.splice(index + 1);
        states.splice(index + 1);
      }
      states.push(state);
      entries.push(path);
      index = Math.max(entries.length - 1, 0);
    },
    replaceState: (path, state) => {
      states[index] = state;
      entries[index] = path;
    },
    back: () => {
      index = Math.max(index - 1, 0);
    },
    forward: () => {
      index = Math.min(index + 1, entries.length - 1);
    },
    go: (n) => {
      index = Math.min(Math.max(index + n, 0), entries.length - 1);
    },
    createHref: (path) => path
  });
}
function parseHref(href, state) {
  const hashIndex = href.indexOf("#");
  const searchIndex = href.indexOf("?");
  const addedKey = createRandomKey();
  return {
    href,
    pathname: href.substring(
      0,
      hashIndex > 0 ? searchIndex > 0 ? Math.min(hashIndex, searchIndex) : hashIndex : searchIndex > 0 ? searchIndex : href.length
    ),
    hash: hashIndex > -1 ? href.substring(hashIndex) : "",
    search: searchIndex > -1 ? href.slice(searchIndex, hashIndex === -1 ? void 0 : hashIndex) : "",
    state: state || { [stateIndexKey]: 0, key: addedKey, __TSR_key: addedKey }
  };
}
function createRandomKey() {
  return (Math.random() + 1).toString(36).substring(7);
}
function toHeadersInstance(init) {
  if (init instanceof Headers) {
    return new Headers(init);
  } else if (Array.isArray(init)) {
    return new Headers(init);
  } else if (typeof init === "object") {
    return new Headers(init);
  } else {
    return new Headers();
  }
}
function mergeHeaders(...headers) {
  return headers.reduce((acc, header) => {
    const headersInstance = toHeadersInstance(header);
    for (const [key, value] of headersInstance.entries()) {
      if (key === "set-cookie") {
        const splitCookies = splitSetCookieString(value);
        splitCookies.forEach((cookie) => acc.append("set-cookie", cookie));
      } else {
        acc.set(key, value);
      }
    }
    return acc;
  }, new Headers());
}
function json(payload, init) {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: mergeHeaders(
      { "content-type": "application/json" },
      init == null ? void 0 : init.headers
    )
  });
}
var prefix = "Invariant failed";
function invariant(condition, message) {
  if (condition) {
    return;
  }
  {
    throw new Error(prefix);
  }
}
function isPlainObject(o) {
  if (!hasObjectPrototype(o)) {
    return false;
  }
  const ctor = o.constructor;
  if (typeof ctor === "undefined") {
    return true;
  }
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  return true;
}
function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function createControlledPromise(onResolve) {
  let resolveLoadPromise;
  let rejectLoadPromise;
  const controlledPromise = new Promise((resolve, reject) => {
    resolveLoadPromise = resolve;
    rejectLoadPromise = reject;
  });
  controlledPromise.status = "pending";
  controlledPromise.resolve = (value) => {
    controlledPromise.status = "resolved";
    controlledPromise.value = value;
    resolveLoadPromise(value);
  };
  controlledPromise.reject = (e) => {
    controlledPromise.status = "rejected";
    rejectLoadPromise(e);
  };
  return controlledPromise;
}
const SEGMENT_TYPE_PATHNAME = 0;
const SEGMENT_TYPE_PARAM = 1;
const SEGMENT_TYPE_WILDCARD = 2;
const SEGMENT_TYPE_OPTIONAL_PARAM = 3;
function joinPaths(paths) {
  return cleanPath(
    paths.filter((val) => {
      return val !== void 0;
    }).join("/")
  );
}
function cleanPath(path) {
  return path.replace(/\/{2,}/g, "/");
}
function trimPathLeft(path) {
  return path === "/" ? path : path.replace(/^\/{1,}/, "");
}
function trimPathRight(path) {
  return path === "/" ? path : path.replace(/\/{1,}$/, "");
}
function trimPath(path) {
  return trimPathRight(trimPathLeft(path));
}
const parsePathname = (pathname, cache) => {
  if (!pathname) return [];
  const cached = cache == null ? void 0 : cache.get(pathname);
  if (cached) return cached;
  const parsed = baseParsePathname(pathname);
  cache == null ? void 0 : cache.set(pathname, parsed);
  return parsed;
};
const PARAM_RE = /^\$.{1,}$/;
const PARAM_W_CURLY_BRACES_RE = /^(.*?)\{(\$[a-zA-Z_$][a-zA-Z0-9_$]*)\}(.*)$/;
const OPTIONAL_PARAM_W_CURLY_BRACES_RE = /^(.*?)\{-(\$[a-zA-Z_$][a-zA-Z0-9_$]*)\}(.*)$/;
const WILDCARD_RE = /^\$$/;
const WILDCARD_W_CURLY_BRACES_RE = /^(.*?)\{\$\}(.*)$/;
function baseParsePathname(pathname) {
  pathname = cleanPath(pathname);
  const segments = [];
  if (pathname.slice(0, 1) === "/") {
    pathname = pathname.substring(1);
    segments.push({
      type: SEGMENT_TYPE_PATHNAME,
      value: "/"
    });
  }
  if (!pathname) {
    return segments;
  }
  const split = pathname.split("/").filter(Boolean);
  segments.push(
    ...split.map((part) => {
      const wildcardBracesMatch = part.match(WILDCARD_W_CURLY_BRACES_RE);
      if (wildcardBracesMatch) {
        const prefix2 = wildcardBracesMatch[1];
        const suffix = wildcardBracesMatch[2];
        return {
          type: SEGMENT_TYPE_WILDCARD,
          value: "$",
          prefixSegment: prefix2 || void 0,
          suffixSegment: suffix || void 0
        };
      }
      const optionalParamBracesMatch = part.match(
        OPTIONAL_PARAM_W_CURLY_BRACES_RE
      );
      if (optionalParamBracesMatch) {
        const prefix2 = optionalParamBracesMatch[1];
        const paramName = optionalParamBracesMatch[2];
        const suffix = optionalParamBracesMatch[3];
        return {
          type: SEGMENT_TYPE_OPTIONAL_PARAM,
          value: paramName,
          // Now just $paramName (no prefix)
          prefixSegment: prefix2 || void 0,
          suffixSegment: suffix || void 0
        };
      }
      const paramBracesMatch = part.match(PARAM_W_CURLY_BRACES_RE);
      if (paramBracesMatch) {
        const prefix2 = paramBracesMatch[1];
        const paramName = paramBracesMatch[2];
        const suffix = paramBracesMatch[3];
        return {
          type: SEGMENT_TYPE_PARAM,
          value: "" + paramName,
          prefixSegment: prefix2 || void 0,
          suffixSegment: suffix || void 0
        };
      }
      if (PARAM_RE.test(part)) {
        const paramName = part.substring(1);
        return {
          type: SEGMENT_TYPE_PARAM,
          value: "$" + paramName,
          prefixSegment: void 0,
          suffixSegment: void 0
        };
      }
      if (WILDCARD_RE.test(part)) {
        return {
          type: SEGMENT_TYPE_WILDCARD,
          value: "$",
          prefixSegment: void 0,
          suffixSegment: void 0
        };
      }
      return {
        type: SEGMENT_TYPE_PATHNAME,
        value: part.includes("%25") ? part.split("%25").map((segment) => decodeURI(segment)).join("%25") : decodeURI(part)
      };
    })
  );
  if (pathname.slice(-1) === "/") {
    pathname = pathname.substring(1);
    segments.push({
      type: SEGMENT_TYPE_PATHNAME,
      value: "/"
    });
  }
  return segments;
}
function matchPathname(basepath, currentPathname, matchLocation, parseCache) {
  const pathParams = matchByPath(
    basepath,
    currentPathname,
    matchLocation,
    parseCache
  );
  if (matchLocation.to && !pathParams) {
    return;
  }
  return pathParams ?? {};
}
function removeBasepath(basepath, pathname, caseSensitive = false) {
  const normalizedBasepath = caseSensitive ? basepath : basepath.toLowerCase();
  const normalizedPathname = caseSensitive ? pathname : pathname.toLowerCase();
  switch (true) {
    // default behaviour is to serve app from the root - pathname
    // left untouched
    case normalizedBasepath === "/":
      return pathname;
    // shortcut for removing the basepath if it matches the pathname
    case normalizedPathname === normalizedBasepath:
      return "";
    // in case pathname is shorter than basepath - there is
    // nothing to remove
    case pathname.length < basepath.length:
      return pathname;
    // avoid matching partial segments - strict equality handled
    // earlier, otherwise, basepath separated from pathname with
    // separator, therefore lack of separator means partial
    // segment match (`/app` should not match `/application`)
    case normalizedPathname[normalizedBasepath.length] !== "/":
      return pathname;
    // remove the basepath from the pathname if it starts with it
    case normalizedPathname.startsWith(normalizedBasepath):
      return pathname.slice(basepath.length);
    // otherwise, return the pathname as is
    default:
      return pathname;
  }
}
function matchByPath(basepath, from, {
  to,
  fuzzy,
  caseSensitive
}, parseCache) {
  if (basepath !== "/" && !from.startsWith(basepath)) {
    return void 0;
  }
  from = removeBasepath(basepath, from, caseSensitive);
  to = removeBasepath(basepath, `${to ?? "$"}`, caseSensitive);
  const baseSegments = parsePathname(
    from.startsWith("/") ? from : `/${from}`,
    parseCache
  );
  const routeSegments = parsePathname(
    to.startsWith("/") ? to : `/${to}`,
    parseCache
  );
  const params = {};
  const result = isMatch(
    baseSegments,
    routeSegments,
    params,
    fuzzy,
    caseSensitive
  );
  return result ? params : void 0;
}
function isMatch(baseSegments, routeSegments, params, fuzzy, caseSensitive) {
  var _a, _b, _c;
  let baseIndex = 0;
  let routeIndex = 0;
  while (baseIndex < baseSegments.length || routeIndex < routeSegments.length) {
    const baseSegment = baseSegments[baseIndex];
    const routeSegment = routeSegments[routeIndex];
    if (routeSegment) {
      if (routeSegment.type === SEGMENT_TYPE_WILDCARD) {
        const remainingBaseSegments = baseSegments.slice(baseIndex);
        let _splat;
        if (routeSegment.prefixSegment || routeSegment.suffixSegment) {
          if (!baseSegment) return false;
          const prefix2 = routeSegment.prefixSegment || "";
          const suffix = routeSegment.suffixSegment || "";
          const baseValue = baseSegment.value;
          if ("prefixSegment" in routeSegment) {
            if (!baseValue.startsWith(prefix2)) {
              return false;
            }
          }
          if ("suffixSegment" in routeSegment) {
            if (!((_a = baseSegments[baseSegments.length - 1]) == null ? void 0 : _a.value.endsWith(suffix))) {
              return false;
            }
          }
          let rejoinedSplat = decodeURI(
            joinPaths(remainingBaseSegments.map((d2) => d2.value))
          );
          if (prefix2 && rejoinedSplat.startsWith(prefix2)) {
            rejoinedSplat = rejoinedSplat.slice(prefix2.length);
          }
          if (suffix && rejoinedSplat.endsWith(suffix)) {
            rejoinedSplat = rejoinedSplat.slice(
              0,
              rejoinedSplat.length - suffix.length
            );
          }
          _splat = rejoinedSplat;
        } else {
          _splat = decodeURI(
            joinPaths(remainingBaseSegments.map((d2) => d2.value))
          );
        }
        params["*"] = _splat;
        params["_splat"] = _splat;
        return true;
      }
      if (routeSegment.type === SEGMENT_TYPE_PATHNAME) {
        if (routeSegment.value === "/" && !(baseSegment == null ? void 0 : baseSegment.value)) {
          routeIndex++;
          continue;
        }
        if (baseSegment) {
          if (caseSensitive) {
            if (routeSegment.value !== baseSegment.value) {
              return false;
            }
          } else if (routeSegment.value.toLowerCase() !== baseSegment.value.toLowerCase()) {
            return false;
          }
          baseIndex++;
          routeIndex++;
          continue;
        } else {
          return false;
        }
      }
      if (routeSegment.type === SEGMENT_TYPE_PARAM) {
        if (!baseSegment) {
          return false;
        }
        if (baseSegment.value === "/") {
          return false;
        }
        let _paramValue = "";
        let matched = false;
        if (routeSegment.prefixSegment || routeSegment.suffixSegment) {
          const prefix2 = routeSegment.prefixSegment || "";
          const suffix = routeSegment.suffixSegment || "";
          const baseValue = baseSegment.value;
          if (prefix2 && !baseValue.startsWith(prefix2)) {
            return false;
          }
          if (suffix && !baseValue.endsWith(suffix)) {
            return false;
          }
          let paramValue = baseValue;
          if (prefix2 && paramValue.startsWith(prefix2)) {
            paramValue = paramValue.slice(prefix2.length);
          }
          if (suffix && paramValue.endsWith(suffix)) {
            paramValue = paramValue.slice(0, paramValue.length - suffix.length);
          }
          _paramValue = decodeURIComponent(paramValue);
          matched = true;
        } else {
          _paramValue = decodeURIComponent(baseSegment.value);
          matched = true;
        }
        if (matched) {
          params[routeSegment.value.substring(1)] = _paramValue;
          baseIndex++;
        }
        routeIndex++;
        continue;
      }
      if (routeSegment.type === SEGMENT_TYPE_OPTIONAL_PARAM) {
        if (!baseSegment) {
          routeIndex++;
          continue;
        }
        if (baseSegment.value === "/") {
          routeIndex++;
          continue;
        }
        let _paramValue = "";
        let matched = false;
        if (routeSegment.prefixSegment || routeSegment.suffixSegment) {
          const prefix2 = routeSegment.prefixSegment || "";
          const suffix = routeSegment.suffixSegment || "";
          const baseValue = baseSegment.value;
          if ((!prefix2 || baseValue.startsWith(prefix2)) && (!suffix || baseValue.endsWith(suffix))) {
            let paramValue = baseValue;
            if (prefix2 && paramValue.startsWith(prefix2)) {
              paramValue = paramValue.slice(prefix2.length);
            }
            if (suffix && paramValue.endsWith(suffix)) {
              paramValue = paramValue.slice(
                0,
                paramValue.length - suffix.length
              );
            }
            _paramValue = decodeURIComponent(paramValue);
            matched = true;
          }
        } else {
          let shouldMatchOptional = true;
          for (let lookAhead = routeIndex + 1; lookAhead < routeSegments.length; lookAhead++) {
            const futureRouteSegment = routeSegments[lookAhead];
            if ((futureRouteSegment == null ? void 0 : futureRouteSegment.type) === SEGMENT_TYPE_PATHNAME && futureRouteSegment.value === baseSegment.value) {
              shouldMatchOptional = false;
              break;
            }
            if ((futureRouteSegment == null ? void 0 : futureRouteSegment.type) === SEGMENT_TYPE_PARAM || (futureRouteSegment == null ? void 0 : futureRouteSegment.type) === SEGMENT_TYPE_WILDCARD) {
              if (baseSegments.length < routeSegments.length) {
                shouldMatchOptional = false;
              }
              break;
            }
          }
          if (shouldMatchOptional) {
            _paramValue = decodeURIComponent(baseSegment.value);
            matched = true;
          }
        }
        if (matched) {
          params[routeSegment.value.substring(1)] = _paramValue;
          baseIndex++;
        }
        routeIndex++;
        continue;
      }
    }
    if (baseIndex < baseSegments.length && routeIndex >= routeSegments.length) {
      params["**"] = joinPaths(
        baseSegments.slice(baseIndex).map((d2) => d2.value)
      );
      return ((_b = routeSegments[routeSegments.length - 1]) == null ? void 0 : _b.value) !== "/";
    }
    if (routeIndex < routeSegments.length && baseIndex >= baseSegments.length) {
      for (let i = routeIndex; i < routeSegments.length; i++) {
        if (((_c = routeSegments[i]) == null ? void 0 : _c.type) !== SEGMENT_TYPE_OPTIONAL_PARAM) {
          return false;
        }
      }
      break;
    }
    break;
  }
  return true;
}
function isNotFound(obj) {
  return !!(obj == null ? void 0 : obj.isNotFound);
}
const rootRouteId = "__root__";
function isRedirect(obj) {
  return obj instanceof Response && !!obj.options;
}
function isResolvedRedirect(obj) {
  return isRedirect(obj) && !!obj.options.href;
}
const REQUIRED_PARAM_BASE_SCORE = 0.5;
const OPTIONAL_PARAM_BASE_SCORE = 0.4;
const WILDCARD_PARAM_BASE_SCORE = 0.25;
const BOTH_PRESENCE_BASE_SCORE = 0.05;
const PREFIX_PRESENCE_BASE_SCORE = 0.02;
const SUFFIX_PRESENCE_BASE_SCORE = 0.01;
const PREFIX_LENGTH_SCORE_MULTIPLIER = 2e-4;
const SUFFIX_LENGTH_SCORE_MULTIPLIER = 1e-4;
function handleParam(segment, baseScore) {
  if (segment.prefixSegment && segment.suffixSegment) {
    return baseScore + BOTH_PRESENCE_BASE_SCORE + PREFIX_LENGTH_SCORE_MULTIPLIER * segment.prefixSegment.length + SUFFIX_LENGTH_SCORE_MULTIPLIER * segment.suffixSegment.length;
  }
  if (segment.prefixSegment) {
    return baseScore + PREFIX_PRESENCE_BASE_SCORE + PREFIX_LENGTH_SCORE_MULTIPLIER * segment.prefixSegment.length;
  }
  if (segment.suffixSegment) {
    return baseScore + SUFFIX_PRESENCE_BASE_SCORE + SUFFIX_LENGTH_SCORE_MULTIPLIER * segment.suffixSegment.length;
  }
  return baseScore;
}
function processRouteTree({
  routeTree: routeTree2,
  initRoute
}) {
  const routesById = {};
  const routesByPath = {};
  const recurseRoutes = (childRoutes) => {
    childRoutes.forEach((childRoute, i) => {
      initRoute == null ? void 0 : initRoute(childRoute, i);
      const existingRoute = routesById[childRoute.id];
      invariant(
        !existingRoute,
        `Duplicate routes found with id: ${String(childRoute.id)}`
      );
      routesById[childRoute.id] = childRoute;
      if (!childRoute.isRoot && childRoute.path) {
        const trimmedFullPath = trimPathRight(childRoute.fullPath);
        if (!routesByPath[trimmedFullPath] || childRoute.fullPath.endsWith("/")) {
          routesByPath[trimmedFullPath] = childRoute;
        }
      }
      const children = childRoute.children;
      if (children == null ? void 0 : children.length) {
        recurseRoutes(children);
      }
    });
  };
  recurseRoutes([routeTree2]);
  const scoredRoutes = [];
  const routes = Object.values(routesById);
  routes.forEach((d2, i) => {
    var _a;
    if (d2.isRoot || !d2.path) {
      return;
    }
    const trimmed = trimPathLeft(d2.fullPath);
    let parsed = parsePathname(trimmed);
    let skip = 0;
    while (parsed.length > skip + 1 && ((_a = parsed[skip]) == null ? void 0 : _a.value) === "/") {
      skip++;
    }
    if (skip > 0) parsed = parsed.slice(skip);
    let optionalParamCount = 0;
    let hasStaticAfter = false;
    const scores = parsed.map((segment, index) => {
      if (segment.value === "/") {
        return 0.75;
      }
      let baseScore = void 0;
      if (segment.type === SEGMENT_TYPE_PARAM) {
        baseScore = REQUIRED_PARAM_BASE_SCORE;
      } else if (segment.type === SEGMENT_TYPE_OPTIONAL_PARAM) {
        baseScore = OPTIONAL_PARAM_BASE_SCORE;
        optionalParamCount++;
      } else if (segment.type === SEGMENT_TYPE_WILDCARD) {
        baseScore = WILDCARD_PARAM_BASE_SCORE;
      }
      if (baseScore) {
        for (let i2 = index + 1; i2 < parsed.length; i2++) {
          const nextSegment = parsed[i2];
          if (nextSegment.type === SEGMENT_TYPE_PATHNAME && nextSegment.value !== "/") {
            hasStaticAfter = true;
            return handleParam(segment, baseScore + 0.2);
          }
        }
        return handleParam(segment, baseScore);
      }
      return 1;
    });
    scoredRoutes.push({
      child: d2,
      trimmed,
      parsed,
      index: i,
      scores,
      optionalParamCount,
      hasStaticAfter
    });
  });
  const flatRoutes = scoredRoutes.sort((a2, b2) => {
    const minLength = Math.min(a2.scores.length, b2.scores.length);
    for (let i = 0; i < minLength; i++) {
      if (a2.scores[i] !== b2.scores[i]) {
        return b2.scores[i] - a2.scores[i];
      }
    }
    if (a2.scores.length !== b2.scores.length) {
      if (a2.optionalParamCount !== b2.optionalParamCount) {
        if (a2.hasStaticAfter === b2.hasStaticAfter) {
          return a2.optionalParamCount - b2.optionalParamCount;
        } else if (a2.hasStaticAfter && !b2.hasStaticAfter) {
          return -1;
        } else if (!a2.hasStaticAfter && b2.hasStaticAfter) {
          return 1;
        }
      }
      return b2.scores.length - a2.scores.length;
    }
    for (let i = 0; i < minLength; i++) {
      if (a2.parsed[i].value !== b2.parsed[i].value) {
        return a2.parsed[i].value > b2.parsed[i].value ? 1 : -1;
      }
    }
    return a2.index - b2.index;
  }).map((d2, i) => {
    d2.child.rank = i;
    return d2.child;
  });
  return { routesById, routesByPath, flatRoutes };
}
function getMatchedRoutes({
  pathname,
  routePathname,
  basepath,
  caseSensitive,
  routesByPath,
  routesById,
  flatRoutes,
  parseCache
}) {
  let routeParams = {};
  const trimmedPath = trimPathRight(pathname);
  const getMatchedParams = (route) => {
    var _a;
    const result = matchPathname(
      basepath,
      trimmedPath,
      {
        to: route.fullPath,
        caseSensitive: ((_a = route.options) == null ? void 0 : _a.caseSensitive) ?? caseSensitive,
        // we need fuzzy matching for `notFoundMode: 'fuzzy'`
        fuzzy: true
      },
      parseCache
    );
    return result;
  };
  let foundRoute = routePathname !== void 0 ? routesByPath[routePathname] : void 0;
  if (foundRoute) {
    routeParams = getMatchedParams(foundRoute);
  } else {
    let fuzzyMatch = void 0;
    for (const route of flatRoutes) {
      const matchedParams = getMatchedParams(route);
      if (matchedParams) {
        if (route.path !== "/" && matchedParams["**"]) {
          if (!fuzzyMatch) {
            fuzzyMatch = { foundRoute: route, routeParams: matchedParams };
          }
        } else {
          foundRoute = route;
          routeParams = matchedParams;
          break;
        }
      }
    }
    if (!foundRoute && fuzzyMatch) {
      foundRoute = fuzzyMatch.foundRoute;
      routeParams = fuzzyMatch.routeParams;
    }
  }
  let routeCursor = foundRoute || routesById[rootRouteId];
  const matchedRoutes = [routeCursor];
  while (routeCursor.parentRoute) {
    routeCursor = routeCursor.parentRoute;
    matchedRoutes.push(routeCursor);
  }
  matchedRoutes.reverse();
  return { matchedRoutes, routeParams, foundRoute };
}
const startSerializer = {
  stringify: (value) => JSON.stringify(value, function replacer(key, val) {
    const ogVal = this[key];
    const serializer = serializers.find((t) => t.stringifyCondition(ogVal));
    if (serializer) {
      return serializer.stringify(ogVal);
    }
    return val;
  }),
  parse: (value) => JSON.parse(value, function parser(key, val) {
    const ogVal = this[key];
    if (isPlainObject(ogVal)) {
      const serializer = serializers.find((t) => t.parseCondition(ogVal));
      if (serializer) {
        return serializer.parse(ogVal);
      }
    }
    return val;
  }),
  encode: (value) => {
    if (Array.isArray(value)) {
      return value.map((v3) => startSerializer.encode(v3));
    }
    if (isPlainObject(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, v3]) => [
          key,
          startSerializer.encode(v3)
        ])
      );
    }
    const serializer = serializers.find((t) => t.stringifyCondition(value));
    if (serializer) {
      return serializer.stringify(value);
    }
    return value;
  },
  decode: (value) => {
    if (isPlainObject(value)) {
      const serializer = serializers.find((t) => t.parseCondition(value));
      if (serializer) {
        return serializer.parse(value);
      }
    }
    if (Array.isArray(value)) {
      return value.map((v3) => startSerializer.decode(v3));
    }
    if (isPlainObject(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, v3]) => [
          key,
          startSerializer.decode(v3)
        ])
      );
    }
    return value;
  }
};
const createSerializer = (key, check, toValue, fromValue) => ({
  key,
  stringifyCondition: check,
  stringify: (value) => ({ [`$${key}`]: toValue(value) }),
  parseCondition: (value) => Object.hasOwn(value, `$${key}`),
  parse: (value) => fromValue(value[`$${key}`])
});
const serializers = [
  createSerializer(
    // Key
    "undefined",
    // Check
    (v3) => v3 === void 0,
    // To
    () => 0,
    // From
    () => void 0
  ),
  createSerializer(
    // Key
    "date",
    // Check
    (v3) => v3 instanceof Date,
    // To
    (v3) => v3.toISOString(),
    // From
    (v3) => new Date(v3)
  ),
  createSerializer(
    // Key
    "error",
    // Check
    (v3) => v3 instanceof Error,
    // To
    (v3) => ({
      ...v3,
      message: v3.message,
      stack: void 0,
      cause: v3.cause
    }),
    // From
    (v3) => Object.assign(new Error(v3.message), v3)
  ),
  createSerializer(
    // Key
    "formData",
    // Check
    (v3) => v3 instanceof FormData,
    // To
    (v3) => {
      const entries = {};
      v3.forEach((value, key) => {
        const entry = entries[key];
        if (entry !== void 0) {
          if (Array.isArray(entry)) {
            entry.push(value);
          } else {
            entries[key] = [entry, value];
          }
        } else {
          entries[key] = value;
        }
      });
      return entries;
    },
    // From
    (v3) => {
      const formData = new FormData();
      Object.entries(v3).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((val) => formData.append(key, val));
        } else {
          formData.append(key, value);
        }
      });
      return formData;
    }
  ),
  createSerializer(
    // Key
    "bigint",
    // Check
    (v3) => typeof v3 === "bigint",
    // To
    (v3) => v3.toString(),
    // From
    (v3) => BigInt(v3)
  )
];
const startStorage = new AsyncLocalStorage();
async function runWithStartContext(context, fn) {
  return startStorage.run(context, fn);
}
function flattenMiddlewares(middlewares) {
  const seen = /* @__PURE__ */ new Set();
  const flattened = [];
  const recurse = (middleware) => {
    middleware.forEach((m2) => {
      if (m2.options.middleware) {
        recurse(m2.options.middleware);
      }
      if (!seen.has(m2)) {
        seen.add(m2);
        flattened.push(m2);
      }
    });
  };
  recurse(middlewares);
  return flattened;
}
var R$1 = ((a2) => (a2[a2.AggregateError = 1] = "AggregateError", a2[a2.ArrowFunction = 2] = "ArrowFunction", a2[a2.ErrorPrototypeStack = 4] = "ErrorPrototypeStack", a2[a2.ObjectAssign = 8] = "ObjectAssign", a2[a2.BigIntTypedArray = 16] = "BigIntTypedArray", a2))(R$1 || {});
function Nr(o) {
  switch (o) {
    case '"':
      return '\\"';
    case "\\":
      return "\\\\";
    case `
`:
      return "\\n";
    case "\r":
      return "\\r";
    case "\b":
      return "\\b";
    case "	":
      return "\\t";
    case "\f":
      return "\\f";
    case "<":
      return "\\x3C";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return;
  }
}
function d(o) {
  let e = "", r = 0, t;
  for (let n = 0, a2 = o.length; n < a2; n++) t = Nr(o[n]), t && (e += o.slice(r, n) + t, r = n + 1);
  return r === 0 ? e = o : e += o.slice(r), e;
}
var O$1 = "__SEROVAL_REFS__", Q$1 = "$R", ae$1 = `self.${Q$1}`;
function xr(o) {
  return o == null ? `${ae$1}=${ae$1}||[]` : `(${ae$1}=${ae$1}||{})["${d(o)}"]=[]`;
}
function f(o, e) {
  if (!o) throw e;
}
var Be = /* @__PURE__ */ new Map(), C$1 = /* @__PURE__ */ new Map();
function je(o) {
  return Be.has(o);
}
function Ke(o) {
  return f(je(o), new ie$1(o)), Be.get(o);
}
typeof globalThis != "undefined" ? Object.defineProperty(globalThis, O$1, { value: C$1, configurable: true, writable: false, enumerable: false }) : typeof self != "undefined" ? Object.defineProperty(self, O$1, { value: C$1, configurable: true, writable: false, enumerable: false }) : typeof global != "undefined" && Object.defineProperty(global, O$1, { value: C$1, configurable: true, writable: false, enumerable: false });
function Hr(o) {
  return o;
}
function Ye(o, e) {
  for (let r = 0, t = e.length; r < t; r++) {
    let n = e[r];
    o.has(n) || (o.add(n), n.extends && Ye(o, n.extends));
  }
}
function m(o) {
  if (o) {
    let e = /* @__PURE__ */ new Set();
    return Ye(e, o), [...e];
  }
}
var $e = { 0: "Symbol.asyncIterator", 1: "Symbol.hasInstance", 2: "Symbol.isConcatSpreadable", 3: "Symbol.iterator", 4: "Symbol.match", 5: "Symbol.matchAll", 6: "Symbol.replace", 7: "Symbol.search", 8: "Symbol.species", 9: "Symbol.split", 10: "Symbol.toPrimitive", 11: "Symbol.toStringTag", 12: "Symbol.unscopables" }, ce$1 = { [Symbol.asyncIterator]: 0, [Symbol.hasInstance]: 1, [Symbol.isConcatSpreadable]: 2, [Symbol.iterator]: 3, [Symbol.match]: 4, [Symbol.matchAll]: 5, [Symbol.replace]: 6, [Symbol.search]: 7, [Symbol.species]: 8, [Symbol.split]: 9, [Symbol.toPrimitive]: 10, [Symbol.toStringTag]: 11, [Symbol.unscopables]: 12 }, qe = { 2: "!0", 3: "!1", 1: "void 0", 0: "null", 4: "-0", 5: "1/0", 6: "-1/0", 7: "0/0" };
var ue$1 = { 0: "Error", 1: "EvalError", 2: "RangeError", 3: "ReferenceError", 4: "SyntaxError", 5: "TypeError", 6: "URIError" }, s = void 0;
function u$1(o, e, r, t, n, a2, i, l, c, p2, h, X) {
  return { t: o, i: e, s: r, l: t, c: n, m: a2, p: i, e: l, a: c, f: p2, b: h, o: X };
}
function x$1(o) {
  return u$1(2, s, o, s, s, s, s, s, s, s, s, s);
}
var I$1 = x$1(2), A = x$1(3), pe$1 = x$1(1), de$1 = x$1(0), Xe = x$1(4), Qe = x$1(5), er = x$1(6), rr = x$1(7);
function me$1(o) {
  return o instanceof EvalError ? 1 : o instanceof RangeError ? 2 : o instanceof ReferenceError ? 3 : o instanceof SyntaxError ? 4 : o instanceof TypeError ? 5 : o instanceof URIError ? 6 : 0;
}
function wr(o) {
  let e = ue$1[me$1(o)];
  return o.name !== e ? { name: o.name } : o.constructor.name !== e ? { name: o.constructor.name } : {};
}
function j$1(o, e) {
  let r = wr(o), t = Object.getOwnPropertyNames(o);
  for (let n = 0, a2 = t.length, i; n < a2; n++) i = t[n], i !== "name" && i !== "message" && (i === "stack" ? e & 4 && (r = r || {}, r[i] = o[i]) : (r = r || {}, r[i] = o[i]));
  return r;
}
function fe$1(o) {
  return Object.isFrozen(o) ? 3 : Object.isSealed(o) ? 2 : Object.isExtensible(o) ? 0 : 1;
}
function ge$1(o) {
  switch (o) {
    case Number.POSITIVE_INFINITY:
      return Qe;
    case Number.NEGATIVE_INFINITY:
      return er;
  }
  return o !== o ? rr : Object.is(o, -0) ? Xe : u$1(0, s, o, s, s, s, s, s, s, s, s, s);
}
function w$2(o) {
  return u$1(1, s, d(o), s, s, s, s, s, s, s, s, s);
}
function Se$1(o) {
  return u$1(3, s, "" + o, s, s, s, s, s, s, s, s, s);
}
function sr(o) {
  return u$1(4, o, s, s, s, s, s, s, s, s, s, s);
}
function he$1(o, e) {
  let r = e.valueOf();
  return u$1(5, o, r !== r ? "" : e.toISOString(), s, s, s, s, s, s, s, s, s);
}
function ye(o, e) {
  return u$1(6, o, s, s, d(e.source), e.flags, s, s, s, s, s, s);
}
function ve(o, e) {
  let r = new Uint8Array(e), t = r.length, n = new Array(t);
  for (let a2 = 0; a2 < t; a2++) n[a2] = r[a2];
  return u$1(19, o, n, s, s, s, s, s, s, s, s, s);
}
function or(o, e) {
  return u$1(17, o, ce$1[e], s, s, s, s, s, s, s, s, s);
}
function nr(o, e) {
  return u$1(18, o, d(Ke(e)), s, s, s, s, s, s, s, s, s);
}
function _$1(o, e, r) {
  return u$1(25, o, r, s, d(e), s, s, s, s, s, s, s);
}
function Ne(o, e, r) {
  return u$1(9, o, s, e.length, s, s, s, s, r, s, s, fe$1(e));
}
function be(o, e) {
  return u$1(21, o, s, s, s, s, s, s, s, e, s, s);
}
function xe(o, e, r) {
  return u$1(15, o, s, e.length, e.constructor.name, s, s, s, s, r, e.byteOffset, s);
}
function Ie(o, e, r) {
  return u$1(16, o, s, e.length, e.constructor.name, s, s, s, s, r, e.byteOffset, s);
}
function Ae$1(o, e, r) {
  return u$1(20, o, s, e.byteLength, s, s, s, s, s, r, e.byteOffset, s);
}
function we(o, e, r) {
  return u$1(13, o, me$1(e), s, s, d(e.message), r, s, s, s, s, s);
}
function Ee$1(o, e, r) {
  return u$1(14, o, me$1(e), s, s, d(e.message), r, s, s, s, s, s);
}
function Pe$1(o, e, r) {
  return u$1(7, o, s, e, s, s, s, s, r, s, s, s);
}
function M(o, e) {
  return u$1(28, s, s, s, s, s, s, s, [o, e], s, s, s);
}
function U$1(o, e) {
  return u$1(30, s, s, s, s, s, s, s, [o, e], s, s, s);
}
function L$1(o, e, r) {
  return u$1(31, o, s, s, s, s, s, s, r, e, s, s);
}
function Re$1(o, e) {
  return u$1(32, o, s, s, s, s, s, s, s, e, s, s);
}
function Oe$1(o, e) {
  return u$1(33, o, s, s, s, s, s, s, s, e, s, s);
}
function Ce(o, e) {
  return u$1(34, o, s, s, s, s, s, s, s, e, s, s);
}
var { toString: _e } = Object.prototype;
function Er(o, e) {
  return e instanceof Error ? `Seroval caught an error during the ${o} process.
  
${e.name}
${e.message}

- For more information, please check the "cause" property of this error.
- If you believe this is an error in Seroval, please submit an issue at https://github.com/lxsmnsyc/seroval/issues/new` : `Seroval caught an error during the ${o} process.

"${_e.call(e)}"

For more information, please check the "cause" property of this error.`;
}
var ee$2 = class ee extends Error {
  constructor(r, t) {
    super(Er(r, t));
    this.cause = t;
  }
}, E = class extends ee$2 {
  constructor(e) {
    super("parsing", e);
  }
}, Te$1 = class Te extends ee$2 {
  constructor(e) {
    super("serialization", e);
  }
}, g = class extends Error {
  constructor(r) {
    super(`The value ${_e.call(r)} of type "${typeof r}" cannot be parsed/serialized.
      
There are few workarounds for this problem:
- Transform the value in a way that it can be serialized.
- If the reference is present on multiple runtimes (isomorphic), you can use the Reference API to map the references.`);
    this.value = r;
  }
}, y = class extends Error {
  constructor(e) {
    super('Unsupported node type "' + e.t + '".');
  }
}, W$1 = class W extends Error {
  constructor(e) {
    super('Missing plugin for tag "' + e + '".');
  }
}, ie$1 = class ie extends Error {
  constructor(r) {
    super('Missing reference for the value "' + _e.call(r) + '" of type "' + typeof r + '"');
    this.value = r;
  }
};
var T$1 = class T {
  constructor(e, r) {
    this.value = e;
    this.replacement = r;
  }
};
function z$1(o, e, r) {
  return o & 2 ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>" + (r.startsWith("{") ? "(" + r + ")" : r) : "function(" + e.join(",") + "){return " + r + "}";
}
function S(o, e, r) {
  return o & 2 ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>{" + r + "}" : "function(" + e.join(",") + "){" + r + "}";
}
var ar = {}, ir = {};
var lr = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {} };
function Pr(o) {
  return z$1(o, ["r"], "(r.p=new Promise(" + S(o, ["s", "f"], "r.s=s,r.f=f") + "))");
}
function Rr(o) {
  return S(o, ["r", "d"], "r.s(d),r.p.s=1,r.p.v=d");
}
function Or(o) {
  return S(o, ["r", "d"], "r.f(d),r.p.s=2,r.p.v=d");
}
function Cr(o) {
  return z$1(o, ["b", "a", "s", "l", "p", "f", "e", "n"], "(b=[],a=!0,s=!1,l=[],p=0,f=" + S(o, ["v", "m", "x"], "for(x=0;x<p;x++)l[x]&&l[x][m](v)") + ",n=" + S(o, ["o", "x", "z", "c"], 'for(x=0,z=b.length;x<z;x++)(c=b[x],(!a&&x===z-1)?o[s?"return":"throw"](c):o.next(c))') + ",e=" + z$1(o, ["o", "t"], "(a&&(l[t=p++]=o),n(o)," + S(o, [], "a&&(l[t]=void 0)") + ")") + ",{__SEROVAL_STREAM__:!0,on:" + z$1(o, ["o"], "e(o)") + ",next:" + S(o, ["v"], 'a&&(b.push(v),f(v,"next"))') + ",throw:" + S(o, ["v"], 'a&&(b.push(v),f(v,"throw"),a=s=!1,l.length=0)') + ",return:" + S(o, ["v"], 'a&&(b.push(v),f(v,"return"),a=!1,s=!0,l.length=0)') + "})");
}
function cr(o, e) {
  switch (e) {
    case 0:
      return "[]";
    case 1:
      return Pr(o);
    case 2:
      return Rr(o);
    case 3:
      return Or(o);
    case 4:
      return Cr(o);
    default:
      return "";
  }
}
function Fe(o) {
  return "__SEROVAL_STREAM__" in o;
}
function K$1() {
  let o = /* @__PURE__ */ new Set(), e = [], r = true, t = true;
  function n(l) {
    for (let c of o.keys()) c.next(l);
  }
  function a2(l) {
    for (let c of o.keys()) c.throw(l);
  }
  function i(l) {
    for (let c of o.keys()) c.return(l);
  }
  return { __SEROVAL_STREAM__: true, on(l) {
    r && o.add(l);
    for (let c = 0, p2 = e.length; c < p2; c++) {
      let h = e[c];
      c === p2 - 1 && !r ? t ? l.return(h) : l.throw(h) : l.next(h);
    }
    return () => {
      r && o.delete(l);
    };
  }, next(l) {
    r && (e.push(l), n(l));
  }, throw(l) {
    r && (e.push(l), a2(l), r = false, t = false, o.clear());
  }, return(l) {
    r && (e.push(l), i(l), r = false, t = true, o.clear());
  } };
}
function Ve(o) {
  let e = K$1(), r = o[Symbol.asyncIterator]();
  async function t() {
    try {
      let n = await r.next();
      n.done ? e.return(n.value) : (e.next(n.value), await t());
    } catch (n) {
      e.throw(n);
    }
  }
  return t().catch(() => {
  }), e;
}
function J$1(o) {
  let e = [], r = -1, t = -1, n = o[Symbol.iterator]();
  for (; ; ) try {
    let a2 = n.next();
    if (e.push(a2.value), a2.done) {
      t = e.length - 1;
      break;
    }
  } catch (a2) {
    r = e.length, e.push(a2);
  }
  return { v: e, t: r, d: t };
}
var Y$1 = class Y {
  constructor(e) {
    this.marked = /* @__PURE__ */ new Set();
    this.plugins = e.plugins, this.features = 31 ^ (e.disabledFeatures || 0), this.refs = e.refs || /* @__PURE__ */ new Map();
  }
  markRef(e) {
    this.marked.add(e);
  }
  isMarked(e) {
    return this.marked.has(e);
  }
  createIndex(e) {
    let r = this.refs.size;
    return this.refs.set(e, r), r;
  }
  getIndexedValue(e) {
    let r = this.refs.get(e);
    return r != null ? (this.markRef(r), { type: 1, value: sr(r) }) : { type: 0, value: this.createIndex(e) };
  }
  getReference(e) {
    let r = this.getIndexedValue(e);
    return r.type === 1 ? r : je(e) ? { type: 2, value: nr(r.value, e) } : r;
  }
  parseWellKnownSymbol(e) {
    let r = this.getReference(e);
    return r.type !== 0 ? r.value : (f(e in ce$1, new g(e)), or(r.value, e));
  }
  parseSpecialReference(e) {
    let r = this.getIndexedValue(lr[e]);
    return r.type === 1 ? r.value : u$1(26, r.value, e, s, s, s, s, s, s, s, s, s);
  }
  parseIteratorFactory() {
    let e = this.getIndexedValue(ar);
    return e.type === 1 ? e.value : u$1(27, e.value, s, s, s, s, s, s, s, this.parseWellKnownSymbol(Symbol.iterator), s, s);
  }
  parseAsyncIteratorFactory() {
    let e = this.getIndexedValue(ir);
    return e.type === 1 ? e.value : u$1(29, e.value, s, s, s, s, s, s, [this.parseSpecialReference(1), this.parseWellKnownSymbol(Symbol.asyncIterator)], s, s, s);
  }
  createObjectNode(e, r, t, n) {
    return u$1(t ? 11 : 10, e, s, s, s, s, n, s, s, s, s, fe$1(r));
  }
  createMapNode(e, r, t, n) {
    return u$1(8, e, s, s, s, s, s, { k: r, v: t, s: n }, s, this.parseSpecialReference(0), s, s);
  }
  createPromiseConstructorNode(e, r) {
    return u$1(22, e, r, s, s, s, s, s, s, this.parseSpecialReference(1), s, s);
  }
};
var kr = /^[$A-Z_][0-9A-Z_$]*$/i;
function Le(o) {
  let e = o[0];
  return (e === "$" || e === "_" || e >= "A" && e <= "Z" || e >= "a" && e <= "z") && kr.test(o);
}
function se$1(o) {
  switch (o.t) {
    case 0:
      return o.s + "=" + o.v;
    case 2:
      return o.s + ".set(" + o.k + "," + o.v + ")";
    case 1:
      return o.s + ".add(" + o.v + ")";
    case 3:
      return o.s + ".delete(" + o.k + ")";
  }
}
function Fr(o) {
  let e = [], r = o[0];
  for (let t = 1, n = o.length, a2, i = r; t < n; t++) a2 = o[t], a2.t === 0 && a2.v === i.v ? r = { t: 0, s: a2.s, k: s, v: se$1(r) } : a2.t === 2 && a2.s === i.s ? r = { t: 2, s: se$1(r), k: a2.k, v: a2.v } : a2.t === 1 && a2.s === i.s ? r = { t: 1, s: se$1(r), k: s, v: a2.v } : a2.t === 3 && a2.s === i.s ? r = { t: 3, s: se$1(r), k: a2.k, v: s } : (e.push(r), r = a2), i = a2;
  return e.push(r), e;
}
function fr(o) {
  if (o.length) {
    let e = "", r = Fr(o);
    for (let t = 0, n = r.length; t < n; t++) e += se$1(r[t]) + ",";
    return e;
  }
  return s;
}
var Vr = "Object.create(null)", Dr = "new Set", Br = "new Map", jr = "Promise.resolve", _r = "Promise.reject", Mr = { 3: "Object.freeze", 2: "Object.seal", 1: "Object.preventExtensions", 0: s }, V$1 = class V {
  constructor(e) {
    this.stack = [];
    this.flags = [];
    this.assignments = [];
    this.plugins = e.plugins, this.features = e.features, this.marked = new Set(e.markedRefs);
  }
  createFunction(e, r) {
    return z$1(this.features, e, r);
  }
  createEffectfulFunction(e, r) {
    return S(this.features, e, r);
  }
  markRef(e) {
    this.marked.add(e);
  }
  isMarked(e) {
    return this.marked.has(e);
  }
  pushObjectFlag(e, r) {
    e !== 0 && (this.markRef(r), this.flags.push({ type: e, value: this.getRefParam(r) }));
  }
  resolveFlags() {
    let e = "";
    for (let r = 0, t = this.flags, n = t.length; r < n; r++) {
      let a2 = t[r];
      e += Mr[a2.type] + "(" + a2.value + "),";
    }
    return e;
  }
  resolvePatches() {
    let e = fr(this.assignments), r = this.resolveFlags();
    return e ? r ? e + r : e : r;
  }
  createAssignment(e, r) {
    this.assignments.push({ t: 0, s: e, k: s, v: r });
  }
  createAddAssignment(e, r) {
    this.assignments.push({ t: 1, s: this.getRefParam(e), k: s, v: r });
  }
  createSetAssignment(e, r, t) {
    this.assignments.push({ t: 2, s: this.getRefParam(e), k: r, v: t });
  }
  createDeleteAssignment(e, r) {
    this.assignments.push({ t: 3, s: this.getRefParam(e), k: r, v: s });
  }
  createArrayAssign(e, r, t) {
    this.createAssignment(this.getRefParam(e) + "[" + r + "]", t);
  }
  createObjectAssign(e, r, t) {
    this.createAssignment(this.getRefParam(e) + "." + r, t);
  }
  isIndexedValueInStack(e) {
    return e.t === 4 && this.stack.includes(e.i);
  }
  serializeReference(e) {
    return this.assignIndexedValue(e.i, O$1 + '.get("' + e.s + '")');
  }
  serializeArrayItem(e, r, t) {
    return r ? this.isIndexedValueInStack(r) ? (this.markRef(e), this.createArrayAssign(e, t, this.getRefParam(r.i)), "") : this.serialize(r) : "";
  }
  serializeArray(e) {
    let r = e.i;
    if (e.l) {
      this.stack.push(r);
      let t = e.a, n = this.serializeArrayItem(r, t[0], 0), a2 = n === "";
      for (let i = 1, l = e.l, c; i < l; i++) c = this.serializeArrayItem(r, t[i], i), n += "," + c, a2 = c === "";
      return this.stack.pop(), this.pushObjectFlag(e.o, e.i), this.assignIndexedValue(r, "[" + n + (a2 ? ",]" : "]"));
    }
    return this.assignIndexedValue(r, "[]");
  }
  serializeProperty(e, r, t) {
    if (typeof r == "string") {
      let n = Number(r), a2 = n >= 0 && n.toString() === r || Le(r);
      if (this.isIndexedValueInStack(t)) {
        let i = this.getRefParam(t.i);
        return this.markRef(e.i), a2 && n !== n ? this.createObjectAssign(e.i, r, i) : this.createArrayAssign(e.i, a2 ? r : '"' + r + '"', i), "";
      }
      return (a2 ? r : '"' + r + '"') + ":" + this.serialize(t);
    }
    return "[" + this.serialize(r) + "]:" + this.serialize(t);
  }
  serializeProperties(e, r) {
    let t = r.s;
    if (t) {
      let n = r.k, a2 = r.v;
      this.stack.push(e.i);
      let i = this.serializeProperty(e, n[0], a2[0]);
      for (let l = 1, c = i; l < t; l++) c = this.serializeProperty(e, n[l], a2[l]), i += (c && i && ",") + c;
      return this.stack.pop(), "{" + i + "}";
    }
    return "{}";
  }
  serializeObject(e) {
    return this.pushObjectFlag(e.o, e.i), this.assignIndexedValue(e.i, this.serializeProperties(e, e.p));
  }
  serializeWithObjectAssign(e, r, t) {
    let n = this.serializeProperties(e, r);
    return n !== "{}" ? "Object.assign(" + t + "," + n + ")" : t;
  }
  serializeStringKeyAssignment(e, r, t, n) {
    let a2 = this.serialize(n), i = Number(t), l = i >= 0 && i.toString() === t || Le(t);
    if (this.isIndexedValueInStack(n)) l && i !== i ? this.createObjectAssign(e.i, t, a2) : this.createArrayAssign(e.i, l ? t : '"' + t + '"', a2);
    else {
      let c = this.assignments;
      this.assignments = r, l && i !== i ? this.createObjectAssign(e.i, t, a2) : this.createArrayAssign(e.i, l ? t : '"' + t + '"', a2), this.assignments = c;
    }
  }
  serializeAssignment(e, r, t, n) {
    if (typeof t == "string") this.serializeStringKeyAssignment(e, r, t, n);
    else {
      let a2 = this.stack;
      this.stack = [];
      let i = this.serialize(n);
      this.stack = a2;
      let l = this.assignments;
      this.assignments = r, this.createArrayAssign(e.i, this.serialize(t), i), this.assignments = l;
    }
  }
  serializeAssignments(e, r) {
    let t = r.s;
    if (t) {
      let n = [], a2 = r.k, i = r.v;
      this.stack.push(e.i);
      for (let l = 0; l < t; l++) this.serializeAssignment(e, n, a2[l], i[l]);
      return this.stack.pop(), fr(n);
    }
    return s;
  }
  serializeDictionary(e, r) {
    if (e.p) if (this.features & 8) r = this.serializeWithObjectAssign(e, e.p, r);
    else {
      this.markRef(e.i);
      let t = this.serializeAssignments(e, e.p);
      if (t) return "(" + this.assignIndexedValue(e.i, r) + "," + t + this.getRefParam(e.i) + ")";
    }
    return this.assignIndexedValue(e.i, r);
  }
  serializeNullConstructor(e) {
    return this.pushObjectFlag(e.o, e.i), this.serializeDictionary(e, Vr);
  }
  serializeDate(e) {
    return this.assignIndexedValue(e.i, 'new Date("' + e.s + '")');
  }
  serializeRegExp(e) {
    return this.assignIndexedValue(e.i, "/" + e.c + "/" + e.m);
  }
  serializeSetItem(e, r) {
    return this.isIndexedValueInStack(r) ? (this.markRef(e), this.createAddAssignment(e, this.getRefParam(r.i)), "") : this.serialize(r);
  }
  serializeSet(e) {
    let r = Dr, t = e.l, n = e.i;
    if (t) {
      let a2 = e.a;
      this.stack.push(n);
      let i = this.serializeSetItem(n, a2[0]);
      for (let l = 1, c = i; l < t; l++) c = this.serializeSetItem(n, a2[l]), i += (c && i && ",") + c;
      this.stack.pop(), i && (r += "([" + i + "])");
    }
    return this.assignIndexedValue(n, r);
  }
  serializeMapEntry(e, r, t, n) {
    if (this.isIndexedValueInStack(r)) {
      let a2 = this.getRefParam(r.i);
      if (this.markRef(e), this.isIndexedValueInStack(t)) {
        let l = this.getRefParam(t.i);
        return this.createSetAssignment(e, a2, l), "";
      }
      if (t.t !== 4 && t.i != null && this.isMarked(t.i)) {
        let l = "(" + this.serialize(t) + ",[" + n + "," + n + "])";
        return this.createSetAssignment(e, a2, this.getRefParam(t.i)), this.createDeleteAssignment(e, n), l;
      }
      let i = this.stack;
      return this.stack = [], this.createSetAssignment(e, a2, this.serialize(t)), this.stack = i, "";
    }
    if (this.isIndexedValueInStack(t)) {
      let a2 = this.getRefParam(t.i);
      if (this.markRef(e), r.t !== 4 && r.i != null && this.isMarked(r.i)) {
        let l = "(" + this.serialize(r) + ",[" + n + "," + n + "])";
        return this.createSetAssignment(e, this.getRefParam(r.i), a2), this.createDeleteAssignment(e, n), l;
      }
      let i = this.stack;
      return this.stack = [], this.createSetAssignment(e, this.serialize(r), a2), this.stack = i, "";
    }
    return "[" + this.serialize(r) + "," + this.serialize(t) + "]";
  }
  serializeMap(e) {
    let r = Br, t = e.e.s, n = e.i, a2 = e.f, i = this.getRefParam(a2.i);
    if (t) {
      let l = e.e.k, c = e.e.v;
      this.stack.push(n);
      let p2 = this.serializeMapEntry(n, l[0], c[0], i);
      for (let h = 1, X = p2; h < t; h++) X = this.serializeMapEntry(n, l[h], c[h], i), p2 += (X && p2 && ",") + X;
      this.stack.pop(), p2 && (r += "([" + p2 + "])");
    }
    return a2.t === 26 && (this.markRef(a2.i), r = "(" + this.serialize(a2) + "," + r + ")"), this.assignIndexedValue(n, r);
  }
  serializeArrayBuffer(e) {
    let r = "new Uint8Array(", t = e.s, n = t.length;
    if (n) {
      r += "[" + t[0];
      for (let a2 = 1; a2 < n; a2++) r += "," + t[a2];
      r += "]";
    }
    return this.assignIndexedValue(e.i, r + ").buffer");
  }
  serializeTypedArray(e) {
    return this.assignIndexedValue(e.i, "new " + e.c + "(" + this.serialize(e.f) + "," + e.b + "," + e.l + ")");
  }
  serializeDataView(e) {
    return this.assignIndexedValue(e.i, "new DataView(" + this.serialize(e.f) + "," + e.b + "," + e.l + ")");
  }
  serializeAggregateError(e) {
    let r = e.i;
    this.stack.push(r);
    let t = this.serializeDictionary(e, 'new AggregateError([],"' + e.m + '")');
    return this.stack.pop(), t;
  }
  serializeError(e) {
    return this.serializeDictionary(e, "new " + ue$1[e.s] + '("' + e.m + '")');
  }
  serializePromise(e) {
    let r, t = e.f, n = e.i, a2 = e.s ? jr : _r;
    if (this.isIndexedValueInStack(t)) {
      let i = this.getRefParam(t.i);
      r = a2 + (e.s ? "().then(" + this.createFunction([], i) + ")" : "().catch(" + this.createEffectfulFunction([], "throw " + i) + ")");
    } else {
      this.stack.push(n);
      let i = this.serialize(t);
      this.stack.pop(), r = a2 + "(" + i + ")";
    }
    return this.assignIndexedValue(n, r);
  }
  serializeWellKnownSymbol(e) {
    return this.assignIndexedValue(e.i, $e[e.s]);
  }
  serializeBoxed(e) {
    return this.assignIndexedValue(e.i, "Object(" + this.serialize(e.f) + ")");
  }
  serializePlugin(e) {
    let r = this.plugins;
    if (r) for (let t = 0, n = r.length; t < n; t++) {
      let a2 = r[t];
      if (a2.tag === e.c) return this.assignIndexedValue(e.i, a2.serialize(e.s, this, { id: e.i }));
    }
    throw new W$1(e.c);
  }
  getConstructor(e) {
    let r = this.serialize(e);
    return r === this.getRefParam(e.i) ? r : "(" + r + ")";
  }
  serializePromiseConstructor(e) {
    let r = this.assignIndexedValue(e.s, "{p:0,s:0,f:0}");
    return this.assignIndexedValue(e.i, this.getConstructor(e.f) + "(" + r + ")");
  }
  serializePromiseResolve(e) {
    return this.getConstructor(e.a[0]) + "(" + this.getRefParam(e.i) + "," + this.serialize(e.a[1]) + ")";
  }
  serializePromiseReject(e) {
    return this.getConstructor(e.a[0]) + "(" + this.getRefParam(e.i) + "," + this.serialize(e.a[1]) + ")";
  }
  serializeSpecialReference(e) {
    return this.assignIndexedValue(e.i, cr(this.features, e.s));
  }
  serializeIteratorFactory(e) {
    let r = "", t = false;
    return e.f.t !== 4 && (this.markRef(e.f.i), r = "(" + this.serialize(e.f) + ",", t = true), r += this.assignIndexedValue(e.i, this.createFunction(["s"], this.createFunction(["i", "c", "d", "t"], "(i=0,t={[" + this.getRefParam(e.f.i) + "]:" + this.createFunction([], "t") + ",next:" + this.createEffectfulFunction([], "if(i>s.d)return{done:!0,value:void 0};if(d=s.v[c=i++],c===s.t)throw d;return{done:c===s.d,value:d}") + "})"))), t && (r += ")"), r;
  }
  serializeIteratorFactoryInstance(e) {
    return this.getConstructor(e.a[0]) + "(" + this.serialize(e.a[1]) + ")";
  }
  serializeAsyncIteratorFactory(e) {
    let r = e.a[0], t = e.a[1], n = "";
    r.t !== 4 && (this.markRef(r.i), n += "(" + this.serialize(r)), t.t !== 4 && (this.markRef(t.i), n += (n ? "," : "(") + this.serialize(t)), n && (n += ",");
    let a2 = this.assignIndexedValue(e.i, this.createFunction(["s"], this.createFunction(["b", "c", "p", "d", "e", "t", "f"], "(b=[],c=0,p=[],d=-1,e=!1,f=" + this.createEffectfulFunction(["i", "l"], "for(i=0,l=p.length;i<l;i++)p[i].s({done:!0,value:void 0})") + ",s.on({next:" + this.createEffectfulFunction(["v", "t"], "if(t=p.shift())t.s({done:!1,value:v});b.push(v)") + ",throw:" + this.createEffectfulFunction(["v", "t"], "if(t=p.shift())t.f(v);f(),d=b.length,e=!0,b.push(v)") + ",return:" + this.createEffectfulFunction(["v", "t"], "if(t=p.shift())t.s({done:!0,value:v});f(),d=b.length,b.push(v)") + "}),t={[" + this.getRefParam(t.i) + "]:" + this.createFunction([], "t.p") + ",next:" + this.createEffectfulFunction(["i", "t", "v"], "if(d===-1){return((i=c++)>=b.length)?(" + this.getRefParam(r.i) + "(t={p:0,s:0,f:0}),p.push(t),t.p):{done:!1,value:b[i]}}if(c>d)return{done:!0,value:void 0};if(v=b[i=c++],i!==d)return{done:!1,value:v};if(e)throw v;return{done:!0,value:v}") + "})")));
    return n ? n + a2 + ")" : a2;
  }
  serializeAsyncIteratorFactoryInstance(e) {
    return this.getConstructor(e.a[0]) + "(" + this.serialize(e.a[1]) + ")";
  }
  serializeStreamConstructor(e) {
    let r = this.assignIndexedValue(e.i, this.getConstructor(e.f) + "()"), t = e.a.length;
    if (t) {
      let n = this.serialize(e.a[0]);
      for (let a2 = 1; a2 < t; a2++) n += "," + this.serialize(e.a[a2]);
      return "(" + r + "," + n + "," + this.getRefParam(e.i) + ")";
    }
    return r;
  }
  serializeStreamNext(e) {
    return this.getRefParam(e.i) + ".next(" + this.serialize(e.f) + ")";
  }
  serializeStreamThrow(e) {
    return this.getRefParam(e.i) + ".throw(" + this.serialize(e.f) + ")";
  }
  serializeStreamReturn(e) {
    return this.getRefParam(e.i) + ".return(" + this.serialize(e.f) + ")";
  }
  serialize(e) {
    try {
      switch (e.t) {
        case 2:
          return qe[e.s];
        case 0:
          return "" + e.s;
        case 1:
          return '"' + e.s + '"';
        case 3:
          return e.s + "n";
        case 4:
          return this.getRefParam(e.i);
        case 18:
          return this.serializeReference(e);
        case 9:
          return this.serializeArray(e);
        case 10:
          return this.serializeObject(e);
        case 11:
          return this.serializeNullConstructor(e);
        case 5:
          return this.serializeDate(e);
        case 6:
          return this.serializeRegExp(e);
        case 7:
          return this.serializeSet(e);
        case 8:
          return this.serializeMap(e);
        case 19:
          return this.serializeArrayBuffer(e);
        case 16:
        case 15:
          return this.serializeTypedArray(e);
        case 20:
          return this.serializeDataView(e);
        case 14:
          return this.serializeAggregateError(e);
        case 13:
          return this.serializeError(e);
        case 12:
          return this.serializePromise(e);
        case 17:
          return this.serializeWellKnownSymbol(e);
        case 21:
          return this.serializeBoxed(e);
        case 22:
          return this.serializePromiseConstructor(e);
        case 23:
          return this.serializePromiseResolve(e);
        case 24:
          return this.serializePromiseReject(e);
        case 25:
          return this.serializePlugin(e);
        case 26:
          return this.serializeSpecialReference(e);
        case 27:
          return this.serializeIteratorFactory(e);
        case 28:
          return this.serializeIteratorFactoryInstance(e);
        case 29:
          return this.serializeAsyncIteratorFactory(e);
        case 30:
          return this.serializeAsyncIteratorFactoryInstance(e);
        case 31:
          return this.serializeStreamConstructor(e);
        case 32:
          return this.serializeStreamNext(e);
        case 33:
          return this.serializeStreamThrow(e);
        case 34:
          return this.serializeStreamReturn(e);
        default:
          throw new y(e);
      }
    } catch (r) {
      throw new Te$1(r);
    }
  }
};
var D$1 = class D extends V$1 {
  constructor(r) {
    super(r);
    this.mode = "cross";
    this.scopeId = r.scopeId;
  }
  getRefParam(r) {
    return Q$1 + "[" + r + "]";
  }
  assignIndexedValue(r, t) {
    return this.getRefParam(r) + "=" + t;
  }
  serializeTop(r) {
    let t = this.serialize(r), n = r.i;
    if (n == null) return t;
    let a2 = this.resolvePatches(), i = this.getRefParam(n), l = this.scopeId == null ? "" : Q$1, c = a2 ? "(" + t + "," + a2 + i + ")" : t;
    if (l === "") return r.t === 10 && !a2 ? "(" + c + ")" : c;
    let p2 = this.scopeId == null ? "()" : "(" + Q$1 + '["' + d(this.scopeId) + '"])';
    return "(" + this.createFunction([l], c) + ")" + p2;
  }
};
var v$1 = class v extends Y$1 {
  parseItems(e) {
    let r = [];
    for (let t = 0, n = e.length; t < n; t++) t in e && (r[t] = this.parse(e[t]));
    return r;
  }
  parseArray(e, r) {
    return Ne(e, r, this.parseItems(r));
  }
  parseProperties(e) {
    let r = Object.entries(e), t = [], n = [];
    for (let i = 0, l = r.length; i < l; i++) t.push(d(r[i][0])), n.push(this.parse(r[i][1]));
    let a2 = Symbol.iterator;
    return a2 in e && (t.push(this.parseWellKnownSymbol(a2)), n.push(M(this.parseIteratorFactory(), this.parse(J$1(e))))), a2 = Symbol.asyncIterator, a2 in e && (t.push(this.parseWellKnownSymbol(a2)), n.push(U$1(this.parseAsyncIteratorFactory(), this.parse(K$1())))), a2 = Symbol.toStringTag, a2 in e && (t.push(this.parseWellKnownSymbol(a2)), n.push(w$2(e[a2]))), a2 = Symbol.isConcatSpreadable, a2 in e && (t.push(this.parseWellKnownSymbol(a2)), n.push(e[a2] ? I$1 : A)), { k: t, v: n, s: t.length };
  }
  parsePlainObject(e, r, t) {
    return this.createObjectNode(e, r, t, this.parseProperties(r));
  }
  parseBoxed(e, r) {
    return be(e, this.parse(r.valueOf()));
  }
  parseTypedArray(e, r) {
    return xe(e, r, this.parse(r.buffer));
  }
  parseBigIntTypedArray(e, r) {
    return Ie(e, r, this.parse(r.buffer));
  }
  parseDataView(e, r) {
    return Ae$1(e, r, this.parse(r.buffer));
  }
  parseError(e, r) {
    let t = j$1(r, this.features);
    return we(e, r, t ? this.parseProperties(t) : s);
  }
  parseAggregateError(e, r) {
    let t = j$1(r, this.features);
    return Ee$1(e, r, t ? this.parseProperties(t) : s);
  }
  parseMap(e, r) {
    let t = [], n = [];
    for (let [a2, i] of r.entries()) t.push(this.parse(a2)), n.push(this.parse(i));
    return this.createMapNode(e, t, n, r.size);
  }
  parseSet(e, r) {
    let t = [];
    for (let n of r.keys()) t.push(this.parse(n));
    return Pe$1(e, r.size, t);
  }
  parsePlugin(e, r) {
    let t = this.plugins;
    if (t) for (let n = 0, a2 = t.length; n < a2; n++) {
      let i = t[n];
      if (i.parse.sync && i.test(r)) return _$1(e, i.tag, i.parse.sync(r, this, { id: e }));
    }
  }
  parseStream(e, r) {
    return L$1(e, this.parseSpecialReference(4), []);
  }
  parsePromise(e, r) {
    return this.createPromiseConstructorNode(e, this.createIndex({}));
  }
  parseObject(e, r) {
    if (Array.isArray(r)) return this.parseArray(e, r);
    if (Fe(r)) return this.parseStream(e, r);
    let t = r.constructor;
    if (t === T$1) return this.parse(r.replacement);
    let n = this.parsePlugin(e, r);
    if (n) return n;
    switch (t) {
      case Object:
        return this.parsePlainObject(e, r, false);
      case void 0:
        return this.parsePlainObject(e, r, true);
      case Date:
        return he$1(e, r);
      case RegExp:
        return ye(e, r);
      case Error:
      case EvalError:
      case RangeError:
      case ReferenceError:
      case SyntaxError:
      case TypeError:
      case URIError:
        return this.parseError(e, r);
      case Number:
      case Boolean:
      case String:
      case BigInt:
        return this.parseBoxed(e, r);
      case ArrayBuffer:
        return ve(e, r);
      case Int8Array:
      case Int16Array:
      case Int32Array:
      case Uint8Array:
      case Uint16Array:
      case Uint32Array:
      case Uint8ClampedArray:
      case Float32Array:
      case Float64Array:
        return this.parseTypedArray(e, r);
      case DataView:
        return this.parseDataView(e, r);
      case Map:
        return this.parseMap(e, r);
      case Set:
        return this.parseSet(e, r);
    }
    if (t === Promise || r instanceof Promise) return this.parsePromise(e, r);
    let a2 = this.features;
    if (a2 & 16) switch (t) {
      case BigInt64Array:
      case BigUint64Array:
        return this.parseBigIntTypedArray(e, r);
    }
    if (a2 & 1 && typeof AggregateError != "undefined" && (t === AggregateError || r instanceof AggregateError)) return this.parseAggregateError(e, r);
    if (r instanceof Error) return this.parseError(e, r);
    if (Symbol.iterator in r || Symbol.asyncIterator in r) return this.parsePlainObject(e, r, !!t);
    throw new g(r);
  }
  parseFunction(e) {
    let r = this.getReference(e);
    if (r.type !== 0) return r.value;
    let t = this.parsePlugin(r.value, e);
    if (t) return t;
    throw new g(e);
  }
  parse(e) {
    switch (typeof e) {
      case "boolean":
        return e ? I$1 : A;
      case "undefined":
        return pe$1;
      case "string":
        return w$2(e);
      case "number":
        return ge$1(e);
      case "bigint":
        return Se$1(e);
      case "object": {
        if (e) {
          let r = this.getReference(e);
          return r.type === 0 ? this.parseObject(r.value, e) : r.value;
        }
        return de$1;
      }
      case "symbol":
        return this.parseWellKnownSymbol(e);
      case "function":
        return this.parseFunction(e);
      default:
        throw new g(e);
    }
  }
  parseTop(e) {
    try {
      return this.parse(e);
    } catch (r) {
      throw r instanceof E ? r : new E(r);
    }
  }
};
var oe$1 = class oe extends v$1 {
  constructor(r) {
    super(r);
    this.alive = true;
    this.pending = 0;
    this.initial = true;
    this.buffer = [];
    this.onParseCallback = r.onParse, this.onErrorCallback = r.onError, this.onDoneCallback = r.onDone;
  }
  onParseInternal(r, t) {
    try {
      this.onParseCallback(r, t);
    } catch (n) {
      this.onError(n);
    }
  }
  flush() {
    for (let r = 0, t = this.buffer.length; r < t; r++) this.onParseInternal(this.buffer[r], false);
  }
  onParse(r) {
    this.initial ? this.buffer.push(r) : this.onParseInternal(r, false);
  }
  onError(r) {
    if (this.onErrorCallback) this.onErrorCallback(r);
    else throw r;
  }
  onDone() {
    this.onDoneCallback && this.onDoneCallback();
  }
  pushPendingState() {
    this.pending++;
  }
  popPendingState() {
    --this.pending <= 0 && this.onDone();
  }
  parseProperties(r) {
    let t = Object.entries(r), n = [], a2 = [];
    for (let l = 0, c = t.length; l < c; l++) n.push(d(t[l][0])), a2.push(this.parse(t[l][1]));
    let i = Symbol.iterator;
    return i in r && (n.push(this.parseWellKnownSymbol(i)), a2.push(M(this.parseIteratorFactory(), this.parse(J$1(r))))), i = Symbol.asyncIterator, i in r && (n.push(this.parseWellKnownSymbol(i)), a2.push(U$1(this.parseAsyncIteratorFactory(), this.parse(Ve(r))))), i = Symbol.toStringTag, i in r && (n.push(this.parseWellKnownSymbol(i)), a2.push(w$2(r[i]))), i = Symbol.isConcatSpreadable, i in r && (n.push(this.parseWellKnownSymbol(i)), a2.push(r[i] ? I$1 : A)), { k: n, v: a2, s: n.length };
  }
  handlePromiseSuccess(r, t) {
    let n = this.parseWithError(t);
    n && this.onParse(u$1(23, r, s, s, s, s, s, s, [this.parseSpecialReference(2), n], s, s, s)), this.popPendingState();
  }
  handlePromiseFailure(r, t) {
    if (this.alive) {
      let n = this.parseWithError(t);
      n && this.onParse(u$1(24, r, s, s, s, s, s, s, [this.parseSpecialReference(3), n], s, s, s));
    }
    this.popPendingState();
  }
  parsePromise(r, t) {
    let n = this.createIndex({});
    return t.then(this.handlePromiseSuccess.bind(this, n), this.handlePromiseFailure.bind(this, n)), this.pushPendingState(), this.createPromiseConstructorNode(r, n);
  }
  parsePlugin(r, t) {
    let n = this.plugins;
    if (n) for (let a2 = 0, i = n.length; a2 < i; a2++) {
      let l = n[a2];
      if (l.parse.stream && l.test(t)) return _$1(r, l.tag, l.parse.stream(t, this, { id: r }));
    }
    return s;
  }
  parseStream(r, t) {
    let n = L$1(r, this.parseSpecialReference(4), []);
    return this.pushPendingState(), t.on({ next: (a2) => {
      if (this.alive) {
        let i = this.parseWithError(a2);
        i && this.onParse(Re$1(r, i));
      }
    }, throw: (a2) => {
      if (this.alive) {
        let i = this.parseWithError(a2);
        i && this.onParse(Oe$1(r, i));
      }
      this.popPendingState();
    }, return: (a2) => {
      if (this.alive) {
        let i = this.parseWithError(a2);
        i && this.onParse(Ce(r, i));
      }
      this.popPendingState();
    } }), n;
  }
  parseWithError(r) {
    try {
      return this.parse(r);
    } catch (t) {
      return this.onError(t), s;
    }
  }
  start(r) {
    let t = this.parseWithError(r);
    t && (this.onParseInternal(t, true), this.initial = false, this.flush(), this.pending <= 0 && this.destroy());
  }
  destroy() {
    this.alive && (this.onDone(), this.alive = false);
  }
  isAlive() {
    return this.alive;
  }
};
var G$1 = class G extends oe$1 {
  constructor() {
    super(...arguments);
    this.mode = "cross";
  }
};
function gr(o, e) {
  let r = m(e.plugins), t = new G$1({ plugins: r, refs: e.refs, disabledFeatures: e.disabledFeatures, onParse(n, a2) {
    let i = new D$1({ plugins: r, features: t.features, scopeId: e.scopeId, markedRefs: t.marked }), l;
    try {
      l = i.serializeTop(n);
    } catch (c) {
      e.onError && e.onError(c);
      return;
    }
    e.onSerialize(l, a2);
  }, onError: e.onError, onDone: e.onDone });
  return t.start(o), t.destroy.bind(t);
}
var p = {}, ee$1 = Hr({ tag: "seroval-plugins/web/ReadableStreamFactory", test(e) {
  return e === p;
}, parse: { sync() {
}, async async() {
  return await Promise.resolve(void 0);
}, stream() {
} }, serialize(e, r) {
  return r.createFunction(["d"], "new ReadableStream({start:" + r.createEffectfulFunction(["c"], "d.on({next:" + r.createEffectfulFunction(["v"], "c.enqueue(v)") + ",throw:" + r.createEffectfulFunction(["v"], "c.error(v)") + ",return:" + r.createEffectfulFunction([], "c.close()") + "})") + "})");
}, deserialize() {
  return p;
} });
function w$1(e) {
  let r = K$1(), a2 = e.getReader();
  async function t() {
    try {
      let n = await a2.read();
      n.done ? r.return(n.value) : (r.next(n.value), await t());
    } catch (n) {
      r.throw(n);
    }
  }
  return t().catch(() => {
  }), r;
}
var re$1 = Hr({ tag: "seroval/plugins/web/ReadableStream", extends: [ee$1], test(e) {
  return typeof ReadableStream == "undefined" ? false : e instanceof ReadableStream;
}, parse: { sync(e, r) {
  return { factory: r.parse(p), stream: r.parse(K$1()) };
}, async async(e, r) {
  return { factory: await r.parse(p), stream: await r.parse(w$1(e)) };
}, stream(e, r) {
  return { factory: r.parse(p), stream: r.parse(w$1(e)) };
} }, serialize(e, r) {
  return "(" + r.serialize(e.factory) + ")(" + r.serialize(e.stream) + ")";
}, deserialize(e, r) {
  let a2 = r.deserialize(e.stream);
  return new ReadableStream({ start(t) {
    a2.on({ next(n) {
      t.enqueue(n);
    }, throw(n) {
      t.error(n);
    }, return() {
      t.close();
    } });
  } });
} }), u = re$1;
const minifiedTsrBootStrapScript = 'self.$_TSR={c:()=>{document.querySelectorAll(".\\\\$tsr").forEach(e=>{e.remove()})}};\n';
const ShallowErrorPlugin = /* @__PURE__ */ Hr({
  tag: "tanstack-start:seroval-plugins/Error",
  test(value) {
    return value instanceof Error;
  },
  parse: {
    sync(value, ctx) {
      return {
        message: ctx.parse(value.message)
      };
    },
    async async(value, ctx) {
      return {
        message: await ctx.parse(value.message)
      };
    },
    stream(value, ctx) {
      return {
        message: ctx.parse(value.message)
      };
    }
  },
  serialize(node, ctx) {
    return "new Error(" + ctx.serialize(node.message) + ")";
  },
  deserialize(node, ctx) {
    return new Error(ctx.deserialize(node.message));
  }
});
const GLOBAL_TSR = "$_TSR";
const SCOPE_ID = "tsr";
function dehydrateMatch(match) {
  const dehydratedMatch = {
    i: match.id,
    u: match.updatedAt,
    s: match.status
  };
  const properties = [
    ["__beforeLoadContext", "b"],
    ["loaderData", "l"],
    ["error", "e"],
    ["ssr", "ssr"]
  ];
  for (const [key, shorthand] of properties) {
    if (match[key] !== void 0) {
      dehydratedMatch[shorthand] = match[key];
    }
  }
  return dehydratedMatch;
}
function attachRouterServerSsrUtils(router, manifest) {
  router.ssr = {
    manifest
  };
  const serializationRefs = /* @__PURE__ */ new Map();
  let initialScriptSent = false;
  const getInitialScript = () => {
    if (initialScriptSent) {
      return "";
    }
    initialScriptSent = true;
    return `${xr(SCOPE_ID)};${minifiedTsrBootStrapScript};`;
  };
  let _dehydrated = false;
  const listeners = [];
  router.serverSsr = {
    injectedHtml: [],
    injectHtml: (getHtml) => {
      const promise = Promise.resolve().then(getHtml);
      router.serverSsr.injectedHtml.push(promise);
      router.emit({
        type: "onInjectedHtml",
        promise
      });
      return promise.then(() => {
      });
    },
    injectScript: (getScript) => {
      return router.serverSsr.injectHtml(async () => {
        const script = await getScript();
        return `<script class='$tsr'>${getInitialScript()}${script};if (typeof $_TSR !== 'undefined') $_TSR.c()<\/script>`;
      });
    },
    dehydrate: async () => {
      var _a, _b, _c;
      invariant(!_dehydrated);
      let matchesToDehydrate = router.state.matches;
      if (router.isShell()) {
        matchesToDehydrate = matchesToDehydrate.slice(0, 1);
      }
      const matches = matchesToDehydrate.map(dehydrateMatch);
      const dehydratedRouter = {
        manifest: router.ssr.manifest,
        matches
      };
      const lastMatchId = (_a = matchesToDehydrate[matchesToDehydrate.length - 1]) == null ? void 0 : _a.id;
      if (lastMatchId) {
        dehydratedRouter.lastMatchId = lastMatchId;
      }
      dehydratedRouter.dehydratedData = await ((_c = (_b = router.options).dehydrate) == null ? void 0 : _c.call(_b));
      _dehydrated = true;
      const p2 = createControlledPromise();
      gr(dehydratedRouter, {
        refs: serializationRefs,
        // TODO make plugins configurable
        plugins: [u, ShallowErrorPlugin],
        onSerialize: (data, initial) => {
          const serialized = initial ? `${GLOBAL_TSR}["router"]=` + data : data;
          router.serverSsr.injectScript(() => serialized);
        },
        scopeId: SCOPE_ID,
        onDone: () => p2.resolve(""),
        onError: (err) => p2.reject(err)
      });
      router.serverSsr.injectHtml(() => p2);
    },
    isDehydrated() {
      return _dehydrated;
    },
    onRenderFinished: (listener) => listeners.push(listener),
    setRenderFinished: () => {
      listeners.forEach((l) => l());
    }
  };
}
function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}
var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => {
  __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class H3Error extends Error {
  constructor(message, opts = {}) {
    super(message, opts);
    __publicField$2(this, "statusCode", 500);
    __publicField$2(this, "fatal", false);
    __publicField$2(this, "unhandled", false);
    __publicField$2(this, "statusMessage");
    __publicField$2(this, "data");
    __publicField$2(this, "cause");
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
__publicField$2(H3Error, "__h3_error__", true);
function createError(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const xForwardedHost = event.node.req.headers["x-forwarded-host"];
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}
function toWebRequest(event) {
  return event.web?.request || new Request(getRequestURL(event), {
    // @ts-ignore Undici option
    duplex: "half",
    method: event.method,
    headers: event.headers,
    body: getRequestWebStream(event)
  });
}
const RawBodySymbol = Symbol.for("h3RawBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}
typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function getResponseStatus$1(event) {
  return event.node.res.statusCode;
}
function getResponseHeaders$1(event) {
  return event.node.res.getHeaders();
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class H3Event {
  constructor(req, res) {
    __publicField(this, "__is_event__", true);
    __publicField(this, "node");
    __publicField(this, "web");
    __publicField(this, "context", {});
    __publicField(this, "_method");
    __publicField(this, "_path");
    __publicField(this, "_headers");
    __publicField(this, "_requestBody");
    __publicField(this, "_handled", false);
    __publicField(this, "_onBeforeResponseCalled");
    __publicField(this, "_onAfterResponseCalled");
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}
function defineEventHandler$1(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventStorage = new AsyncLocalStorage();
function defineEventHandler(handler) {
  return defineEventHandler$1((event) => {
    return runWithEvent(event, () => handler(event));
  });
}
async function runWithEvent(event, fn) {
  return eventStorage.run(event, fn);
}
function getEvent() {
  const event = eventStorage.getStore();
  if (!event) {
    throw new Error(
      `No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`
    );
  }
  return event;
}
const HTTPEventSymbol = Symbol("$HTTPEvent");
function isEvent(obj) {
  return typeof obj === "object" && (obj instanceof H3Event || (obj == null ? void 0 : obj[HTTPEventSymbol]) instanceof H3Event || (obj == null ? void 0 : obj.__is_event__) === true);
}
function createWrapperFunction(h3Function) {
  return function(...args) {
    const event = args[0];
    if (!isEvent(event)) {
      args.unshift(getEvent());
    } else {
      args[0] = event instanceof H3Event || event.__is_event__ ? event : event[HTTPEventSymbol];
    }
    return h3Function(...args);
  };
}
const getResponseStatus = createWrapperFunction(getResponseStatus$1);
const getResponseHeaders = createWrapperFunction(getResponseHeaders$1);
const getWebRequest = createWrapperFunction(toWebRequest);
function requestHandler(handler) {
  return handler;
}
const VIRTUAL_MODULES = {
  routeTree: "tanstack-start-route-tree:v",
  startManifest: "tanstack-start-manifest:v",
  serverFnManifest: "tanstack-start-server-fn-manifest:v"
};
async function loadVirtualModule(id) {
  switch (id) {
    case VIRTUAL_MODULES.routeTree:
      return await Promise.resolve().then(() => routeTree_gen);
    case VIRTUAL_MODULES.startManifest:
      return await import('./_tanstack-start-manifest_v-B7bzHneg.mjs');
    case VIRTUAL_MODULES.serverFnManifest:
      return await import('./_tanstack-start-server-fn-manifest_v-DtgTK7xl.mjs');
    default:
      throw new Error(`Unknown virtual module: ${id}`);
  }
}
async function getStartManifest(opts) {
  const { tsrStartManifest } = await loadVirtualModule(
    VIRTUAL_MODULES.startManifest
  );
  const startManifest = tsrStartManifest();
  const rootRoute = startManifest.routes[rootRouteId] = startManifest.routes[rootRouteId] || {};
  rootRoute.assets = rootRoute.assets || [];
  let script = `import('${startManifest.clientEntry}')`;
  rootRoute.assets.push({
    tag: "script",
    attrs: {
      type: "module",
      suppressHydrationWarning: true,
      async: true
    },
    children: script
  });
  const manifest = {
    ...startManifest,
    routes: Object.fromEntries(
      Object.entries(startManifest.routes).map(([k, v3]) => {
        const { preloads, assets } = v3;
        return [
          k,
          {
            preloads,
            assets
          }
        ];
      })
    )
  };
  return manifest;
}
function sanitizeBase(base) {
  return base.replace(/^\/|\/$/g, "");
}
const handleServerAction = async ({
  request
}) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const abort = () => controller.abort();
  request.signal.addEventListener("abort", abort);
  const method = request.method;
  const url = new URL(request.url, "http://localhost:3000");
  const regex = new RegExp(`${sanitizeBase("/_serverFn")}/([^/?#]+)`);
  const match = url.pathname.match(regex);
  const serverFnId = match ? match[1] : null;
  const search = Object.fromEntries(url.searchParams.entries());
  const isCreateServerFn = "createServerFn" in search;
  const isRaw = "raw" in search;
  if (typeof serverFnId !== "string") {
    throw new Error("Invalid server action param for serverFnId: " + serverFnId);
  }
  const {
    default: serverFnManifest
  } = await loadVirtualModule(VIRTUAL_MODULES.serverFnManifest);
  const serverFnInfo = serverFnManifest[serverFnId];
  if (!serverFnInfo) {
    console.info("serverFnManifest", serverFnManifest);
    throw new Error("Server function info not found for " + serverFnId);
  }
  const fnModule = await serverFnInfo.importer();
  if (!fnModule) {
    console.info("serverFnInfo", serverFnInfo);
    throw new Error("Server function module not resolved for " + serverFnId);
  }
  const action = fnModule[serverFnInfo.functionName];
  if (!action) {
    console.info("serverFnInfo", serverFnInfo);
    console.info("fnModule", fnModule);
    throw new Error(`Server function module export not resolved for serverFn ID: ${serverFnId}`);
  }
  const formDataContentTypes = ["multipart/form-data", "application/x-www-form-urlencoded"];
  const response = await (async () => {
    try {
      let result = await (async () => {
        if (request.headers.get("Content-Type") && formDataContentTypes.some((type) => {
          var _a;
          return (_a = request.headers.get("Content-Type")) == null ? void 0 : _a.includes(type);
        })) {
          invariant(method.toLowerCase() !== "get", "GET requests with FormData payloads are not supported");
          return await action(await request.formData(), signal);
        }
        if (method.toLowerCase() === "get") {
          let payload2 = search;
          if (isCreateServerFn) {
            payload2 = search.payload;
          }
          payload2 = payload2 ? startSerializer.parse(payload2) : payload2;
          return await action(payload2, signal);
        }
        const jsonPayloadAsString = await request.text();
        const payload = startSerializer.parse(jsonPayloadAsString);
        if (isCreateServerFn) {
          return await action(payload, signal);
        }
        return await action(...payload, signal);
      })();
      if (result.result instanceof Response) {
        return result.result;
      }
      if (!isCreateServerFn) {
        result = result.result;
        if (result instanceof Response) {
          return result;
        }
      }
      if (isNotFound(result)) {
        return isNotFoundResponse(result);
      }
      return new Response(result !== void 0 ? startSerializer.stringify(result) : void 0, {
        status: getResponseStatus(getEvent()),
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }
      if (isNotFound(error)) {
        return isNotFoundResponse(error);
      }
      console.info();
      console.info("Server Fn Error!");
      console.info();
      console.error(error);
      console.info();
      return new Response(startSerializer.stringify(error), {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
  })();
  request.signal.removeEventListener("abort", abort);
  if (isRaw) {
    return response;
  }
  return response;
};
function isNotFoundResponse(error) {
  const {
    headers,
    ...rest
  } = error;
  return new Response(JSON.stringify(rest), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...headers || {}
    }
  });
}
const HEADERS = {
  TSS_SHELL: "X-TSS_SHELL"
};
function getStartResponseHeaders(opts) {
  const headers = mergeHeaders(
    getResponseHeaders(),
    {
      "Content-Type": "text/html; charset=UTF-8"
    },
    ...opts.router.state.matches.map((match) => {
      return match.headers;
    })
  );
  return headers;
}
function createStartHandler({
  createRouter: createRouter2
}) {
  let routeTreeModule = null;
  let startRoutesManifest = null;
  let processedServerRouteTree = void 0;
  return (cb) => {
    const originalFetch = globalThis.fetch;
    const startRequestResolver = async ({ request }) => {
      globalThis.fetch = async function(input, init) {
        function resolve(url2, requestOptions) {
          const fetchRequest = new Request(url2, requestOptions);
          return startRequestResolver({ request: fetchRequest });
        }
        function getOrigin() {
          return request.headers.get("Origin") || request.headers.get("Referer") || "http://localhost";
        }
        if (typeof input === "string" && input.startsWith("/")) {
          const url2 = new URL(input, getOrigin());
          return resolve(url2, init);
        } else if (typeof input === "object" && "url" in input && typeof input.url === "string" && input.url.startsWith("/")) {
          const url2 = new URL(input.url, getOrigin());
          return resolve(url2, init);
        }
        return originalFetch(input, init);
      };
      const url = new URL(request.url);
      const href = url.href.replace(url.origin, "");
      const APP_BASE = "/";
      const router = await createRouter2();
      const history = createMemoryHistory({
        initialEntries: [href]
      });
      const isPrerendering = process.env.TSS_PRERENDERING === "true";
      let isShell = process.env.TSS_SHELL === "true";
      if (isPrerendering && !isShell) {
        isShell = request.headers.get(HEADERS.TSS_SHELL) === "true";
      }
      router.update({
        history,
        isShell,
        isPrerendering
      });
      const response = await (async () => {
        try {
          if (false) ;
          const serverFnBase = joinPaths([
            APP_BASE,
            trimPath("/_serverFn"),
            "/"
          ]);
          if (href.startsWith(serverFnBase)) {
            return await handleServerAction({ request });
          }
          if (routeTreeModule === null) {
            try {
              routeTreeModule = await loadVirtualModule(
                VIRTUAL_MODULES.routeTree
              );
              if (routeTreeModule.serverRouteTree) {
                processedServerRouteTree = processRouteTree({
                  routeTree: routeTreeModule.serverRouteTree,
                  initRoute: (route, i) => {
                    route.init({
                      originalIndex: i
                    });
                  }
                });
              }
            } catch (e) {
              console.log(e);
            }
          }
          const executeRouter = () => runWithStartContext({ router }, async () => {
            const requestAcceptHeader = request.headers.get("Accept") || "*/*";
            const splitRequestAcceptHeader = requestAcceptHeader.split(",");
            const supportedMimeTypes = ["*/*", "text/html"];
            const isRouterAcceptSupported = supportedMimeTypes.some(
              (mimeType) => splitRequestAcceptHeader.some(
                (acceptedMimeType) => acceptedMimeType.trim().startsWith(mimeType)
              )
            );
            if (!isRouterAcceptSupported) {
              return json(
                {
                  error: "Only HTML requests are supported here"
                },
                {
                  status: 500
                }
              );
            }
            if (startRoutesManifest === null) {
              startRoutesManifest = await getStartManifest({
                basePath: APP_BASE
              });
            }
            attachRouterServerSsrUtils(router, startRoutesManifest);
            await router.load();
            if (router.state.redirect) {
              return router.state.redirect;
            }
            await router.serverSsr.dehydrate();
            const responseHeaders = getStartResponseHeaders({ router });
            const response2 = await cb({
              request,
              router,
              responseHeaders
            });
            return response2;
          });
          if (processedServerRouteTree) {
            const [_matchedRoutes, response2] = await handleServerRoutes({
              processedServerRouteTree,
              router,
              request,
              basePath: APP_BASE,
              executeRouter
            });
            if (response2) return response2;
          }
          const routerResponse = await executeRouter();
          return routerResponse;
        } catch (err) {
          if (err instanceof Response) {
            return err;
          }
          throw err;
        }
      })();
      if (isRedirect(response)) {
        if (isResolvedRedirect(response)) {
          if (request.headers.get("x-tsr-redirect") === "manual") {
            return json(
              {
                ...response.options,
                isSerializedRedirect: true
              },
              {
                headers: response.headers
              }
            );
          }
          return response;
        }
        if (response.options.to && typeof response.options.to === "string" && !response.options.to.startsWith("/")) {
          throw new Error(
            `Server side redirects must use absolute paths via the 'href' or 'to' options. The redirect() method's "to" property accepts an internal path only. Use the "href" property to provide an external URL. Received: ${JSON.stringify(response.options)}`
          );
        }
        if (["params", "search", "hash"].some(
          (d2) => typeof response.options[d2] === "function"
        )) {
          throw new Error(
            `Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(
              response.options
            ).filter((d2) => typeof response.options[d2] === "function").map((d2) => `"${d2}"`).join(", ")}`
          );
        }
        const redirect2 = router.resolveRedirect(response);
        if (request.headers.get("x-tsr-redirect") === "manual") {
          return json(
            {
              ...response.options,
              isSerializedRedirect: true
            },
            {
              headers: response.headers
            }
          );
        }
        return redirect2;
      }
      return response;
    };
    return requestHandler(startRequestResolver);
  };
}
async function handleServerRoutes(opts) {
  var _a, _b;
  const url = new URL(opts.request.url);
  const pathname = url.pathname;
  const serverTreeResult = getMatchedRoutes({
    pathname,
    basepath: opts.basePath,
    caseSensitive: true,
    routesByPath: opts.processedServerRouteTree.routesByPath,
    routesById: opts.processedServerRouteTree.routesById,
    flatRoutes: opts.processedServerRouteTree.flatRoutes
  });
  const routeTreeResult = opts.router.getMatchedRoutes(pathname, void 0);
  let response;
  let matchedRoutes = [];
  matchedRoutes = serverTreeResult.matchedRoutes;
  if (routeTreeResult.foundRoute) {
    if (serverTreeResult.matchedRoutes.length < routeTreeResult.matchedRoutes.length) {
      const closestCommon = [...routeTreeResult.matchedRoutes].reverse().find((r) => {
        return opts.processedServerRouteTree.routesById[r.id] !== void 0;
      });
      if (closestCommon) {
        let routeId = closestCommon.id;
        matchedRoutes = [];
        do {
          const route = opts.processedServerRouteTree.routesById[routeId];
          if (!route) {
            break;
          }
          matchedRoutes.push(route);
          routeId = (_a = route.parentRoute) == null ? void 0 : _a.id;
        } while (routeId);
        matchedRoutes.reverse();
      }
    }
  }
  if (matchedRoutes.length) {
    const middlewares = flattenMiddlewares(
      matchedRoutes.flatMap((r) => r.options.middleware).filter(Boolean)
    ).map((d2) => d2.options.server);
    if ((_b = serverTreeResult.foundRoute) == null ? void 0 : _b.options.methods) {
      const method = Object.keys(
        serverTreeResult.foundRoute.options.methods
      ).find(
        (method2) => method2.toLowerCase() === opts.request.method.toLowerCase()
      );
      if (method) {
        const handler = serverTreeResult.foundRoute.options.methods[method];
        if (handler) {
          if (typeof handler === "function") {
            middlewares.push(handlerToMiddleware(handler));
          } else {
            if (handler._options.middlewares && handler._options.middlewares.length) {
              middlewares.push(
                ...flattenMiddlewares(handler._options.middlewares).map(
                  (d2) => d2.options.server
                )
              );
            }
            if (handler._options.handler) {
              middlewares.push(handlerToMiddleware(handler._options.handler));
            }
          }
        }
      }
    }
    middlewares.push(handlerToMiddleware(opts.executeRouter));
    const ctx = await executeMiddleware(middlewares, {
      request: opts.request,
      context: {},
      params: serverTreeResult.routeParams,
      pathname
    });
    response = ctx.response;
  }
  return [matchedRoutes, response];
}
function handlerToMiddleware(handler) {
  return async ({ next: _next, ...rest }) => {
    const response = await handler(rest);
    if (response) {
      return { response };
    }
    return _next(rest);
  };
}
function executeMiddleware(middlewares, ctx) {
  let index = -1;
  const next = async (ctx2) => {
    index++;
    const middleware = middlewares[index];
    if (!middleware) return ctx2;
    const result = await middleware({
      ...ctx2,
      // Allow the middleware to call the next middleware in the chain
      next: async (nextCtx) => {
        const nextResult = await next({
          ...ctx2,
          ...nextCtx,
          context: {
            ...ctx2.context,
            ...(nextCtx == null ? void 0 : nextCtx.context) || {}
          }
        });
        return Object.assign(ctx2, handleCtxResult(nextResult));
      }
      // Allow the middleware result to extend the return context
    }).catch((err) => {
      if (isSpecialResponse(err)) {
        return {
          response: err
        };
      }
      throw err;
    });
    return Object.assign(ctx2, handleCtxResult(result));
  };
  return handleCtxResult(next(ctx));
}
function handleCtxResult(result) {
  if (isSpecialResponse(result)) {
    return {
      response: result
    };
  }
  return result;
}
function isSpecialResponse(err) {
  return isResponse(err) || isRedirect(err);
}
function isResponse(response) {
  return response instanceof Response;
}
var Pe = Object.defineProperty;
var a = (e, t) => Pe(e, "name", { value: t, configurable: true });
var P = class {
  type = 3;
  name = "";
  prefix = "";
  value = "";
  suffix = "";
  modifier = 3;
  constructor(t, r, n, c, l, f2) {
    this.type = t, this.name = r, this.prefix = n, this.value = c, this.suffix = l, this.modifier = f2;
  }
  hasCustomName() {
    return this.name !== "" && typeof this.name != "number";
  }
};
a(P, "Part");
var Re = /[$_\p{ID_Start}]/u, Ee = /[$_\u200C\u200D\p{ID_Continue}]/u, v2 = ".*";
function Oe(e, t) {
  return (t ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(e);
}
a(Oe, "isASCII");
function D2(e, t = false) {
  let r = [], n = 0;
  for (; n < e.length; ) {
    let c = e[n], l = a(function(f2) {
      if (!t) throw new TypeError(f2);
      r.push({ type: "INVALID_CHAR", index: n, value: e[n++] });
    }, "ErrorOrInvalid");
    if (c === "*") {
      r.push({ type: "ASTERISK", index: n, value: e[n++] });
      continue;
    }
    if (c === "+" || c === "?") {
      r.push({ type: "OTHER_MODIFIER", index: n, value: e[n++] });
      continue;
    }
    if (c === "\\") {
      r.push({ type: "ESCAPED_CHAR", index: n++, value: e[n++] });
      continue;
    }
    if (c === "{") {
      r.push({ type: "OPEN", index: n, value: e[n++] });
      continue;
    }
    if (c === "}") {
      r.push({ type: "CLOSE", index: n, value: e[n++] });
      continue;
    }
    if (c === ":") {
      let f2 = "", s2 = n + 1;
      for (; s2 < e.length; ) {
        let i = e.substr(s2, 1);
        if (s2 === n + 1 && Re.test(i) || s2 !== n + 1 && Ee.test(i)) {
          f2 += e[s2++];
          continue;
        }
        break;
      }
      if (!f2) {
        l(`Missing parameter name at ${n}`);
        continue;
      }
      r.push({ type: "NAME", index: n, value: f2 }), n = s2;
      continue;
    }
    if (c === "(") {
      let f2 = 1, s2 = "", i = n + 1, o = false;
      if (e[i] === "?") {
        l(`Pattern cannot start with "?" at ${i}`);
        continue;
      }
      for (; i < e.length; ) {
        if (!Oe(e[i], false)) {
          l(`Invalid character '${e[i]}' at ${i}.`), o = true;
          break;
        }
        if (e[i] === "\\") {
          s2 += e[i++] + e[i++];
          continue;
        }
        if (e[i] === ")") {
          if (f2--, f2 === 0) {
            i++;
            break;
          }
        } else if (e[i] === "(" && (f2++, e[i + 1] !== "?")) {
          l(`Capturing groups are not allowed at ${i}`), o = true;
          break;
        }
        s2 += e[i++];
      }
      if (o) continue;
      if (f2) {
        l(`Unbalanced pattern at ${n}`);
        continue;
      }
      if (!s2) {
        l(`Missing pattern at ${n}`);
        continue;
      }
      r.push({ type: "REGEX", index: n, value: s2 }), n = i;
      continue;
    }
    r.push({ type: "CHAR", index: n, value: e[n++] });
  }
  return r.push({ type: "END", index: n, value: "" }), r;
}
a(D2, "lexer");
function F(e, t = {}) {
  let r = D2(e);
  t.delimiter ??= "/#?", t.prefixes ??= "./";
  let n = `[^${x(t.delimiter)}]+?`, c = [], l = 0, f2 = 0, i = /* @__PURE__ */ new Set(), o = a((u2) => {
    if (f2 < r.length && r[f2].type === u2) return r[f2++].value;
  }, "tryConsume"), h = a(() => o("OTHER_MODIFIER") ?? o("ASTERISK"), "tryConsumeModifier"), p2 = a((u2) => {
    let d2 = o(u2);
    if (d2 !== void 0) return d2;
    let { type: g2, index: y2 } = r[f2];
    throw new TypeError(`Unexpected ${g2} at ${y2}, expected ${u2}`);
  }, "mustConsume"), A2 = a(() => {
    let u2 = "", d2;
    for (; d2 = o("CHAR") ?? o("ESCAPED_CHAR"); ) u2 += d2;
    return u2;
  }, "consumeText"), xe2 = a((u2) => u2, "DefaultEncodePart"), N = t.encodePart || xe2, H = "", $ = a((u2) => {
    H += u2;
  }, "appendToPendingFixedValue"), M2 = a(() => {
    H.length && (c.push(new P(3, "", "", N(H), "", 3)), H = "");
  }, "maybeAddPartFromPendingFixedValue"), X = a((u2, d2, g2, y2, Z) => {
    let m2 = 3;
    switch (Z) {
      case "?":
        m2 = 1;
        break;
      case "*":
        m2 = 0;
        break;
      case "+":
        m2 = 2;
        break;
    }
    if (!d2 && !g2 && m2 === 3) {
      $(u2);
      return;
    }
    if (M2(), !d2 && !g2) {
      if (!u2) return;
      c.push(new P(3, "", "", N(u2), "", m2));
      return;
    }
    let S2;
    g2 ? g2 === "*" ? S2 = v2 : S2 = g2 : S2 = n;
    let k = 2;
    S2 === n ? (k = 1, S2 = "") : S2 === v2 && (k = 0, S2 = "");
    let E2;
    if (d2 ? E2 = d2 : g2 && (E2 = l++), i.has(E2)) throw new TypeError(`Duplicate name '${E2}'.`);
    i.add(E2), c.push(new P(k, E2, N(u2), S2, N(y2), m2));
  }, "addPart");
  for (; f2 < r.length; ) {
    let u2 = o("CHAR"), d2 = o("NAME"), g2 = o("REGEX");
    if (!d2 && !g2 && (g2 = o("ASTERISK")), d2 || g2) {
      let m2 = u2 ?? "";
      t.prefixes.indexOf(m2) === -1 && ($(m2), m2 = ""), M2();
      let S2 = h();
      X(m2, d2, g2, "", S2);
      continue;
    }
    let y2 = u2 ?? o("ESCAPED_CHAR");
    if (y2) {
      $(y2);
      continue;
    }
    if (o("OPEN")) {
      let m2 = A2(), S2 = o("NAME"), k = o("REGEX");
      !S2 && !k && (k = o("ASTERISK"));
      let E2 = A2();
      p2("CLOSE");
      let be2 = h();
      X(m2, S2, k, E2, be2);
      continue;
    }
    M2(), p2("END");
  }
  return c;
}
a(F, "parse");
function x(e) {
  return e.replace(/([.+*?^${}()[\]|/\\])/g, "\\$1");
}
a(x, "escapeString");
function B(e) {
  return e && e.ignoreCase ? "ui" : "u";
}
a(B, "flags");
function q(e, t, r) {
  return W2(F(e, r), t, r);
}
a(q, "stringToRegexp");
function T2(e) {
  switch (e) {
    case 0:
      return "*";
    case 1:
      return "?";
    case 2:
      return "+";
    case 3:
      return "";
  }
}
a(T2, "modifierToString");
function W2(e, t, r = {}) {
  r.delimiter ??= "/#?", r.prefixes ??= "./", r.sensitive ??= false, r.strict ??= false, r.end ??= true, r.start ??= true, r.endsWith = "";
  let n = r.start ? "^" : "";
  for (let s2 of e) {
    if (s2.type === 3) {
      s2.modifier === 3 ? n += x(s2.value) : n += `(?:${x(s2.value)})${T2(s2.modifier)}`;
      continue;
    }
    t && t.push(s2.name);
    let i = `[^${x(r.delimiter)}]+?`, o = s2.value;
    if (s2.type === 1 ? o = i : s2.type === 0 && (o = v2), !s2.prefix.length && !s2.suffix.length) {
      s2.modifier === 3 || s2.modifier === 1 ? n += `(${o})${T2(s2.modifier)}` : n += `((?:${o})${T2(s2.modifier)})`;
      continue;
    }
    if (s2.modifier === 3 || s2.modifier === 1) {
      n += `(?:${x(s2.prefix)}(${o})${x(s2.suffix)})`, n += T2(s2.modifier);
      continue;
    }
    n += `(?:${x(s2.prefix)}`, n += `((?:${o})(?:`, n += x(s2.suffix), n += x(s2.prefix), n += `(?:${o}))*)${x(s2.suffix)})`, s2.modifier === 0 && (n += "?");
  }
  let c = `[${x(r.endsWith)}]|$`, l = `[${x(r.delimiter)}]`;
  if (r.end) return r.strict || (n += `${l}?`), r.endsWith.length ? n += `(?=${c})` : n += "$", new RegExp(n, B(r));
  r.strict || (n += `(?:${l}(?=${c}))?`);
  let f2 = false;
  if (e.length) {
    let s2 = e[e.length - 1];
    s2.type === 3 && s2.modifier === 3 && (f2 = r.delimiter.indexOf(s2) > -1);
  }
  return f2 || (n += `(?=${l}|${c})`), new RegExp(n, B(r));
}
a(W2, "partsToRegexp");
var b = { delimiter: "", prefixes: "", sensitive: true, strict: true }, J = { delimiter: ".", prefixes: "", sensitive: true, strict: true }, Q = { delimiter: "/", prefixes: "/", sensitive: true, strict: true };
function ee2(e, t) {
  return e.length ? e[0] === "/" ? true : !t || e.length < 2 ? false : (e[0] == "\\" || e[0] == "{") && e[1] == "/" : false;
}
a(ee2, "isAbsolutePathname");
function te(e, t) {
  return e.startsWith(t) ? e.substring(t.length, e.length) : e;
}
a(te, "maybeStripPrefix");
function ke(e, t) {
  return e.endsWith(t) ? e.substr(0, e.length - t.length) : e;
}
a(ke, "maybeStripSuffix");
function _(e) {
  return !e || e.length < 2 ? false : e[0] === "[" || (e[0] === "\\" || e[0] === "{") && e[1] === "[";
}
a(_, "treatAsIPv6Hostname");
var re = ["ftp", "file", "http", "https", "ws", "wss"];
function U(e) {
  if (!e) return true;
  for (let t of re) if (e.test(t)) return true;
  return false;
}
a(U, "isSpecialScheme");
function ne(e, t) {
  if (e = te(e, "#"), t || e === "") return e;
  let r = new URL("https://example.com");
  return r.hash = e, r.hash ? r.hash.substring(1, r.hash.length) : "";
}
a(ne, "canonicalizeHash");
function se(e, t) {
  if (e = te(e, "?"), t || e === "") return e;
  let r = new URL("https://example.com");
  return r.search = e, r.search ? r.search.substring(1, r.search.length) : "";
}
a(se, "canonicalizeSearch");
function ie2(e, t) {
  return t || e === "" ? e : _(e) ? K(e) : j(e);
}
a(ie2, "canonicalizeHostname");
function ae(e, t) {
  if (t || e === "") return e;
  let r = new URL("https://example.com");
  return r.password = e, r.password;
}
a(ae, "canonicalizePassword");
function oe2(e, t) {
  if (t || e === "") return e;
  let r = new URL("https://example.com");
  return r.username = e, r.username;
}
a(oe2, "canonicalizeUsername");
function ce(e, t, r) {
  if (r || e === "") return e;
  if (t && !re.includes(t)) return new URL(`${t}:${e}`).pathname;
  let n = e[0] == "/";
  return e = new URL(n ? e : "/-" + e, "https://example.com").pathname, n || (e = e.substring(2, e.length)), e;
}
a(ce, "canonicalizePathname");
function le(e, t, r) {
  return z(t) === e && (e = ""), r || e === "" ? e : G2(e);
}
a(le, "canonicalizePort");
function fe(e, t) {
  return e = ke(e, ":"), t || e === "" ? e : w(e);
}
a(fe, "canonicalizeProtocol");
function z(e) {
  switch (e) {
    case "ws":
    case "http":
      return "80";
    case "wws":
    case "https":
      return "443";
    case "ftp":
      return "21";
    default:
      return "";
  }
}
a(z, "defaultPortForProtocol");
function w(e) {
  if (e === "") return e;
  if (/^[-+.A-Za-z0-9]*$/.test(e)) return e.toLowerCase();
  throw new TypeError(`Invalid protocol '${e}'.`);
}
a(w, "protocolEncodeCallback");
function he(e) {
  if (e === "") return e;
  let t = new URL("https://example.com");
  return t.username = e, t.username;
}
a(he, "usernameEncodeCallback");
function ue(e) {
  if (e === "") return e;
  let t = new URL("https://example.com");
  return t.password = e, t.password;
}
a(ue, "passwordEncodeCallback");
function j(e) {
  if (e === "") return e;
  if (/[\t\n\r #%/:<>?@[\]^\\|]/g.test(e)) throw new TypeError(`Invalid hostname '${e}'`);
  let t = new URL("https://example.com");
  return t.hostname = e, t.hostname;
}
a(j, "hostnameEncodeCallback");
function K(e) {
  if (e === "") return e;
  if (/[^0-9a-fA-F[\]:]/g.test(e)) throw new TypeError(`Invalid IPv6 hostname '${e}'`);
  return e.toLowerCase();
}
a(K, "ipv6HostnameEncodeCallback");
function G2(e) {
  if (e === "" || /^[0-9]*$/.test(e) && parseInt(e) <= 65535) return e;
  throw new TypeError(`Invalid port '${e}'.`);
}
a(G2, "portEncodeCallback");
function de(e) {
  if (e === "") return e;
  let t = new URL("https://example.com");
  return t.pathname = e[0] !== "/" ? "/-" + e : e, e[0] !== "/" ? t.pathname.substring(2, t.pathname.length) : t.pathname;
}
a(de, "standardURLPathnameEncodeCallback");
function pe(e) {
  return e === "" ? e : new URL(`data:${e}`).pathname;
}
a(pe, "pathURLPathnameEncodeCallback");
function ge(e) {
  if (e === "") return e;
  let t = new URL("https://example.com");
  return t.search = e, t.search.substring(1, t.search.length);
}
a(ge, "searchEncodeCallback");
function me(e) {
  if (e === "") return e;
  let t = new URL("https://example.com");
  return t.hash = e, t.hash.substring(1, t.hash.length);
}
a(me, "hashEncodeCallback");
var C = class {
  #i;
  #n = [];
  #t = {};
  #e = 0;
  #s = 1;
  #l = 0;
  #o = 0;
  #d = 0;
  #p = 0;
  #g = false;
  constructor(t) {
    this.#i = t;
  }
  get result() {
    return this.#t;
  }
  parse() {
    for (this.#n = D2(this.#i, true); this.#e < this.#n.length; this.#e += this.#s) {
      if (this.#s = 1, this.#n[this.#e].type === "END") {
        if (this.#o === 0) {
          this.#b(), this.#f() ? this.#r(9, 1) : this.#h() ? this.#r(8, 1) : this.#r(7, 0);
          continue;
        } else if (this.#o === 2) {
          this.#u(5);
          continue;
        }
        this.#r(10, 0);
        break;
      }
      if (this.#d > 0) if (this.#A()) this.#d -= 1;
      else continue;
      if (this.#T()) {
        this.#d += 1;
        continue;
      }
      switch (this.#o) {
        case 0:
          this.#P() && this.#u(1);
          break;
        case 1:
          if (this.#P()) {
            this.#C();
            let t = 7, r = 1;
            this.#E() ? (t = 2, r = 3) : this.#g && (t = 2), this.#r(t, r);
          }
          break;
        case 2:
          this.#S() ? this.#u(3) : (this.#x() || this.#h() || this.#f()) && this.#u(5);
          break;
        case 3:
          this.#O() ? this.#r(4, 1) : this.#S() && this.#r(5, 1);
          break;
        case 4:
          this.#S() && this.#r(5, 1);
          break;
        case 5:
          this.#y() ? this.#p += 1 : this.#w() && (this.#p -= 1), this.#k() && !this.#p ? this.#r(6, 1) : this.#x() ? this.#r(7, 0) : this.#h() ? this.#r(8, 1) : this.#f() && this.#r(9, 1);
          break;
        case 6:
          this.#x() ? this.#r(7, 0) : this.#h() ? this.#r(8, 1) : this.#f() && this.#r(9, 1);
          break;
        case 7:
          this.#h() ? this.#r(8, 1) : this.#f() && this.#r(9, 1);
          break;
        case 8:
          this.#f() && this.#r(9, 1);
          break;
      }
    }
    this.#t.hostname !== void 0 && this.#t.port === void 0 && (this.#t.port = "");
  }
  #r(t, r) {
    switch (this.#o) {
      case 0:
        break;
      case 1:
        this.#t.protocol = this.#c();
        break;
      case 2:
        break;
      case 3:
        this.#t.username = this.#c();
        break;
      case 4:
        this.#t.password = this.#c();
        break;
      case 5:
        this.#t.hostname = this.#c();
        break;
      case 6:
        this.#t.port = this.#c();
        break;
      case 7:
        this.#t.pathname = this.#c();
        break;
      case 8:
        this.#t.search = this.#c();
        break;
      case 9:
        this.#t.hash = this.#c();
        break;
    }
    this.#o !== 0 && t !== 10 && ([1, 2, 3, 4].includes(this.#o) && [6, 7, 8, 9].includes(t) && (this.#t.hostname ??= ""), [1, 2, 3, 4, 5, 6].includes(this.#o) && [8, 9].includes(t) && (this.#t.pathname ??= this.#g ? "/" : ""), [1, 2, 3, 4, 5, 6, 7].includes(this.#o) && t === 9 && (this.#t.search ??= "")), this.#R(t, r);
  }
  #R(t, r) {
    this.#o = t, this.#l = this.#e + r, this.#e += r, this.#s = 0;
  }
  #b() {
    this.#e = this.#l, this.#s = 0;
  }
  #u(t) {
    this.#b(), this.#o = t;
  }
  #m(t) {
    return t < 0 && (t = this.#n.length - t), t < this.#n.length ? this.#n[t] : this.#n[this.#n.length - 1];
  }
  #a(t, r) {
    let n = this.#m(t);
    return n.value === r && (n.type === "CHAR" || n.type === "ESCAPED_CHAR" || n.type === "INVALID_CHAR");
  }
  #P() {
    return this.#a(this.#e, ":");
  }
  #E() {
    return this.#a(this.#e + 1, "/") && this.#a(this.#e + 2, "/");
  }
  #S() {
    return this.#a(this.#e, "@");
  }
  #O() {
    return this.#a(this.#e, ":");
  }
  #k() {
    return this.#a(this.#e, ":");
  }
  #x() {
    return this.#a(this.#e, "/");
  }
  #h() {
    if (this.#a(this.#e, "?")) return true;
    if (this.#n[this.#e].value !== "?") return false;
    let t = this.#m(this.#e - 1);
    return t.type !== "NAME" && t.type !== "REGEX" && t.type !== "CLOSE" && t.type !== "ASTERISK";
  }
  #f() {
    return this.#a(this.#e, "#");
  }
  #T() {
    return this.#n[this.#e].type == "OPEN";
  }
  #A() {
    return this.#n[this.#e].type == "CLOSE";
  }
  #y() {
    return this.#a(this.#e, "[");
  }
  #w() {
    return this.#a(this.#e, "]");
  }
  #c() {
    let t = this.#n[this.#e], r = this.#m(this.#l).index;
    return this.#i.substring(r, t.index);
  }
  #C() {
    let t = {};
    Object.assign(t, b), t.encodePart = w;
    let r = q(this.#c(), void 0, t);
    this.#g = U(r);
  }
};
a(C, "Parser");
var V2 = ["protocol", "username", "password", "hostname", "port", "pathname", "search", "hash"], O = "*";
function Se(e, t) {
  if (typeof e != "string") throw new TypeError("parameter 1 is not of type 'string'.");
  let r = new URL(e, t);
  return { protocol: r.protocol.substring(0, r.protocol.length - 1), username: r.username, password: r.password, hostname: r.hostname, port: r.port, pathname: r.pathname, search: r.search !== "" ? r.search.substring(1, r.search.length) : void 0, hash: r.hash !== "" ? r.hash.substring(1, r.hash.length) : void 0 };
}
a(Se, "extractValues");
function R(e, t) {
  return t ? I(e) : e;
}
a(R, "processBaseURLString");
function L(e, t, r) {
  let n;
  if (typeof t.baseURL == "string") try {
    n = new URL(t.baseURL), t.protocol === void 0 && (e.protocol = R(n.protocol.substring(0, n.protocol.length - 1), r)), !r && t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.username === void 0 && (e.username = R(n.username, r)), !r && t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.username === void 0 && t.password === void 0 && (e.password = R(n.password, r)), t.protocol === void 0 && t.hostname === void 0 && (e.hostname = R(n.hostname, r)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && (e.port = R(n.port, r)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.pathname === void 0 && (e.pathname = R(n.pathname, r)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.pathname === void 0 && t.search === void 0 && (e.search = R(n.search.substring(1, n.search.length), r)), t.protocol === void 0 && t.hostname === void 0 && t.port === void 0 && t.pathname === void 0 && t.search === void 0 && t.hash === void 0 && (e.hash = R(n.hash.substring(1, n.hash.length), r));
  } catch {
    throw new TypeError(`invalid baseURL '${t.baseURL}'.`);
  }
  if (typeof t.protocol == "string" && (e.protocol = fe(t.protocol, r)), typeof t.username == "string" && (e.username = oe2(t.username, r)), typeof t.password == "string" && (e.password = ae(t.password, r)), typeof t.hostname == "string" && (e.hostname = ie2(t.hostname, r)), typeof t.port == "string" && (e.port = le(t.port, e.protocol, r)), typeof t.pathname == "string") {
    if (e.pathname = t.pathname, n && !ee2(e.pathname, r)) {
      let c = n.pathname.lastIndexOf("/");
      c >= 0 && (e.pathname = R(n.pathname.substring(0, c + 1), r) + e.pathname);
    }
    e.pathname = ce(e.pathname, e.protocol, r);
  }
  return typeof t.search == "string" && (e.search = se(t.search, r)), typeof t.hash == "string" && (e.hash = ne(t.hash, r)), e;
}
a(L, "applyInit");
function I(e) {
  return e.replace(/([+*?:{}()\\])/g, "\\$1");
}
a(I, "escapePatternString");
function Te2(e) {
  return e.replace(/([.+*?^${}()[\]|/\\])/g, "\\$1");
}
a(Te2, "escapeRegexpString");
function Ae(e, t) {
  t.delimiter ??= "/#?", t.prefixes ??= "./", t.sensitive ??= false, t.strict ??= false, t.end ??= true, t.start ??= true, t.endsWith = "";
  let r = ".*", n = `[^${Te2(t.delimiter)}]+?`, c = /[$_\u200C\u200D\p{ID_Continue}]/u, l = "";
  for (let f2 = 0; f2 < e.length; ++f2) {
    let s2 = e[f2];
    if (s2.type === 3) {
      if (s2.modifier === 3) {
        l += I(s2.value);
        continue;
      }
      l += `{${I(s2.value)}}${T2(s2.modifier)}`;
      continue;
    }
    let i = s2.hasCustomName(), o = !!s2.suffix.length || !!s2.prefix.length && (s2.prefix.length !== 1 || !t.prefixes.includes(s2.prefix)), h = f2 > 0 ? e[f2 - 1] : null, p2 = f2 < e.length - 1 ? e[f2 + 1] : null;
    if (!o && i && s2.type === 1 && s2.modifier === 3 && p2 && !p2.prefix.length && !p2.suffix.length) if (p2.type === 3) {
      let A2 = p2.value.length > 0 ? p2.value[0] : "";
      o = c.test(A2);
    } else o = !p2.hasCustomName();
    if (!o && !s2.prefix.length && h && h.type === 3) {
      let A2 = h.value[h.value.length - 1];
      o = t.prefixes.includes(A2);
    }
    o && (l += "{"), l += I(s2.prefix), i && (l += `:${s2.name}`), s2.type === 2 ? l += `(${s2.value})` : s2.type === 1 ? i || (l += `(${n})`) : s2.type === 0 && (!i && (!h || h.type === 3 || h.modifier !== 3 || o || s2.prefix !== "") ? l += "*" : l += `(${r})`), s2.type === 1 && i && s2.suffix.length && c.test(s2.suffix[0]) && (l += "\\"), l += I(s2.suffix), o && (l += "}"), s2.modifier !== 3 && (l += T2(s2.modifier));
  }
  return l;
}
a(Ae, "partsToPattern");
var Y2 = class {
  #i;
  #n = {};
  #t = {};
  #e = {};
  #s = {};
  #l = false;
  constructor(t = {}, r, n) {
    try {
      let c;
      if (typeof r == "string" ? c = r : n = r, typeof t == "string") {
        let i = new C(t);
        if (i.parse(), t = i.result, c === void 0 && typeof t.protocol != "string") throw new TypeError("A base URL must be provided for a relative constructor string.");
        t.baseURL = c;
      } else {
        if (!t || typeof t != "object") throw new TypeError("parameter 1 is not of type 'string' and cannot convert to dictionary.");
        if (c) throw new TypeError("parameter 1 is not of type 'string'.");
      }
      typeof n > "u" && (n = { ignoreCase: false });
      let l = { ignoreCase: n.ignoreCase === true }, f2 = { pathname: O, protocol: O, username: O, password: O, hostname: O, port: O, search: O, hash: O };
      this.#i = L(f2, t, true), z(this.#i.protocol) === this.#i.port && (this.#i.port = "");
      let s2;
      for (s2 of V2) {
        if (!(s2 in this.#i)) continue;
        let i = {}, o = this.#i[s2];
        switch (this.#t[s2] = [], s2) {
          case "protocol":
            Object.assign(i, b), i.encodePart = w;
            break;
          case "username":
            Object.assign(i, b), i.encodePart = he;
            break;
          case "password":
            Object.assign(i, b), i.encodePart = ue;
            break;
          case "hostname":
            Object.assign(i, J), _(o) ? i.encodePart = K : i.encodePart = j;
            break;
          case "port":
            Object.assign(i, b), i.encodePart = G2;
            break;
          case "pathname":
            U(this.#n.protocol) ? (Object.assign(i, Q, l), i.encodePart = de) : (Object.assign(i, b, l), i.encodePart = pe);
            break;
          case "search":
            Object.assign(i, b, l), i.encodePart = ge;
            break;
          case "hash":
            Object.assign(i, b, l), i.encodePart = me;
            break;
        }
        try {
          this.#s[s2] = F(o, i), this.#n[s2] = W2(this.#s[s2], this.#t[s2], i), this.#e[s2] = Ae(this.#s[s2], i), this.#l = this.#l || this.#s[s2].some((h) => h.type === 2);
        } catch {
          throw new TypeError(`invalid ${s2} pattern '${this.#i[s2]}'.`);
        }
      }
    } catch (c) {
      throw new TypeError(`Failed to construct 'URLPattern': ${c.message}`);
    }
  }
  get [Symbol.toStringTag]() {
    return "URLPattern";
  }
  test(t = {}, r) {
    let n = { pathname: "", protocol: "", username: "", password: "", hostname: "", port: "", search: "", hash: "" };
    if (typeof t != "string" && r) throw new TypeError("parameter 1 is not of type 'string'.");
    if (typeof t > "u") return false;
    try {
      typeof t == "object" ? n = L(n, t, false) : n = L(n, Se(t, r), false);
    } catch {
      return false;
    }
    let c;
    for (c of V2) if (!this.#n[c].exec(n[c])) return false;
    return true;
  }
  exec(t = {}, r) {
    let n = { pathname: "", protocol: "", username: "", password: "", hostname: "", port: "", search: "", hash: "" };
    if (typeof t != "string" && r) throw new TypeError("parameter 1 is not of type 'string'.");
    if (typeof t > "u") return;
    try {
      typeof t == "object" ? n = L(n, t, false) : n = L(n, Se(t, r), false);
    } catch {
      return null;
    }
    let c = {};
    r ? c.inputs = [t, r] : c.inputs = [t];
    let l;
    for (l of V2) {
      let f2 = this.#n[l].exec(n[l]);
      if (!f2) return null;
      let s2 = {};
      for (let [i, o] of this.#t[l].entries()) if (typeof o == "string" || typeof o == "number") {
        let h = f2[i + 1];
        s2[o] = h;
      }
      c[l] = { input: n[l] ?? "", groups: s2 };
    }
    return c;
  }
  static compareComponent(t, r, n) {
    let c = a((i, o) => {
      for (let h of ["type", "modifier", "prefix", "value", "suffix"]) {
        if (i[h] < o[h]) return -1;
        if (i[h] === o[h]) continue;
        return 1;
      }
      return 0;
    }, "comparePart"), l = new P(3, "", "", "", "", 3), f2 = new P(0, "", "", "", "", 3), s2 = a((i, o) => {
      let h = 0;
      for (; h < Math.min(i.length, o.length); ++h) {
        let p2 = c(i[h], o[h]);
        if (p2) return p2;
      }
      return i.length === o.length ? 0 : c(i[h] ?? l, o[h] ?? l);
    }, "comparePartList");
    return !r.#e[t] && !n.#e[t] ? 0 : r.#e[t] && !n.#e[t] ? s2(r.#s[t], [f2]) : !r.#e[t] && n.#e[t] ? s2([f2], n.#s[t]) : s2(r.#s[t], n.#s[t]);
  }
  get protocol() {
    return this.#e.protocol;
  }
  get username() {
    return this.#e.username;
  }
  get password() {
    return this.#e.password;
  }
  get hostname() {
    return this.#e.hostname;
  }
  get port() {
    return this.#e.port;
  }
  get pathname() {
    return this.#e.pathname;
  }
  get search() {
    return this.#e.search;
  }
  get hash() {
    return this.#e.hash;
  }
  get hasRegExpGroups() {
    return this.#l;
  }
};
a(Y2, "URLPattern");
if (!globalThis.URLPattern) {
  globalThis.URLPattern = Y2;
}
function routerWithQueryClient(router, queryClient, additionalOpts) {
  const ogOptions = router.options;
  router.options = {
    ...router.options,
    context: {
      ...ogOptions.context,
      // Pass the query client to the context, so we can access it in loaders
      queryClient
    },
    // Wrap the app in a QueryClientProvider
    Wrap: ({ children }) => {
      const OuterWrapper = Fragment$1;
      const OGWrap = ogOptions.Wrap || Fragment$1;
      return /* @__PURE__ */ jsx(OuterWrapper, { children: /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(OGWrap, { children }) }) });
    }
  };
  if (router.isServer) {
    const queryStream = createPushableStream();
    router.options.dehydrate = async () => {
      var _a;
      const ogDehydrated = await ((_a = ogOptions.dehydrate) == null ? void 0 : _a.call(ogOptions));
      const dehydratedQueryClient = dehydrate(queryClient);
      router.serverSsr.onRenderFinished(() => queryStream.close());
      const dehydratedRouter = {
        ...ogDehydrated,
        // When critical data is dehydrated, we also dehydrate the query client
        dehydratedQueryClient,
        // prepare the stream for queries coming up during rendering
        queryStream: queryStream.stream
      };
      return dehydratedRouter;
    };
    const ogClientOptions = queryClient.getDefaultOptions();
    queryClient.setDefaultOptions({
      ...ogClientOptions,
      dehydrate: {
        shouldDehydrateQuery: () => true,
        ...ogClientOptions.dehydrate
      }
    });
    queryClient.getQueryCache().subscribe((event) => {
      if (event.type === "added") {
        if (!router.serverSsr.isDehydrated()) {
          return;
        }
        if (queryStream.isClosed()) {
          console.warn(
            `tried to stream query ${event.query.queryHash} after stream was already closed`
          );
          return;
        }
        queryStream.enqueue(
          dehydrate(queryClient, {
            shouldDehydrateQuery: (query) => {
              var _a, _b;
              if (query.queryHash === event.query.queryHash) {
                return ((_b = (_a = ogClientOptions.dehydrate) == null ? void 0 : _a.shouldDehydrateQuery) == null ? void 0 : _b.call(_a, query)) ?? true;
              }
              return false;
            }
          })
        );
      }
    });
  } else {
    router.options.hydrate = async (dehydrated) => {
      var _a;
      await ((_a = ogOptions.hydrate) == null ? void 0 : _a.call(ogOptions, dehydrated));
      hydrate(queryClient, dehydrated.dehydratedQueryClient);
      const reader = dehydrated.queryStream.getReader();
      reader.read().then(async function handle({ done, value }) {
        hydrate(queryClient, value);
        if (done) {
          return;
        }
        const result = await reader.read();
        return handle(result);
      }).catch((err) => {
        console.error("Error reading query stream:", err);
      });
    };
    {
      const ogMutationCacheConfig = queryClient.getMutationCache().config;
      queryClient.getMutationCache().config = {
        ...ogMutationCacheConfig,
        onError: (error, _variables, _context, _mutation) => {
          var _a;
          if (isRedirect(error)) {
            error.options._fromLocation = router.state.location;
            return router.navigate(router.resolveRedirect(error).options);
          }
          return (_a = ogMutationCacheConfig.onError) == null ? void 0 : _a.call(
            ogMutationCacheConfig,
            error,
            _variables,
            _context,
            _mutation
          );
        }
      };
      const ogQueryCacheConfig = queryClient.getQueryCache().config;
      queryClient.getQueryCache().config = {
        ...ogQueryCacheConfig,
        onError: (error, _query) => {
          var _a;
          if (isRedirect(error)) {
            error.options._fromLocation = router.state.location;
            return router.navigate(router.resolveRedirect(error).options);
          }
          return (_a = ogQueryCacheConfig.onError) == null ? void 0 : _a.call(ogQueryCacheConfig, error, _query);
        }
      };
    }
  }
  return router;
}
function createPushableStream() {
  let controllerRef;
  const stream = new ReadableStream({
    start(controller) {
      controllerRef = controller;
    }
  });
  let _isClosed = false;
  return {
    stream,
    enqueue: (chunk) => controllerRef.enqueue(chunk),
    close: () => {
      controllerRef.close();
      _isClosed = true;
    },
    isClosed: () => _isClosed,
    error: (err) => controllerRef.error(err)
  };
}
function DefaultCatchBoundary({ error }) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId$1
  });
  console.error(error);
  return /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6", children: [
    /* @__PURE__ */ jsx(ErrorComponent, { error }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center flex-wrap", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router.invalidate();
          },
          className: `px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold`,
          children: "Try Again"
        }
      ),
      isRoot ? /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          className: `px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold`,
          children: "Home"
        }
      ) : /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          className: `px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold`,
          onClick: (e) => {
            e.preventDefault();
            window.history.back();
          },
          children: "Go Back"
        }
      )
    ] })
  ] });
}
const baseLocale = "ru";
const locales = (
  /** @type {const} */
  ["kk", "ru"]
);
const cookieName = "PARAGLIDE_LOCALE";
const strategy = [
  "cookie",
  "url",
  "preferredLanguage",
  "baseLocale"
];
const urlPatterns = [
  {
    "pattern": "/:path(.*)?",
    "localized": [
      [
        "kk",
        "/kk/:path(.*)?"
      ],
      [
        "ru",
        "/:path(.*)?"
      ]
    ]
  }
];
let serverAsyncLocalStorage = void 0;
function overwriteServerAsyncLocalStorage(value) {
  serverAsyncLocalStorage = value;
}
globalThis.__paraglide = {};
let _locale;
let localeInitiallySet = false;
let getLocale = () => {
  let locale;
  if (serverAsyncLocalStorage) {
    const locale2 = serverAsyncLocalStorage?.getStore()?.locale;
    if (locale2) {
      return locale2;
    }
  }
  for (const strat of strategy) {
    if (strat === "cookie") {
      locale = extractLocaleFromCookie();
    } else if (strat === "baseLocale") {
      locale = baseLocale;
    } else if (isCustomStrategy(strat) && customClientStrategies.has(strat)) {
      const handler = customClientStrategies.get(strat);
      if (handler) {
        const result = handler.getLocale();
        if (result instanceof Promise) {
          continue;
        }
        locale = result;
      }
    }
    if (locale !== void 0) {
      const asserted = assertIsLocale(locale);
      if (!localeInitiallySet) {
        _locale = asserted;
        localeInitiallySet = true;
        setLocale(asserted, { reload: false });
      }
      return asserted;
    }
  }
  throw new Error("No locale found. Read the docs https://inlang.com/m/gerre34r/library-inlang-paraglideJs/errors#no-locale-found");
};
const overwriteGetLocale = (fn) => {
  getLocale = fn;
};
let setLocale = (newLocale, options) => {
  ({
    ...options
  });
  let currentLocale;
  try {
    currentLocale = getLocale();
  } catch {
  }
  for (const strat of strategy) {
    if (strat === "cookie") {
      {
        continue;
      }
    } else if (strat === "baseLocale") {
      continue;
    } else if (isCustomStrategy(strat) && customClientStrategies.has(strat)) {
      const handler = customClientStrategies.get(strat);
      if (handler) {
        const result = handler.setLocale(newLocale);
        if (result instanceof Promise) {
          result.catch((error) => {
            console.warn(`Custom strategy "${strat}" setLocale failed:`, error);
          });
        }
      }
    }
  }
  return;
};
function isLocale(locale) {
  return !locale ? false : locales.includes(locale);
}
function assertIsLocale(input) {
  if (isLocale(input) === false) {
    throw new Error(`Invalid locale: ${input}. Expected one of: ${locales.join(", ")}`);
  }
  return input;
}
const extractLocaleFromRequest = (request) => {
  let locale;
  for (const strat of strategy) {
    if (strat === "cookie") {
      locale = request.headers.get("cookie")?.split("; ").find((c) => c.startsWith(cookieName + "="))?.split("=")[1];
    } else if (strat === "url") {
      locale = extractLocaleFromUrl(request.url);
    } else if (strat === "preferredLanguage") {
      locale = extractLocaleFromHeader(request);
    } else if (strat === "globalVariable") {
      locale = _locale;
    } else if (strat === "baseLocale") {
      return baseLocale;
    } else if (strat === "localStorage") {
      continue;
    } else if (isCustomStrategy(strat)) {
      continue;
    }
    if (locale !== void 0) {
      if (!isLocale(locale)) {
        locale = void 0;
      } else {
        return assertIsLocale(locale);
      }
    }
  }
  throw new Error("No locale found. There is an error in your strategy. Try adding 'baseLocale' as the very last strategy. Read more here https://inlang.com/m/gerre34r/library-inlang-paraglideJs/errors#no-locale-found");
};
const extractLocaleFromRequestAsync = async (request) => {
  let locale;
  for (const strat of strategy) {
    if (isCustomStrategy(strat) && customServerStrategies.has(strat)) {
      const handler = customServerStrategies.get(strat);
      if (handler) {
        locale = await handler.getLocale(request);
      }
      if (locale !== void 0 && isLocale(locale)) {
        return assertIsLocale(locale);
      }
    }
  }
  locale = extractLocaleFromRequest(request);
  return assertIsLocale(locale);
};
function extractLocaleFromCookie() {
  if (typeof document === "undefined" || !document.cookie) {
    return;
  }
  const match = document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
  const locale = match?.[2];
  if (isLocale(locale)) {
    return locale;
  }
  return void 0;
}
function extractLocaleFromHeader(request) {
  const acceptLanguageHeader = request.headers.get("accept-language");
  if (acceptLanguageHeader) {
    const languages = acceptLanguageHeader.split(",").map((lang) => {
      const [tag, q2 = "1"] = lang.trim().split(";q=");
      const baseTag = tag?.split("-")[0]?.toLowerCase();
      return {
        fullTag: tag?.toLowerCase(),
        baseTag,
        q: Number(q2)
      };
    }).sort((a2, b2) => b2.q - a2.q);
    for (const lang of languages) {
      if (isLocale(lang.fullTag)) {
        return lang.fullTag;
      } else if (isLocale(lang.baseTag)) {
        return lang.baseTag;
      }
    }
    return void 0;
  }
  return void 0;
}
let cachedUrl;
let cachedLocale;
function extractLocaleFromUrl(url) {
  const urlString = typeof url === "string" ? url : url.href;
  if (cachedUrl === urlString) {
    return cachedLocale;
  }
  let result;
  {
    const urlObj = typeof url === "string" ? new URL(url) : url;
    for (const element of urlPatterns) {
      for (const [locale, localizedPattern] of element.localized) {
        const match = new URLPattern(localizedPattern, urlObj.href).exec(urlObj.href);
        if (!match) {
          continue;
        }
        if (assertIsLocale(locale)) {
          result = locale;
          break;
        }
      }
      if (result)
        break;
    }
  }
  cachedUrl = urlString;
  cachedLocale = result;
  return result;
}
function localizeUrl(url, options) {
  const targetLocale = options?.locale ?? getLocale();
  const urlObj = typeof url === "string" ? new URL(url) : url;
  for (const element of urlPatterns) {
    for (const [, localizedPattern] of element.localized) {
      const match = new URLPattern(localizedPattern, urlObj.href).exec(urlObj.href);
      if (!match) {
        continue;
      }
      const targetPattern = element.localized.find(([locale]) => locale === targetLocale)?.[1];
      if (!targetPattern) {
        continue;
      }
      const localizedUrl = fillPattern(targetPattern, aggregateGroups(match), urlObj.origin);
      return fillMissingUrlParts(localizedUrl, match);
    }
    const unlocalizedMatch = new URLPattern(element.pattern, urlObj.href).exec(urlObj.href);
    if (unlocalizedMatch) {
      const targetPattern = element.localized.find(([locale]) => locale === targetLocale)?.[1];
      if (targetPattern) {
        const localizedUrl = fillPattern(targetPattern, aggregateGroups(unlocalizedMatch), urlObj.origin);
        return fillMissingUrlParts(localizedUrl, unlocalizedMatch);
      }
    }
  }
  return urlObj;
}
function deLocalizeUrl(url) {
  const urlObj = typeof url === "string" ? new URL(url) : url;
  for (const element of urlPatterns) {
    for (const [, localizedPattern] of element.localized) {
      const match = new URLPattern(localizedPattern, urlObj.href).exec(urlObj.href);
      if (match) {
        const groups = aggregateGroups(match);
        const baseUrl = fillPattern(element.pattern, groups, urlObj.origin);
        return fillMissingUrlParts(baseUrl, match);
      }
    }
    const unlocalizedMatch = new URLPattern(element.pattern, urlObj.href).exec(urlObj.href);
    if (unlocalizedMatch) {
      const baseUrl = fillPattern(element.pattern, aggregateGroups(unlocalizedMatch), urlObj.origin);
      return fillMissingUrlParts(baseUrl, unlocalizedMatch);
    }
  }
  return urlObj;
}
function fillMissingUrlParts(url, match) {
  if (match.protocol.groups["0"]) {
    url.protocol = match.protocol.groups["0"] ?? "";
  }
  if (match.hostname.groups["0"]) {
    url.hostname = match.hostname.groups["0"] ?? "";
  }
  if (match.username.groups["0"]) {
    url.username = match.username.groups["0"] ?? "";
  }
  if (match.password.groups["0"]) {
    url.password = match.password.groups["0"] ?? "";
  }
  if (match.port.groups["0"]) {
    url.port = match.port.groups["0"] ?? "";
  }
  if (match.pathname.groups["0"]) {
    url.pathname = match.pathname.groups["0"] ?? "";
  }
  if (match.search.groups["0"]) {
    url.search = match.search.groups["0"] ?? "";
  }
  if (match.hash.groups["0"]) {
    url.hash = match.hash.groups["0"] ?? "";
  }
  return url;
}
function fillPattern(pattern, values, origin) {
  let processedPattern = pattern.replace(/(https?:\/\/[^:/]+):(\d+)(\/|$)/g, (_2, protocol, port, slash) => {
    return `${protocol}#PORT-${port}#${slash}`;
  });
  let processedGroupDelimiters = processedPattern.replace(/\{([^{}]*)\}([?+*]?)/g, (_2, content, modifier) => {
    if (modifier === "?") {
      return content;
    }
    return content;
  });
  let filled = processedGroupDelimiters.replace(/(\/?):([a-zA-Z0-9_]+)(\([^)]*\))?([?+*]?)/g, (_2, slash, name, __, modifier) => {
    const value = values[name];
    if (value === null) {
      return "";
    }
    if (modifier === "?") {
      return value !== void 0 ? `${slash}${value}` : "";
    }
    if (modifier === "+" || modifier === "*") {
      if (value === void 0 && modifier === "+") {
        throw new Error(`Missing value for "${name}" (one or more required)`);
      }
      return value ? `${slash}${value}` : "";
    }
    if (value === void 0) {
      throw new Error(`Missing value for "${name}"`);
    }
    return `${slash}${value}`;
  });
  filled = filled.replace(/#PORT-(\d+)#/g, ":$1");
  return new URL(filled, origin);
}
function aggregateGroups(match) {
  return {
    ...match.hash.groups,
    ...match.hostname.groups,
    ...match.password.groups,
    ...match.pathname.groups,
    ...match.port.groups,
    ...match.protocol.groups,
    ...match.search.groups,
    ...match.username.groups
  };
}
function trackMessageCall(safeModuleId, locale) {
  const store = serverAsyncLocalStorage?.getStore();
  if (store) {
    store.messageCalls?.add(`${safeModuleId}:${locale}`);
  }
}
const customServerStrategies = /* @__PURE__ */ new Map();
const customClientStrategies = /* @__PURE__ */ new Map();
function isCustomStrategy(strategy2) {
  return typeof strategy2 === "string" && /^custom-[A-Za-z0-9_-]+$/.test(strategy2);
}
const kk_ui_theme_light = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Ашық`;
  }
);
const ru_ui_theme_light = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Светлая`;
  }
);
const ui_theme_light = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("ui_theme_light", locale);
  if (locale === "kk") return kk_ui_theme_light();
  return ru_ui_theme_light();
};
const kk_ui_theme_dark = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Қараңғы`;
  }
);
const ru_ui_theme_dark = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Тёмная`;
  }
);
const ui_theme_dark = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("ui_theme_dark", locale);
  if (locale === "kk") return kk_ui_theme_dark();
  return ru_ui_theme_dark();
};
const kk_ui_theme_system = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Жүйе`;
  }
);
const ru_ui_theme_system = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Системная`;
  }
);
const ui_theme_system = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("ui_theme_system", locale);
  if (locale === "kk") return kk_ui_theme_system();
  return ru_ui_theme_system();
};
const kk_not_found_default_message = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Іздеген бетіңіз табылмады.`;
  }
);
const ru_not_found_default_message = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Страница, которую вы ищете, не существует.`;
  }
);
const not_found_default_message = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("not_found_default_message", locale);
  if (locale === "kk") return kk_not_found_default_message();
  return ru_not_found_default_message();
};
const kk_not_found_go_back = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Артқа қайту`;
  }
);
const ru_not_found_go_back = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Вернуться назад`;
  }
);
const not_found_go_back = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("not_found_go_back", locale);
  if (locale === "kk") return kk_not_found_go_back();
  return ru_not_found_go_back();
};
const kk_not_found_start_over = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Қайта бастау`;
  }
);
const ru_not_found_start_over = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Начать заново`;
  }
);
const not_found_start_over = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("not_found_start_over", locale);
  if (locale === "kk") return kk_not_found_start_over();
  return ru_not_found_start_over();
};
const kk_seo_home_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Дәнел`;
  }
);
const ru_seo_home_title = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Данель`;
  }
);
const seo_home_title = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("seo_home_title", locale);
  if (locale === "kk") return kk_seo_home_title();
  return ru_seo_home_title();
};
const kk_seo_home_description = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Сипаттама`;
  }
);
const ru_seo_home_description = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `Описание`;
  }
);
const seo_home_description = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("seo_home_description", locale);
  if (locale === "kk") return kk_seo_home_description();
  return ru_seo_home_description();
};
const kk_seo_home_keywords = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `1, 2, 3`;
  }
);
const ru_seo_home_keywords = (
  /** @type {(inputs: {}) => string} */
  () => {
    return `1, 2, 3`;
  }
);
const seo_home_keywords = /* @__NO_SIDE_EFFECTS__ */ (inputs = {}, options = {}) => {
  const locale = options.locale ?? getLocale();
  trackMessageCall("seo_home_keywords", locale);
  if (locale === "kk") return kk_seo_home_keywords();
  return ru_seo_home_keywords();
};
function NotFound({ children }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2 p-2", children: [
    /* @__PURE__ */ jsx("div", { className: "text-gray-600 dark:text-gray-400", children: children || /* @__PURE__ */ jsx("p", { children: /* @__PURE__ */ not_found_default_message() }) }),
    /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => window.history.back(),
          className: "bg-emerald-500 text-white px-2 py-1 rounded uppercase font-black text-sm",
          children: /* @__PURE__ */ not_found_go_back()
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          className: "bg-cyan-600 text-white px-2 py-1 rounded uppercase font-black text-sm",
          children: /* @__PURE__ */ not_found_start_over()
        }
      )
    ] })
  ] });
}
const appCss = "/assets/app-C4GfVY-C.css";
const getBaseMeta = ({
  title,
  description,
  keywords,
  image,
  canonicalUrl
}) => {
  const metaTags = [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { name: "author", content: "Danel" },
    { name: "publisher", content: "Danel" },
    { name: "application-name", content: "Danel" },
    // { name: 'theme-color', content: '#ffffff' },
    // Open Graph meta tags
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:site_name", content: "Danel" },
    { property: "og:locale", content: getLocale() }
  ];
  if (canonicalUrl) {
    metaTags.push({ name: "canonical", content: canonicalUrl });
  }
  if (image) {
    metaTags.push(
      { property: "og:image", content: image },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: title }
    );
  }
  return metaTags;
};
const combineSEO = (meta, scripts = []) => {
  return {
    meta,
    scripts
  };
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
async function paraglideMiddleware(request, resolve, callbacks) {
  if (!serverAsyncLocalStorage) {
    const { AsyncLocalStorage: AsyncLocalStorage2 } = await import('async_hooks');
    overwriteServerAsyncLocalStorage(new AsyncLocalStorage2());
  } else if (!serverAsyncLocalStorage) {
    overwriteServerAsyncLocalStorage(createMockAsyncLocalStorage());
  }
  const locale = await extractLocaleFromRequestAsync(request);
  const origin = new URL(request.url).origin;
  if (request.headers.get("Sec-Fetch-Dest") === "document" && strategy.includes("url")) {
    const localizedUrl = localizeUrl(request.url, { locale });
    if (normalizeURL(localizedUrl.href) !== normalizeURL(request.url)) {
      const headers = {};
      if (strategy.includes("preferredLanguage")) {
        headers["Vary"] = "Accept-Language";
      }
      const response2 = new Response(null, {
        status: 307,
        headers: {
          Location: localizedUrl.href,
          ...headers
        }
      });
      return response2;
    }
  }
  const newRequest = strategy.includes("url") ? new Request(deLocalizeUrl(request.url), request) : (
    // need to create a new request object because some metaframeworks (nextjs!) throw otherwise
    // https://github.com/opral/inlang-paraglide-js/issues/411
    new Request(request)
  );
  const messageCalls = /* @__PURE__ */ new Set();
  const response = await serverAsyncLocalStorage?.run({ locale, origin, messageCalls }, () => resolve({ locale, request: newRequest }));
  return response;
}
function normalizeURL(url) {
  const urlObj = new URL(url);
  urlObj.pathname = urlObj.pathname.replace(/\/$/, "");
  return urlObj.href;
}
function createMockAsyncLocalStorage() {
  let currentStore = void 0;
  return {
    getStore() {
      return currentStore;
    },
    async run(store, callback) {
      currentStore = store;
      try {
        return await callback();
      } finally {
        currentStore = void 0;
      }
    }
  };
}
function extractLocale(url) {
  const urlObj = new URL(url, "https://www.jasalab.com");
  const pathSegments = urlObj.pathname.split("/").filter(Boolean);
  if (pathSegments.length > 0) {
    const potentialLocale = pathSegments[0];
    if (isLocale(potentialLocale)) {
      return potentialLocale;
    }
  }
}
function getRouterBasepath(pathname) {
  const extractedLocale = extractLocale(pathname ?? "/");
  return strategy.includes("url") && extractedLocale ? `/${extractedLocale}` : void 0;
}
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TooltipPrimitive.Provider,
    {
      "data-slot": "tooltip-provider",
      delayDuration,
      ...props
    }
  );
}
function Tooltip({ ...props }) {
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsx(TooltipPrimitive.Root, { "data-slot": "tooltip", ...props }) });
}
function TooltipTrigger({ ...props }) {
  return /* @__PURE__ */ jsx(TooltipPrimitive.Trigger, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  sideOffset = 8,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    TooltipPrimitive.Content,
    {
      "data-slot": "tooltip-content",
      sideOffset,
      className: cn(
        "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 origin-(--radix-tooltip-content-transform-origin) rounded-lg px-3 py-2 text-sm font-medium shadow-lg border border-gray-200 dark:border-gray-700 backdrop-blur-sm max-w-xs text-balance",
        className
      ),
      ...props,
      children
    }
  ) });
}
const useCartStore = create()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (newItem) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === newItem.id);
        if (existingItem) {
          set({
            items: items.map(
              (item) => item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          });
        } else {
          set({
            items: [...items, { ...newItem, quantity: 1 }]
          });
        }
      },
      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id)
        });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map(
            (item) => item.id === id ? { ...item, quantity } : item
          )
        });
      },
      clearCart: () => {
        set({ items: [] });
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      setIsOpen: (isOpen) => {
        set({ isOpen });
      }
    }),
    {
      name: "danel-cart-storage"
    }
  )
);
function CartSheet({ trigger }) {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getTotalPrice
  } = useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const navigate = useNavigate();
  const defaultTrigger = /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs(
      GradientButton,
      {
        variant: "gradient",
        size: "default",
        className: "text-lg font-bold",
        "data-cart-trigger": true,
        decorative: true,
        children: [
          /* @__PURE__ */ jsx(ShoppingCart, { className: "w-5 h-5" }),
          "Корзина"
        ]
      }
    ),
    totalItems > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-2 -right-2 bg-white text-purple-600 rounded-full w-6 h-6 text-xs flex items-center justify-center font-bold border-2 border-purple-200", children: totalItems })
  ] });
  return /* @__PURE__ */ jsxs(Sheet, { open: isOpen, onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: trigger || defaultTrigger }),
    /* @__PURE__ */ jsxs(SheetContent, { className: "w-full sm:max-w-lg", children: [
      /* @__PURE__ */ jsx(SheetHeader, { children: /* @__PURE__ */ jsxs(SheetTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(ShoppingCart, { className: "w-5 h-5" }),
        "Корзина (",
        totalItems,
        ")"
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col h-full", children: items.length === 0 ? /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center text-center", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(ShoppingCart, { className: "w-12 h-12 mx-auto mb-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Корзина пуста" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Добавьте товары для заказа" })
      ] }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto py-4", children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: items.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 border rounded-lg", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: item.image,
              alt: item.name,
              className: "w-16 h-16 object-cover rounded-md"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-medium text-sm truncate", children: item.name }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-foreground", children: [
              item.price,
              " ₸"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
              /* @__PURE__ */ jsx(
                GradientButton,
                {
                  variant: "gradient",
                  size: "icon",
                  className: "h-8 w-8",
                  onClick: () => updateQuantity(item.id, item.quantity - 1),
                  children: /* @__PURE__ */ jsx(Minus, { className: "w-3 h-3" })
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium w-8 text-center", children: item.quantity }),
              /* @__PURE__ */ jsx(
                GradientButton,
                {
                  variant: "gradient",
                  size: "icon",
                  className: "h-8 w-8",
                  onClick: () => updateQuantity(item.id, item.quantity + 1),
                  children: /* @__PURE__ */ jsx(Plus, { className: "w-3 h-3" })
                }
              ),
              /* @__PURE__ */ jsx(
                GradientButton,
                {
                  variant: "gradient-red",
                  size: "icon",
                  className: "h-8 w-8",
                  onClick: () => removeItem(item.id),
                  decorative: true,
                  decorativeColor: "red",
                  children: /* @__PURE__ */ jsx(Trash2, { className: "w-3 h-3" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxs("p", { className: "font-semibold text-sm text-foreground", children: [
            item.price * item.quantity,
            " ₸"
          ] }) })
        ] }, item.id)) }) }),
        /* @__PURE__ */ jsxs("div", { className: "container mx-auto p-6 space-y-8 border-t pt-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold", children: "Итого:" }),
            /* @__PURE__ */ jsxs("span", { className: "text-lg font-bold text-foreground", children: [
              totalPrice,
              " ₸"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(
              GradientButton,
              {
                onClick: clearCart,
                variant: "gradient-gray",
                size: "lg",
                className: "w-full px-4 py-3",
                decorative: true,
                decorativeColor: "gray",
                children: "Очистить"
              }
            ),
            /* @__PURE__ */ jsx(
              GradientButton,
              {
                variant: "gradient",
                size: "lg",
                className: "w-full px-4 py-3 font-semibold",
                decorative: true,
                decorativeColor: "purple",
                onClick: () => {
                  setIsOpen(false);
                  navigate({ to: "/checkout" });
                },
                children: "Заказать"
              }
            )
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
function GradientButton({
  children,
  className,
  decorative = false,
  decorativeColor = "purple",
  ...props
}) {
  const decorativeColors = {
    purple: "bg-purple-500/10 dark:bg-purple-500/20",
    gray: "bg-gray-500/10 dark:bg-gray-500/20",
    red: "bg-red-500/10 dark:bg-red-500/20"
  };
  return /* @__PURE__ */ jsxs(
    Button,
    {
      className: cn(
        "relative",
        className
      ),
      ...props,
      children: [
        children,
        decorative && /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "absolute bottom-0 right-0 w-8 h-8 rounded-full -mr-4 -mb-4 pointer-events-none",
              decorativeColors[decorativeColor]
            ),
            "aria-hidden": "true"
          }
        )
      ]
    }
  );
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "text-card-foreground rounded-xl border shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-purple-50/50 to-violet-50/50 dark:from-purple-950/30 dark:to-violet-950/30 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100 hover:from-purple-100/70 hover:to-violet-100/70 dark:hover:from-purple-900/50 dark:hover:to-violet-900/50",
        "gradient-gray": "text-card-foreground rounded-xl border shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-gray-50/50 to-slate-50/50 dark:from-gray-950/30 dark:to-slate-950/30 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:from-gray-100/70 hover:to-slate-100/70 dark:hover:from-gray-900/50 dark:hover:to-slate-900/50",
        "gradient-red": "text-card-foreground rounded-xl border shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-950/30 dark:to-pink-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:from-red-100/70 hover:to-pink-100/70 dark:hover:from-red-900/50 dark:hover:to-pink-900/50"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Root, { "data-slot": "sheet", ...props });
}
function SheetTrigger({ ...props }) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Trigger, { "data-slot": "sheet-trigger", ...props });
}
function SheetPortal({ ...props }) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return /* @__PURE__ */ jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxs(
      SheetPrimitive.Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsx(XIcon, { className: "size-4" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function SheetTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Title,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function SheetDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Description,
    {
      "data-slot": "sheet-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(void 0);
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SidebarContext = React.createContext(null);
function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
  }, [isMobile, setOpen, setOpenMobile]);
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);
  const state = open ? "expanded" : "collapsed";
  const contextValue = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );
  return /* @__PURE__ */ jsx(SidebarContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-wrapper",
      style: {
        "--sidebar-width": SIDEBAR_WIDTH,
        "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
        ...style
      },
      className: cn(
        "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
        className
      ),
      ...props,
      children
    }
  ) }) });
}
function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  if (collapsible === "none") {
    return /* @__PURE__ */ jsx(
      "div",
      {
        "data-slot": "sidebar",
        className: cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className
        ),
        ...props,
        children
      }
    );
  }
  if (isMobile) {
    return /* @__PURE__ */ jsx(Sheet, { open: openMobile, onOpenChange: setOpenMobile, ...props, children: /* @__PURE__ */ jsxs(
      SheetContent,
      {
        "data-sidebar": "sidebar",
        "data-slot": "sidebar",
        "data-mobile": "true",
        className: "bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
        style: {
          "--sidebar-width": SIDEBAR_WIDTH_MOBILE
        },
        side,
        children: [
          /* @__PURE__ */ jsxs(SheetHeader, { className: "sr-only", children: [
            /* @__PURE__ */ jsx(SheetTitle, { children: "Sidebar" }),
            /* @__PURE__ */ jsx(SheetDescription, { children: "Displays the mobile sidebar." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex h-full w-full flex-col", children })
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "group peer text-sidebar-foreground hidden md:block",
      "data-state": state,
      "data-collapsible": state === "collapsed" ? collapsible : "",
      "data-variant": variant,
      "data-side": side,
      "data-slot": "sidebar",
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-slot": "sidebar-gap",
            className: cn(
              "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
              "group-data-[collapsible=offcanvas]:w-0",
              "group-data-[side=right]:rotate-180",
              variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-slot": "sidebar-container",
            className: cn(
              "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
              side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
              // Adjust the padding for floating and inset variants.
              variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
              className
            ),
            ...props,
            children: /* @__PURE__ */ jsx(
              "div",
              {
                "data-sidebar": "sidebar",
                "data-slot": "sidebar-inner",
                className: "bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm",
                children
              }
            )
          }
        )
      ]
    }
  );
}
function SidebarTrigger({ className, onClick, ...props }) {
  const { state, toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsxs(
    Button,
    {
      "data-sidebar": "trigger",
      "data-slot": "sidebar-trigger",
      variant: "ghost",
      size: "icon",
      className: cn("size-8", className),
      onClick: (event) => {
        onClick?.(event);
        toggleSidebar();
      },
      ...props,
      children: [
        state === "collapsed" ? /* @__PURE__ */ jsx(PanelLeftOpen, {}) : /* @__PURE__ */ jsx(PanelLeftClose, {}),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Toggle Sidebar" })
      ]
    }
  );
}
function SidebarInset({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "main",
    {
      "data-slot": "sidebar-inset",
      className: cn(
        "bg-background relative flex w-full flex-1 flex-col",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm",
        className
      ),
      ...props
    }
  );
}
function SidebarHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-header",
      "data-sidebar": "header",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
}
function SidebarFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-footer",
      "data-sidebar": "footer",
      className: cn("flex flex-col gap-2 p-2", className),
      ...props
    }
  );
}
function SidebarContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-content",
      "data-sidebar": "content",
      className: cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      ),
      ...props
    }
  );
}
function SidebarGroup({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-group",
      "data-sidebar": "group",
      className: cn("relative flex w-full min-w-0 flex-col p-2", className),
      ...props
    }
  );
}
function SidebarGroupContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sidebar-group-content",
      "data-sidebar": "group-content",
      className: cn("w-full text-sm", className),
      ...props
    }
  );
}
function SidebarMenu({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "ul",
    {
      "data-slot": "sidebar-menu",
      "data-sidebar": "menu",
      className: cn("flex w-full min-w-0 flex-col gap-1", className),
      ...props
    }
  );
}
function SidebarMenuItem({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "li",
    {
      "data-slot": "sidebar-menu-item",
      "data-sidebar": "menu-item",
      className: cn("group/menu-item relative", className),
      ...props
    }
  );
}
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  const { isMobile, state } = useSidebar();
  const button = /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "sidebar-menu-button",
      "data-sidebar": "menu-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(sidebarMenuButtonVariants({ variant, size }), className),
      ...props
    }
  );
  if (!tooltip) {
    return button;
  }
  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip
    };
  }
  return /* @__PURE__ */ jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: button }),
    /* @__PURE__ */ jsx(
      TooltipContent,
      {
        side: "right",
        align: "center",
        hidden: state !== "collapsed" || isMobile,
        ...tooltip
      }
    )
  ] });
}
function DropdownMenu({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...props
    }
  );
}
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      ),
      ...props
    }
  ) });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Separator,
    {
      "data-slot": "dropdown-menu-separator",
      className: cn("bg-border -mx-1 my-1 h-px", className),
      ...props
    }
  );
}
function Avatar({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Root,
    {
      "data-slot": "avatar",
      className: cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      ),
      ...props
    }
  );
}
const defaultSettings = {
  theme: "system",
  language: "ru",
  sidebarCollapsed: false
};
const useAppSettingsStore = create()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      setTheme: (theme) => set((state) => ({
        settings: { ...state.settings, theme }
      })),
      toggleTheme: () => {
        const currentTheme = get().settings.theme;
        const newTheme = currentTheme === "light" ? "dark" : "light";
        get().setTheme(newTheme);
      },
      setLanguage: (language) => set((state) => ({
        settings: { ...state.settings, language }
      })),
      setSidebarCollapsed: (collapsed) => set((state) => ({
        settings: { ...state.settings, sidebarCollapsed: collapsed }
      })),
      toggleSidebar: () => {
        const currentCollapsed = get().settings.sidebarCollapsed;
        get().setSidebarCollapsed(!currentCollapsed);
      },
      getResolvedTheme: () => {
        const theme = get().settings.theme;
        if (theme === "system") {
          {
            return "light";
          }
        }
        return theme;
      }
    }),
    {
      name: "jasalab-app-settings",
      version: 1
    }
  )
);
const ThemeProviderContext = createContext(void 0);
function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (context === void 0) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
function ThemeProvider({
  children,
  defaultTheme = "system",
  ...props
}) {
  const { settings, setTheme, toggleTheme, getResolvedTheme } = useAppSettingsStore();
  const theme = settings.theme || defaultTheme;
  const resolvedTheme = getResolvedTheme();
  useEffect(() => {
    return;
  }, [resolvedTheme]);
  useEffect(() => {
    return;
  }, [theme, getResolvedTheme]);
  const value = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme
  };
  return /* @__PURE__ */ jsx(ThemeProviderContext.Provider, { value, children });
}
const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      theme,
      className: "toaster group",
      style: {
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)"
      },
      ...props
    }
  );
};
function AppSidebarHeader() {
  const { isMobile, setOpenMobile } = useSidebar();
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  return /* @__PURE__ */ jsx(SidebarHeader, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsxs(SidebarMenuItem, { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsx(SidebarTrigger, { className: "min-w-8 min-h-8" }),
    /* @__PURE__ */ jsx(SidebarMenuButton, { asChild: true, className: "group-data-[collapsible=icon]:hidden", children: /* @__PURE__ */ jsx(Link, { to: "/", onClick: handleLinkClick, className: "scroll-m-20 text-xl font-medium tracking-tight", children: "Danel" }) })
  ] }) }) });
}
const themeConfig$1 = {
  light: { icon: Sun, label: () => /* @__PURE__ */ ui_theme_light() },
  dark: { icon: Moon, label: () => /* @__PURE__ */ ui_theme_dark() },
  system: { icon: Monitor, label: () => /* @__PURE__ */ ui_theme_system() }
};
const languageLabels$1 = {
  kk: "Казакша",
  ru: "Русский"
};
function AppSidebarFooter() {
  const { theme, setTheme } = useTheme();
  const currentLocale = getLocale();
  const isMobile = useIsMobile();
  const currentThemeConfig = themeConfig$1[theme] || themeConfig$1.system;
  const ThemeIcon = currentThemeConfig.icon;
  const themeLabel = currentThemeConfig.label();
  const getLanguageLabel = (locale) => {
    return languageLabels$1[locale] || locale.toUpperCase();
  };
  const handleLanguageChange = (locale) => {
    setLocale(locale);
  };
  return /* @__PURE__ */ jsx(SidebarFooter, { children: /* @__PURE__ */ jsxs(SidebarMenu, { children: [
    /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(SidebarMenuButton, { tooltip: getLanguageLabel(currentLocale), children: [
        /* @__PURE__ */ jsx(Languages, {}),
        /* @__PURE__ */ jsx("span", { children: getLanguageLabel(currentLocale) })
      ] }) }),
      /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", side: isMobile ? "bottom" : "right", sideOffset: 4, children: locales.map((locale) => /* @__PURE__ */ jsxs(
        DropdownMenuItem,
        {
          onClick: () => handleLanguageChange(locale),
          className: currentLocale === locale ? "bg-accent" : "",
          children: [
            /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center text-xs font-medium", children: locale.toUpperCase() }),
            getLanguageLabel(locale)
          ]
        },
        locale
      )) })
    ] }) }),
    /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(SidebarMenuButton, { tooltip: themeLabel, children: [
        /* @__PURE__ */ jsx(ThemeIcon, {}),
        /* @__PURE__ */ jsx("span", { children: themeLabel })
      ] }) }),
      /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", side: isMobile ? "bottom" : "right", sideOffset: 4, children: Object.entries(themeConfig$1).map(([themeKey, config]) => {
        const Icon = config.icon;
        const label = config.label();
        return /* @__PURE__ */ jsxs(
          DropdownMenuItem,
          {
            onClick: () => setTheme(themeKey),
            className: theme === themeKey ? "bg-accent" : "",
            children: [
              /* @__PURE__ */ jsx(Icon, {}),
              label
            ]
          },
          themeKey
        );
      }) })
    ] }) })
  ] }) });
}
const categories = [
  { id: "pies", name: "Пироги", href: "#pies", icon: ChefHat },
  { id: "salads", name: "Салаты", href: "#salads", icon: Salad },
  { id: "hot", name: "Горячее", href: "#hot", icon: Flame },
  { id: "snacks", name: "Закуски", href: "#snacks", icon: Cookie },
  { id: "cakes", name: "Торты", href: "#cakes", icon: Cake }
];
function AppSidebar() {
  const { isMobile, setOpenMobile } = useSidebar();
  const handleLinkClick = (href) => {
    if (isMobile) {
      setOpenMobile(false);
    }
    const element = document.getElementById(href.substring(1));
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return /* @__PURE__ */ jsxs(Sidebar, { collapsible: "icon", variant: "inset", children: [
    /* @__PURE__ */ jsx(AppSidebarHeader, {}),
    /* @__PURE__ */ jsx(SidebarContent, { children: /* @__PURE__ */ jsx(SidebarGroup, { children: /* @__PURE__ */ jsx(SidebarGroupContent, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: categories.map((category) => {
      const Icon = category.icon;
      return /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, { asChild: true, tooltip: category.name, children: /* @__PURE__ */ jsxs(
        "a",
        {
          href: category.href,
          onClick: (e) => {
            e.preventDefault();
            handleLinkClick(category.href);
          },
          children: [
            /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { children: category.name })
          ]
        }
      ) }) }, category.id);
    }) }) }) }) }),
    /* @__PURE__ */ jsx(AppSidebarFooter, {})
  ] });
}
function MobileHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  return /* @__PURE__ */ jsxs(
    "header",
    {
      className: `fixed top-0 left-0 right-0 z-50 flex items-center gap-3 px-4 py-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ease-in-out ${isVisible ? "translate-y-0" : "-translate-y-full"}`,
      children: [
        /* @__PURE__ */ jsx(SidebarTrigger, {}),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/",
            className: "text-lg font-medium tracking-tight hover:text-primary transition-colors",
            children: "Danel"
          }
        )
      ]
    }
  );
}
const API_BASE_URL = "/api";
class ApiClient {
  baseURL;
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const tokens = useAuthStore.getState().tokens;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...tokens?.access && {
          Authorization: `Bearer ${tokens.access}`
        },
        ...options.headers
      },
      ...options
    });
    if (response.status == 401 && tokens?.refresh) {
      try {
        const refreshResponse = await fetch(`${this.baseURL}/auth/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: tokens.refresh })
        });
        if (!refreshResponse.ok) {
          throw new Error("Refresh failed");
        }
        const refreshData = await refreshResponse.json();
        useAuthStore.setState({
          tokens: {
            access: refreshData.access,
            refresh: tokens.refresh
          }
        });
        const retryResponse = await fetch(url, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshData.access}`,
            ...options.headers
          }
        });
        if (!retryResponse.ok) {
          throw new Error(`HTTP error! status: ${retryResponse.status}`);
        }
        return retryResponse.json();
      } catch {
        useAuthStore.getState().logout();
        throw new Error("Сессия истекла");
      }
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
  async get(endpoint) {
    return this.request(endpoint);
  }
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data)
    });
  }
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data)
    });
  }
}
const apiClient = new ApiClient();
const authApi = {
  login: (data) => apiClient.post("/auth/login/", data),
  register: (data) => apiClient.post("/auth/register/", data),
  refresh: (refreshToken) => apiClient.post("/auth/refresh/", { refresh: refreshToken })
};
const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      login: async (email, password) => {
        const response = await authApi.login({ email, password });
        set({
          user: response.customer,
          tokens: response.tokens
        });
      },
      register: async (data) => {
        const response = await authApi.register(data);
        set({
          user: response.customer,
          tokens: response.tokens
        });
      },
      logout: () => {
        set({ user: null, tokens: null });
      }
    }),
    {
      name: "auth-storage"
    }
  )
);
const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const tokens = useAuthStore((state) => state.tokens);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = !!tokens?.access && !!user;
  return {
    user,
    tokens,
    isAuthenticated,
    login,
    register,
    logout
  };
};
function ProfileMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        onClick: () => router.navigate({ to: "/auth/login" }),
        className: "gap-2",
        children: [
          /* @__PURE__ */ jsx(User, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Войти" })
        ]
      }
    );
  }
  const handleLogout = () => {
    logout();
    router.navigate({ to: "/" });
  };
  return /* @__PURE__ */ jsxs(DropdownMenu, { children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "gap-2", children: /* @__PURE__ */ jsx(Avatar, { className: "w-6 h-6", children: /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(User, { className: "w-3 h-3" }) }) }) }) }),
    /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", sideOffset: 4, className: "w-56", children: [
      /* @__PURE__ */ jsx("div", { className: "px-2 py-1.5", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: user?.email }) }),
      /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => router.navigate({ to: "/profile" }), children: [
        /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4 mr-2" }),
        "Профиль"
      ] }),
      /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
      /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleLogout, className: "text-red-600", children: [
        /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4 mr-2" }),
        "Выйти"
      ] })
    ] })
  ] });
}
const categoriesApi = {
  getAll: () => apiClient.get("/categories/"),
  getById: (id) => apiClient.get(`/categories/${id}/`)
};
const productsApi = {
  getAll: (params) => {
    const searchParams = new URLSearchParams();
    if (params?.category) {
      searchParams.append("category", params.category.toString());
    }
    const query = searchParams.toString() ? `?${searchParams}` : "";
    return apiClient.get(`/products/${query}`);
  },
  getById: (id) => apiClient.get(`/products/${id}/`)
};
const ordersApi = {
  create: (data) => apiClient.post("/orders/create_order/", data),
  getAll: () => apiClient.get("/orders/"),
  updateStatus: (id, status) => apiClient.patch(`/orders/${id}/update_status/`, { status })
};
const useProducts = (categoryId) => {
  return useQuery({
    queryKey: ["product", categoryId],
    queryFn: () => productsApi.getAll(void 0)
  });
};
const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll()
  });
};
const transformProduct = (product) => ({
  id: product.id,
  name: product.name,
  image: product.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=faces",
  ingredients: product.ingredients ? product.ingredients.split(", ") : [],
  price: parseFloat(product.price)
});
const themeConfig = {
  light: { icon: Sun, label: () => /* @__PURE__ */ ui_theme_light() },
  dark: { icon: Moon, label: () => /* @__PURE__ */ ui_theme_dark() },
  system: { icon: Monitor, label: () => /* @__PURE__ */ ui_theme_system() }
};
const languageLabels = {
  kk: "Казакша",
  ru: "Русский"
};
function DesktopHeader() {
  const { theme, setTheme } = useTheme();
  const currentLocale = getLocale();
  const location = useLocation();
  const { data: categories2 = [], isLoading } = useCategories();
  const isHomePage = location.pathname === "/" || location.pathname === "//kk";
  const currentThemeConfig = themeConfig[theme] || themeConfig.system;
  const ThemeIcon = currentThemeConfig.icon;
  const themeLabel = currentThemeConfig.label();
  const getLanguageLabel = (locale) => {
    return languageLabels[locale] || locale.toUpperCase();
  };
  const handleLanguageChange = (locale) => {
    setLocale(locale);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("header", { className: "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto flex items-center justify-between py-3", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          className: "text-xl font-medium tracking-tight hover:text-primary transition-colors",
          children: "Danel"
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "gap-2", children: [
            /* @__PURE__ */ jsx(Languages, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: getLanguageLabel(currentLocale) })
          ] }) }),
          /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", sideOffset: 4, children: locales.map((locale) => /* @__PURE__ */ jsxs(
            DropdownMenuItem,
            {
              onClick: () => handleLanguageChange(locale),
              className: currentLocale === locale ? "bg-accent" : "",
              children: [
                /* @__PURE__ */ jsx("span", { className: "flex items-center justify-center text-xs font-medium mr-2", children: locale.toUpperCase() }),
                getLanguageLabel(locale)
              ]
            },
            locale
          )) })
        ] }),
        /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "gap-2", children: [
            /* @__PURE__ */ jsx(ThemeIcon, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: themeLabel })
          ] }) }),
          /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", sideOffset: 4, children: Object.entries(themeConfig).map(([themeKey, config]) => {
            const Icon = config.icon;
            const label = config.label();
            return /* @__PURE__ */ jsxs(
              DropdownMenuItem,
              {
                onClick: () => setTheme(themeKey),
                className: theme === themeKey ? "bg-accent" : "",
                children: [
                  /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4 mr-2" }),
                  label
                ]
              },
              themeKey
            );
          }) })
        ] }),
        /* @__PURE__ */ jsx(ProfileMenu, {})
      ] })
    ] }) }),
    isHomePage && /* @__PURE__ */ jsx("nav", { className: "fixed top-[57px] left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto flex items-center py-3 relative", children: [
      isLoading ? /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Загрузка..." }) : /* @__PURE__ */ jsx("div", { className: "flex gap-6", children: categories2.map((category) => /* @__PURE__ */ jsx(
        "a",
        {
          href: `#category-${category.id}`,
          className: "text-sm font-medium hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-accent scroll-smooth",
          onClick: (e) => {
            e.preventDefault();
            const element = document.getElementById(`category-${category.id}`);
            element?.scrollIntoView({ behavior: "smooth", block: "start" });
          },
          children: category.name
        },
        category.id
      )) }),
      /* @__PURE__ */ jsx("div", { className: "absolute right-0", children: /* @__PURE__ */ jsx(CartSheet, {}) })
    ] }) })
  ] });
}
function Footer() {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsx("footer", { className: "border-t bg-background mt-auto", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 py-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "Danel" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Система заказа продкутов для бизнеса. Качественная продукция с доставкой." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "Контакты" }),
        /* @__PURE__ */ jsxs("div", { className: "sapce-y-3", children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "tel:+77001234567",
              className: "flex items-center gap-2 text-sm text-muted-foregound hover:text-primary transition-colors",
              children: [
                /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4" }),
                "+7 (700) 123-45-67"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "malito:info@danel.kz",
              className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors",
              children: [
                /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4" }),
                "info@danel.kz"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "https://www.instagram.com/pirogi_danel_astana/",
              target: "_blank",
              rel: "noopener onreferrer",
              className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors",
              children: [
                /* @__PURE__ */ jsx(Instagram, { className: "w-4 h-4" }),
                "@danel.kz"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "Адрес" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsx("span", { children: 'Казахстан, г. Астана, ул. Сыганак 54а, БЦ "А"' })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "Навигация" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/",
              className: "block text-sm text-muted-foreground hover:text-primary transition-colors",
              children: "Главная"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/orders",
              className: "block text-sm text-muted-foreground hover:text-primary transition-colors",
              children: "Мои заказы"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/auth/register",
              className: "block text-sm text-muted-foreground hover:text-primary transition-colors",
              children: "Регистрация"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/auth/login",
              className: "block text-sm text-muted-foreground hover:text-primary transition-colors",
              children: "Вход"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 pt-6 border-t text-center text-sm text-muted-foreground", children: /* @__PURE__ */ jsxs("p", { children: [
      "© ",
      currentYear,
      " Danel. Все права защищены."
    ] }) })
  ] }) });
}
function PageWrapper({ children }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/kk";
  const paddingClass = isHomePage ? "pt-[114px]" : "pt-[57px]";
  return /* @__PURE__ */ jsx("div", { className: paddingClass, children });
}
function AppLayout({ children }) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return /* @__PURE__ */ jsxs(
      SidebarProvider,
      {
        style: {
          "--sidebar-width": "calc(var(--spacing) * 55)",
          "--header-height": "calc(var(--spacing) * 12)"
        },
        children: [
          /* @__PURE__ */ jsx(AppSidebar, {}),
          /* @__PURE__ */ jsxs(SidebarInset, { className: "p-0 flex flex-col min-h-screen", children: [
            /* @__PURE__ */ jsx(MobileHeader, {}),
            /* @__PURE__ */ jsx("div", { className: "pt-14 flex-1", children: /* @__PURE__ */ jsx(PageWrapper, { children }) }),
            /* @__PURE__ */ jsx(Footer, {})
          ] }),
          /* @__PURE__ */ jsx(Toaster, {})
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col", children: [
    /* @__PURE__ */ jsx(DesktopHeader, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsx(PageWrapper, { children }) }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(Toaster, {})
  ] });
}
const Route$6 = createRootRouteWithContext()({
  head: () => {
    const baseMeta = getBaseMeta({
      title: /* @__PURE__ */ seo_home_title(),
      description: /* @__PURE__ */ seo_home_description(),
      keywords: /* @__PURE__ */ seo_home_keywords()
      // canonicalUrl: localizeHref('https://www.jasalab.com/'),
    });
    return {
      meta: [
        {
          charSet: "utf-8"
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1"
        },
        {
          name: "robots",
          content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        },
        {
          name: "googlebot",
          content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        },
        {
          name: "bingbot",
          content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        },
        {
          name: "format-detection",
          content: "telephone=no, email=no, address=no"
        },
        {
          name: "referrer",
          content: "origin-when-cross-origin"
        },
        ...baseMeta || []
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.svg"
        },
        // {
        //   rel: 'apple-touch-icon',
        //   sizes: '180x180',
        //   href: '/apple-touch-icon.png',
        // },
        { rel: "manifest", href: "/site.webmanifest" }
      ],
      scripts: [
        {
          children: `(function () {
              try {
                const stored = localStorage.getItem('jasalab-app-settings');
                const settings = stored ? JSON.parse(stored) : {};
                const theme = settings?.state?.settings?.theme || 'system';
                const resolvedTheme =
                  theme === 'system'
                    ? window.matchMedia('(prefers-color-scheme: dark)').matches
                      ? 'dark'
                      : 'light'
                    : theme;

                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(resolvedTheme);
              } catch (e) {
                document.documentElement.classList.add('light');
              }
            })()`
        }
      ]
    };
  },
  errorComponent: (props) => {
    return /* @__PURE__ */ jsx(RootDocument, { children: /* @__PURE__ */ jsx(DefaultCatchBoundary, { ...props }) });
  },
  notFoundComponent: () => /* @__PURE__ */ jsx(NotFound, {}),
  component: RootComponent
});
function RootComponent() {
  return /* @__PURE__ */ jsx(RootDocument, { children: /* @__PURE__ */ jsx(Outlet, {}) });
}
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: getLocale(), suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsxs(ThemeProvider, { defaultTheme: "light", storageKey: "jasalab-ui-theme", children: [
        /* @__PURE__ */ jsx(Toaster, {}),
        /* @__PURE__ */ jsx(AppLayout, { children })
      ] }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$5 = () => import('./checkout-DUpguBvC.mjs');
const Route$5 = createFileRoute("/checkout")({
  // beforeload выполняется ДО загрузки страницы
  beforeLoad: ({
    context,
    location
  }) => {
    const authStore = useAuthStore.getState();
    if (!authStore.tokens?.access || !authStore.user) {
      throw redirect$1({
        to: "/auth/login",
        search: {
          // Сохраняем текущий URL, чтобы после логина вернуться сюда
          redirect: location.href
        }
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import('./index-yjYZAE7s.mjs');
const Route$4 = createFileRoute("/")({
  head: () => {
    const baseMeta = getBaseMeta({
      title: /* @__PURE__ */ seo_home_title(),
      description: /* @__PURE__ */ seo_home_description(),
      keywords: /* @__PURE__ */ seo_home_keywords()
    });
    return combineSEO(baseMeta);
  },
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import('./index-ZiE1nzJu.mjs');
const Route$3 = createFileRoute("/orders/")({
  beforeLoad: ({
    context,
    location
  }) => {
    const authStore = useAuthStore.getState();
    if (!authStore.tokens?.access || !authStore.user) {
      throw redirect({
        to: "/auth/login",
        search: {
          redirect: location.href
        }
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import('./success-hJfm7bWq.mjs');
const Route$2 = createFileRoute("/orders/success")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const requireGuest = () => {
  const authStore = useAuthStore.getState();
  if (authStore.tokens?.access && authStore.user) {
    throw redirect$1({
      to: "/"
    });
  }
};
const $$splitComponentImporter$1 = () => import('./register-h6iiJI6t.mjs');
const Route$1 = createFileRoute("/auth/register")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component"),
  beforeLoad: requireGuest
});
const $$splitComponentImporter = () => import('./login-D6TG9eVv.mjs');
const Route = createFileRoute("/auth/login")({
  beforeLoad: requireGuest,
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const CheckoutRoute = Route$5.update({
  id: "/checkout",
  path: "/checkout",
  getParentRoute: () => Route$6
});
const IndexRoute = Route$4.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$6
});
const OrdersIndexRoute = Route$3.update({
  id: "/orders/",
  path: "/orders/",
  getParentRoute: () => Route$6
});
const OrdersSuccessRoute = Route$2.update({
  id: "/orders/success",
  path: "/orders/success",
  getParentRoute: () => Route$6
});
const AuthRegisterRoute = Route$1.update({
  id: "/auth/register",
  path: "/auth/register",
  getParentRoute: () => Route$6
});
const AuthLoginRoute = Route.update({
  id: "/auth/login",
  path: "/auth/login",
  getParentRoute: () => Route$6
});
const rootRouteChildren = {
  IndexRoute,
  CheckoutRoute,
  AuthLoginRoute,
  AuthRegisterRoute,
  OrdersSuccessRoute,
  OrdersIndexRoute
};
const routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
const routeTree_gen = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  routeTree
}, Symbol.toStringTag, { value: "Module" }));
function createRouter(pathname) {
  const queryClient = new QueryClient();
  return routerWithQueryClient(
    createRouter$1({
      routeTree,
      context: { queryClient },
      defaultPreload: "intent",
      defaultErrorComponent: DefaultCatchBoundary,
      defaultNotFoundComponent: () => /* @__PURE__ */ jsx(NotFound, {}),
      scrollRestoration: true,
      basepath: getRouterBasepath(pathname)
      // defaultSsr: false,
    }),
    queryClient
  );
}
const serverEntry$1 = createStartHandler({
  createRouter: () => createRouter(getWebRequest().url)
})(
  (event) => paraglideMiddleware(getWebRequest(), ({ locale }) => {
    overwriteGetLocale(() => locale);
    return defaultStreamHandler(event);
  })
);
const serverEntry = defineEventHandler(function(event) {
  const request = toWebRequest(event);
  return serverEntry$1({ request });
});

export { Button as B, GradientButton as G, useAuthStore as a, useCategories as b, cn as c, useProducts as d, serverEntry as default, ordersApi as o, transformProduct as t, useCartStore as u };
//# sourceMappingURL=ssr.mjs.map
