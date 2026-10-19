/* LUNELLE shared demo cart. Data stays in this browser; orders are sent to WhatsApp for confirmation. */
(() => {
  const KEY='lunelle_demo_cart_v1';
  const get=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}};
  const save=items=>{localStorage.setItem(KEY,JSON.stringify(items));window.dispatchEvent(new CustomEvent('lunelle:cartchange',{detail:items}));};
  const count=()=>get().reduce((n,p)=>n+(Number(p.qty)||0),0);
  const money=n=>`${Number(n||0).toLocaleString('en-US')} RWF`;
  const add=(product,qty=1)=>{const items=get(),found=items.find(p=>p.id===product.id);if(found)found.qty=Math.min(99,found.qty+qty);else items.push({...product,qty:Math.min(99,Math.max(1,qty))});save(items);return items;};
  const update=(id,qty)=>{let items=get();items=qty<=0?items.filter(p=>p.id!==id):items.map(p=>p.id===id?{...p,qty:Math.min(99,Math.max(1,qty))}:p);save(items);return items;};
  const clear=()=>save([]);
  const refresh=()=>{const el=document.getElementById('cart-count');if(el)el.textContent=count();};
  document.addEventListener('DOMContentLoaded',()=>{refresh();document.getElementById('cart-button')?.addEventListener('click',()=>{location.href='cart.html'});document.getElementById('menu-toggle')?.addEventListener('click',()=>document.getElementById('main-nav')?.classList.toggle('open'));document.querySelector('.announcement-close')?.addEventListener('click',()=>document.querySelector('.announcement')?.remove());});
  window.addEventListener('lunelle:cartchange',refresh);
  window.LUNELLECart={get,save,count,money,add,update,clear,refresh};
})();
