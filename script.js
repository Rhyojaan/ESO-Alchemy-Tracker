(function(){
  const files = [

    "js/app-part-01.js"

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
