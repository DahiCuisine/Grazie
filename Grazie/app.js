
function dahiNormalizeStaffRole(role) {
  return role === "staff" ? "staff" : role;
}

function saveCreditDebitCard() {
  const user = JSON.parse(localStorage.getItem("dahiCurrentUser") || "null");
  if (!user || user.role !== "customer") return;
  let bank = document.getElementById("paymentBank")?.value.trim();
  if (bank === "Mastercard") bank = "MasterCard";
  const name = document.getElementById("paymentName")?.value.trim();
  const card = document.getElementById("paymentCard")?.value.trim();
  const expiry = document.getElementById("paymentExpiry")?.value.trim();
  const zip = document.getElementById("paymentZip")?.value.trim();
  if (!bank || !name || !card || !expiry || !zip) return alert("Please select a card network or bank and complete the cardholder name, card number, expiry and billing ZIP.");
  const users = JSON.parse(localStorage.getItem("dahiUsers") || "[]");
  const idx = users.findIndex(u => u.id === user.id);
  if (idx < 0) return;
  users[idx].cardWallet = { bank, name, card, expiry, zip, savedAt: new Date().toISOString() };
  localStorage.setItem("dahiUsers", JSON.stringify(users));
  localStorage.setItem("dahiCurrentUser", JSON.stringify({...user, cardWallet: users[idx].cardWallet}));
  document.getElementById("paymentBank").value=bank;
  document.getElementById("paymentName").value=name;
  document.getElementById("paymentCard").value=card;
  document.getElementById("paymentExpiry").value=expiry;
  document.getElementById("paymentZip").value=zip;
  renderSavedCard(users[idx]);
  alert("Credit and debit card saved.");
}

function renderSavedCard(userArg) {
  const box = document.getElementById("savedCard");
  if (!box) return;
  const user = userArg || JSON.parse(localStorage.getItem("dahiCurrentUser") || "null");
  const card = user?.cardWallet;
  box.innerHTML = card
    ? `<div class="saved-wallet"><div><strong>${card.bank || "Credit and Debit Card"}</strong><span>•••• ${String(card.card).replace(/\s/g,"").slice(-4)}</span><small>${card.name} · Expires ${card.expiry}</small></div><button type="button" id="removeSavedCard" class="btn btn-secondary btn-small">Remove</button></div>`
    : '<p class="muted">No saved credit or debit card yet.</p>';
  document.getElementById("removeSavedCard")?.addEventListener("click", () => {
    const u = JSON.parse(localStorage.getItem("dahiCurrentUser") || "null");
    if (!u) return;
    const users = JSON.parse(localStorage.getItem("dahiUsers") || "[]");
    const idx = users.findIndex(x => x.id === u.id);
    if (idx < 0) return;
    delete users[idx].cardWallet;
    localStorage.setItem("dahiUsers", JSON.stringify(users));
    localStorage.setItem("dahiCurrentUser", JSON.stringify({...u, cardWallet: undefined}));
    document.getElementById("paymentBank").value = "";
    document.getElementById("paymentName").value = "";
    document.getElementById("paymentCard").value = "";
    document.getElementById("paymentExpiry").value = "";
    document.getElementById("paymentZip").value = "";
    renderSavedCard(users[idx]);
  });
}

function dahiSaveWallet() {
  const user = JSON.parse(localStorage.getItem("dahiCurrentUser") || "null");
  if (!user || user.role !== "customer") return;
  const provider = document.getElementById("walletProvider")?.value;
  const account = document.getElementById("walletAccount")?.value.trim();
  if (!provider || !account) return alert("Choose a payment provider and enter the account or mobile/email.");
  const users = JSON.parse(localStorage.getItem("dahiUsers") || "[]");
  const idx = users.findIndex(u => u.id === user.id);
  if (idx < 0) return;
  users[idx].wallets = users[idx].wallets || [];
  users[idx].wallets = users[idx].wallets.filter(w => w.provider !== provider);
  users[idx].wallets.push({ provider, account, savedAt: new Date().toISOString() });
  localStorage.setItem("dahiUsers", JSON.stringify(users));
  localStorage.setItem("dahiCurrentUser", JSON.stringify({...user, wallets: users[idx].wallets}));
  renderSavedWallets();
  alert("Payment wallet saved.");
}

function renderSavedWallets() {
  const box = document.getElementById("savedWallets");
  if (!box) return;
  const user = JSON.parse(localStorage.getItem("dahiCurrentUser") || "null");
  const wallets = user?.wallets || [];
  box.innerHTML = wallets.length ? wallets.map((w,i) =>
    `<div class="saved-wallet"><strong>${w.provider}</strong><span>${w.account}</span><button type="button" data-wallet-index="${i}" class="btn btn-secondary btn-small">Remove</button></div>`
  ).join("") : '<p class="muted">No saved payment wallets yet.</p>';
  box.querySelectorAll("[data-wallet-index]").forEach(btn => btn.addEventListener("click", () => {
    const idx = Number(btn.dataset.walletIndex);
    const u = JSON.parse(localStorage.getItem("dahiCurrentUser") || "null");
    if (!u) return;
    const users = JSON.parse(localStorage.getItem("dahiUsers") || "[]");
    const ui = users.findIndex(x => x.id === u.id);
    if (ui < 0) return;
    const removed = users[ui].wallets?.[idx];
    users[ui].wallets.splice(idx,1);
    localStorage.setItem("dahiUsers", JSON.stringify(users));
    localStorage.setItem("dahiCurrentUser", JSON.stringify({...u, wallets: users[ui].wallets}));
    renderSavedWallets();
  }));
}

