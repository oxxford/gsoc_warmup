import * as THREE from 'three';
import OBJLoader from 'three-obj-loader';
OBJLoader(THREE);

let container;
let camera;
let renderer;
let scene;
let mesh;

function init() {

  // Get a reference to the container element that will hold the scene
  container = document.querySelector( '#scene-container' );

  // create a Scene
  scene = new THREE.Scene();

  scene.background = new THREE.Color( 0x8FBCD4 );

  // set up the options for a perspective camera
  const fov = 100; 
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 15000;

  camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

  camera.position.set( 0, 0, 1500);
  camera.rotation.set(0, 0, 0.2);

  // Add loaded object to the scene
  addLoadedObject( scene );

  // Create a directional light
  const light = new THREE.DirectionalLight( 0xffffff, 5.0 );
  light.position.set( 1000, 1000, 1000 );
  scene.add( light );

  // Set up rendering
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( container.clientWidth, container.clientHeight );

  renderer.setPixelRatio( window.devicePixelRatio );

  // Add the automatically created <canvas> element to the page
  container.appendChild( renderer.domElement );
}

function addLoadedObject(scene) { 
  var loader = new THREE.OBJLoader();

  // load a resource
  loader.load(
    'http://localhost:8090/obj',
    function ( object ) {
      
      //called when object is loaded
      scene.add( object );
      mesh = object;
      console.log(object);

    },
    function ( xhr ) {

      //called when object is loading
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    function ( error ) {

      //called if an error occured
      console.log( error );

    }
  );
  
}

function animate() {

  // call animate recursively
  requestAnimationFrame( animate );

  if ( mesh != undefined ) {
    mesh.rotation.z = Math.PI / 2;
    mesh.rotation.x = Math.PI / 2;
    mesh.rotation.y += 0.01;
  }
  
  renderer.render( scene, camera );
  
}

// set everything up
init();

// render the scene
animate();