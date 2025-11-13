import { jsx, Fragment } from 'react/jsx-runtime';
import * as LabelPrimitive from '@radix-ui/react-label';
import { c as cn } from './ssr.mjs';
import React__default, { useState, useEffect, useMemo } from 'react';

const __storeToDerived = /* @__PURE__ */ new WeakMap();
const __derivedToStore = /* @__PURE__ */ new WeakMap();
const __depsThatHaveWrittenThisTick = {
  current: []
};
let __isFlushing = false;
let __batchDepth = 0;
const __pendingUpdates = /* @__PURE__ */ new Set();
const __initialBatchValues = /* @__PURE__ */ new Map();
function __flush_internals(relatedVals) {
  const sorted = Array.from(relatedVals).sort((a, b) => {
    if (a instanceof Derived && a.options.deps.includes(b)) return 1;
    if (b instanceof Derived && b.options.deps.includes(a)) return -1;
    return 0;
  });
  for (const derived of sorted) {
    if (__depsThatHaveWrittenThisTick.current.includes(derived)) {
      continue;
    }
    __depsThatHaveWrittenThisTick.current.push(derived);
    derived.recompute();
    const stores = __derivedToStore.get(derived);
    if (stores) {
      for (const store of stores) {
        const relatedLinkedDerivedVals = __storeToDerived.get(store);
        if (!relatedLinkedDerivedVals) continue;
        __flush_internals(relatedLinkedDerivedVals);
      }
    }
  }
}
function __notifyListeners(store) {
  store.listeners.forEach(
    (listener) => listener({
      prevVal: store.prevState,
      currentVal: store.state
    })
  );
}
function __notifyDerivedListeners(derived) {
  derived.listeners.forEach(
    (listener) => listener({
      prevVal: derived.prevState,
      currentVal: derived.state
    })
  );
}
function __flush(store) {
  var _a;
  if (__batchDepth > 0 && !__initialBatchValues.has(store)) {
    __initialBatchValues.set(store, store.prevState);
  }
  __pendingUpdates.add(store);
  if (__batchDepth > 0) return;
  if (__isFlushing) return;
  try {
    __isFlushing = true;
    while (__pendingUpdates.size > 0) {
      const stores = Array.from(__pendingUpdates);
      __pendingUpdates.clear();
      for (const store2 of stores) {
        const prevState = (_a = __initialBatchValues.get(store2)) != null ? _a : store2.prevState;
        store2.prevState = prevState;
        __notifyListeners(store2);
      }
      for (const store2 of stores) {
        const derivedVals = __storeToDerived.get(store2);
        if (!derivedVals) continue;
        __depsThatHaveWrittenThisTick.current.push(store2);
        __flush_internals(derivedVals);
      }
      for (const store2 of stores) {
        const derivedVals = __storeToDerived.get(store2);
        if (!derivedVals) continue;
        for (const derived of derivedVals) {
          __notifyDerivedListeners(derived);
        }
      }
    }
  } finally {
    __isFlushing = false;
    __depsThatHaveWrittenThisTick.current = [];
    __initialBatchValues.clear();
  }
}
function batch(fn) {
  __batchDepth++;
  try {
    fn();
  } finally {
    __batchDepth--;
    if (__batchDepth === 0) {
      const pendingUpdateToFlush = Array.from(__pendingUpdates)[0];
      if (pendingUpdateToFlush) {
        __flush(pendingUpdateToFlush);
      }
    }
  }
}
function isUpdaterFunction(updater) {
  return typeof updater === "function";
}
class Store {
  constructor(initialState, options) {
    this.listeners = /* @__PURE__ */ new Set();
    this.subscribe = (listener) => {
      var _a, _b;
      this.listeners.add(listener);
      const unsub = (_b = (_a = this.options) == null ? void 0 : _a.onSubscribe) == null ? void 0 : _b.call(_a, listener, this);
      return () => {
        this.listeners.delete(listener);
        unsub == null ? void 0 : unsub();
      };
    };
    this.prevState = initialState;
    this.state = initialState;
    this.options = options;
  }
  setState(updater) {
    var _a, _b, _c;
    this.prevState = this.state;
    if ((_a = this.options) == null ? void 0 : _a.updateFn) {
      this.state = this.options.updateFn(this.prevState)(updater);
    } else {
      if (isUpdaterFunction(updater)) {
        this.state = updater(this.prevState);
      } else {
        this.state = updater;
      }
    }
    (_c = (_b = this.options) == null ? void 0 : _b.onUpdate) == null ? void 0 : _c.call(_b);
    __flush(this);
  }
}
class Derived {
  constructor(options) {
    this.listeners = /* @__PURE__ */ new Set();
    this._subscriptions = [];
    this.lastSeenDepValues = [];
    this.getDepVals = () => {
      var _a;
      const prevDepVals = [];
      const currDepVals = [];
      for (const dep of this.options.deps) {
        prevDepVals.push(dep.prevState);
        currDepVals.push(dep.state);
      }
      this.lastSeenDepValues = currDepVals;
      return {
        prevDepVals,
        currDepVals,
        prevVal: (_a = this.prevState) != null ? _a : void 0
      };
    };
    this.recompute = () => {
      var _a, _b;
      this.prevState = this.state;
      const { prevDepVals, currDepVals, prevVal } = this.getDepVals();
      this.state = this.options.fn({
        prevDepVals,
        currDepVals,
        prevVal
      });
      (_b = (_a = this.options).onUpdate) == null ? void 0 : _b.call(_a);
    };
    this.checkIfRecalculationNeededDeeply = () => {
      for (const dep of this.options.deps) {
        if (dep instanceof Derived) {
          dep.checkIfRecalculationNeededDeeply();
        }
      }
      let shouldRecompute = false;
      const lastSeenDepValues = this.lastSeenDepValues;
      const { currDepVals } = this.getDepVals();
      for (let i = 0; i < currDepVals.length; i++) {
        if (currDepVals[i] !== lastSeenDepValues[i]) {
          shouldRecompute = true;
          break;
        }
      }
      if (shouldRecompute) {
        this.recompute();
      }
    };
    this.mount = () => {
      this.registerOnGraph();
      this.checkIfRecalculationNeededDeeply();
      return () => {
        this.unregisterFromGraph();
        for (const cleanup of this._subscriptions) {
          cleanup();
        }
      };
    };
    this.subscribe = (listener) => {
      var _a, _b;
      this.listeners.add(listener);
      const unsub = (_b = (_a = this.options).onSubscribe) == null ? void 0 : _b.call(_a, listener, this);
      return () => {
        this.listeners.delete(listener);
        unsub == null ? void 0 : unsub();
      };
    };
    this.options = options;
    this.state = options.fn({
      prevDepVals: void 0,
      prevVal: void 0,
      currDepVals: this.getDepVals().currDepVals
    });
  }
  registerOnGraph(deps = this.options.deps) {
    for (const dep of deps) {
      if (dep instanceof Derived) {
        dep.registerOnGraph();
        this.registerOnGraph(dep.options.deps);
      } else if (dep instanceof Store) {
        let relatedLinkedDerivedVals = __storeToDerived.get(dep);
        if (!relatedLinkedDerivedVals) {
          relatedLinkedDerivedVals = /* @__PURE__ */ new Set();
          __storeToDerived.set(dep, relatedLinkedDerivedVals);
        }
        relatedLinkedDerivedVals.add(this);
        let relatedStores = __derivedToStore.get(this);
        if (!relatedStores) {
          relatedStores = /* @__PURE__ */ new Set();
          __derivedToStore.set(this, relatedStores);
        }
        relatedStores.add(dep);
      }
    }
  }
  unregisterFromGraph(deps = this.options.deps) {
    for (const dep of deps) {
      if (dep instanceof Derived) {
        this.unregisterFromGraph(dep.options.deps);
      } else if (dep instanceof Store) {
        const relatedLinkedDerivedVals = __storeToDerived.get(dep);
        if (relatedLinkedDerivedVals) {
          relatedLinkedDerivedVals.delete(this);
        }
        const relatedStores = __derivedToStore.get(this);
        if (relatedStores) {
          relatedStores.delete(dep);
        }
      }
    }
  }
}
function Label({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    LabelPrimitive.Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
function functionalUpdate(updater, input) {
  return typeof updater === "function" ? updater(input) : updater;
}
function getBy(obj, path) {
  const pathObj = makePathArray(path);
  return pathObj.reduce((current, pathPart) => {
    if (current === null) return null;
    if (typeof current !== "undefined") {
      return current[pathPart];
    }
    return void 0;
  }, obj);
}
function setBy(obj, _path, updater) {
  const path = makePathArray(_path);
  function doSet(parent) {
    if (!path.length) {
      return functionalUpdate(updater, parent);
    }
    const key = path.shift();
    if (typeof key === "string" || typeof key === "number" && !Array.isArray(parent)) {
      if (typeof parent === "object") {
        if (parent === null) {
          parent = {};
        }
        return {
          ...parent,
          [key]: doSet(parent[key])
        };
      }
      return {
        [key]: doSet()
      };
    }
    if (Array.isArray(parent) && typeof key === "number") {
      const prefix = parent.slice(0, key);
      return [
        ...prefix.length ? prefix : new Array(key),
        doSet(parent[key]),
        ...parent.slice(key + 1)
      ];
    }
    return [...new Array(key), doSet()];
  }
  return doSet(obj);
}
function deleteBy(obj, _path) {
  const path = makePathArray(_path);
  function doDelete(parent) {
    if (!parent) return;
    if (path.length === 1) {
      const finalPath = path[0];
      if (Array.isArray(parent) && typeof finalPath === "number") {
        return parent.filter((_, i) => i !== finalPath);
      }
      const { [finalPath]: remove, ...rest } = parent;
      return rest;
    }
    const key = path.shift();
    if (typeof key === "string") {
      if (typeof parent === "object") {
        return {
          ...parent,
          [key]: doDelete(parent[key])
        };
      }
    }
    if (typeof key === "number") {
      if (Array.isArray(parent)) {
        if (key >= parent.length) {
          return parent;
        }
        const prefix = parent.slice(0, key);
        return [
          ...prefix.length ? prefix : new Array(key),
          doDelete(parent[key]),
          ...parent.slice(key + 1)
        ];
      }
    }
    throw new Error("It seems we have created an infinite loop in deleteBy. ");
  }
  return doDelete(obj);
}
const reLineOfOnlyDigits = /^(\d+)$/gm;
const reDigitsBetweenDots = /\.(\d+)(?=\.)/gm;
const reStartWithDigitThenDot = /^(\d+)\./gm;
const reDotWithDigitsToEnd = /\.(\d+$)/gm;
const reMultipleDots = /\.{2,}/gm;
const intPrefix = "__int__";
const intReplace = `${intPrefix}$1`;
function makePathArray(str) {
  if (Array.isArray(str)) {
    return [...str];
  }
  if (typeof str !== "string") {
    throw new Error("Path must be a string.");
  }
  return str.replace(/(^\[)|]/gm, "").replace(/\[/g, ".").replace(reLineOfOnlyDigits, intReplace).replace(reDigitsBetweenDots, `.${intReplace}.`).replace(reStartWithDigitThenDot, `${intReplace}.`).replace(reDotWithDigitsToEnd, `.${intReplace}`).replace(reMultipleDots, ".").split(".").map((d) => {
    if (d.startsWith(intPrefix)) {
      const numStr = d.substring(intPrefix.length);
      const num = parseInt(numStr, 10);
      if (String(num) === numStr) {
        return num;
      }
      return numStr;
    }
    return d;
  });
}
function isNonEmptyArray(obj) {
  return !(Array.isArray(obj) && obj.length === 0);
}
function getSyncValidatorArray(cause, options) {
  const runValidation = (props) => {
    return props.validators.filter(Boolean).map((validator) => {
      return {
        cause: validator.cause,
        validate: validator.fn
      };
    });
  };
  return options.validationLogic({
    form: options.form,
    validators: options.validators,
    event: { type: cause, async: false },
    runValidation
  });
}
function getAsyncValidatorArray(cause, options) {
  const { asyncDebounceMs } = options;
  const {
    onBlurAsyncDebounceMs,
    onChangeAsyncDebounceMs,
    onDynamicAsyncDebounceMs
  } = options.validators || {};
  const defaultDebounceMs = asyncDebounceMs != null ? asyncDebounceMs : 0;
  const runValidation = (props) => {
    return props.validators.filter(Boolean).map((validator) => {
      const validatorCause = (validator == null ? void 0 : validator.cause) || cause;
      let debounceMs = defaultDebounceMs;
      switch (validatorCause) {
        case "change":
          debounceMs = onChangeAsyncDebounceMs != null ? onChangeAsyncDebounceMs : defaultDebounceMs;
          break;
        case "blur":
          debounceMs = onBlurAsyncDebounceMs != null ? onBlurAsyncDebounceMs : defaultDebounceMs;
          break;
        case "dynamic":
          debounceMs = onDynamicAsyncDebounceMs != null ? onDynamicAsyncDebounceMs : defaultDebounceMs;
          break;
        case "submit":
          debounceMs = 0;
          break;
      }
      if (cause === "submit") {
        debounceMs = 0;
      }
      return {
        cause: validatorCause,
        validate: validator.fn,
        debounceMs
      };
    });
  };
  return options.validationLogic({
    form: options.form,
    validators: options.validators,
    event: { type: cause, async: true },
    runValidation
  });
}
const isGlobalFormValidationError = (error) => {
  return !!error && typeof error === "object" && "fields" in error;
};
function evaluate(objA, objB) {
  if (Object.is(objA, objB)) {
    return true;
  }
  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }
  if (objA instanceof Map && objB instanceof Map) {
    if (objA.size !== objB.size) return false;
    for (const [k, v] of objA) {
      if (!objB.has(k) || !Object.is(v, objB.get(k))) return false;
    }
    return true;
  }
  if (objA instanceof Set && objB instanceof Set) {
    if (objA.size !== objB.size) return false;
    for (const v of objA) {
      if (!objB.has(v)) return false;
    }
    return true;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (const key of keysA) {
    if (!keysB.includes(key) || !evaluate(objA[key], objB[key])) {
      return false;
    }
  }
  return true;
}
const determineFormLevelErrorSourceAndValue = ({
  newFormValidatorError,
  isPreviousErrorFromFormValidator,
  previousErrorValue
}) => {
  if (newFormValidatorError) {
    return { newErrorValue: newFormValidatorError, newSource: "form" };
  }
  if (isPreviousErrorFromFormValidator) {
    return { newErrorValue: void 0, newSource: void 0 };
  }
  if (previousErrorValue) {
    return { newErrorValue: previousErrorValue, newSource: "field" };
  }
  return { newErrorValue: void 0, newSource: void 0 };
};
const determineFieldLevelErrorSourceAndValue = ({
  formLevelError,
  fieldLevelError
}) => {
  if (fieldLevelError) {
    return { newErrorValue: fieldLevelError, newSource: "field" };
  }
  if (formLevelError) {
    return { newErrorValue: formLevelError, newSource: "form" };
  }
  return { newErrorValue: void 0, newSource: void 0 };
};
const defaultValidationLogic = (props) => {
  if (!props.validators) {
    return props.runValidation({
      validators: [],
      form: props.form
    });
  }
  const isAsync = props.event.async;
  const onMountValidator = isAsync ? void 0 : { fn: props.validators.onMount, cause: "mount" };
  const onChangeValidator = {
    fn: isAsync ? props.validators.onChangeAsync : props.validators.onChange,
    cause: "change"
  };
  const onBlurValidator = {
    fn: isAsync ? props.validators.onBlurAsync : props.validators.onBlur,
    cause: "blur"
  };
  const onSubmitValidator = {
    fn: isAsync ? props.validators.onSubmitAsync : props.validators.onSubmit,
    cause: "submit"
  };
  const onServerValidator = isAsync ? void 0 : { fn: () => void 0, cause: "server" };
  switch (props.event.type) {
    case "mount": {
      return props.runValidation({
        validators: [onMountValidator],
        form: props.form
      });
    }
    case "submit": {
      return props.runValidation({
        validators: [
          onChangeValidator,
          onBlurValidator,
          onSubmitValidator,
          onServerValidator
        ],
        form: props.form
      });
    }
    case "server": {
      return props.runValidation({
        validators: [],
        form: props.form
      });
    }
    case "blur": {
      return props.runValidation({
        validators: [onBlurValidator, onServerValidator],
        form: props.form
      });
    }
    case "change": {
      return props.runValidation({
        validators: [onChangeValidator, onServerValidator],
        form: props.form
      });
    }
    default: {
      throw new Error(`Unknown validation event type: ${props.event.type}`);
    }
  }
};
function prefixSchemaToErrors(issues) {
  var _a, _b;
  const schema = /* @__PURE__ */ new Map();
  for (const issue of issues) {
    const path = [...(_a = issue.path) != null ? _a : []].map((segment) => {
      const normalizedSegment = typeof segment === "object" ? segment.key : segment;
      return typeof normalizedSegment === "number" ? `[${normalizedSegment}]` : normalizedSegment;
    }).join(".").replace(/\.\[/g, "[");
    schema.set(path, ((_b = schema.get(path)) != null ? _b : []).concat(issue));
  }
  return Object.fromEntries(schema);
}
const transformFormIssues = (issues) => {
  const schemaErrors = prefixSchemaToErrors(issues);
  return {
    form: schemaErrors,
    fields: schemaErrors
  };
};
const standardSchemaValidators = {
  validate({
    value,
    validationSource
  }, schema) {
    const result = schema["~standard"].validate(value);
    if (result instanceof Promise) {
      throw new Error("async function passed to sync validator");
    }
    if (!result.issues) return;
    if (validationSource === "field")
      return result.issues;
    return transformFormIssues(result.issues);
  },
  async validateAsync({
    value,
    validationSource
  }, schema) {
    const result = await schema["~standard"].validate(value);
    if (!result.issues) return;
    if (validationSource === "field")
      return result.issues;
    return transformFormIssues(result.issues);
  }
};
const isStandardSchemaValidator = (validator) => !!validator && "~standard" in validator;
const defaultFieldMeta = {
  isValidating: false,
  isTouched: false,
  isBlurred: false,
  isDirty: false,
  isPristine: true,
  isValid: true,
  isDefaultValue: true,
  errors: [],
  errorMap: {},
  errorSourceMap: {}
};
function metaHelper(formApi) {
  function handleArrayFieldMetaShift(field, index, mode, secondIndex) {
    const affectedFields = getAffectedFields(field, index, mode, secondIndex);
    const handlers = {
      insert: () => handleInsertMode(affectedFields, field, index),
      remove: () => handleRemoveMode(affectedFields),
      swap: () => secondIndex !== void 0 && handleSwapMode(affectedFields, field, index, secondIndex),
      move: () => secondIndex !== void 0 && handleMoveMode(affectedFields, field, index, secondIndex)
    };
    handlers[mode]();
  }
  function getFieldPath(field, index) {
    return `${field}[${index}]`;
  }
  function getAffectedFields(field, index, mode, secondIndex) {
    const affectedFieldKeys = [getFieldPath(field, index)];
    if (mode === "swap") {
      affectedFieldKeys.push(getFieldPath(field, secondIndex));
    } else if (mode === "move") {
      const [startIndex, endIndex] = [
        Math.min(index, secondIndex),
        Math.max(index, secondIndex)
      ];
      for (let i = startIndex; i <= endIndex; i++) {
        affectedFieldKeys.push(getFieldPath(field, i));
      }
    } else {
      const currentValue = formApi.getFieldValue(field);
      const fieldItems = Array.isArray(currentValue) ? currentValue.length : 0;
      for (let i = index + 1; i < fieldItems; i++) {
        affectedFieldKeys.push(getFieldPath(field, i));
      }
    }
    return Object.keys(formApi.fieldInfo).filter(
      (fieldKey) => affectedFieldKeys.some((key) => fieldKey.startsWith(key))
    );
  }
  function updateIndex(fieldKey, direction) {
    return fieldKey.replace(/\[(\d+)\]/, (_, num) => {
      const currIndex = parseInt(num, 10);
      const newIndex = direction === "up" ? currIndex + 1 : Math.max(0, currIndex - 1);
      return `[${newIndex}]`;
    });
  }
  function shiftMeta(fields, direction) {
    const sortedFields = direction === "up" ? fields : [...fields].reverse();
    sortedFields.forEach((fieldKey) => {
      const nextFieldKey = updateIndex(fieldKey.toString(), direction);
      const nextFieldMeta = formApi.getFieldMeta(nextFieldKey);
      if (nextFieldMeta) {
        formApi.setFieldMeta(fieldKey, nextFieldMeta);
      } else {
        formApi.setFieldMeta(fieldKey, getEmptyFieldMeta());
      }
    });
  }
  const getEmptyFieldMeta = () => defaultFieldMeta;
  const handleInsertMode = (fields, field, insertIndex) => {
    shiftMeta(fields, "down");
    fields.forEach((fieldKey) => {
      if (fieldKey.toString().startsWith(getFieldPath(field, insertIndex))) {
        formApi.setFieldMeta(fieldKey, getEmptyFieldMeta());
      }
    });
  };
  const handleRemoveMode = (fields) => {
    shiftMeta(fields, "up");
  };
  const handleMoveMode = (fields, field, fromIndex, toIndex) => {
    const fromFields = new Map(
      Object.keys(formApi.fieldInfo).filter(
        (fieldKey) => fieldKey.startsWith(getFieldPath(field, fromIndex))
      ).map((fieldKey) => [
        fieldKey,
        formApi.getFieldMeta(fieldKey)
      ])
    );
    shiftMeta(fields, fromIndex < toIndex ? "up" : "down");
    Object.keys(formApi.fieldInfo).filter((fieldKey) => fieldKey.startsWith(getFieldPath(field, toIndex))).forEach((fieldKey) => {
      const fromKey = fieldKey.replace(
        getFieldPath(field, toIndex),
        getFieldPath(field, fromIndex)
      );
      const fromMeta = fromFields.get(fromKey);
      if (fromMeta) {
        formApi.setFieldMeta(fieldKey, fromMeta);
      }
    });
  };
  const handleSwapMode = (fields, field, index, secondIndex) => {
    fields.forEach((fieldKey) => {
      if (!fieldKey.toString().startsWith(getFieldPath(field, index))) return;
      const swappedKey = fieldKey.toString().replace(
        getFieldPath(field, index),
        getFieldPath(field, secondIndex)
      );
      const [meta1, meta2] = [
        formApi.getFieldMeta(fieldKey),
        formApi.getFieldMeta(swappedKey)
      ];
      if (meta1) formApi.setFieldMeta(swappedKey, meta1);
      if (meta2) formApi.setFieldMeta(fieldKey, meta2);
    });
  };
  return { handleArrayFieldMetaShift };
}
function getDefaultFormState(defaultState) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  return {
    values: (_a = defaultState.values) != null ? _a : {},
    errorMap: (_b = defaultState.errorMap) != null ? _b : {},
    fieldMetaBase: (_c = defaultState.fieldMetaBase) != null ? _c : {},
    isSubmitted: (_d = defaultState.isSubmitted) != null ? _d : false,
    isSubmitting: (_e = defaultState.isSubmitting) != null ? _e : false,
    isValidating: (_f = defaultState.isValidating) != null ? _f : false,
    submissionAttempts: (_g = defaultState.submissionAttempts) != null ? _g : 0,
    isSubmitSuccessful: (_h = defaultState.isSubmitSuccessful) != null ? _h : false,
    validationMetaMap: (_i = defaultState.validationMetaMap) != null ? _i : {
      onChange: void 0,
      onBlur: void 0,
      onSubmit: void 0,
      onMount: void 0,
      onServer: void 0,
      onDynamic: void 0
    }
  };
}
class FormApi {
  /**
   * Constructs a new `FormApi` instance with the given form options.
   */
  constructor(opts) {
    var _a, _b;
    this.options = {};
    this.fieldInfo = {};
    this.prevTransformArray = [];
    this.mount = () => {
      var _a2, _b2;
      const cleanupFieldMetaDerived = this.fieldMetaDerived.mount();
      const cleanupStoreDerived = this.store.mount();
      const cleanup = () => {
        cleanupFieldMetaDerived();
        cleanupStoreDerived();
      };
      (_b2 = (_a2 = this.options.listeners) == null ? void 0 : _a2.onMount) == null ? void 0 : _b2.call(_a2, { formApi: this });
      const { onMount } = this.options.validators || {};
      if (!onMount) return cleanup;
      this.validateSync("mount");
      return cleanup;
    };
    this.update = (options) => {
      var _a2, _b2;
      if (!options) return;
      const oldOptions = this.options;
      this.options = options;
      const shouldUpdateReeval = !!((_b2 = (_a2 = options.transform) == null ? void 0 : _a2.deps) == null ? void 0 : _b2.some(
        (val, i) => val !== this.prevTransformArray[i]
      ));
      const shouldUpdateValues = options.defaultValues && !evaluate(options.defaultValues, oldOptions.defaultValues) && !this.state.isTouched;
      const shouldUpdateState = !evaluate(options.defaultState, oldOptions.defaultState) && !this.state.isTouched;
      if (!shouldUpdateValues && !shouldUpdateState && !shouldUpdateReeval) return;
      batch(() => {
        this.baseStore.setState(
          () => getDefaultFormState(
            Object.assign(
              {},
              this.state,
              shouldUpdateState ? options.defaultState : {},
              shouldUpdateValues ? {
                values: options.defaultValues
              } : {},
              shouldUpdateReeval ? { _force_re_eval: !this.state._force_re_eval } : {}
            )
          )
        );
      });
    };
    this.reset = (values, opts2) => {
      const { fieldMeta: currentFieldMeta } = this.state;
      const fieldMetaBase = this.resetFieldMeta(currentFieldMeta);
      if (values && !(opts2 == null ? void 0 : opts2.keepDefaultValues)) {
        this.options = {
          ...this.options,
          defaultValues: values
        };
      }
      this.baseStore.setState(
        () => {
          var _a2, _b2;
          return getDefaultFormState({
            ...this.options.defaultState,
            values: (_b2 = values != null ? values : this.options.defaultValues) != null ? _b2 : (_a2 = this.options.defaultState) == null ? void 0 : _a2.values,
            fieldMetaBase
          });
        }
      );
    };
    this.validateAllFields = async (cause) => {
      const fieldValidationPromises = [];
      batch(() => {
        void Object.values(this.fieldInfo).forEach(
          (field) => {
            if (!field.instance) return;
            const fieldInstance = field.instance;
            fieldValidationPromises.push(
              // Remember, `validate` is either a sync operation or a promise
              Promise.resolve().then(
                () => fieldInstance.validate(cause, { skipFormValidation: true })
              )
            );
            if (!field.instance.state.meta.isTouched) {
              field.instance.setMeta((prev) => ({ ...prev, isTouched: true }));
            }
          }
        );
      });
      const fieldErrorMapMap = await Promise.all(fieldValidationPromises);
      return fieldErrorMapMap.flat();
    };
    this.validateArrayFieldsStartingFrom = async (field, index, cause) => {
      const currentValue = this.getFieldValue(field);
      const lastIndex = Array.isArray(currentValue) ? Math.max(currentValue.length - 1, 0) : null;
      const fieldKeysToValidate = [`${field}[${index}]`];
      for (let i = index + 1; i <= (lastIndex != null ? lastIndex : 0); i++) {
        fieldKeysToValidate.push(`${field}[${i}]`);
      }
      const fieldsToValidate = Object.keys(this.fieldInfo).filter(
        (fieldKey) => fieldKeysToValidate.some((key) => fieldKey.startsWith(key))
      );
      const fieldValidationPromises = [];
      batch(() => {
        fieldsToValidate.forEach((nestedField) => {
          fieldValidationPromises.push(
            Promise.resolve().then(() => this.validateField(nestedField, cause))
          );
        });
      });
      const fieldErrorMapMap = await Promise.all(fieldValidationPromises);
      return fieldErrorMapMap.flat();
    };
    this.validateField = (field, cause) => {
      var _a2;
      const fieldInstance = (_a2 = this.fieldInfo[field]) == null ? void 0 : _a2.instance;
      if (!fieldInstance) return [];
      if (!fieldInstance.state.meta.isTouched) {
        fieldInstance.setMeta((prev) => ({ ...prev, isTouched: true }));
      }
      return fieldInstance.validate(cause);
    };
    this.validateSync = (cause) => {
      const validates = getSyncValidatorArray(cause, {
        ...this.options,
        form: this,
        validationLogic: this.options.validationLogic || defaultValidationLogic
      });
      let hasErrored = false;
      const currentValidationErrorMap = {};
      batch(() => {
        var _a2, _b2, _c;
        for (const validateObj of validates) {
          if (!validateObj.validate) continue;
          const rawError = this.runValidator({
            validate: validateObj.validate,
            value: {
              value: this.state.values,
              formApi: this,
              validationSource: "form"
            },
            type: "validate"
          });
          const { formError, fieldErrors } = normalizeError$1(rawError);
          const errorMapKey = getErrorMapKey$1(validateObj.cause);
          for (const field of Object.keys(
            this.state.fieldMeta
          )) {
            const fieldMeta = this.getFieldMeta(field);
            if (!fieldMeta) continue;
            const {
              errorMap: currentErrorMap,
              errorSourceMap: currentErrorMapSource
            } = fieldMeta;
            const newFormValidatorError = fieldErrors == null ? void 0 : fieldErrors[field];
            const { newErrorValue, newSource } = determineFormLevelErrorSourceAndValue({
              newFormValidatorError,
              isPreviousErrorFromFormValidator: (
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                (currentErrorMapSource == null ? void 0 : currentErrorMapSource[errorMapKey]) === "form"
              ),
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              previousErrorValue: currentErrorMap == null ? void 0 : currentErrorMap[errorMapKey]
            });
            if (newSource === "form") {
              currentValidationErrorMap[field] = {
                ...currentValidationErrorMap[field],
                [errorMapKey]: newFormValidatorError
              };
            }
            if (
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              (currentErrorMap == null ? void 0 : currentErrorMap[errorMapKey]) !== newErrorValue
            ) {
              this.setFieldMeta(field, (prev) => ({
                ...prev,
                errorMap: {
                  ...prev.errorMap,
                  [errorMapKey]: newErrorValue
                },
                errorSourceMap: {
                  ...prev.errorSourceMap,
                  [errorMapKey]: newSource
                }
              }));
            }
          }
          if (((_a2 = this.state.errorMap) == null ? void 0 : _a2[errorMapKey]) !== formError) {
            this.baseStore.setState((prev) => ({
              ...prev,
              errorMap: {
                ...prev.errorMap,
                [errorMapKey]: formError
              }
            }));
          }
          if (formError || fieldErrors) {
            hasErrored = true;
          }
        }
        const submitErrKey = getErrorMapKey$1("submit");
        if (
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          ((_b2 = this.state.errorMap) == null ? void 0 : _b2[submitErrKey]) && cause !== "submit" && !hasErrored
        ) {
          this.baseStore.setState((prev) => ({
            ...prev,
            errorMap: {
              ...prev.errorMap,
              [submitErrKey]: void 0
            }
          }));
        }
        const serverErrKey = getErrorMapKey$1("server");
        if (
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          ((_c = this.state.errorMap) == null ? void 0 : _c[serverErrKey]) && cause !== "server" && !hasErrored
        ) {
          this.baseStore.setState((prev) => ({
            ...prev,
            errorMap: {
              ...prev.errorMap,
              [serverErrKey]: void 0
            }
          }));
        }
      });
      return { hasErrored, fieldsErrorMap: currentValidationErrorMap };
    };
    this.validateAsync = async (cause) => {
      const validates = getAsyncValidatorArray(cause, {
        ...this.options,
        form: this,
        validationLogic: this.options.validationLogic || defaultValidationLogic
      });
      if (!this.state.isFormValidating) {
        this.baseStore.setState((prev) => ({ ...prev, isFormValidating: true }));
      }
      const promises = [];
      let fieldErrorsFromFormValidators;
      for (const validateObj of validates) {
        if (!validateObj.validate) continue;
        const key = getErrorMapKey$1(validateObj.cause);
        const fieldValidatorMeta = this.state.validationMetaMap[key];
        fieldValidatorMeta == null ? void 0 : fieldValidatorMeta.lastAbortController.abort();
        const controller = new AbortController();
        this.state.validationMetaMap[key] = {
          lastAbortController: controller
        };
        promises.push(
          new Promise(async (resolve) => {
            let rawError;
            try {
              rawError = await new Promise((rawResolve, rawReject) => {
                setTimeout(async () => {
                  if (controller.signal.aborted) return rawResolve(void 0);
                  try {
                    rawResolve(
                      await this.runValidator({
                        validate: validateObj.validate,
                        value: {
                          value: this.state.values,
                          formApi: this,
                          validationSource: "form",
                          signal: controller.signal
                        },
                        type: "validateAsync"
                      })
                    );
                  } catch (e) {
                    rawReject(e);
                  }
                }, validateObj.debounceMs);
              });
            } catch (e) {
              rawError = e;
            }
            const { formError, fieldErrors: fieldErrorsFromNormalizeError } = normalizeError$1(rawError);
            if (fieldErrorsFromNormalizeError) {
              fieldErrorsFromFormValidators = fieldErrorsFromFormValidators ? {
                ...fieldErrorsFromFormValidators,
                ...fieldErrorsFromNormalizeError
              } : fieldErrorsFromNormalizeError;
            }
            const errorMapKey = getErrorMapKey$1(validateObj.cause);
            for (const field of Object.keys(
              this.state.fieldMeta
            )) {
              const fieldMeta = this.getFieldMeta(field);
              if (!fieldMeta) continue;
              const {
                errorMap: currentErrorMap,
                errorSourceMap: currentErrorMapSource
              } = fieldMeta;
              const newFormValidatorError = fieldErrorsFromFormValidators == null ? void 0 : fieldErrorsFromFormValidators[field];
              const { newErrorValue, newSource } = determineFormLevelErrorSourceAndValue({
                newFormValidatorError,
                isPreviousErrorFromFormValidator: (
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  (currentErrorMapSource == null ? void 0 : currentErrorMapSource[errorMapKey]) === "form"
                ),
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                previousErrorValue: currentErrorMap == null ? void 0 : currentErrorMap[errorMapKey]
              });
              if (
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                (currentErrorMap == null ? void 0 : currentErrorMap[errorMapKey]) !== newErrorValue
              ) {
                this.setFieldMeta(field, (prev) => ({
                  ...prev,
                  errorMap: {
                    ...prev.errorMap,
                    [errorMapKey]: newErrorValue
                  },
                  errorSourceMap: {
                    ...prev.errorSourceMap,
                    [errorMapKey]: newSource
                  }
                }));
              }
            }
            this.baseStore.setState((prev) => ({
              ...prev,
              errorMap: {
                ...prev.errorMap,
                [errorMapKey]: formError
              }
            }));
            resolve(
              fieldErrorsFromFormValidators ? { fieldErrors: fieldErrorsFromFormValidators, errorMapKey } : void 0
            );
          })
        );
      }
      let results = [];
      const fieldsErrorMap = {};
      if (promises.length) {
        results = await Promise.all(promises);
        for (const fieldValidationResult of results) {
          if (fieldValidationResult == null ? void 0 : fieldValidationResult.fieldErrors) {
            const { errorMapKey } = fieldValidationResult;
            for (const [field, fieldError] of Object.entries(
              fieldValidationResult.fieldErrors
            )) {
              const oldErrorMap = fieldsErrorMap[field] || {};
              const newErrorMap = {
                ...oldErrorMap,
                [errorMapKey]: fieldError
              };
              fieldsErrorMap[field] = newErrorMap;
            }
          }
        }
      }
      this.baseStore.setState((prev) => ({
        ...prev,
        isFormValidating: false
      }));
      return fieldsErrorMap;
    };
    this.validate = (cause) => {
      const { hasErrored, fieldsErrorMap } = this.validateSync(cause);
      if (hasErrored && !this.options.asyncAlways) {
        return fieldsErrorMap;
      }
      return this.validateAsync(cause);
    };
    this.getFieldValue = (field) => getBy(this.state.values, field);
    this.getFieldMeta = (field) => {
      return this.state.fieldMeta[field];
    };
    this.getFieldInfo = (field) => {
      var _a2;
      return (_a2 = this.fieldInfo)[field] || (_a2[field] = {
        instance: null,
        validationMetaMap: {
          onChange: void 0,
          onBlur: void 0,
          onSubmit: void 0,
          onMount: void 0,
          onServer: void 0,
          onDynamic: void 0
        }
      });
    };
    this.setFieldMeta = (field, updater) => {
      this.baseStore.setState((prev) => {
        return {
          ...prev,
          fieldMetaBase: {
            ...prev.fieldMetaBase,
            [field]: functionalUpdate(
              updater,
              prev.fieldMetaBase[field]
            )
          }
        };
      });
    };
    this.resetFieldMeta = (fieldMeta) => {
      return Object.keys(fieldMeta).reduce(
        (acc, key) => {
          const fieldKey = key;
          acc[fieldKey] = defaultFieldMeta;
          return acc;
        },
        {}
      );
    };
    this.setFieldValue = (field, updater, opts2) => {
      var _a2;
      const dontUpdateMeta = (_a2 = opts2 == null ? void 0 : opts2.dontUpdateMeta) != null ? _a2 : false;
      batch(() => {
        if (!dontUpdateMeta) {
          this.setFieldMeta(field, (prev) => ({
            ...prev,
            isTouched: true,
            isDirty: true,
            errorMap: {
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              ...prev == null ? void 0 : prev.errorMap,
              onMount: void 0
            }
          }));
        }
        this.baseStore.setState((prev) => {
          return {
            ...prev,
            values: setBy(prev.values, field, updater)
          };
        });
      });
    };
    this.deleteField = (field) => {
      const subFieldsToDelete = Object.keys(this.fieldInfo).filter((f) => {
        const fieldStr = field.toString();
        return f !== fieldStr && f.startsWith(fieldStr);
      });
      const fieldsToDelete = [...subFieldsToDelete, field];
      this.baseStore.setState((prev) => {
        const newState = { ...prev };
        fieldsToDelete.forEach((f) => {
          newState.values = deleteBy(newState.values, f);
          delete this.fieldInfo[f];
          delete newState.fieldMetaBase[f];
        });
        return newState;
      });
    };
    this.pushFieldValue = (field, value, opts2) => {
      this.setFieldValue(
        field,
        (prev) => [...Array.isArray(prev) ? prev : [], value],
        opts2
      );
      this.validateField(field, "change");
    };
    this.insertFieldValue = async (field, index, value, opts2) => {
      this.setFieldValue(
        field,
        (prev) => {
          return [
            ...prev.slice(0, index),
            value,
            ...prev.slice(index)
          ];
        },
        opts2
      );
      await this.validateField(field, "change");
      metaHelper(this).handleArrayFieldMetaShift(field, index, "insert");
      await this.validateArrayFieldsStartingFrom(field, index, "change");
    };
    this.replaceFieldValue = async (field, index, value, opts2) => {
      this.setFieldValue(
        field,
        (prev) => {
          return prev.map(
            (d, i) => i === index ? value : d
          );
        },
        opts2
      );
      await this.validateField(field, "change");
      await this.validateArrayFieldsStartingFrom(field, index, "change");
    };
    this.removeFieldValue = async (field, index, opts2) => {
      const fieldValue = this.getFieldValue(field);
      const lastIndex = Array.isArray(fieldValue) ? Math.max(fieldValue.length - 1, 0) : null;
      this.setFieldValue(
        field,
        (prev) => {
          return prev.filter(
            (_d, i) => i !== index
          );
        },
        opts2
      );
      metaHelper(this).handleArrayFieldMetaShift(field, index, "remove");
      if (lastIndex !== null) {
        const start = `${field}[${lastIndex}]`;
        this.deleteField(start);
      }
      await this.validateField(field, "change");
      await this.validateArrayFieldsStartingFrom(field, index, "change");
    };
    this.swapFieldValues = (field, index1, index2, opts2) => {
      this.setFieldValue(
        field,
        (prev) => {
          const prev1 = prev[index1];
          const prev2 = prev[index2];
          return setBy(setBy(prev, `${index1}`, prev2), `${index2}`, prev1);
        },
        opts2
      );
      metaHelper(this).handleArrayFieldMetaShift(field, index1, "swap", index2);
      this.validateField(field, "change");
      this.validateField(`${field}[${index1}]`, "change");
      this.validateField(`${field}[${index2}]`, "change");
    };
    this.moveFieldValues = (field, index1, index2, opts2) => {
      this.setFieldValue(
        field,
        (prev) => {
          const next = [...prev];
          next.splice(index2, 0, next.splice(index1, 1)[0]);
          return next;
        },
        opts2
      );
      metaHelper(this).handleArrayFieldMetaShift(field, index1, "move", index2);
      this.validateField(field, "change");
      this.validateField(`${field}[${index1}]`, "change");
      this.validateField(`${field}[${index2}]`, "change");
    };
    this.clearFieldValues = (field, opts2) => {
      const fieldValue = this.getFieldValue(field);
      const lastIndex = Array.isArray(fieldValue) ? Math.max(fieldValue.length - 1, 0) : null;
      this.setFieldValue(field, [], opts2);
      if (lastIndex !== null) {
        for (let i = 0; i <= lastIndex; i++) {
          const fieldKey = `${field}[${i}]`;
          this.deleteField(fieldKey);
        }
      }
      this.validateField(field, "change");
    };
    this.resetField = (field) => {
      this.baseStore.setState((prev) => {
        return {
          ...prev,
          fieldMetaBase: {
            ...prev.fieldMetaBase,
            [field]: defaultFieldMeta
          },
          values: this.options.defaultValues ? setBy(prev.values, field, getBy(this.options.defaultValues, field)) : prev.values
        };
      });
    };
    this.getAllErrors = () => {
      return {
        form: {
          errors: this.state.errors,
          errorMap: this.state.errorMap
        },
        fields: Object.entries(this.state.fieldMeta).reduce(
          (acc, [fieldName, fieldMeta]) => {
            if (Object.keys(fieldMeta).length && fieldMeta.errors.length) {
              acc[fieldName] = {
                errors: fieldMeta.errors,
                errorMap: fieldMeta.errorMap
              };
            }
            return acc;
          },
          {}
        )
      };
    };
    this.parseValuesWithSchema = (schema) => {
      return standardSchemaValidators.validate(
        { value: this.state.values, validationSource: "form" },
        schema
      );
    };
    this.parseValuesWithSchemaAsync = (schema) => {
      return standardSchemaValidators.validateAsync(
        { value: this.state.values, validationSource: "form" },
        schema
      );
    };
    this.baseStore = new Store(
      getDefaultFormState({
        ...opts == null ? void 0 : opts.defaultState,
        values: (_b = opts == null ? void 0 : opts.defaultValues) != null ? _b : (_a = opts == null ? void 0 : opts.defaultState) == null ? void 0 : _a.values
      })
    );
    this.fieldMetaDerived = new Derived({
      deps: [this.baseStore],
      fn: ({ prevDepVals, currDepVals, prevVal: _prevVal }) => {
        var _a2, _b2, _c, _d;
        const prevVal = _prevVal;
        const prevBaseStore = prevDepVals == null ? void 0 : prevDepVals[0];
        const currBaseStore = currDepVals[0];
        let originalMetaCount = 0;
        const fieldMeta = {};
        for (const fieldName of Object.keys(
          currBaseStore.fieldMetaBase
        )) {
          const currBaseMeta = currBaseStore.fieldMetaBase[fieldName];
          const prevBaseMeta = prevBaseStore == null ? void 0 : prevBaseStore.fieldMetaBase[fieldName];
          const prevFieldInfo = prevVal == null ? void 0 : prevVal[fieldName];
          const curFieldVal = getBy(currBaseStore.values, fieldName);
          let fieldErrors = prevFieldInfo == null ? void 0 : prevFieldInfo.errors;
          if (!prevBaseMeta || currBaseMeta.errorMap !== prevBaseMeta.errorMap) {
            fieldErrors = Object.values((_a2 = currBaseMeta.errorMap) != null ? _a2 : {}).filter(
              (val) => val !== void 0
            );
            const fieldInstance = (_b2 = this.getFieldInfo(fieldName)) == null ? void 0 : _b2.instance;
            if (fieldInstance && !fieldInstance.options.disableErrorFlat) {
              fieldErrors = fieldErrors == null ? void 0 : fieldErrors.flat(
                1
              );
            }
          }
          const isFieldValid = !isNonEmptyArray(fieldErrors != null ? fieldErrors : []);
          const isFieldPristine = !currBaseMeta.isDirty;
          const isDefaultValue = evaluate(
            curFieldVal,
            getBy(this.options.defaultValues, fieldName)
          ) || evaluate(
            curFieldVal,
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            (_d = (_c = this.getFieldInfo(fieldName)) == null ? void 0 : _c.instance) == null ? void 0 : _d.options.defaultValue
          );
          if (prevFieldInfo && prevFieldInfo.isPristine === isFieldPristine && prevFieldInfo.isValid === isFieldValid && prevFieldInfo.isDefaultValue === isDefaultValue && prevFieldInfo.errors === fieldErrors && currBaseMeta === prevBaseMeta) {
            fieldMeta[fieldName] = prevFieldInfo;
            originalMetaCount++;
            continue;
          }
          fieldMeta[fieldName] = {
            ...currBaseMeta,
            errors: fieldErrors,
            isPristine: isFieldPristine,
            isValid: isFieldValid,
            isDefaultValue
          };
        }
        if (!Object.keys(currBaseStore.fieldMetaBase).length) return fieldMeta;
        if (prevVal && originalMetaCount === Object.keys(currBaseStore.fieldMetaBase).length) {
          return prevVal;
        }
        return fieldMeta;
      }
    });
    this.store = new Derived({
      deps: [this.baseStore, this.fieldMetaDerived],
      fn: ({ prevDepVals, currDepVals, prevVal: _prevVal }) => {
        var _a2, _b2, _c, _d, _e, _f, _g;
        const prevVal = _prevVal;
        const prevBaseStore = prevDepVals == null ? void 0 : prevDepVals[0];
        const currBaseStore = currDepVals[0];
        const currFieldMeta = currDepVals[1];
        const fieldMetaValues = Object.values(currFieldMeta).filter(
          Boolean
        );
        const isFieldsValidating = fieldMetaValues.some(
          (field) => field.isValidating
        );
        const isFieldsValid = fieldMetaValues.every((field) => field.isValid);
        const isTouched = fieldMetaValues.some((field) => field.isTouched);
        const isBlurred = fieldMetaValues.some((field) => field.isBlurred);
        const isDefaultValue = fieldMetaValues.every(
          (field) => field.isDefaultValue
        );
        const shouldInvalidateOnMount = (
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          isTouched && ((_a2 = currBaseStore.errorMap) == null ? void 0 : _a2.onMount)
        );
        const isDirty = fieldMetaValues.some((field) => field.isDirty);
        const isPristine = !isDirty;
        const hasOnMountError = Boolean(
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          ((_b2 = currBaseStore.errorMap) == null ? void 0 : _b2.onMount) || // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          fieldMetaValues.some((f) => {
            var _a3;
            return (_a3 = f == null ? void 0 : f.errorMap) == null ? void 0 : _a3.onMount;
          })
        );
        const isValidating = !!isFieldsValidating;
        let errors = (_c = prevVal == null ? void 0 : prevVal.errors) != null ? _c : [];
        if (!prevBaseStore || currBaseStore.errorMap !== prevBaseStore.errorMap) {
          errors = Object.values(currBaseStore.errorMap).reduce((prev, curr) => {
            if (curr === void 0) return prev;
            if (curr && isGlobalFormValidationError(curr)) {
              prev.push(curr.form);
              return prev;
            }
            prev.push(curr);
            return prev;
          }, []);
        }
        const isFormValid = errors.length === 0;
        const isValid = isFieldsValid && isFormValid;
        const submitInvalid = (_d = this.options.canSubmitWhenInvalid) != null ? _d : false;
        const canSubmit = currBaseStore.submissionAttempts === 0 && !isTouched && !hasOnMountError || !isValidating && !currBaseStore.isSubmitting && isValid || submitInvalid;
        let errorMap = currBaseStore.errorMap;
        if (shouldInvalidateOnMount) {
          errors = errors.filter(
            (err) => err !== currBaseStore.errorMap.onMount
          );
          errorMap = Object.assign(errorMap, { onMount: void 0 });
        }
        if (prevVal && prevBaseStore && prevVal.errorMap === errorMap && prevVal.fieldMeta === this.fieldMetaDerived.state && prevVal.errors === errors && prevVal.isFieldsValidating === isFieldsValidating && prevVal.isFieldsValid === isFieldsValid && prevVal.isFormValid === isFormValid && prevVal.isValid === isValid && prevVal.canSubmit === canSubmit && prevVal.isTouched === isTouched && prevVal.isBlurred === isBlurred && prevVal.isPristine === isPristine && prevVal.isDefaultValue === isDefaultValue && prevVal.isDirty === isDirty && evaluate(prevBaseStore, currBaseStore)) {
          return prevVal;
        }
        let state = {
          ...currBaseStore,
          errorMap,
          fieldMeta: this.fieldMetaDerived.state,
          errors,
          isFieldsValidating,
          isFieldsValid,
          isFormValid,
          isValid,
          canSubmit,
          isTouched,
          isBlurred,
          isPristine,
          isDefaultValue,
          isDirty
        };
        const transformArray = (_f = (_e = this.options.transform) == null ? void 0 : _e.deps) != null ? _f : [];
        const shouldTransform = transformArray.length !== this.prevTransformArray.length || transformArray.some((val, i) => val !== this.prevTransformArray[i]);
        if (shouldTransform) {
          const newObj = Object.assign({}, this, { state });
          (_g = this.options.transform) == null ? void 0 : _g.fn(newObj);
          state = newObj.state;
          this.prevTransformArray = transformArray;
        }
        return state;
      }
    });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.update(opts || {});
  }
  get state() {
    return this.store.state;
  }
  get formId() {
    return this.options.formId;
  }
  /**
   * @private
   */
  runValidator(props) {
    if (isStandardSchemaValidator(props.validate)) {
      return standardSchemaValidators[props.type](
        props.value,
        props.validate
      );
    }
    return props.validate(props.value);
  }
  async handleSubmit(submitMeta) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    this.baseStore.setState((old) => ({
      ...old,
      // Submission attempts mark the form as not submitted
      isSubmitted: false,
      // Count submission attempts
      submissionAttempts: old.submissionAttempts + 1,
      isSubmitSuccessful: false
      // Reset isSubmitSuccessful at the start of submission
    }));
    batch(() => {
      void Object.values(this.fieldInfo).forEach(
        (field) => {
          if (!field.instance) return;
          if (!field.instance.state.meta.isTouched) {
            field.instance.setMeta((prev) => ({ ...prev, isTouched: true }));
          }
        }
      );
    });
    if (!this.state.canSubmit) return;
    const submitMetaArg = submitMeta != null ? submitMeta : this.options.onSubmitMeta;
    this.baseStore.setState((d) => ({ ...d, isSubmitting: true }));
    const done = () => {
      this.baseStore.setState((prev) => ({ ...prev, isSubmitting: false }));
    };
    await this.validateAllFields("submit");
    if (!this.state.isFieldsValid) {
      done();
      (_b = (_a = this.options).onSubmitInvalid) == null ? void 0 : _b.call(_a, {
        value: this.state.values,
        formApi: this,
        meta: submitMetaArg
      });
      return;
    }
    await this.validate("submit");
    if (!this.state.isValid) {
      done();
      (_d = (_c = this.options).onSubmitInvalid) == null ? void 0 : _d.call(_c, {
        value: this.state.values,
        formApi: this,
        meta: submitMetaArg
      });
      return;
    }
    batch(() => {
      void Object.values(this.fieldInfo).forEach(
        (field) => {
          var _a2, _b2, _c2;
          (_c2 = (_b2 = (_a2 = field.instance) == null ? void 0 : _a2.options.listeners) == null ? void 0 : _b2.onSubmit) == null ? void 0 : _c2.call(_b2, {
            value: field.instance.state.value,
            fieldApi: field.instance
          });
        }
      );
    });
    (_f = (_e = this.options.listeners) == null ? void 0 : _e.onSubmit) == null ? void 0 : _f.call(_e, { formApi: this, meta: submitMetaArg });
    try {
      await ((_h = (_g = this.options).onSubmit) == null ? void 0 : _h.call(_g, {
        value: this.state.values,
        formApi: this,
        meta: submitMetaArg
      }));
      batch(() => {
        this.baseStore.setState((prev) => ({
          ...prev,
          isSubmitted: true,
          isSubmitSuccessful: true
          // Set isSubmitSuccessful to true on successful submission
        }));
        done();
      });
    } catch (err) {
      this.baseStore.setState((prev) => ({
        ...prev,
        isSubmitSuccessful: false
        // Ensure isSubmitSuccessful is false if an error occurs
      }));
      done();
      throw err;
    }
  }
  /**
   * Updates the form's errorMap
   */
  setErrorMap(errorMap) {
    batch(() => {
      Object.entries(errorMap).forEach(([key, value]) => {
        const errorMapKey = key;
        if (isGlobalFormValidationError(value)) {
          const { formError, fieldErrors } = normalizeError$1(value);
          for (const fieldName of Object.keys(
            this.fieldInfo
          )) {
            const fieldMeta = this.getFieldMeta(fieldName);
            if (!fieldMeta) continue;
            this.setFieldMeta(fieldName, (prev) => ({
              ...prev,
              errorMap: {
                ...prev.errorMap,
                [errorMapKey]: fieldErrors == null ? void 0 : fieldErrors[fieldName]
              },
              errorSourceMap: {
                ...prev.errorSourceMap,
                [errorMapKey]: "form"
              }
            }));
          }
          this.baseStore.setState((prev) => ({
            ...prev,
            errorMap: {
              ...prev.errorMap,
              [errorMapKey]: formError
            }
          }));
        } else {
          this.baseStore.setState((prev) => ({
            ...prev,
            errorMap: {
              ...prev.errorMap,
              [errorMapKey]: value
            }
          }));
        }
      });
    });
  }
}
function normalizeError$1(rawError) {
  if (rawError) {
    if (isGlobalFormValidationError(rawError)) {
      const formError = normalizeError$1(rawError.form).formError;
      const fieldErrors = rawError.fields;
      return { formError, fieldErrors };
    }
    return { formError: rawError };
  }
  return { formError: void 0 };
}
function getErrorMapKey$1(cause) {
  switch (cause) {
    case "submit":
      return "onSubmit";
    case "blur":
      return "onBlur";
    case "mount":
      return "onMount";
    case "server":
      return "onServer";
    case "dynamic":
      return "onDynamic";
    case "change":
    default:
      return "onChange";
  }
}
class FieldApi {
  /**
   * Initializes a new `FieldApi` instance.
   */
  constructor(opts) {
    this.options = {};
    this.mount = () => {
      var _a, _b;
      const cleanup = this.store.mount();
      if (this.options.defaultValue !== void 0) {
        this.form.setFieldValue(this.name, this.options.defaultValue, {
          dontUpdateMeta: true
        });
      }
      const info = this.getInfo();
      info.instance = this;
      this.update(this.options);
      const { onMount } = this.options.validators || {};
      if (onMount) {
        const error = this.runValidator({
          validate: onMount,
          value: {
            value: this.state.value,
            fieldApi: this,
            validationSource: "field"
          },
          type: "validate"
        });
        if (error) {
          this.setMeta(
            (prev) => ({
              ...prev,
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              errorMap: { ...prev == null ? void 0 : prev.errorMap, onMount: error },
              errorSourceMap: {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                ...prev == null ? void 0 : prev.errorSourceMap,
                onMount: "field"
              }
            })
          );
        }
      }
      (_b = (_a = this.options.listeners) == null ? void 0 : _a.onMount) == null ? void 0 : _b.call(_a, {
        value: this.state.value,
        fieldApi: this
      });
      return cleanup;
    };
    this.update = (opts2) => {
      var _a;
      this.options = opts2;
      const nameHasChanged = this.name !== opts2.name;
      this.name = opts2.name;
      if (this.state.value === void 0) {
        const formDefault = getBy(opts2.form.options.defaultValues, opts2.name);
        const defaultValue = (_a = opts2.defaultValue) != null ? _a : formDefault;
        if (nameHasChanged) {
          this.setValue((val) => val || defaultValue, {
            dontUpdateMeta: true
          });
        } else if (defaultValue !== void 0) {
          this.setValue(defaultValue, {
            dontUpdateMeta: true
          });
        }
      }
      if (this.form.getFieldMeta(this.name) === void 0) {
        this.setMeta(this.state.meta);
      }
    };
    this.getValue = () => {
      return this.form.getFieldValue(this.name);
    };
    this.setValue = (updater, options) => {
      this.form.setFieldValue(this.name, updater, options);
      this.triggerOnChangeListener();
      this.validate("change");
    };
    this.getMeta = () => this.store.state.meta;
    this.setMeta = (updater) => this.form.setFieldMeta(this.name, updater);
    this.getInfo = () => this.form.getFieldInfo(this.name);
    this.pushValue = (value, opts2) => {
      this.form.pushFieldValue(this.name, value, opts2);
      this.triggerOnChangeListener();
    };
    this.insertValue = (index, value, opts2) => {
      this.form.insertFieldValue(this.name, index, value, opts2);
      this.triggerOnChangeListener();
    };
    this.replaceValue = (index, value, opts2) => {
      this.form.replaceFieldValue(this.name, index, value, opts2);
      this.triggerOnChangeListener();
    };
    this.removeValue = (index, opts2) => {
      this.form.removeFieldValue(this.name, index, opts2);
      this.triggerOnChangeListener();
    };
    this.swapValues = (aIndex, bIndex, opts2) => {
      this.form.swapFieldValues(this.name, aIndex, bIndex, opts2);
      this.triggerOnChangeListener();
    };
    this.moveValue = (aIndex, bIndex, opts2) => {
      this.form.moveFieldValues(this.name, aIndex, bIndex, opts2);
      this.triggerOnChangeListener();
    };
    this.clearValues = (opts2) => {
      this.form.clearFieldValues(this.name, opts2);
      this.triggerOnChangeListener();
    };
    this.getLinkedFields = (cause) => {
      const fields = Object.values(this.form.fieldInfo);
      const linkedFields = [];
      for (const field of fields) {
        if (!field.instance) continue;
        const { onChangeListenTo, onBlurListenTo } = field.instance.options.validators || {};
        if (cause === "change" && (onChangeListenTo == null ? void 0 : onChangeListenTo.includes(this.name))) {
          linkedFields.push(field.instance);
        }
        if (cause === "blur" && (onBlurListenTo == null ? void 0 : onBlurListenTo.includes(this.name))) {
          linkedFields.push(field.instance);
        }
      }
      return linkedFields;
    };
    this.validateSync = (cause, errorFromForm) => {
      var _a;
      const validates = getSyncValidatorArray(cause, {
        ...this.options,
        form: this.form,
        validationLogic: this.form.options.validationLogic || defaultValidationLogic
      });
      const linkedFields = this.getLinkedFields(cause);
      const linkedFieldValidates = linkedFields.reduce(
        (acc, field) => {
          const fieldValidates = getSyncValidatorArray(cause, {
            ...field.options,
            form: field.form,
            validationLogic: field.form.options.validationLogic || defaultValidationLogic
          });
          fieldValidates.forEach((validate) => {
            validate.field = field;
          });
          return acc.concat(fieldValidates);
        },
        []
      );
      let hasErrored = false;
      batch(() => {
        const validateFieldFn = (field, validateObj) => {
          var _a2;
          const errorMapKey = getErrorMapKey(validateObj.cause);
          const fieldLevelError = validateObj.validate ? normalizeError(
            field.runValidator({
              validate: validateObj.validate,
              value: {
                value: field.store.state.value,
                validationSource: "field",
                fieldApi: field
              },
              type: "validate"
            })
          ) : void 0;
          const formLevelError = errorFromForm[errorMapKey];
          const { newErrorValue, newSource } = determineFieldLevelErrorSourceAndValue({
            formLevelError,
            fieldLevelError
          });
          if (((_a2 = field.state.meta.errorMap) == null ? void 0 : _a2[errorMapKey]) !== newErrorValue) {
            field.setMeta((prev) => ({
              ...prev,
              errorMap: {
                ...prev.errorMap,
                [errorMapKey]: newErrorValue
              },
              errorSourceMap: {
                ...prev.errorSourceMap,
                [errorMapKey]: newSource
              }
            }));
          }
          if (newErrorValue) {
            hasErrored = true;
          }
        };
        for (const validateObj of validates) {
          validateFieldFn(this, validateObj);
        }
        for (const fieldValitateObj of linkedFieldValidates) {
          if (!fieldValitateObj.validate) continue;
          validateFieldFn(fieldValitateObj.field, fieldValitateObj);
        }
      });
      const submitErrKey = getErrorMapKey("submit");
      if (
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        ((_a = this.state.meta.errorMap) == null ? void 0 : _a[submitErrKey]) && cause !== "submit" && !hasErrored
      ) {
        this.setMeta((prev) => ({
          ...prev,
          errorMap: {
            ...prev.errorMap,
            [submitErrKey]: void 0
          },
          errorSourceMap: {
            ...prev.errorSourceMap,
            [submitErrKey]: void 0
          }
        }));
      }
      return { hasErrored };
    };
    this.validateAsync = async (cause, formValidationResultPromise) => {
      const validates = getAsyncValidatorArray(cause, {
        ...this.options,
        form: this.form,
        validationLogic: this.form.options.validationLogic || defaultValidationLogic
      });
      const asyncFormValidationResults = await formValidationResultPromise;
      const linkedFields = this.getLinkedFields(cause);
      const linkedFieldValidates = linkedFields.reduce(
        (acc, field) => {
          const fieldValidates = getAsyncValidatorArray(cause, {
            ...field.options,
            form: field.form,
            validationLogic: field.form.options.validationLogic || defaultValidationLogic
          });
          fieldValidates.forEach((validate) => {
            validate.field = field;
          });
          return acc.concat(fieldValidates);
        },
        []
      );
      if (!this.state.meta.isValidating) {
        this.setMeta((prev) => ({ ...prev, isValidating: true }));
      }
      for (const linkedField of linkedFields) {
        linkedField.setMeta((prev) => ({ ...prev, isValidating: true }));
      }
      const validatesPromises = [];
      const linkedPromises = [];
      const validateFieldAsyncFn = (field, validateObj, promises) => {
        const errorMapKey = getErrorMapKey(validateObj.cause);
        const fieldValidatorMeta = field.getInfo().validationMetaMap[errorMapKey];
        fieldValidatorMeta == null ? void 0 : fieldValidatorMeta.lastAbortController.abort();
        const controller = new AbortController();
        this.getInfo().validationMetaMap[errorMapKey] = {
          lastAbortController: controller
        };
        promises.push(
          new Promise(async (resolve) => {
            var _a;
            let rawError;
            try {
              rawError = await new Promise((rawResolve, rawReject) => {
                if (this.timeoutIds.validations[validateObj.cause]) {
                  clearTimeout(this.timeoutIds.validations[validateObj.cause]);
                }
                this.timeoutIds.validations[validateObj.cause] = setTimeout(
                  async () => {
                    if (controller.signal.aborted) return rawResolve(void 0);
                    try {
                      rawResolve(
                        await this.runValidator({
                          validate: validateObj.validate,
                          value: {
                            value: field.store.state.value,
                            fieldApi: field,
                            signal: controller.signal,
                            validationSource: "field"
                          },
                          type: "validateAsync"
                        })
                      );
                    } catch (e) {
                      rawReject(e);
                    }
                  },
                  validateObj.debounceMs
                );
              });
            } catch (e) {
              rawError = e;
            }
            if (controller.signal.aborted) return resolve(void 0);
            const fieldLevelError = normalizeError(rawError);
            const formLevelError = (_a = asyncFormValidationResults[this.name]) == null ? void 0 : _a[errorMapKey];
            const { newErrorValue, newSource } = determineFieldLevelErrorSourceAndValue({
              formLevelError,
              fieldLevelError
            });
            field.setMeta((prev) => {
              return {
                ...prev,
                errorMap: {
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  ...prev == null ? void 0 : prev.errorMap,
                  [errorMapKey]: newErrorValue
                },
                errorSourceMap: {
                  ...prev.errorSourceMap,
                  [errorMapKey]: newSource
                }
              };
            });
            resolve(newErrorValue);
          })
        );
      };
      for (const validateObj of validates) {
        if (!validateObj.validate) continue;
        validateFieldAsyncFn(this, validateObj, validatesPromises);
      }
      for (const fieldValitateObj of linkedFieldValidates) {
        if (!fieldValitateObj.validate) continue;
        validateFieldAsyncFn(
          fieldValitateObj.field,
          fieldValitateObj,
          linkedPromises
        );
      }
      let results = [];
      if (validatesPromises.length || linkedPromises.length) {
        results = await Promise.all(validatesPromises);
        await Promise.all(linkedPromises);
      }
      this.setMeta((prev) => ({ ...prev, isValidating: false }));
      for (const linkedField of linkedFields) {
        linkedField.setMeta((prev) => ({ ...prev, isValidating: false }));
      }
      return results.filter(Boolean);
    };
    this.validate = (cause, opts2) => {
      var _a, _b;
      if (!this.state.meta.isTouched) return [];
      const { fieldsErrorMap } = (opts2 == null ? void 0 : opts2.skipFormValidation) ? { fieldsErrorMap: {} } : this.form.validateSync(cause);
      const { hasErrored } = this.validateSync(
        cause,
        (_a = fieldsErrorMap[this.name]) != null ? _a : {}
      );
      if (hasErrored && !this.options.asyncAlways) {
        (_b = this.getInfo().validationMetaMap[getErrorMapKey(cause)]) == null ? void 0 : _b.lastAbortController.abort();
        return this.state.meta.errors;
      }
      const formValidationResultPromise = (opts2 == null ? void 0 : opts2.skipFormValidation) ? Promise.resolve({}) : this.form.validateAsync(cause);
      return this.validateAsync(cause, formValidationResultPromise);
    };
    this.handleChange = (updater) => {
      this.setValue(updater);
    };
    this.handleBlur = () => {
      const prevTouched = this.state.meta.isTouched;
      if (!prevTouched) {
        this.setMeta((prev) => ({ ...prev, isTouched: true }));
      }
      if (!this.state.meta.isBlurred) {
        this.setMeta((prev) => ({ ...prev, isBlurred: true }));
      }
      this.validate("blur");
      this.triggerOnBlurListener();
    };
    this.parseValueWithSchema = (schema) => {
      return standardSchemaValidators.validate(
        { value: this.state.value, validationSource: "field" },
        schema
      );
    };
    this.parseValueWithSchemaAsync = (schema) => {
      return standardSchemaValidators.validateAsync(
        { value: this.state.value, validationSource: "field" },
        schema
      );
    };
    this.form = opts.form;
    this.name = opts.name;
    this.timeoutIds = {
      validations: {},
      listeners: {},
      formListeners: {}
    };
    this.store = new Derived({
      deps: [this.form.store],
      fn: () => {
        var _a;
        const value = this.form.getFieldValue(this.name);
        const meta = (_a = this.form.getFieldMeta(this.name)) != null ? _a : {
          ...defaultFieldMeta,
          ...opts.defaultMeta
        };
        return {
          value,
          meta
        };
      }
    });
    this.options = opts;
  }
  /**
   * The current field state.
   */
  get state() {
    return this.store.state;
  }
  /**
   * @private
   */
  runValidator(props) {
    if (isStandardSchemaValidator(props.validate)) {
      return standardSchemaValidators[props.type](
        props.value,
        props.validate
      );
    }
    return props.validate(props.value);
  }
  /**
   * Updates the field's errorMap
   */
  setErrorMap(errorMap) {
    this.setMeta((prev) => ({
      ...prev,
      errorMap: {
        ...prev.errorMap,
        ...errorMap
      }
    }));
  }
  triggerOnBlurListener() {
    var _a, _b, _c, _d, _e, _f;
    const formDebounceMs = (_a = this.form.options.listeners) == null ? void 0 : _a.onBlurDebounceMs;
    if (formDebounceMs && formDebounceMs > 0) {
      if (this.timeoutIds.formListeners.blur) {
        clearTimeout(this.timeoutIds.formListeners.blur);
      }
      this.timeoutIds.formListeners.blur = setTimeout(() => {
        var _a2, _b2;
        (_b2 = (_a2 = this.form.options.listeners) == null ? void 0 : _a2.onBlur) == null ? void 0 : _b2.call(_a2, {
          formApi: this.form,
          fieldApi: this
        });
      }, formDebounceMs);
    } else {
      (_c = (_b = this.form.options.listeners) == null ? void 0 : _b.onBlur) == null ? void 0 : _c.call(_b, {
        formApi: this.form,
        fieldApi: this
      });
    }
    const fieldDebounceMs = (_d = this.options.listeners) == null ? void 0 : _d.onBlurDebounceMs;
    if (fieldDebounceMs && fieldDebounceMs > 0) {
      if (this.timeoutIds.listeners.blur) {
        clearTimeout(this.timeoutIds.listeners.blur);
      }
      this.timeoutIds.listeners.blur = setTimeout(() => {
        var _a2, _b2;
        (_b2 = (_a2 = this.options.listeners) == null ? void 0 : _a2.onBlur) == null ? void 0 : _b2.call(_a2, {
          value: this.state.value,
          fieldApi: this
        });
      }, fieldDebounceMs);
    } else {
      (_f = (_e = this.options.listeners) == null ? void 0 : _e.onBlur) == null ? void 0 : _f.call(_e, {
        value: this.state.value,
        fieldApi: this
      });
    }
  }
  triggerOnChangeListener() {
    var _a, _b, _c, _d, _e, _f;
    const formDebounceMs = (_a = this.form.options.listeners) == null ? void 0 : _a.onChangeDebounceMs;
    if (formDebounceMs && formDebounceMs > 0) {
      if (this.timeoutIds.formListeners.change) {
        clearTimeout(this.timeoutIds.formListeners.change);
      }
      this.timeoutIds.formListeners.change = setTimeout(() => {
        var _a2, _b2;
        (_b2 = (_a2 = this.form.options.listeners) == null ? void 0 : _a2.onChange) == null ? void 0 : _b2.call(_a2, {
          formApi: this.form,
          fieldApi: this
        });
      }, formDebounceMs);
    } else {
      (_c = (_b = this.form.options.listeners) == null ? void 0 : _b.onChange) == null ? void 0 : _c.call(_b, {
        formApi: this.form,
        fieldApi: this
      });
    }
    const fieldDebounceMs = (_d = this.options.listeners) == null ? void 0 : _d.onChangeDebounceMs;
    if (fieldDebounceMs && fieldDebounceMs > 0) {
      if (this.timeoutIds.listeners.change) {
        clearTimeout(this.timeoutIds.listeners.change);
      }
      this.timeoutIds.listeners.change = setTimeout(() => {
        var _a2, _b2;
        (_b2 = (_a2 = this.options.listeners) == null ? void 0 : _a2.onChange) == null ? void 0 : _b2.call(_a2, {
          value: this.state.value,
          fieldApi: this
        });
      }, fieldDebounceMs);
    } else {
      (_f = (_e = this.options.listeners) == null ? void 0 : _e.onChange) == null ? void 0 : _f.call(_e, {
        value: this.state.value,
        fieldApi: this
      });
    }
  }
}
function normalizeError(rawError) {
  if (rawError) {
    return rawError;
  }
  return void 0;
}
function getErrorMapKey(cause) {
  switch (cause) {
    case "submit":
      return "onSubmit";
    case "blur":
      return "onBlur";
    case "mount":
      return "onMount";
    case "server":
      return "onServer";
    case "dynamic":
      return "onDynamic";
    case "change":
    default:
      return "onChange";
  }
}
var withSelector = { exports: {} };
var withSelector_production = {};
var shim = { exports: {} };
var useSyncExternalStoreShim_production = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredUseSyncExternalStoreShim_production;
function requireUseSyncExternalStoreShim_production() {
  if (hasRequiredUseSyncExternalStoreShim_production) return useSyncExternalStoreShim_production;
  hasRequiredUseSyncExternalStoreShim_production = 1;
  var React = React__default;
  React.useState; React.useEffect; React.useLayoutEffect; React.useDebugValue;
  function useSyncExternalStore$1(subscribe, getSnapshot) {
    return getSnapshot();
  }
  var shim2 = useSyncExternalStore$1 ;
  useSyncExternalStoreShim_production.useSyncExternalStore = void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim2;
  return useSyncExternalStoreShim_production;
}
var hasRequiredShim;
function requireShim() {
  if (hasRequiredShim) return shim.exports;
  hasRequiredShim = 1;
  {
    shim.exports = requireUseSyncExternalStoreShim_production();
  }
  return shim.exports;
}
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredWithSelector_production;
function requireWithSelector_production() {
  if (hasRequiredWithSelector_production) return withSelector_production;
  hasRequiredWithSelector_production = 1;
  var React = React__default, shim2 = requireShim();
  function is(x, y) {
    return x === y && (0 !== x || 1 / x === 1 / y) || x !== x && y !== y;
  }
  var objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore = shim2.useSyncExternalStore, useRef = React.useRef, useEffect2 = React.useEffect, useMemo2 = React.useMemo, useDebugValue = React.useDebugValue;
  withSelector_production.useSyncExternalStoreWithSelector = function(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
    var instRef = useRef(null);
    if (null === instRef.current) {
      var inst = { hasValue: false, value: null };
      instRef.current = inst;
    } else inst = instRef.current;
    instRef = useMemo2(
      function() {
        function memoizedSelector(nextSnapshot) {
          if (!hasMemo) {
            hasMemo = true;
            memoizedSnapshot = nextSnapshot;
            nextSnapshot = selector(nextSnapshot);
            if (void 0 !== isEqual && inst.hasValue) {
              var currentSelection = inst.value;
              if (isEqual(currentSelection, nextSnapshot))
                return memoizedSelection = currentSelection;
            }
            return memoizedSelection = nextSnapshot;
          }
          currentSelection = memoizedSelection;
          if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
          var nextSelection = selector(nextSnapshot);
          if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))
            return memoizedSnapshot = nextSnapshot, currentSelection;
          memoizedSnapshot = nextSnapshot;
          return memoizedSelection = nextSelection;
        }
        var hasMemo = false, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
        return [
          function() {
            return memoizedSelector(getSnapshot());
          },
          null === maybeGetServerSnapshot ? void 0 : function() {
            return memoizedSelector(maybeGetServerSnapshot());
          }
        ];
      },
      [getSnapshot, getServerSnapshot, selector, isEqual]
    );
    var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
    useEffect2(
      function() {
        inst.hasValue = true;
        inst.value = value;
      },
      [value]
    );
    useDebugValue(value);
    return value;
  };
  return withSelector_production;
}
var hasRequiredWithSelector;
function requireWithSelector() {
  if (hasRequiredWithSelector) return withSelector.exports;
  hasRequiredWithSelector = 1;
  {
    withSelector.exports = requireWithSelector_production();
  }
  return withSelector.exports;
}
var withSelectorExports = requireWithSelector();
function useStore(store, selector = (d) => d) {
  const slice = withSelectorExports.useSyncExternalStoreWithSelector(
    store.subscribe,
    () => store.state,
    () => store.state,
    selector,
    shallow
  );
  return slice;
}
function shallow(objA, objB) {
  if (Object.is(objA, objB)) {
    return true;
  }
  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }
  if (objA instanceof Map && objB instanceof Map) {
    if (objA.size !== objB.size) return false;
    for (const [k, v] of objA) {
      if (!objB.has(k) || !Object.is(v, objB.get(k))) return false;
    }
    return true;
  }
  if (objA instanceof Set && objB instanceof Set) {
    if (objA.size !== objB.size) return false;
    for (const v of objA) {
      if (!objB.has(v)) return false;
    }
    return true;
  }
  if (objA instanceof Date && objB instanceof Date) {
    if (objA.getTime() !== objB.getTime()) return false;
    return true;
  }
  const keysA = Object.keys(objA);
  if (keysA.length !== Object.keys(objB).length) {
    return false;
  }
  for (let i = 0; i < keysA.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }
  return true;
}
const useIsomorphicLayoutEffect = useEffect;
function useField(opts) {
  const [fieldApi] = useState(() => {
    const api = new FieldApi({
      ...opts,
      form: opts.form,
      name: opts.name
    });
    const extendedApi = api;
    extendedApi.Field = Field;
    return extendedApi;
  });
  useIsomorphicLayoutEffect(fieldApi.mount, [fieldApi]);
  useIsomorphicLayoutEffect(() => {
    fieldApi.update(opts);
  });
  useStore(
    fieldApi.store,
    opts.mode === "array" ? (state) => {
      var _a;
      return [
        state.meta,
        Object.keys((_a = state.value) != null ? _a : []).length
      ];
    } : void 0
  );
  return fieldApi;
}
const Field = ({
  children,
  ...fieldOptions
}) => {
  const fieldApi = useField(fieldOptions);
  const jsxToDisplay = useMemo(
    () => functionalUpdate(children, fieldApi),
    /**
     * The reason this exists is to fix an issue with the React Compiler.
     * Namely, functionalUpdate is memoized where it checks for `fieldApi`, which is a static type.
     * This means that when `state.value` changes, it does not trigger a re-render. The useMemo explicitly fixes this problem
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [children, fieldApi, fieldApi.state.value, fieldApi.state.meta]
  );
  return /* @__PURE__ */ jsx(Fragment, { children: jsxToDisplay });
};
function LocalSubscribe({
  form,
  selector,
  children
}) {
  const data = useStore(form.store, selector);
  return functionalUpdate(children, data);
}
function useForm(opts) {
  const [formApi] = useState(() => {
    const api = new FormApi(opts);
    const extendedApi = api;
    extendedApi.Field = function APIField(props) {
      return /* @__PURE__ */ jsx(Field, { ...props, form: api });
    };
    extendedApi.Subscribe = function Subscribe(props) {
      return /* @__PURE__ */ jsx(
        LocalSubscribe,
        {
          form: api,
          selector: props.selector,
          children: props.children
        }
      );
    };
    return extendedApi;
  });
  useIsomorphicLayoutEffect(formApi.mount, []);
  useIsomorphicLayoutEffect(() => {
    formApi.update(opts);
  });
  return formApi;
}

export { Label as L, useForm as u };
//# sourceMappingURL=useForm-CSs12aQO.mjs.map
