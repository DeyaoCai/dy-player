// @ts-ignore;
import * as THREE from 'three';
// @ts-ignore;
import {Reflector} from 'three/examples/jsm/objects/Reflector';

export class ThreeViewUtils {
  static makePointwave(scene: THREE.Scene, data: number[], index_: number){
    const pointwave = new THREE.Group();

    const perDeg = Math.PI * 2 / data.length;
    data.forEach((data_, index) => {
      const material = new THREE.MeshPhysicalMaterial({color: 0xffffff});
      const geometry = new THREE.SphereBufferGeometry(0.1, 16, 8);
      const circle = new THREE.Mesh(geometry, material);
      circle.position.z = -index/10;
      circle.position.y = data_ / 60;
      circle.position.x = index_;
      // circle.position.x = Math.sin(perDeg * index) * (index_ + 5);
      // circle.position.z = Math.cos(perDeg * index) * (index_ + 5);
      pointwave.add(circle);
    });
    return pointwave;
  }

  static makeMirror(scene: THREE.Scene) {
    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;

    // reflectors/mirrors

    var geometry = new THREE.CircleBufferGeometry(20, 64);
    var groundMirror = new Reflector(geometry, {
      clipBias: 0.1,
      textureWidth: WIDTH * window.devicePixelRatio,
      textureHeight: HEIGHT * window.devicePixelRatio,
      color: 0x000000
    });
    groundMirror.position.y = 0.01;
    // groundMirror.position.x = -30;
    // groundMirror.position.z = -30;
    groundMirror.rotateX(-Math.PI / 2);
    scene.add(groundMirror);
  }

  static makeCubes(scene: THREE.Scene, material: THREE.Material, data: number[]) {
    const cubes = [];

    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0],];
    const currentPosi = [0, 0];
    let current = 0;
    let open = directions[0];
    const start = directions[0];
    while (data.length) {
      // @ts-ignore;
      open = directions.shift();
      open === start && (current += 1);
      while (
        data.length && (
          (open[1] === 1 && currentPosi[1] < current) ||
          (open[1] === -1 && currentPosi[1] > -current) ||
          (open[0] === 1 && currentPosi[0] < current) ||
          (open[0] === -1 && currentPosi[0] > -current)
        )
        ) {
        data.shift();
        const geometry = new THREE.BoxBufferGeometry(0.3, 1, 0.3);
        // const geometry = new THREE.CylinderBufferGeometry( 0.4, 0.4, 1, 32 );
        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = currentPosi[0] * 3;
        cube.position.z = currentPosi[1] * 3;
        currentPosi[0] = (currentPosi[0] + open[0]);
        currentPosi[1] = (currentPosi[1] + open[1]);
        scene.add(cube);
        cubes.push(cube);
      }
      directions.push(open);
    }
    return cubes;
  }

  static makeCircles(scene: THREE.Scene, data: number[]) {

    const circles = new THREE.Group();
    const perDeg = Math.PI * 2 / data.length;
    data.forEach((data_, index) => {
      const material = new THREE.MeshPhysicalMaterial({color: 0xffffff});
      const geometry = new THREE.CylinderBufferGeometry(0.1, 0.1, 8, 32);
      const circle = new THREE.Mesh(geometry, material);
      circle.position.x = Math.sin(perDeg * index) * 30;
      circle.position.z = Math.cos(perDeg * index) * 30;
      circles.add(circle);
    });
    scene.add(circles);
    return circles;
  }

  static makePointLight(scene: THREE.Scene, color: number) {
    const sphere = new THREE.SphereBufferGeometry(0.1, 16, 8);
    const light = new THREE.PointLight(color, 2, 50);
    light.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({color: color})));
    scene.add(light);
    return light;
  }
}