const TAX_DEFAULT = 0.0825;
const MENU = [
 {id:"pesto-salmon-pasta",name:"Pesto Salmon Pasta",cat:"Pastas",price:796,image:"assets/images/pesto-salmon-pasta.jpg",emoji:"🍝",desc:"250g • Salmon pasta tossed in pesto."},
 {id:"shrimp-aglio-olio",name:"Shrimp Aglio Olio",cat:"Pastas",price:585,image:"assets/images/shrimp-aglio-olio.jpg",emoji:"🍤",desc:"200g • Shrimp with garlic, olive oil and pasta."},
 {id:"chicken-parmigiana",name:"Chicken Parmigianna",cat:"Pastas",price:699,image:"assets/images/chicken-parmigiana.jpg",emoji:"🍗",desc:"300g • Chicken parmigiana served with pasta."},
 {id:"alfredo-pasta",name:"Alfredo Pasta",cat:"Pastas",price:450,image:"assets/images/alfredo-pasta.jpg",emoji:"🍝",desc:"200g • Creamy Alfredo pasta."},
 {id:"angel-hair-pomodoro",name:"Angel Hair Pomodoro",cat:"Pastas",price:400,image:"assets/images/angel-hair-pomodoro.jpg",emoji:"🍝",desc:"200g • Angel hair pasta with tomato pomodoro sauce."},

 {id:"margharita-pizza",name:"Margharita Pizza",cat:"Pizzas",price:580,image:"assets/images/margharita-pizza.jpg",emoji:"🍕",desc:"12 inch • Classic tomato, cheese and basil pizza."},
 {id:"truffle-mushroom-pizza",name:"Truffle and Mushroom Pizza",cat:"Pizzas",price:889,image:"assets/images/truffle-mushroom-pizza.jpg",emoji:"🍕",desc:"12 inch • Truffle and mushroom pizza."},
 {id:"creamy-spinach-creamcheese",name:"Creamy Spinach Creamcheese",cat:"Pizzas",price:799,image:"assets/images/creamy-spinach-creamcheese.jpg",emoji:"🍕",desc:"12 inch • Creamy spinach and cream cheese pizza."},
 {id:"quatro-staggoni-pizza",name:"Quatro Staggoni Pizza",cat:"Pizzas",price:659,image:"assets/images/quatro-staggoni-pizza.jpg",emoji:"🍕",desc:"12 inch • Four-season style pizza."},
 {id:"quatro-carne-pizza",name:"Quatro Carne Pizza",cat:"Pizzas",price:700,image:"assets/images/quatro-carne-pizza.jpg",emoji:"🍕",desc:"12 inch • Four-meat pizza."},

 {id:"cesar-salad",name:"Cesar Salad",cat:"All Night All Yours",price:400,image:"assets/images/cesar-salad.jpg",emoji:"🥗",desc:"150g • Included in the All Night All Yours selection for ₱400."},
 {id:"pepperoni-pizetta",name:"Pepperoni Pizetta",cat:"All Night All Yours",price:400,image:"assets/images/pepperoni-pizetta.jpg",emoji:"🍕",desc:"80g • Included in the All Night All Yours selection for ₱400."},
 {id:"chicken-fingers",name:"Chicken Fingers w/ Mustard Sauce",cat:"All Night All Yours",price:400,image:"assets/images/chicken-fingers.jpg",emoji:"🍗",desc:"190g • Included in the All Night All Yours selection for ₱400."},
 {id:"bbq-spare-ribs",name:"BBQ Spare Ribs w/ Mashed Potato",cat:"All Night All Yours",price:400,image:"assets/images/bbq-spare-ribs.jpg",emoji:"🍖",desc:"All Night All Yours • ₱400."},
 {id:"adobo-garlic-rice",name:"Adobo Garlic Rice",cat:"All Night All Yours",price:400,image:"assets/images/adobo-garlic-rice.jpg",emoji:"🍚",desc:"All Night All Yours • ₱400."},
 {id:"grilled-pork-loin",name:"Grilled Pork Loin",cat:"All Night All Yours",price:400,image:"assets/images/grilled-pork-loin.jpg",emoji:"🥩",desc:"All Night All Yours • ₱400."},
 {id:"house-blend-iced-tea",name:"House Blend Iced Tea",cat:"All Night All Yours",price:400,image:"assets/images/house-blend-iced-tea.jpg",emoji:"🧋",desc:"300 ml • All Night All Yours selection for ₱400."},
 {id:"bottomless-iced-tea",name:"Bottomless Iced Tea",cat:"All Night All Yours",price:50,image:"assets/images/bottomless-iced-tea.jpg",emoji:"🥤",desc:"Bottomless iced tea • Add ₱50."}
];
const COUPONS = {WELCOME10:{type:"percent",value:10},GRAZIE5:{type:"fixed",value:5,min:30},PICKUP15:{type:"percent",value:15,orderType:"pickup"}};

function getSettings(){const s=JSON.parse(localStorage.getItem("dahiSettings")||"null"); return s ? {...s,name:"GRAZIE",currency:"₱"} : {tax:TAX_DEFAULT,name:"GRAZIE",currency:"₱"}}
function getCart(){
 const cart=JSON.parse(localStorage.getItem("dahiCart")||"[]");
 const validIds=new Set(MENU.map(x=>x.id));
 const filtered=cart.filter(x=>validIds.has(x.id));
 if(filtered.length!==cart.length)localStorage.setItem("dahiCart",JSON.stringify(filtered));
 return filtered;
}
function setCart(c){localStorage.setItem("dahiCart",JSON.stringify(c));renderCartCount()}
function money(n){return `${getSettings().currency}${Number(n).toFixed(2)}`}
function currentUser(){return JSON.parse(localStorage.getItem("dahiCurrentUser")||"null")}
function currentStaff(){return JSON.parse(localStorage.getItem("dahiStaff")||"null")}
function initMobileNavigation(){
  document.querySelectorAll(".nav-toggle").forEach(toggle=>{
    if(toggle.dataset.mobileReady) return;
    toggle.dataset.mobileReady="1";
    const nav=toggle.parentElement?.querySelector(".main-nav");
    if(!nav) return;
    const close=()=>{
      nav.classList.remove("mobile-open");
      toggle.setAttribute("aria-expanded","false");
      toggle.setAttribute("aria-label","Open navigation");
      toggle.textContent="☰";
    };
    const open=()=>{
      nav.classList.add("mobile-open");
      toggle.setAttribute("aria-expanded","true");
      toggle.setAttribute("aria-label","Close navigation");
      toggle.textContent="×";
    };
    toggle.addEventListener("click",()=>nav.classList.contains("mobile-open")?close():open());
    nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",close));
    nav.querySelectorAll("button").forEach(btn=>{
      if(btn !== toggle) btn.addEventListener("click",()=>setTimeout(close,100));
    });
    document.addEventListener("click",e=>{
      if(!nav.classList.contains("mobile-open")) return;
      if(!toggle.contains(e.target) && !nav.contains(e.target)) close();
    });
    document.addEventListener("keydown",e=>{if(e.key==="Escape") close()});
  });
}

