// Tables turn into cards on small screens: label each cell with its column heading.
document.querySelectorAll("table").forEach(function(t){
  var heads=[].map.call(t.querySelectorAll("thead th"),function(th){return th.textContent.trim();});
  t.querySelectorAll("tbody tr").forEach(function(tr){[].forEach.call(tr.children,function(td,i){if(heads[i])td.setAttribute("data-label",heads[i]);});});
});
document.addEventListener("click",function(e){
  var b=e.target.closest(".code button");if(!b)return;
  var text=b.parentElement.querySelector("pre").innerText;
  var done=function(){b.textContent="Copied";setTimeout(function(){b.textContent="Copy";},1500);};
  if(navigator.clipboard)navigator.clipboard.writeText(text).then(done).catch(function(){});
});
document.querySelectorAll(".onpage a").forEach(function(a){a.addEventListener("click",function(){a.closest("details").open=false;});});
// Highlight the section you are reading.
var side=document.getElementById("sidebar");
if(side){
  var links=[].slice.call(side.querySelectorAll('a[href^="#"]')),byId={};
  links.forEach(function(a){byId[a.getAttribute("href").slice(1)]=a;});
  var spy=new IntersectionObserver(function(es){es.forEach(function(en){var l=byId[en.target.id];if(l&&en.isIntersecting){links.forEach(function(a){a.classList.remove("active");});l.classList.add("active");}});},{rootMargin:"-84px 0px -70% 0px"});
  document.querySelectorAll("section[id]").forEach(function(s){spy.observe(s);});
}

// Home: panel ring and panel tabs.
(function(){
  var ring=document.querySelector(".ring"),cap=document.getElementById("ringCap");
  var tabs=[].slice.call(document.querySelectorAll('.ptabs [role="tab"]'));
  function select(id,focus){
    tabs.forEach(function(t){var on=t.id==="pt-"+id;t.setAttribute("aria-selected",on?"true":"false");t.tabIndex=on?0:-1;document.getElementById(t.getAttribute("aria-controls")).hidden=!on;if(on&&focus)t.focus();});
  }
  tabs.forEach(function(t,i){
    t.addEventListener("click",function(){select(t.id.slice(3));});
    t.addEventListener("keydown",function(e){var k=e.key,n=null;if(k==="ArrowDown"||k==="ArrowRight")n=tabs[(i+1)%tabs.length];if(k==="ArrowUp"||k==="ArrowLeft")n=tabs[(i-1+tabs.length)%tabs.length];if(n){e.preventDefault();select(n.id.slice(3),true);}});
  });
  if(!ring||!cap)return;
  var nodes=[].slice.call(ring.querySelectorAll(".node"));
  function show(n){nodes.forEach(function(x){x.classList.toggle("on",x===n);});ring.classList.add("dim");cap.innerHTML="<b>"+n.dataset.n+"</b><span>"+n.dataset.q+"</span>";}
  nodes.forEach(function(n){
    n.addEventListener("mouseenter",function(){show(n);});
    n.addEventListener("focus",function(){show(n);});
    n.addEventListener("click",function(){select(n.dataset.p);document.getElementById("panels").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});});
    n.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();n.dispatchEvent(new Event("click"));}});
  });
})();
