if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(s[o])return;let l={};const a=e=>n(e,o),t={module:{uri:o},exports:l,require:a};s[o]=Promise.all(i.map((e=>t[e]||a(e)))).then((e=>(r(...e),l)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.clientsClaim(),e.precacheAndRoute([{url:"apple-touch-icon-180x180.png",revision:"c602778fd931835fe9b8b4d33abb5138"},{url:"assets/apple-BE9JdhUw.mp3",revision:null},{url:"assets/bonus-D4UAjnNn.mp3",revision:null},{url:"assets/index-C36o0e9I.js",revision:null},{url:"assets/index-D-gQoQ7r.css",revision:null},{url:"assets/swipe-to-move-BmaLagW_.png",revision:null},{url:"assets/theme-qFkg0tJG.mp3",revision:null},{url:"assets/wasd-BfY5DoZf.png",revision:null},{url:"favicon.ico",revision:"29144f51934b3569b711a1e3b9dd11ba"},{url:"favicon.svg",revision:"419b4fb98eecd40ce03e97fb72121574"},{url:"index.html",revision:"757686f315d6deef0c7d789376ee6e92"},{url:"maskable-icon-512x512.png",revision:"6ca78240464d8a68b95bbd6e374edec2"},{url:"pwa-192x192.png",revision:"232d1b1920379aa9cc8aa40b362f4245"},{url:"pwa-512x512.png",revision:"9beae5320ab3b1c814cdf867900aa682"},{url:"pwa-64x64.png",revision:"a4d452370655fa4665e1f7d442f39aab"},{url:"pwa-192x192.png",revision:"be677ae3adfa92551eb3c95648e74d42"},{url:"pwa-512x512.png",revision:"639fa0278e9cbbe9f406ed7881002122"},{url:"manifest.webmanifest",revision:"af9e035cd6ac9cff642bfcda0d734574"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
