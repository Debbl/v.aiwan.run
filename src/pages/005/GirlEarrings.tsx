import { useEffect, useRef } from "react";
import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import girlEarringsModel from "./assets/girl-earrings.glb";
import envHDR from "./assets/050.hdr";

const GirlEarrings: React.FC = () => {
  const girlEarringsEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = girlEarringsEl.current!;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, el.clientWidth / el.clientHeight, 0.1, 2000);
    camera.position.set(0, 0, 6);
    camera.aspect = el.clientWidth / el.clientHeight;
    camera.updateProjectionMatrix();
    scene.add(camera);

    // model
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    const gltfLoader = new GLTFLoader().setDRACOLoader(dracoLoader);
    gltfLoader.load(
      girlEarringsModel,
      (m) => {
        scene.add(m.scene);
      },
      (progress) => {
        // eslint-disable-next-line no-console
        console.log(progress);
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.log(err);
      },
    );

    // Light
    const directionLight = new THREE.DirectionalLight("#ffffff", 3);
    directionLight.position.set(0, 3, 2.25);
    scene.add(directionLight);

    // env
    const hdrLoader = new RGBELoader();
    hdrLoader.loadAsync(envHDR).then((t) => {
      t.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = t;
      scene.environment = t;
    });

    // render
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
    });
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    // const axesHelper = new THREE.AxesHelper(1000);
    // scene.add(axesHelper);
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
    function render() {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }, []);
  return <div ref={girlEarringsEl} className="fixed inset-0"></div>;
};

export default GirlEarrings;
