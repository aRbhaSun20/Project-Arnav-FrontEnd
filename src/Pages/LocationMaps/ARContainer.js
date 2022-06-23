import React, { Suspense, useRef, useState } from "react";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Environment, OrbitControls } from "@react-three/drei";
import Webcam from "react-webcam";

function ARContainer() {
  return (
    <React.Fragment>
      {/* <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexDirection: "column",
          position: "relative",
        }}
      >
        AR
      </div>{" "} */}
      {/* <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas> */}
      <div>

      <Webcam style={{position:"absolute"}}/>
      </div>
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight />
          <Model />
          <OrbitControls />
          {/* <Environment preset="sunset" background /> */}
        </Suspense>
      </Canvas>
    </React.Fragment>
  );
}

export default ARContainer;

const Model = () => {
  const mesh = useRef();
  const gltf = useLoader(GLTFLoader, "./arrow.gltf");
  // useFrame((state, delta) => (mesh.current.rotation.x += 0.01));
  return (
    <mesh ref={mesh}>
      <primitive object={gltf.scene} scale={0.4} />
    </mesh>
  );
};

function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  // useFrame((state, delta) => (mesh.current.rotation.x += 0.01));
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}
