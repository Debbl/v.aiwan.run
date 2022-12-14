import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Triangle: React.FC = () => {
  const triangleEl = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = triangleEl.current!;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      el.clientWidth / el.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);
    scene.add(camera);

    // add
    for (let i = 0; i < 50; i++) {
      const vertices = new Float32Array(9);
      for (let j = 0; j < 9; j++) {
        vertices[j] = Math.random() * 10 - 5;
      }
      const color = new THREE.Color(
        Math.random(),
        Math.random(),
        Math.random()
      );
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
      const material = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    }

    // render and resize
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(el.clientWidth, el.clientHeight);
    // const axesHelper = new THREE.AxesHelper(6);
    // scene.add(axesHelper);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
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
      renderer.physicallyCorrectLights = true;
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    // dat.gui
    const gui = new dat.GUI();
    gui.add(controls, "autoRotate").name("自动旋转");
    gui.add(controls, "autoRotateSpeed").name("速度").min(0).max(10);
  }, []);
  return <div ref={triangleEl} className="fixed inset-0"></div>;
};

export default Triangle;
