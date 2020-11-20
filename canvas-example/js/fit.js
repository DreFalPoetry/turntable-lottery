var rootResize=function(){
  var baseFontSize = 100;
  var baseWidth = 750;
  var minWidth=320;
  var clientWidth = document.documentElement.clientWidth || window.innerWidth;
  var innerWidth = Math.max(Math.min(clientWidth, baseWidth), minWidth);
  var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent); // /(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent);
  var rem = clientWidth/(baseWidth/baseFontSize);
  if(innerWidth==750 || innerWidth == 1334 ||innerWidth==320){
      rem=innerWidth/(baseWidth/baseFontSize)
  }

  document.querySelector('html').style.fontSize = rem + 'px';

  if(mobile){
      document.getElementById("wrap").style.width = "100%";
  }else{
     document.getElementById("wrap").style.width = "750px";
  }
};
rootResize();
window.onresize=function(){rootResize()};