function setupRoleAccountLinks(){
  const staff=currentStaff();
  const user=currentUser();
  document.querySelectorAll('a[href="account.html"], a[data-account-link], #accountLink').forEach(link=>{
    if(staff && (staff.role === "admin" || staff.role === "staff")){
      link.textContent="Account";
      link.href="admin.html";
    } else if(user){
      link.textContent=link.id === "accountLink" ? `Hi, ${String(user.name || "Customer").split(" ")[0]}` : "Account";
      link.href="account.html";
    } else {
      if(link.id === "accountLink") link.textContent="Log in / Sign up";
      else link.textContent="Account";
      link.href="account.html";
    }
  });
}
function toast(msg){const el=document.getElementById("toast");if(!el)return;el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200)}
function ensureOrderModal(){
 if(document.getElementById("orderModal")) return;
 document.body.insertAdjacentHTML("beforeend",`<div class="order-modal" id="orderModal" aria-hidden="true"><div class="order-modal-backdrop" data-modal-close></div><div class="order-modal-card" role="dialog" aria-modal="true" aria-labelledby="orderModalTitle"><button class="order-modal-close" type="button" data-modal-close aria-label="Close">×</button><div id="orderModalContent"></div></div></div>`);
 document.querySelectorAll("#orderModal [data-modal-close]").forEach(el=>el.addEventListener("click",closeOrderModal));
}
function closeOrderModal(){const modal=document.getElementById("orderModal");if(!modal)return;modal.classList.remove("open");modal.setAttribute("aria-hidden","true");}
function showOrderPlacedPopup(order){
 ensureOrderModal();
 const modal=document.getElementById("orderModal"),content=document.getElementById("orderModalContent");
 const eta=new Date(order.estimatedDeliveryAt);
 content.innerHTML=`<p class="eyebrow">ORDER CONFIRMED</p><h2 id="orderModalTitle">Your order has been placed.</h2><p class="order-modal-lead">Order <strong>${order.id}</strong> has been received successfully.</p><div class="order-time-box"><span>Placed at</span><strong>${new Date(order.createdAt).toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})}</strong><span>Estimated ${order.type==="delivery"?"delivery":"completion"} time</span><strong>${eta.toLocaleTimeString([], {hour:"numeric",minute:"2-digit"})}</strong></div><button type="button" class="btn primary full" id="orderModalDone">Done</button>`;
 content.querySelector("#orderModalDone").addEventListener("click",closeOrderModal);
 modal.classList.add("open");modal.setAttribute("aria-hidden","false");
}
const RATING_LABELS={1:"Very bad",2:"Fair",3:"Good",4:"Very good",5:"Excellent"};
function showDeliveredRating(order){
 ensureOrderModal();
 const modal=document.getElementById("orderModal"),content=document.getElementById("orderModalContent");
 let selected=Number(order.rating)||0;
 const render=()=>{content.innerHTML=`<p class="eyebrow">${selected?"EDIT RATING":"ORDER DELIVERED"}</p><h2 id="orderModalTitle">${selected?"Edit your rating":"How was your order?"}</h2><p class="order-modal-lead">We'd love to hear how your experience with <strong>${order.id}</strong> was.</p><div class="rating-stars" role="radiogroup" aria-label="Rate your order from 1 to 5 stars">${[1,2,3,4,5].map(n=>`<button type="button" class="rating-star ${n<=selected?"selected":""}" data-rating="${n}" aria-label="${n} star${n>1?"s":""}">★</button>`).join("")}</div><p class="rating-label" id="ratingLabel">${selected?RATING_LABELS[selected]:"Select a rating"}</p><label class="rating-comment-label">Additional comments<textarea id="ratingComment" rows="4" placeholder="Tell us about your experience (optional)">${order.ratingComment||""}</textarea></label><button type="button" class="btn primary full" id="submitRating" ${selected?"":"disabled"}>${selected?"Save changes":"Submit rating"}</button>`;
 content.querySelectorAll("[data-rating]").forEach(btn=>btn.addEventListener("click",()=>{selected=Number(btn.dataset.rating);content.querySelectorAll("[data-rating]").forEach(b=>b.classList.toggle("selected",Number(b.dataset.rating)<=selected));document.getElementById("ratingLabel").textContent=RATING_LABELS[selected];document.getElementById("submitRating").disabled=false;}));
 content.querySelector("#submitRating").addEventListener("click",()=>{const orders=JSON.parse(localStorage.getItem("dahiOrders")||"[]"),idx=orders.findIndex(x=>x.id===order.id);if(idx<0)return;orders[idx].rating=selected;orders[idx].ratingLabel=RATING_LABELS[selected];orders[idx].ratingComment=document.getElementById("ratingComment").value.trim();orders[idx].ratedAt=new Date().toISOString();localStorage.setItem("dahiOrders",JSON.stringify(orders));
   const u=currentUser();
   if(u?.email) renderMyOrders(u.email);
   closeOrderModal();});
 };
 render();modal.classList.add("open");modal.setAttribute("aria-hidden","false");
}
function getEstimatedDeliveryAt(type,createdAt){
 const minutes=type==="delivery"?45:type==="pickup"?30:25;
 return new Date(new Date(createdAt).getTime()+minutes*60000).toISOString();
}
function initOrderNotifications(){
 ensureOrderModal();
 window.addEventListener("storage",e=>{if(e.key==="dahiOrders" && document.getElementById("myOrders")){const u=currentUser();if(u?.email)renderMyOrders(u.email);}if(e.key==="dahiReservations" && document.getElementById("myReservations")){const u=currentUser();if(u?.email)renderMyReservations(u.email);}});
}
function renderCartCount(){const e=document.getElementById("cartCount");if(e)e.textContent=getCart().reduce((s,x)=>s+x.qty,0)}
function calcCart(cart=getCart(),coupon=null){
 const subtotal=cart.reduce((s,x)=>s+x.price*x.qty,0);
 let discount=0;
 if(coupon){if(coupon.min&&subtotal<coupon.min){}else if(coupon.orderType&&coupon.orderType!==document.getElementById("orderType")?.value){}else discount=coupon.type==="percent"?subtotal*coupon.value/100:coupon.value}
 const taxable=Math.max(0,subtotal-discount),tax=taxable*getSettings().tax,total=taxable+tax;
 return {subtotal,discount,tax,total};
}
function openCart(){document.getElementById("cartDrawer")?.classList.add("open");document.getElementById("overlay")?.classList.add("open");renderCart()}
function closeCart(){document.getElementById("cartDrawer")?.classList.remove("open");document.getElementById("overlay")?.classList.remove("open")}
function addItem(id){const item=MENU.find(x=>x.id===id),cart=getCart(),found=cart.find(x=>x.id===id);if(found)found.qty++;else cart.push({...item,qty:1});setCart(cart);toast(`${item.name} added to your order`);renderCart()}
function renderCart(){
 const box=document.getElementById("cartItems");if(!box)return;
 const cart=getCart();
 box.innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><div><h4>${x.name}</h4><small>${money(x.price)} each</small></div><div><b>${money(x.price*x.qty)}</b><div class="qty"><button data-dec="${x.id}">−</button><span>${x.qty}</span><button data-inc="${x.id}">+</button></div></div></div>`).join(""):`<div class="empty">Your cart is empty.<br><a href="index.html#menu">Browse the menu</a></div>`;
 const coupon=JSON.parse(localStorage.getItem("dahiCoupon")||"null"), c=calcCart(cart,coupon);
 ["cartSubtotal","cartDiscount","cartTax","cartTotal"].forEach((id,i)=>{const el=document.getElementById(id);if(el)el.textContent=money([c.subtotal,c.discount,c.tax,c.total][i])});
}
function renderMenu(){
 const grid=document.getElementById("menuGrid"),filters=document.getElementById("categoryFilters");if(!grid)return;
 const cats=["All",...new Set(MENU.map(x=>x.cat))];let active="All";
 filters.innerHTML=cats.map(c=>`<button class="filter ${c==="All"?"active":""}" data-cat="${c}">${c}</button>`).join("");
 const draw=()=>{grid.innerHTML=MENU.filter(x=>active==="All"||x.cat===active).map(x=>`<article class="menu-card"><div class="menu-art"><img src="${x.image}" alt="${x.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="menu-art-fallback">${x.emoji}</span></div><div class="menu-body"><div class="menu-top"><h3>${x.name}</h3><span class="price">${money(x.price)}</span></div><p>${x.desc}</p><div class="menu-footer"><span class="tag">${x.cat}</span><button class="btn primary small-btn" data-add="${x.id}">Add</button></div></div></article>`).join("")};
 filters.addEventListener("click",e=>{if(!e.target.dataset.cat)return;active=e.target.dataset.cat;filters.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===e.target));draw()});grid.addEventListener("click",e=>{if(e.target.dataset.add)addItem(e.target.dataset.add)});draw();
}
function initReservation(){const f=document.getElementById("reservationForm");if(!f)return;const d=f.querySelector('[name="date"]'),u=currentUser();d.min=new Date().toISOString().slice(0,10);if(u?.role==="customer"){const name=f.querySelector('[name="name"]'),email=f.querySelector('[name="email"]');if(name&&!name.value)name.value=u.name||"";if(email){email.value=u.email||"";email.readOnly=true}}f.addEventListener("submit",e=>{e.preventDefault();const fd=new FormData(f),user=currentUser(),email=String(user?.role==="customer"?user.email:fd.get("email")||"").trim().toLowerCase(),name=String(user?.role==="customer"?user.name:fd.get("name")||"").trim(),r={id:"R"+Date.now().toString().slice(-7),name,email,date:fd.get("date"),time:fd.get("time"),guests:fd.get("guests"),notes:fd.get("notes"),status:"Pending",createdAt:new Date().toISOString()};const arr=JSON.parse(localStorage.getItem("dahiReservations")||"[]");arr.push(r);localStorage.setItem("dahiReservations",JSON.stringify(arr));document.getElementById("reservationMessage").textContent="Reservation request received. Staff can confirm it from the dashboard.";f.reset();if(user?.role==="customer"){const nameInput=f.querySelector('[name="name"]'),emailInput=f.querySelector('[name="email"]');if(nameInput)nameInput.value=user.name||"";if(emailInput){emailInput.value=user.email||"";emailInput.readOnly=true}}})}
function initContact(){const f=document.getElementById("contactForm");if(!f)return;f.addEventListener("submit",e=>{e.preventDefault();const fd=new FormData(f),entry={id:"C"+Date.now().toString().slice(-7),name:String(fd.get("name")||"").trim(),email:String(fd.get("email")||"").trim(),comment:String(fd.get("comment")||"").trim(),createdAt:new Date().toISOString()};const arr=JSON.parse(localStorage.getItem("dahiContactMessages")||"[]");arr.push(entry);localStorage.setItem("dahiContactMessages",JSON.stringify(arr));document.getElementById("contactMessage").textContent="Thank you. Your message has been received.";f.reset()})}
function staffCredentials(id,pw){
 const u=id.trim().toLowerCase();
 if(u==="admin" && pw==="dahi123") return {username:"admin",role:"admin",name:"Administrator"};
 if(u==="staff" && pw==="dahi123") return {username:"staff",role:"staff",name:"Staff"};
 return null;
}
function initAuth(){
 const tabs=document.querySelectorAll(".tab"),login=document.getElementById("loginForm"),signup=document.getElementById("signupForm");
 const authPanel=document.getElementById("authPanel"),profilePanel=document.getElementById("profilePanel");
 if(!login&&!signup&&!profilePanel)return;

 tabs.forEach(t=>t.onclick=()=>{
   tabs.forEach(x=>x.classList.remove("active"));t.classList.add("active");
   login?.classList.toggle("hidden",t.dataset.tab!=="login");
   signup?.classList.toggle("hidden",t.dataset.tab!=="signup");
 });

 login?.addEventListener("submit",e=>{
   e.preventDefault();
   const id=document.getElementById("loginId").value.trim().toLowerCase();
   const pw=document.getElementById("loginPassword").value;
   const staff=staffCredentials(id,pw);
   if(staff){
     localStorage.setItem("dahiStaff",JSON.stringify(staff));
     localStorage.removeItem("dahiCurrentUser");
     location.href="admin.html";
     return;
   }
   const users=JSON.parse(localStorage.getItem("dahiUsers")||"[]");
   const u=users.find(x=>x.email.toLowerCase()===id && x.password===pw);
   const m=document.getElementById("loginMessage");
   if(!u){m.textContent="Account not found or password is incorrect.";return}
   localStorage.setItem("dahiCurrentUser",JSON.stringify({id:u.id,name:u.name,email:u.email,role:"customer"}));
   location.href="index.html";
 });

 signup?.addEventListener("submit",e=>{
   e.preventDefault();
   const name=document.getElementById("signupName").value.trim();
   const email=document.getElementById("signupEmail").value.trim().toLowerCase();
   const pw=document.getElementById("signupPassword").value;
   const confirm=document.getElementById("signupPasswordConfirm")?.value;
   const users=JSON.parse(localStorage.getItem("dahiUsers")||"[]");
   const m=document.getElementById("signupMessage");
   if(pw!==confirm){m.textContent="Passwords do not match.";return}
   if(users.some(x=>x.email.toLowerCase()===email)){m.textContent="An account with that email already exists. Log in instead.";return}
   const u={id:"U"+Date.now(),name,email,password:pw,role:"customer",picture:"",payment:{},
    wallets:[],createdAt:new Date().toISOString()};
   users.push(u);
   localStorage.setItem("dahiUsers",JSON.stringify(users));
   localStorage.setItem("dahiCurrentUser",JSON.stringify({id:u.id,name:u.name,email:u.email,role:"customer"}));
   location.href="index.html";
 });

 const staff=currentStaff();
 if(staff && (staff.role==="admin" || staff.role==="staff") && location.pathname.endsWith("/account.html")) {
   location.replace("admin.html");
   return;
 }

 const existing=currentUser();
 if(existing && existing.role==="customer") {
   const users=JSON.parse(localStorage.getItem("dahiUsers")||"[]");
   const u=users.find(x=>x.id===existing.id);
   if(u) showCustomerProfile(u);
 }
}
function showCustomerProfile(u){
 const authPanel=document.getElementById("authPanel"),profilePanel=document.getElementById("profilePanel");
 if(!profilePanel)return;
 authPanel?.classList.add("hidden");profilePanel.classList.remove("hidden");
 document.getElementById("profileGreeting").textContent=`Hello, ${u.name.split(" ")[0]}`;
 document.getElementById("profileEmail").textContent=u.email;
 document.getElementById("profileName").value=u.name;
 document.getElementById("profileEmailInput").value=u.email;
 const pic=document.getElementById("profilePicture");
 pic.src=u.picture||"data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="100%" height="100%" fill="#f1ede6"/><text x="50%" y="56%" text-anchor="middle" font-size="62">${(u.name||"U").charAt(0).toUpperCase()}</text></svg>`);
 // Card details now belong exclusively to the Credit and Debit Cards wallet.
 // Migrate the previous Payment Details object once so existing customer data is not lost.
 if(!u.cardWallet && u.payment && (u.payment.name || u.payment.card || u.payment.expiry || u.payment.zip)){
   u.cardWallet={...u.payment};
   delete u.payment;
   const users=JSON.parse(localStorage.getItem("dahiUsers")||"[]");
   const idx=users.findIndex(x=>x.id===u.id);
   if(idx>=0){users[idx]=u;localStorage.setItem("dahiUsers",JSON.stringify(users));}
 }
 const card=u.cardWallet||{};
 document.getElementById("paymentBank").value=card.bank||"";
 document.getElementById("paymentName").value=card.name||"";
 document.getElementById("paymentCard").value=card.card||"";
 document.getElementById("paymentExpiry").value=card.expiry||"";
 document.getElementById("paymentZip").value=card.zip||"";
 renderSavedCard(u);
 renderSavedWallets();
 renderMyOrders(u.email);
 renderMyReservations(u.email);
}
function orderDetailHtml(o){
 const items=(o.items||[]).map(i=>`<div class="review-item"><span>${i.name} × ${i.qty}</span><b>${money(i.price*i.qty)}</b></div>`).join("");
 const rating=o.rating?`<div class="order-rating-summary"><div class="rating-stars static" aria-label="${o.ratingLabel||RATING_LABELS[o.rating]||o.rating} rating">${[1,2,3,4,5].map(n=>`<span class="rating-star ${n<=o.rating?"selected":""}">★</span>`).join("")}</div><strong>${o.ratingLabel||RATING_LABELS[o.rating]}</strong>${o.ratingComment?`<p class="muted">“${o.ratingComment.replace(/[<>]/g,"") }”</p>`:""}<button type="button" class="btn secondary full" id="detailEditRating">Edit rating</button></div>`:(o.status==="Completed"||o.status==="Delivered")?`<button type="button" class="btn primary full" id="detailRateOrder">Rate this order</button>`:`<p class="muted">Rating will become available when this order is completed.</p>`;
 return `<p class="eyebrow">ORDER DETAILS</p><h2 id="orderModalTitle">${o.id}</h2><div class="order-detail-grid"><div><span>Status</span><strong>${o.status}</strong></div><div><span>Placed</span><strong>${new Date(o.createdAt).toLocaleString([], {dateStyle:"medium",timeStyle:"short"})}</strong></div><div><span>Order type</span><strong>${o.type}</strong></div><div><span>Payment</span><strong>${o.paymentMethod||"Not specified"}${o.paymentMethod==="card"&&o.paymentCardIssuer?` · ${o.paymentCardIssuer}`:""}</strong></div></div><div class="order-detail-items"><h3>Items</h3>${items||'<p class="muted">No item details available.</p>'}</div><div class="summary-line grand"><span>Total</span><b>${money(o.total)}</b></div><div class="order-rating-section"><h3>Rating</h3>${rating}</div>`;
}
function showOrderDetails(order){
 ensureOrderModal();
 const modal=document.getElementById("orderModal"),content=document.getElementById("orderModalContent");
 content.innerHTML=orderDetailHtml(order);
 content.querySelector("#detailRateOrder")?.addEventListener("click",()=>showDeliveredRating(order));
 content.querySelector("#detailEditRating")?.addEventListener("click",()=>showDeliveredRating(order));
 modal.classList.add("open");modal.setAttribute("aria-hidden","false");
}
function renderMyOrders(email){
 const box=document.getElementById("myOrders");if(!box)return;
 const orders=JSON.parse(localStorage.getItem("dahiOrders")||"[]").filter(x=>x.email===email).reverse();
 box.innerHTML=orders.length?orders.slice(0,5).map(o=>`<button type="button" class="profile-order" data-order-id="${o.id}" aria-label="Open order ${o.id} details"><div class="profile-order-main"><span class="profile-order-icon" aria-hidden="true">↗</span><span><b>${o.id}</b><small>${new Date(o.createdAt).toLocaleDateString()}</small></span></div><div class="profile-order-meta"><span class="order-status-bubble">${o.status}</span><b>${money(o.total)}</b><span class="profile-order-arrow" aria-hidden="true">›</span></div></button>`).join(""):'<p class="muted">No orders yet.</p>';
 box.querySelectorAll("[data-order-id]").forEach(btn=>btn.addEventListener("click",()=>{const order=JSON.parse(localStorage.getItem("dahiOrders")||"[]").find(x=>x.id===btn.dataset.orderId);if(order)showOrderDetails(order)}));
}
function renderMyReservations(email){
 const box=document.getElementById("myReservations");if(!box)return;
 const normalized=String(email||"").trim().toLowerCase();
 const reservations=JSON.parse(localStorage.getItem("dahiReservations")||"[]").filter(x=>String(x.email||"").trim().toLowerCase()===normalized).reverse();
 box.innerHTML=reservations.length?reservations.map(r=>`<article class="profile-reservation"><div class="profile-reservation-main"><div><p class="eyebrow">RESERVATION ${r.id}</p><h3>${String(r.name||"Guest").replace(/[<>]/g,"")}</h3><p class="muted">${r.date} at ${r.time} · ${r.guests} ${Number(r.guests)===1?"guest":"guests"}</p>${r.notes?`<p class="muted reservation-note">${String(r.notes).replace(/[<>]/g,"")}</p>`:""}</div></div><div class="profile-reservation-status"><span class="reservation-status-bubble">${String(r.status||"Pending").replace(/[<>]/g,"")}</span></div></article>`).join(""):'<p class="muted">No reservations yet.</p>';
}
function initProfile(){
 const form=document.getElementById("profileForm");if(!form)return;
 const cardInput=document.getElementById("paymentCard");
 const expiryInput=document.getElementById("paymentExpiry");
 if(cardInput) cardInput.addEventListener("input",()=>{cardInput.value=cardInput.value.replace(/\D/g,"").slice(0,19).replace(/(.{4})/g,"$1 ").trim();});
 if(expiryInput) expiryInput.addEventListener("input",()=>{expiryInput.value=expiryInput.value.replace(/\D/g,"").slice(0,4).replace(/^(\d{2})(\d)/,"$1/$2");});
 document.getElementById("profileLogout")?.addEventListener("click",()=>{
   localStorage.removeItem("dahiCurrentUser");location.reload();
 });
 document.getElementById("profilePictureInput")?.addEventListener("change",e=>{
   const file=e.target.files?.[0];if(!file)return;
   if(file.size>2*1024*1024){document.getElementById("profileMessage").textContent="Please choose an image under 2 MB.";return}
   const reader=new FileReader();reader.onload=()=>{const u=currentUser();const users=JSON.parse(localStorage.getItem("dahiUsers")||"[]"),user=users.find(x=>x.id===u.id);if(user){user.picture=reader.result;localStorage.setItem("dahiUsers",JSON.stringify(users));showCustomerProfile(user)}};reader.readAsDataURL(file);
 });
 form.addEventListener("submit",e=>{
   e.preventDefault();const cur=currentUser();if(!cur)return;
   const users=JSON.parse(localStorage.getItem("dahiUsers")||"[]"),u=users.find(x=>x.id===cur.id),msg=document.getElementById("profileMessage");
   if(!u)return;
   const np=document.getElementById("profilePassword").value,cp=document.getElementById("profilePasswordConfirm").value;
   if(np && np!==cp){msg.textContent="New passwords do not match.";return}
   u.name=document.getElementById("profileName").value.trim();
   if(np)u.password=np;
   // Payment Wallets are saved separately with the Save Card / Save Wallet controls.
   localStorage.setItem("dahiUsers",JSON.stringify(users));
   localStorage.setItem("dahiCurrentUser",JSON.stringify({id:u.id,name:u.name,email:u.email,role:"customer"}));
   msg.textContent="Profile saved successfully.";
   showCustomerProfile(u);
 });
}

