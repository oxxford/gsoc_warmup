import * as THREE from 'three';
import OBJLoader from 'three-obj-loader';
OBJLoader(THREE);

let container;
let camera;
let renderer;
let scene;
let lines;

var drawCount;
var max_hits = 50;

function init() {

  // Get a reference to the container element that will hold the scene
  container = document.querySelector( '#scene-container' );

  // Create a Scene
  scene = new THREE.Scene();

  scene.background = new THREE.Color( 0xffffff );

  // Set up the options for a perspective camera
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.set( -1000, -1000, -1000 );
  camera.lookAt( 0, 0, 0 );

  // Draw range
  drawCount = 1;

  lines = [];  

  // Get dictionary of particles from server
  fetch( 'http://localhost:8090/dict' )
   .then( response => response.json() )
   .then( data => {
      for ( var key in data ) {
        var positions = data[key];
        
        var geometry = new THREE.BufferGeometry();

        var typedPositions = new Float32Array( positions.length * 3 );

        // Set up hits positions
        for (var i = 0; i < positions.length; i++) {
          var pos = positions[i];

          typedPositions[3 * i] = pos[0];
          typedPositions[3 * i + 1] = pos[1];
          typedPositions[3 * i + 2] = pos[2];
         }

        geometry.addAttribute( 'position', new THREE.BufferAttribute( typedPositions, 3 ) );
             
        // To draw only first dot at the beggining
        geometry.setDrawRange( 0, drawCount );
      
        var material = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );

        // Add a line for each particle trajectory
        var line = new THREE.Line( geometry,  material );
        scene.add( line );
        lines.push( line );
      }; 
   }) 

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

function animate() {

  // Call animate recursively
  requestAnimationFrame( animate );
  
  drawCount = ( drawCount + 1 ) % max_hits;

  // Update amount of hits that are rendred (simulated timing)
  lines.forEach(line => {
    line.geometry.setDrawRange( 0, drawCount );
  });
  
  renderer.render( scene, camera );
  
}

// Set everything up
init();

// Render the scene
animate();