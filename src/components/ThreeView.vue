<template>
  <div class="three-view" ref="wrap"></div>
</template>
<script>
  import * as THREE from 'three';
  import {ObjectLoader} from "three/src/loaders/ObjectLoader";
  import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
  import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
  import {GeometryUtils} from 'three/examples/jsm/utils/GeometryUtils';
  import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial';
  import {ThreeViewUtils} from "./ThreeViewUtils";

  export default {
    name: 'ThreeView',
    provide() {
      return {}
    },
    components: {},
    mixins: [],
    props: ['index'],
    inject: ['musicData'],
    data() {
      return {
        camera: null,
        scene: null,
        renderer: null,
        mesh: null,
        light1: null,

        time: 0,
        width: 0, height: 0,
        hasInit: false,
        todoInRender: [],
      }
    },
    computed: {},
    methods: {
      init() {
        const {musicData, todoInRender} = this;
        const container = this.$el;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const camera = this.camera = new THREE.PerspectiveCamera(30, width / height, 1, 10000);
        camera.position.set(50, 50, 50);

        const scene = this.scene = new THREE.Scene();
        // Lights
        ThreeViewUtils.makeMirror(scene);
        // 环境光
        const mainLight = new THREE.AmbientLight(0xffffff, .6);
        mainLight.position.y = 8;
        mainLight.position.x = 0;
        mainLight.position.z = 0;
        scene.add(mainLight);


        function makeLineCircle(scene, radio = 5, subRadio = 1, size = 32, color = 0x00ffff) {
          const rCenter = radio;
          const rMax = radio + subRadio;
          const rMin = radio - subRadio;
          const lineGeometry = new THREE.BufferGeometry();
          const lineMaterial = new THREE.LineBasicMaterial({color});
          let i = size;
          const arr = [];
          const perDeg = Math.PI * 2 / i;
          while (i >= 0) {
            arr.push(
              Math.sin(perDeg * i) * rMax, Math.cos(perDeg * i) * rMax, 0,
              Math.sin(perDeg * (i + 1)) * rMax, Math.cos(perDeg * (i + 1)) * rMax, 0,
              Math.sin(perDeg * i) * rMax, Math.cos(perDeg * i) * rMax, 0,
              Math.sin(perDeg * i) * rCenter, Math.cos(perDeg * i) * rCenter, subRadio,
              Math.sin(perDeg * (i + 1)) * rCenter, Math.cos(perDeg * (i + 1)) * rCenter, subRadio,
              Math.sin(perDeg * i) * rCenter, Math.cos(perDeg * i) * rCenter, subRadio,
              Math.sin(perDeg * i) * rMin, Math.cos(perDeg * i) * rMin, 0,
              Math.sin(perDeg * (i + 1)) * rMin, Math.cos(perDeg * (i + 1)) * rMin, 0,
              Math.sin(perDeg * i) * rMin, Math.cos(perDeg * i) * rMin, 0,
              Math.sin(perDeg * i) * rCenter, Math.cos(perDeg * i) * rCenter, -subRadio,
              Math.sin(perDeg * (i + 1)) * rCenter, Math.cos(perDeg * (i + 1)) * rCenter, -subRadio,
              Math.sin(perDeg * i) * rCenter, Math.cos(perDeg * i) * rCenter, -subRadio,
              Math.sin(perDeg * i) * rMax, Math.cos(perDeg * i) * rMax, 0,
            );
            i--
          }
          lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
          const line = new THREE.Line(lineGeometry, lineMaterial);

          const light = new THREE.PointLight(color, 2, 50);
          light.add(line);
          scene.add(light);
          return light;
        }


        const group = new THREE.Group();
        scene.add(group);
        group.rotation.x = -Math.PI / 4;
        group.position.z = -10;
        group.position.y = 3;


        function makeLine(data, color) {
          const lineGeometry = new THREE.BufferGeometry();
          const lineMaterial = new THREE.LineBasicMaterial({color});
          const arr = [].concat.apply([], data.map((item, index) => [index, 0, item / 255]));
          lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
          return new THREE.Line(lineGeometry, lineMaterial);
        }

        const line = makeLine([...musicData.realTimeData.data], 0xffff00);
        group.add(line);
        todoInRender.push(({musicData, avrLevel}) => {
          const len = musicData.realTimeData.data.length;
          const dataCopy = [...musicData.realTimeData.data];
          const arr = [].concat.apply(
            [],
            [...dataCopy.reverse(), ...dataCopy.reverse()]
              .map((item, index) => {
                const [x, y, z] = [(index - len) / Math.pow(2, 3), item / 255, 0];
                return item > avrLevel ? [
                  x, y, z,
                  x, 0, z,
                  x, y, z,
                ] : [x, y, z]
              })
          );
          //
          line.geometry.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
        });


        // 运动的点光；
        const pointLights = {
          r: ThreeViewUtils.makePointLight(scene, 0xff0000),
          g: ThreeViewUtils.makePointLight(scene, 0x00ff00),
          b: ThreeViewUtils.makePointLight(scene, 0x00ff),
          rg: ThreeViewUtils.makePointLight(scene, 0xffff00),
          rb: ThreeViewUtils.makePointLight(scene, 0xff00ff),
          gb: ThreeViewUtils.makePointLight(scene, 0x00ffff),
        };
        todoInRender.push(({musicData, avrLevel}) => {
          this.time += avrLevel / 255 * .8 + 0.2;
          const {time} = this;

          Object.values(pointLights).forEach((light, index) => {
            const index_ = index / 3 + 1;
            const oriDeg = index * 120;
            light.position.x = Math.sin(oriDeg + time / 40 * index_ * 1.5) * 15;
            light.position.y = Math.cos(oriDeg + time / 40 * index_ * 2) * 15 + 15;
            light.position.z = Math.cos(oriDeg + time / 40 * index_ * 3) * 15;
          });
        });


        function makeIcosahedron() {
          const texture = new THREE.TextureLoader().load('img/pop-star.jpg');
          const icosahedronGeometry = new THREE.IcosahedronBufferGeometry(2);
          const icosahedronMaterial = new THREE.MeshPhysicalMaterial({map: texture});
          const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
          icosahedron.position.set(0, 0, 10);
          return icosahedron;
        }

        const icosahedron = makeIcosahedron();
        group.add(icosahedron);


        const lineCircle1 = makeLineCircle(group, 4, 0.25, 64);
        lineCircle1.position.set(0, 0, 0);
        const lineCircle2 = makeLineCircle(group, 3, 0.25, 48, 0xff00ff);
        lineCircle2.position.set(0, 0, 1);

        const lineCircle3 = makeLineCircle(group, 7, 0.5, 64);
        lineCircle3.position.set(0, 0, 3);

        todoInRender.push(({musicData, avrLevel}) => {
          const icosahedronScale = Math.pow((avrLevel / (255 / 4)), 2) + 1;
          const ratateSpeed = Math.PI / 180;
          lineCircle1.rotation.z += ratateSpeed;
          lineCircle2.rotation.z -= ratateSpeed;
          lineCircle3.rotation.z += ratateSpeed;

          icosahedron.scale.set(icosahedronScale, icosahedronScale, icosahedronScale);
          icosahedron.position.z = 6 + icosahedronScale * 2;
          icosahedron.rotation.z -= icosahedronScale / 100;
          icosahedron.rotation.y -= icosahedronScale / 200;
          icosahedron.rotation.x -= icosahedronScale / 300;
        });
        // Renderer
        const renderer = this.renderer = new THREE.WebGLRenderer({antialias: true});
        // renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.className = 'three-view-canvas';
        document.body.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 1, 0);
        controls.update();


        // 地面

        const texture = new THREE.TextureLoader().load('img/pop-star.jpg');
        const groundMaterial = new THREE.MeshPhongMaterial({color: 0x333333, shininess: 0, map: texture});
        const ground = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(172, 72, 1, 1),
          groundMaterial
        );
        ground.rotation.x = -Math.PI / 2; // rotates X/Y to X/Z
        ground.receiveShadow = true;
        scene.add(ground);


        function makeLathe(color = 0xffff00, radio = 15, y = 10, height = 0.3, deg = 60) {
          const points = [
            new THREE.Vector3(radio, y, 0),
            new THREE.Vector3(radio, y + height, 0),
            new THREE.Vector3(radio, y, 0),
          ];
          const geometry = new THREE.LatheBufferGeometry(points, radio * 2, 0, Math.PI / 180 * deg);
          const material = new THREE.MeshBasicMaterial({color});
          const lathe = new THREE.Mesh(geometry, material);
          lathe.rotation.x = Math.PI/2;
          return lathe;
        }

        const lathe = makeLathe();
        lineCircle3.add(lathe);

        const lathe2 = makeLathe(0xff00ff, 14, 9, 0.15, 120);
        lineCircle3.add(lathe2);

        const lathe3 = makeLathe(0x00ffff, 12, 2, 0.1, 180);
        lineCircle3.add(lathe3);

        const lathe4 = makeLathe(0x00ffff, 12, 4, 0.2, 60);
        lineCircle3.add(lathe4);

        todoInRender.push(({musicData, avrLevel}) => {
          const speed = Math.PI / 180 * avrLevel / 255 + .01;
          lathe.rotation.y += speed;
          lathe2.rotation.y -= speed * 2;
          lathe3.rotation.y += speed / 2;
          lathe4.rotation.y -= speed * 10;

        });

        this.hasInit = true;
      },
      threeRenderer() {
        if (this.hasInit) {

          this.cacheList || (this.cacheList = []);

          const {renderer, scene, camera, musicData} = this;
          const {avrLevel} = musicData.realTimeData;
          this.todoInRender.forEach(fn => fn({musicData, avrLevel}));


          renderer.render(scene, camera);
        }
      },
    },
    watch: {},
    beforeDestroy() {
    },
    mounted() {
      this.width = this.$el.offsetWidth;
      this.height = this.$el.offsetHeight;
      this.init();
      this.musicData.realTimeData.event.addEventListener('update', () => {
        this.threeRenderer()
      })
    }
  }
</script>

<style lang="less" scoped>
  .three-view {
    position: absolute;
    opacity: 1;
    width: 100%;
    height: 100%;
    flex: 1 1 0;
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: 2999;
  }

  .three-view canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 4000;
  }
</style>
<style>
  .three-view-canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 3003;
  }
</style>