function initCheckout(){
 const form=document.getElementById("checkoutForm");if(!form)return;
 const user=currentUser();if(user){document.getElementById("coName").value=user.name||"";document.getElementById("coEmail").value=user.email||""}
 const cart=getCart();if(!cart.length){document.getElementById("checkoutItems").innerHTML='<div class="empty">Your cart is empty.</div>';return}
 const coupon=JSON.parse(localStorage.getItem("dahiCoupon")||"null");
 const render=()=>{const c=calcCart(cart,coupon);document.getElementById("checkoutItems").innerHTML=cart.map(x=>`<div class="review-item"><span>${x.name} × ${x.qty}</span><b>${money(x.price*x.qty)}</b></div>`).join("");document.getElementById("coSubtotal").textContent=money(c.subtotal);document.getElementById("coDiscount").textContent=money(c.discount);document.getElementById("coTax").textContent=money(c.tax);document.getElementById("coTotal").textContent=money(c.total);return c};
 const updateDelivery=()=>{const type=document.getElementById("coType").value;document.getElementById("deliveryFields").hidden=type!=="delivery";document.getElementById("deliveryAddress").required=type==="delivery"};
 document.getElementById("coType").addEventListener("change",updateDelivery);updateDelivery();
 document.querySelectorAll('input[name="paymentMethod"]').forEach(r=>r.addEventListener("change",()=>{
  const selected=document.querySelector('input[name="paymentMethod"]:checked')?.value;
  document.getElementById("qrPaymentBox").hidden=!["qr","gcash","maya","paypal"].includes(selected);
  const issuerBox=document.getElementById("cardIssuerCheckout");
  if(issuerBox) issuerBox.hidden=selected!=="card";
}));
 const c=render();
 form.addEventListener("submit",e=>{e.preventDefault();
   const orders=JSON.parse(localStorage.getItem("dahiOrders")||"[]");
   const paymentMethod=document.querySelector('input[name="paymentMethod"]:checked')?.value||"cash";
   const paymentCardIssuer=paymentMethod==="card"?(document.querySelector('input[name="cardIssuer"]:checked')?.value||""):"";
   if(paymentMethod==="card"&&!paymentCardIssuer){document.getElementById("checkoutMessage").textContent="Please select your card network or bank.";return;}
   const createdAt=new Date().toISOString();
   const order={id:"D"+Date.now().toString().slice(-8),customer:document.getElementById("coName").value,email:document.getElementById("coEmail").value,phone:document.getElementById("coPhone").value,type:document.getElementById("coType").value,note:document.getElementById("coNote").value,delivery:document.getElementById("coType").value==="delivery"?{address:document.getElementById("deliveryAddress").value,instructions:document.getElementById("deliveryInstructions").value}:null,paymentMethod,paymentCardIssuer,items:cart,subtotal:c.subtotal,discount:c.discount,tax:c.tax,total:c.total,status:"Received",createdAt,estimatedDeliveryAt:getEstimatedDeliveryAt(document.getElementById("coType").value,createdAt)};
   orders.push(order);localStorage.setItem("dahiOrders",JSON.stringify(orders));localStorage.removeItem("dahiCart");localStorage.removeItem("dahiCoupon");document.getElementById("checkoutMessage").textContent=`Order ${order.id} placed successfully using ${paymentMethod.toUpperCase()}.`;form.querySelector("button").disabled=true;showOrderPlacedPopup(order);
 });
}
function initStaff(){
 const app=document.getElementById("dashboardApp");if(!app)return;
 const session=JSON.parse(localStorage.getItem("dahiStaff")||"null");
 if(!session || !["admin","staff"].includes(dahiNormalizeStaffRole(session.role))){
   location.replace("account.html");
   return;
 }
 const show=role=>{
   app.classList.remove("hidden");
   document.getElementById("roleText").textContent=role==="admin"?"Admin — full website and system access":"Staff — website/order/reservation access";
   document.getElementById("roleBadge").textContent=role.toUpperCase();
   if(role!=="admin") document.getElementById("systemPanel").classList.add("hidden");
   else {
     document.getElementById("taxSetting").value=(getSettings().tax*100).toFixed(2);
     document.getElementById("nameSetting").value=getSettings().name;
     document.getElementById("currencySetting").value=getSettings().currency;
   }
   renderDashboard(role);
 };
 show(dahiNormalizeStaffRole(session.role));

 document.getElementById("staffLogout")?.addEventListener("click",()=>{
   localStorage.removeItem("dahiStaff");
   location.href="account.html";
 });
 document.getElementById("clearOrders")?.addEventListener("click",()=>{
   if(confirm("Clear all demo orders and reservations?")){
     localStorage.removeItem("dahiOrders");
     localStorage.removeItem("dahiReservations");
     const r=JSON.parse(localStorage.getItem("dahiStaff")||"null");
     renderDashboard(r?.role||"staff");
   }
 });
 document.getElementById("saveSettings")?.addEventListener("click",()=>{
   const s={tax:Number(document.getElementById("taxSetting").value)/100,name:document.getElementById("nameSetting").value,currency:document.getElementById("currencySetting").value};
   localStorage.setItem("dahiSettings",JSON.stringify(s));
   document.getElementById("settingsMessage").textContent="System settings saved.";
 });
}
function renderDashboard(role){
 const orders=JSON.parse(localStorage.getItem("dahiOrders")||"[]"),res=JSON.parse(localStorage.getItem("dahiReservations")||"[]");
 document.getElementById("stats").innerHTML=[["Orders",orders.length],["Reservations",res.length],["Revenue",money(orders.reduce((s,x)=>s+x.total,0))],["Pending",orders.filter(x=>x.status==="Received").length]].map(x=>`<div class="stat"><span class="muted">${x[0]}</span><b>${x[1]}</b></div>`).join("");
 document.getElementById("ordersTable").innerHTML=orders.length?orders.slice().reverse().map(o=>`<tr><td>${o.id}</td><td>${o.customer}</td><td>${o.type}</td><td>${money(o.total)}</td><td><select class="status-select order-status" data-id="${o.id}"><option ${o.status==="Received"?"selected":""}>Received</option><option ${o.status==="Preparing"?"selected":""}>Preparing</option><option ${o.status==="Ready"?"selected":""}>Ready</option><option ${o.status==="Completed"?"selected":""}>Completed</option><option ${o.status==="Delivered"?"selected":""}>Delivered</option><option ${o.status==="Cancelled"?"selected":""}>Cancelled</option></select></td><td>${o.email||""}</td></tr>`).join(""):'<tr><td colspan="6" class="empty">No orders yet.</td></tr>';
 const reservationStatuses=["Pending","Confirmed","Waiting","Partly Seated","Seated","Finished","No Show","Cancelled"];
  document.getElementById("reservationsTable").innerHTML=res.length?res.slice().reverse().map(r=>`<tr><td>${r.name}</td><td>${r.date}</td><td>${r.time}</td><td>${r.guests}</td><td><select class="status-select reservation-status" data-id="${r.id}" aria-label="Reservation status for ${String(r.name||"reservation").replace(/[<>]/g,"")}">${reservationStatuses.map(s=>`<option value="${s}" ${r.status===s?"selected":""}>${s}</option>`).join("")}</select></td></tr>`).join(""):'<tr><td colspan="5" class="empty">No reservations yet.</td></tr>';
 const feedbackBox=document.getElementById("customerFeedbackTable");
 if(feedbackBox){
   const rated=orders.filter(o=>Number(o.rating)>=1).slice().reverse();
   feedbackBox.innerHTML=rated.length?rated.map(o=>`<tr><td><strong>${o.id}</strong></td><td>${String(o.customer||"Customer").replace(/[<>]/g,"")}</td><td><span class="staff-rating-stars" aria-label="${o.rating} out of 5">${[1,2,3,4,5].map(n=>n<=o.rating?"★":"☆").join("")}</span><br><small>${o.ratingLabel||RATING_LABELS[o.rating]||""}</small></td><td>${o.ratingComment?`“${String(o.ratingComment).replace(/[<>]/g,"")}”`:'<span class="muted">No written feedback</span>'}</td><td>${o.ratedAt?new Date(o.ratedAt).toLocaleString([], {dateStyle:"medium",timeStyle:"short"}):"—"}</td></tr>`).join(""):'<tr><td colspan="5" class="empty">No customer ratings yet.</td></tr>';
 }
 const inquiryTable=document.getElementById("inquiriesTable");
 const inquiryCount=document.getElementById("inquiryCount");
 if(inquiryTable){
   const inquiries=JSON.parse(localStorage.getItem("dahiContactMessages")||"[]").slice().reverse();
   if(inquiryCount) inquiryCount.textContent=String(inquiries.length);
   inquiryTable.innerHTML=inquiries.length?inquiries.map(m=>`<tr><td><strong>${String(m.name||"Guest").replace(/[<>]/g,"")}</strong><br><small>${String(m.id||"").replace(/[<>]/g,"")}</small></td><td>${String(m.email||"").replace(/[<>]/g,"")}</td><td class="inquiry-message">${String(m.comment||"").replace(/[<>]/g,"")}</td><td>${m.createdAt?new Date(m.createdAt).toLocaleString([], {dateStyle:"medium",timeStyle:"short"}):"—"}</td></tr>`).join(""):'<tr><td colspan="4" class="empty">No inquiries yet.</td></tr>';
 }
 document.querySelectorAll(".order-status").forEach(sel=>sel.onchange=()=>{const arr=JSON.parse(localStorage.getItem("dahiOrders")||"[]"),o=arr.find(x=>x.id===sel.dataset.id);if(o){o.status=sel.value;localStorage.setItem("dahiOrders",JSON.stringify(arr));renderDashboard(role)}});
  document.querySelectorAll(".reservation-status").forEach(sel=>sel.onchange=()=>{const arr=JSON.parse(localStorage.getItem("dahiReservations")||"[]"),r=arr.find(x=>x.id===sel.dataset.id);if(r){r.status=sel.value;localStorage.setItem("dahiReservations",JSON.stringify(arr));renderDashboard(role)}});
}
function initHome(){
 renderMenu();renderCartCount();renderCart();initReservation();initContact();
 document.getElementById("cartOpen")?.addEventListener("click",openCart);document.getElementById("cartClose")?.addEventListener("click",closeCart);document.getElementById("overlay")?.addEventListener("click",closeCart);
 document.getElementById("cartItems")?.addEventListener("click",e=>{const cart=getCart();if(e.target.dataset.inc){cart.find(x=>x.id===e.target.dataset.inc).qty++;setCart(cart);renderCart()}if(e.target.dataset.dec){const x=cart.find(x=>x.id===e.target.dataset.dec);x.qty--;if(x.qty<=0)cart.splice(cart.indexOf(x),1);setCart(cart);renderCart()}});
 document.getElementById("applyCoupon")?.addEventListener("click",()=>{const code=document.getElementById("couponInput").value.trim().toUpperCase(),coupon=COUPONS[code],msg=document.getElementById("couponInput");if(!coupon){toast("Coupon code not recognized");return}const cart=getCart(),c=calcCart(cart,coupon);if(coupon.min&&c.subtotal<coupon.min){toast(`This coupon requires ${money(coupon.min)} before tax`);return}if(coupon.orderType&&coupon.orderType!==document.getElementById("orderType").value){toast("This coupon is for pickup orders");return}localStorage.setItem("dahiCoupon",JSON.stringify(coupon));toast("Coupon applied");renderCart()});
 document.getElementById("orderType")?.addEventListener("change",()=>{const type=document.getElementById("orderType")?.value;const coupon=JSON.parse(localStorage.getItem("dahiCoupon")||"null");if(coupon?.orderType&&coupon.orderType!==type){localStorage.removeItem("dahiCoupon");const input=document.getElementById("couponInput");if(input) input.value="";toast("Coupon removed because it does not apply to this order type");}renderCart();});
 document.getElementById("checkoutBtn")?.addEventListener("click",()=>{if(!getCart().length){toast("Your cart is empty");return}const u=currentUser();if(!u){toast("Please log in or sign up first");setTimeout(()=>location.href="account.html",500);return}location.href="checkout.html"});
 setupRoleAccountLinks();
}
document.getElementById("year")&&(document.getElementById("year").textContent=new Date().getFullYear());
document.addEventListener("DOMContentLoaded",()=>{
  initMobileNavigation();
  setupRoleAccountLinks();
  initHome();initAuth();initProfile();initCheckout();initStaff();initOrderNotifications();
});


document.addEventListener("DOMContentLoaded", () => {
  const walletBtn = document.getElementById("saveWalletBtn");
  if (walletBtn) walletBtn.addEventListener("click", dahiSaveWallet);
  const cardBtn = document.getElementById("saveCardBtn");
  if (cardBtn) cardBtn.addEventListener("click", saveCreditDebitCard);
  renderSavedWallets();
  renderSavedCard();

  const qrBox = document.getElementById("qrPaymentBox");
  document.querySelectorAll('input[name="paymentMethod"]').forEach(r => r.addEventListener("change", () => {
    if (qrBox) qrBox.hidden = !["qr","gcash","maya","paypal"].includes(r.checked ? r.value : "");
  }));

  const mode = document.querySelector('[name="orderType"]');
  const deliveryFields = document.getElementById("deliveryFields");
  const updateDelivery = () => {
    if (deliveryFields && mode) deliveryFields.hidden = mode.value !== "delivery";
  };
  if (mode) { mode.addEventListener("change", updateDelivery); updateDelivery(); }
});
