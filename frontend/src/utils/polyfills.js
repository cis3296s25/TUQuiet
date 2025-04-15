// Node.js polyfill
if (typeof window !== 'undefined') {
  window.global = window;
  window.process = { env: {} };
  window.Buffer = {};
}

export default {}; 