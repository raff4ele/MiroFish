(() => {
  const addStyle = (href) => { const l=document.createElement('link'); l.rel='stylesheet'; l.href=href; document.head.appendChild(l); };
  addStyle('https://cdn.jsdelivr.net/gh/raff4ele/MiroFish@5b64520c8bd33a90021edd8d8d336bca0b69e614/entra-prima/revamp.css');
  addStyle('https://cdn.jsdelivr.net/gh/raff4ele/MiroFish@5b64520c8bd33a90021edd8d8d336bca0b69e614/entra-prima/mobile-fix.css');
  const s=document.createElement('script');
  s.src='https://cdn.jsdelivr.net/gh/raff4ele/MiroFish@2b3a9f00269c4523aaa36ca968483c9bac58f2fe/entra-prima/script.js';
  s.defer=true;
  document.head.appendChild(s);
})();
