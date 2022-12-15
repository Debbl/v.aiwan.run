import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Water } from "three/examples/jsm/objects/Water2";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import skyImg from "./assets/sky.jpg";
import water1Img from "./assets/Water_1_M_Normal.jpg";
import water2Img from "./assets/water_2_M_Normal.jpg";
import islandModel from "./assets/island.glb";
import envHDR from "./assets/050.hdr";

const WaterSky: React.FC = () => {
  const waterSkyEl = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = waterSkyEl.current!;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      el.clientWidth / el.clientHeight,
      0.1,
      2000
    );
    camera.position.set(-50, 50, 130);
    camera.aspect = el.clientWidth / el.clientHeight;
    camera.updateProjectionMatrix();
    scene.add(camera);

    // add
    const textureLoader = new THREE.TextureLoader();
    // sky
    const skyTexture = textureLoader.load(skyImg);
    const skyGeometry = new THREE.SphereGeometry(1000, 60, 60);
    const skyMaterial = new THREE.MeshBasicMaterial({
      map: skyTexture,
      side: THREE.DoubleSide,
    });
    skyGeometry.scale(1, 1, 1);
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);
    // sky video
    import("./assets/sky.mp4").then((res) => {
      const skyVideoEl = document.createElement("video");
      skyVideoEl.src = res.default;
      skyVideoEl.loop = true;
      skyVideoEl.muted = true;
      skyVideoEl.play();
      const skyVideoTexture = new THREE.VideoTexture(skyVideoEl);
      skyMaterial.map = skyVideoTexture;
      skyMaterial.map.needsUpdate = true;
    });
    // water
    const waterGeometry = new THREE.CircleGeometry(1000, 64);
    const water = new Water(waterGeometry, {
      normalMap0: textureLoader.load(water1Img),
      normalMap1: textureLoader.load(water2Img),
      textureWidth: 1024,
      textureHeight: 1024,
      color: 0xeeeeff,
      flowDirection: new THREE.Vector2(1, 1),
      scale: 1,
    });
    water.position.y = 3;
    water.rotation.x = -Math.PI / 2;
    scene.add(water);
    // island
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    const gltfLoader = new GLTFLoader().setDRACOLoader(dracoLoader);
    gltfLoader.load(islandModel, (m) => {
      scene.add(m.scene);
    });
    // light
    const directionalLight = new THREE.DirectionalLight(0xfff, 1);
    directionalLight.position.set(-100, 100, 10);
    scene.add(directionalLight);
    // env
    const hdrLoader = new RGBELoader();
    hdrLoader.loadAsync(envHDR).then((t) => {
      t.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = t;
      scene.environment = t;
    });

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
    });
    renderer.outputEncoding = THREE.sRGBEncoding;
    const axesHelper = new THREE.AxesHelper(1000);
    scene.add(axesHelper);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    renderer.render(scene, camera);
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);
    window.addEventListener("resize", () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
    });
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;
    function render() {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }, []);
  return <div ref={waterSkyEl} className="fixed inset-0"></div>;
};

export default WaterSky;
