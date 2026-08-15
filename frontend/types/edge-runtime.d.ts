// Type declarations specific to Vercel Edge Runtime
/// <reference types="@vercel/edge" />

declare namespace EdgeRuntime {
  interface RequestInit {}
  interface ResponseInit {}
  interface FetchEvent {}
}

// Global scope extensions for Edge Runtime
declare const EdgeRuntime: 'edge';

// Edge Runtime specific APIs
interface ReadableStreamBYOBReader {}
interface ReadableStreamDefaultReader {}
interface WritableStreamDefaultWriter {}