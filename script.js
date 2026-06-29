/* The Alchemist — Release 5.4.1 JavaScript Loader */

(function(){
  const files = [
    "js/app-part-01.js",
    "js/app-part-02.js",
    "js/app-part-03.js",
    "js/app-part-04.js"
  ];

  function loadNext(index){
    if(index >= files.length) return;

    const s = document.createElement("script");
    s.src = files[index];
    s.onload = () => loadNext(index + 1);
    s.onerror = () => alert("Aldren could not load " + files[index] + ". Please check that the file exists in GitHub.");
    document.body.appendChild(s);
  }

  loadNext(0);
})();
