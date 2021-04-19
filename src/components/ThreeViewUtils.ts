// @ts-ignore;
import * as THREE from 'three';
export class ThreeViewUtils{
  static makeCubes(scene: THREE.Scene, material: THREE.Material, data: number[]) {
    const cubes = [];

    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0],];
    const currentPosi = [0, 0];
    let current = 0;
    let open = directions[0];
    const start = directions[0];
    while(data.length) {
      // @ts-ignore;
      open = directions.shift();
      open === start && (current+=1);
      while (
        data.length && (
          (open[1] === 1 && currentPosi[1] < current) ||
          (open[1] === -1 && currentPosi[1] > -current) ||
          (open[0] === 1 && currentPosi[0] < current) ||
          (open[0] === -1 && currentPosi[0] > -current)
        )
        ) {
        data.shift();
        const geometry = new THREE.BoxBufferGeometry(0.8, 1, 0.8);
        // const geometry = new THREE.CylinderBufferGeometry( 0.4, 0.4, 1, 32 );
        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = currentPosi[0];
        cube.position.z = currentPosi[1];
        currentPosi[0] = (currentPosi[0] + open[0]);
        currentPosi[1] = (currentPosi[1] + open[1]);
        scene.add(cube);
        cubes.push(cube);
      }
      directions.push(open);
    }
    return cubes;
  }
  static makeCircles(scene: THREE.Scene, material: THREE.Material, data: number[]){
    const circles: THREE.CylinderBufferGeometry = [];
    const perDeg =  Math.PI * 2 / data.length;
    data.forEach((data_, index) => {
      const geometry = new THREE.CylinderBufferGeometry( 0.7, 0.7, 5, 32 );
      const circle = new THREE.Mesh(geometry, material);
      circle.position.x = Math.sin(perDeg * index) * 15;
      circle.position.z = Math.cos(perDeg * index) * 15;
      scene.add(circle);
      circles.push(circle);
    });
    return circles;
  }
  static makePointLight(scene: THREE.Scene, color: number) {
    const sphere = new THREE.SphereBufferGeometry( 0.1, 16, 8 );
    const light = new THREE.PointLight( color, 2, 50 );
    light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: color } ) ) );
    scene.add( light );
    return light;
  }
}
