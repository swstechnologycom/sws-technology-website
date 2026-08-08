document.addEventListener("DOMContentLoaded",()=>{
  const menu=document.getElementById("menu"),nav=document.getElementById("nav");
  menu.addEventListener("click",()=>nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
  document.getElementById("year").textContent=new Date().getFullYear();

  const form=document.getElementById("contactForm"),btn=document.getElementById("submit"),status=document.getElementById("status");
  const fields=["name","email","subject","message"];
  function message(type,title,text){status.className="status show "+type;status.innerHTML="<strong>"+title+"</strong><br>"+text}
  function validate(){
    let ok=true;
    fields.forEach(id=>{const e=document.getElementById(id); if(!e.value.trim()){e.style.borderColor="#e55770";ok=false}else e.style.borderColor=""});
    const email=document.getElementById("email");
    if(email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())){email.style.borderColor="#e55770";ok=false}
    return ok;
  }
  form.addEventListener("input",e=>{if(e.target.matches("input,textarea"))e.target.style.borderColor=""});
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    if(!validate()){message("error","Please check the form.","Complete the required fields and enter a valid email.");return}
    btn.disabled=true;btn.classList.add("is-loading");status.className="status";
    try{
      const response=await fetch(form.action,{method:"POST",body:new FormData(form),headers:{Accept:"application/json"}});
      if(response.ok){form.reset();message("success","✓ Message sent successfully","Thank you. SWS Technology will contact you shortly.");}
      else{
        let detail="Please try again in a moment.";
        try{const data=await response.json();if(data.errors?.length)detail=data.errors.map(x=>x.message).join(" ")}catch(_){}
        message("error","⚠ Message not sent",detail);
      }
    }catch(_){message("error","⚠ Connection error","Check your internet connection and try again.");}
    finally{btn.disabled=false;btn.classList.remove("is-loading")}
  });
});