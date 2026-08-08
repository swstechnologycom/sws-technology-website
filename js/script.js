document.addEventListener("DOMContentLoaded",()=>{
  const menu=document.getElementById("menu"), links=document.getElementById("navLinks");
  menu.addEventListener("click",()=>{const open=links.classList.toggle("open");menu.setAttribute("aria-expanded",open)});
  links.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{links.classList.remove("open");menu.setAttribute("aria-expanded","false")}));
  document.getElementById("year").textContent=new Date().getFullYear();

  const form=document.getElementById("contactForm"), btn=document.getElementById("submitBtn"), status=document.getElementById("formStatus");
  const required=["name","email","subject","message"];
  const show=(type,title,msg)=>{status.className=`status show ${type}`;status.innerHTML=`<strong>${title}</strong><br>${msg}`};
  const valid=()=>{
    let ok=true;
    required.forEach(id=>{const el=document.getElementById(id);if(!el.value.trim()){el.style.borderColor="var(--danger)";ok=false}else el.style.borderColor=""});
    const email=document.getElementById("email");
    if(email.value.trim()&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())){email.style.borderColor="var(--danger)";ok=false}
    return ok;
  };
  form.addEventListener("input",e=>{if(e.target.matches("input,textarea"))e.target.style.borderColor=""});
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    if(!valid()){show("error","Please check the form.","Complete the required fields and enter a valid email.");return}
    btn.disabled=true;btn.classList.add("loading");status.className="status";
    try{
      const r=await fetch(form.action,{method:"POST",body:new FormData(form),headers:{Accept:"application/json"}});
      if(r.ok){form.reset();show("success","✓ Message sent successfully","Thank you. SWS Technology will get back to you shortly.");}
      else{let msg="We could not send your message. Please try again.";try{const d=await r.json();if(d.errors?.length)msg=d.errors.map(x=>x.message).join(" ")}catch(_){ }show("error","⚠ Message not sent",msg)}
    }catch(_){show("error","⚠ Connection error","Please check your internet connection and try again.")}
    finally{btn.disabled=false;btn.classList.remove("loading")}
  });
});