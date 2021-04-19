<template>
  <div class="three-view" ref="wrap"></div>
</template>
<script>
  import * as THREE from 'three';
  import {ObjectLoader} from "three/src/loaders/ObjectLoader";
  import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
  import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
  import { GeometryUtils } from 'three/examples/jsm/utils/GeometryUtils';
  import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
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
        hasInit: false
      }
    },
    computed: {},
    methods: {
      init() {

        const {musicData} = this;

        const container = this.$el;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const camera = this.camera = new THREE.PerspectiveCamera(30, width / height, 1, 10000);
        camera.position.set(50, 50, 50);

        const scene = this.scene = new THREE.Scene();

        // Lights

        // 环境光
        scene.add(new THREE.AmbientLight(0xffffff, .3));

        // 点光
        this.pointLights = {
          r: ThreeViewUtils.makePointLight(scene, 0xff00),
          g: ThreeViewUtils.makePointLight(scene, 0x00ff00),
          b: ThreeViewUtils.makePointLight(scene, 0x00ff),
          rg: ThreeViewUtils.makePointLight(scene, 0xffff00),
          rb: ThreeViewUtils.makePointLight(scene, 0xff00ff),
          gb: ThreeViewUtils.makePointLight(scene, 0x00ffff),
        };



        // Renderer
        const renderer = this.renderer = new THREE.WebGLRenderer();
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.className = 'three-view-canvas';
        document.body.appendChild(renderer.domElement);


        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 1, 0);
        controls.update();


        const groundMaterial = new THREE.MeshPhongMaterial({color: 0x333333, shininess: 0});
        // 地面
        const ground = new THREE.Mesh(
          new THREE.PlaneBufferGeometry(200, 200, 1, 1),
          groundMaterial
        );

        ground.rotation.x = -Math.PI / 2; // rotates X/Y to X/Z
        ground.receiveShadow = true;
        scene.add(ground);

        const material = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          shininess: 10
        });
        this.cubes = ThreeViewUtils.makeCubes(scene, material, [...musicData.realTimeData.data]);
        this.circles = ThreeViewUtils.makeCircles(scene, material, [...musicData.realTimeData.data]);

        this.hasInit = true;
      },
      threeRenderer() {
        if (this.hasInit) {
          const {renderer, scene, camera, cubes, circles, time} = this;

          const {avrLevel} = this.musicData.realTimeData;
          const avrPer = avrLevel / 255;

          this.time += avrLevel / 255 * .8 + 0.2;

          Object.values(this.pointLights).forEach((light, index) => {
            const index_ = index / 3 + 1;
            const oriDeg = index * 120;
            light.position.x = Math.sin(oriDeg + time / 30 * index_ * 1.5) * 15;
            light.position.y = Math.cos(oriDeg + time / 30 * index_ * 2) * 10 + 20;
            light.position.z = Math.cos(oriDeg + time / 30 * index_ * 3) * 15;
          });

          const data = [...this.musicData.realTimeData.data];
          const perDeg =  Math.PI * 2 / data.length;
          cubes && cubes.forEach((cube, index) => {
            cube && (cube.scale.y = data[index] / 255 * 2.7 + 0.3);
          });

          circles && circles.forEach((circle, index) => {
            if (circle) {
              circle.scale.y = data[index] / 255 * 2.9 + 0.1;
              circle.position.x = Math.sin(perDeg * index) * 30;
              circle.position.z = Math.cos(perDeg * index) * 30;
            }

          });


          renderer.render(scene, camera);
        }
      },
    },
    watch: {
    },
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
    z-index: 3000;
  }
</style>
