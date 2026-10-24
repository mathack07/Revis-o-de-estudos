/* Login com Google e sincronização do progresso pelo Firebase.
   Cada usuário tem um documento progress/{uid} no Firestore com o estado inteiro. */
const Cloud = (() => {
  const cfg = window.FIREBASE_CONFIG || {};
  const enabled = !!(cfg.apiKey && cfg.projectId && window.firebase);
  let auth = null, db = null, user = null, timer = null, status = "idle";
  if(enabled){
    firebase.initializeApp(cfg);
    auth = firebase.auth();
    db = firebase.firestore();
  }

  function init(onChange){
    if(!enabled) return Promise.resolve(null);
    auth.getRedirectResult().catch(() => {});
    return new Promise(resolve => {
      let first = true;
      auth.onAuthStateChanged(u => {
        const prev = user ? user.uid : null;
        user = u;
        if(first){ first = false; return resolve(user); }
        if((user ? user.uid : null) !== prev) onChange(user);
      });
    });
  }
  async function pull(){
    if(!user) return null;
    try{
      const snap = await db.collection("progress").doc(user.uid).get();
      return snap.exists ? snap.data().state : null;
    }catch(e){ status = "error"; return null; }
  }
  function push(state){
    if(!user) return;
    clearTimeout(timer);
    timer = setTimeout(async () => {
      status = "saving";
      try{
        await db.collection("progress").doc(user.uid).set({ state: JSON.parse(JSON.stringify(state)), updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
        status = "saved";
      }catch(e){ status = "error"; }
    }, 1500);
  }
  async function signInGoogle(){
    const provider = new firebase.auth.GoogleAuthProvider();
    try{ await auth.signInWithPopup(provider); }
    catch(e){
      // Alguns celulares bloqueiam a janela; nesse caso vai pela página inteira.
      if(e && (e.code === "auth/popup-blocked" || e.code === "auth/operation-not-supported-in-this-environment")) return auth.signInWithRedirect(provider);
      throw e;
    }
  }
  const signOut = () => auth.signOut();

  return { enabled, init, pull, push, signInGoogle, signOut,
    get user(){ return user; }, get status(){ return status; } };
})();
