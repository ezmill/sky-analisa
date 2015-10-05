var container;
var scene, camera, light, renderer;
var geometry, cube, mesh, material;
var mouse = new THREE.Vector2(), center;
var stats;
var container;
var scene, renderer, camera, controls;
var fbScene, fbRenderer, fbCamera, fbTexture, fbShaders, fbMaterial;
var mouseX = 0, mouseY = 0;
var time = 0;
var texture;
var windowHalfX = window.innerWidth / 2;
var w = window.innerWidth;
var windowHalfY = window.innerHeight / 2;
var h = window.innerHeight;

var start = Date.now(); 
var gradient, tex;
var meshes = [];
var obj;
var counter = 0;
var rtt;
var captureFrame = 0;
var sizeMult = 1;
var capturer = new CCapture( { framerate: 60, format: 'webm', workersPath: 'js/' } );
var range = 100.0;
var video, texture;
var expand = false;

init();
fbInit();
initRefraction();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );


    video = document.createElement("video");
    video.src = "textures/satin.mp4";
    video.play();
    video.loop = true;

    // target = new Target();
    // target.init();
    target = new SquareVideo();
    target.init();

    fbTexture = new THREE.Texture(target.canvas);
    fbTexture.needsUpdate = true;

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );

}
var counter = 0;
function onDocumentMouseDown(){
	if(counter%2==0){
		target.alpha = 0.0;
	} else {
		target.alpha = 1.0;
	}
	counter++;
}


function animate() {
// setTimeout(function() {
	requestAnimationFrame( animate );
// }, 1000 / 30);
	render();

}

function render() {
	target.update();

	// texture.needsUpdate = true;
	// camera.position.x += ( mouse.x - camera.position.x ) * 0.05;
	// camera.position.y += ( - mouse.y - camera.position.y ) * 0.05;
	// camera.lookAt( center );
	// gradient.update();
	// fbRenderer.render( scene, camera );
    fbDraw();

}

function fbInit(){

    fbScene = new THREE.Scene();
    fbCamera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
    fbCamera.position.set(0,0,0);

    fbRenderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true/*, alpha: true*/});
    fbRenderer.setClearColor(0xffffff, 1.0);
    fbRenderer.setSize(window.innerWidth, window.innerWidth);
    // container.appendChild(fbRenderer.domElement);

    fbScene = new THREE.Scene();
    

    var customShaders = new CustomShaders();
    var customShaders2 = new CustomShaders();

    fbShaders = [ 
        customShaders.reposShader, 
        customShaders.blurShader, 
        customShaders.diffShader, 
        customShaders2.flowShader, 
        customShaders2.passShader,
        customShaders.passShader
    ];

    fbMaterial = new FeedbackMaterial(fbRenderer, fbScene, fbCamera, fbTexture, fbShaders);
        
    fbMaterial.init();



    document.addEventListener( 'keydown', function(){screenshot(outputRenderer)}, false );
}
function initRefraction(){
    outputScene = new THREE.Scene();
    outputRenderer = new THREE.WebGLRenderer({preserveDrawingBuffer:true})
    outputRenderer.setClearColor(0xffffff, 1.0);

    outputRenderer.setSize(window.innerWidth, window.innerHeight);

    outputCamera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
    // outputCamera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.001, 100000);
    outputCamera.position.set(0,0,1000);

    controls = new THREE.OrbitControls(outputCamera);
    container.appendChild(outputRenderer.domElement);

    // video = document.createElement("video");

    // // window.addEventListener('DOMContentLoaded', function(){
    // // navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
 
    // // if (navigator.getUserMedia) {       
    // //     navigator.getUserMedia({video: true, audio: false}, handleVideo, videoError);
    // // }
 
    // // function handleVideo(stream) {
    // //   var url = window.URL || window.webkitURL;
    //    // video.src = url ? url.createObjectURL(stream) : stream;
       // video.src = "textures/caustics.mp4";
       //  video.play();
       //  video.loop = true;
    // //     //video.src = window.URL.createObjectURL(stream);
    // //     videoLoaded = true;
    // // }
 
    // //     function videoError(e) {
    // //       alert("There seems to be something wrong with your webcam :(");
    // //     }
    // //   });
    rGeo = new RefractiveGeometry(outputScene, new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0), 1.0, 0);

}
function onDocumentMouseMove( event ) {

	mouse.x = ( event.clientX - window.innerWidth / 2 ) * 8;
	mouse.y = ( event.clientY - window.innerHeight / 2 ) * 8;

    unMappedMouseX = (event.clientX );
    unMappedMouseY = (event.clientY );
    mouseX = map(unMappedMouseX, window.innerWidth, -1.0,1.0);
    mouseY = map(unMappedMouseY, window.innerHeight, -1.0,1.0);
    
    
    for(var i = 0; i < fbMaterial.fbos.length; i++){
      fbMaterial.fbos[i].material.uniforms.mouse.value = new THREE.Vector2(mouseX, mouseY);
      // fbMaterial.material.uniforms.mouse.value = new THREE.Vector2(window.innerWidth, 0);
    }


}
function fbDraw(){

    time+=0.01;
    for(var i = 0; i < fbMaterial.fbos.length; i++){
      fbMaterial.fbos[i].material.uniforms.time.value = time;
      // fbMaterial.fbos[i].material.uniforms.mouse.value = new THREE.Vector2(Math.sin(time*2.0)*0.3, Math.cos(time*2.0)*0.3);
      // fbMaterial.fbos[i].material.uniforms.mouse.value = new THREE.Vector2(mouseX, mouseY);
      // fbMaterial.fbos[i].material.uniforms.mouse.value = new THREE.Vector2(0.0,0.0);
      fbMaterial.material.uniforms.mouse.value = new THREE.Vector2(window.innerWidth, 0);
    }
    fbTexture.needsUpdate = true;
        
    fbMaterial.update();
    // fbMaterial.expand(1.002);
    fbRenderer.render(fbScene, fbCamera);

    fbMaterial.getNewFrame();
    fbMaterial.swapBuffers();


    rGeo.update();
// 
    outputRenderer.render(outputScene, outputCamera);

    // outputCamera.rotation.y += 0.01;

    capturer.capture( outputRenderer.domElement );

    
}
function hslaColor(h,s,l,a)
  {
    return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
  }
