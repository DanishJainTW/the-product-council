(function(){
  var b=document.getElementById("ghMenu"),n=document.getElementById("ghNav");
  if(b&&n){
    b.addEventListener("click",function(){var o=n.classList.toggle("open");b.setAttribute("aria-expanded",o?"true":"false");b.textContent=o?"Close":"Menu";});
    document.addEventListener("keydown",function(e){if(e.key==="Escape"&&n.classList.contains("open")){b.click();b.focus();}});
  }
  var t=document.getElementById("themeBtn"),r=document.documentElement;
  if(t){t.addEventListener("click",function(){
    var dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme: dark)").matches;
    r.dataset.theme=dark?"light":"dark";try{localStorage.setItem("council-theme",r.dataset.theme);}catch(e){}
  });}
})();
