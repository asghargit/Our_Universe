import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import * as THREE from 'three'

import sheSmol from '../assets/she_smol.jpg'
import meSmol from '../assets/me_smol.jpg'
import meBig from '../assets/me_big.jpg'
import favPic from '../assets/fav_pic.jpg'
import bestUs from '../assets/best_us.jpg'
import aaaandEngaged from '../assets/aaaand_engaged.jpg'

type MemoryId =
  | 'her'
  | 'me'
  | 'growing'
  | 'herNow'
  | 'us'
  | 'engaged'

type Memory = {
  id: MemoryId
  image: string
  position: [number, number, number]
  title: string
  text: string
}

const memories: Memory[] = [
  {
    id: 'her',
    image: sheSmol,
    position: [-14, 6, 1],
    title: 'Her childhood',
    text: 'Before there was an us, there was you.',
  },
  {
    id: 'me',
    image: meSmol,
    position: [12, -5, 1],
    title: 'His childhood',
    text: 'And somewhere else in the universe, there I was doing crazy things.',
  },
  {
    id: 'growing',
    image: meBig,
    position: [-6, 1, 1],
    title: 'Growing up',
    text: 'Two lives, moving through two different worlds.',
  },
  {
    id: 'herNow',
    image: favPic,
    position: [4, 7, 1],
    title: 'Her',
    text: 'And somehow, the universe led me to you.',
  },
  {
    id: 'us',
    image: bestUs,
    position: [7, -1, 1],
    title: 'Us',
    text: 'Then the two universes became one.',
  },
  {
    id: 'engaged',
    image: aaaandEngaged,
    position: [0, -8, 1],
    title: 'Forever',
    text: 'And this is only the beginning Cause I am going to love you for the rest of my life.',
  },
]

function Galaxy() {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const count = 100000

    const positions = new Float32Array(
      count * 3
    )

    const colors = new Float32Array(
      count * 3
    )

    const palette = [
      new THREE.Color('#10071A'),
      new THREE.Color('#1B0B2E'),
      new THREE.Color('#291044'),
      new THREE.Color('#3A185C'),
      new THREE.Color('#512477'),
      new THREE.Color('#6B348F'),
      new THREE.Color('#8752A5'),
    ]

    for (let i = 0; i < count; i++) {
      const radius =
        Math.pow(Math.random(), 0.72) * 28

      const spiralAngle =
        radius * 0.55

      const randomAngle =
        Math.random() * Math.PI * 2

      const angle =
        randomAngle +
        spiralAngle +
        Math.sin(radius * 0.35) * 0.35

      const spread =
        0.18 +
        radius * 0.045 +
        Math.random() *
          radius *
          0.025

      positions[i * 3] =
        Math.cos(angle) * radius +
        (Math.random() - 0.5) *
          spread

      positions[i * 3 + 1] =
        (Math.random() - 0.5) *
        (3.2 + radius * 0.20)

      positions[i * 3 + 2] =
        Math.sin(angle) * radius +
        (Math.random() - 0.5) *
          spread

      const centerFactor =
        1 - radius / 28

      const colorIndex =
        Math.random() <
        centerFactor * 0.5
          ? 0
          : Math.floor(
              1 + Math.random() * 6
            )

      const color =
        palette[colorIndex]

      const brightness =
        0.28 +
        centerFactor * 0.55 +
        Math.random() * 0.18

      colors[i * 3] =
        color.r * brightness

      colors[i * 3 + 1] =
        color.g * brightness

      colors[i * 3 + 2] =
        color.b * brightness
    }

    return {
      positions,
      colors,
    }
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current) return

    pointsRef.current.rotation.y +=
      delta * 0.018

    pointsRef.current.rotation.x =
      -0.025
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />

        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.108}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.72}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function GalaxyCore() {
  const coreRef =
    useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!coreRef.current) return

    const pulse =
      1 +
      Math.sin(
        state.clock.elapsedTime * 1.2
      ) * 0.08

    coreRef.current.scale.setScalar(
      pulse
    )
  })

  return (
    <mesh ref={coreRef}>
      <sphereGeometry
        args={[1.4, 32, 32]}
      />

      <meshBasicMaterial
        color="#E6A24A"
        transparent
        opacity={0.05}
        blending={
          THREE.AdditiveBlending
        }
        depthWrite={false}
      />
    </mesh>
  )
}

function MemoryStar({
  memory,
  onClick,
  moving,
}: {
  memory: Memory
  onClick: () => void
  moving?: 'her' | 'me'
}) {
  const groupRef =
    useRef<THREE.Group>(null)

  const coreRef =
    useRef<THREE.Mesh>(null)

  const glowRef =
    useRef<THREE.Mesh>(null)

  const isEngagement =
    memory.id === 'engaged'

  useFrame((state) => {
    const time =
      state.clock.elapsedTime

    if (coreRef.current) {
      const pulse =
        1 +
        Math.sin(
          time *
            (isEngagement ? 0.9 : 1.8)
        ) *
          (isEngagement
            ? 0.25
            : 0.16)

      coreRef.current.scale.setScalar(
        pulse
      )
    }

    if (glowRef.current) {
      const pulse =
        1 +
        Math.sin(
          time *
            (isEngagement ? 0.7 : 1.2) +
            memory.position[1]
        ) *
          (isEngagement
            ? 0.18
            : 0.12)

      glowRef.current.scale.setScalar(
        pulse
      )
    }

    if (!groupRef.current || !moving) {
      return
    }

    const orbit =
      time * 0.025

    const centerX = -1.5
    const distanceX = 16.5
    const distanceY = 7

    if (moving === 'her') {
      groupRef.current.position.set(
        centerX -
          Math.cos(orbit) *
            distanceX,
        Math.sin(orbit) *
          distanceY,
        1
      )
    }

    if (moving === 'me') {
      groupRef.current.position.set(
        centerX +
          Math.cos(orbit) *
            distanceX,
        -Math.sin(orbit) *
          distanceY,
        1
      )
    }
  })

  return (
    <group
      ref={groupRef}
      position={memory.position}
    >
      <mesh
        ref={glowRef}
        raycast={() => null}
      >
        <sphereGeometry
          args={[
            isEngagement ? 1 : 0.55,
            16,
            16,
          ]}
        />

        <meshBasicMaterial
          color="#FFD27A"
          transparent
          opacity={
            isEngagement
              ? 0.13
              : 0.06
          }
          blending={
            THREE.AdditiveBlending
          }
          depthWrite={false}
        />
      </mesh>

      <mesh
        ref={coreRef}
        onClick={(event) => {
          event.stopPropagation()
          onClick()
        }}
      >
        <sphereGeometry
          args={[
            isEngagement
              ? 0.2
              : 0.11,
            20,
            20,
          ]}
        />

        <meshBasicMaterial
          color={
            isEngagement
              ? '#FFFFFF'
              : '#FFF1C2'
          }
        />
      </mesh>

      <mesh raycast={() => null}>
        <sphereGeometry
          args={[
            isEngagement
              ? 0.38
              : 0.22,
            16,
            16,
          ]}
        />

        <meshBasicMaterial
          color="#FFD27A"
          transparent
          opacity={
            isEngagement
              ? 0.22
              : 0.12
          }
          blending={
            THREE.AdditiveBlending
          }
          depthWrite={false}
        />
      </mesh>

      {isEngagement && (
        <mesh raycast={() => null}>
          <sphereGeometry
            args={[1.5, 16, 16]}
          />

          <meshBasicMaterial
            color="#FFD27A"
            transparent
            opacity={0.025}
            blending={
              THREE.AdditiveBlending
            }
            depthWrite={false}
          />
        </mesh>
      )}

      <mesh
        onClick={(event) => {
          event.stopPropagation()
          onClick()
        }}
      >
        <sphereGeometry
          args={[
            isEngagement
              ? 0.7
              : 0.5,
            12,
            12,
          ]}
        />

        <meshBasicMaterial
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  )
}

function StarConnection() {
  const connections = [
    [
      memories[0].position,
      memories[2].position,
    ],
    [
      memories[1].position,
      memories[2].position,
    ],
    [
      memories[2].position,
      memories[3].position,
    ],
    [
      memories[2].position,
      memories[4].position,
    ],
    [
      memories[3].position,
      memories[4].position,
    ],
    [
      memories[4].position,
      memories[5].position,
    ],
  ]

  return (
    <group>
      {connections.map(
        ([start, end], index) => (
          <Line
            key={index}
            points={[start, end]}
            color="#FFD27A"
            transparent
            opacity={
              index ===
              connections.length - 1
                ? 0.22
                : 0.09
            }
            lineWidth={0.7}
          />
        )
      )}
    </group>
  )
}

function MemoryPhoto({
  memory,
}: {
  memory: Memory | null
}) {
  const groupRef =
    useRef<THREE.Group>(null)

  const materialRef =
    useRef<THREE.MeshBasicMaterial>(null)

  const glowRef =
    useRef<THREE.MeshBasicMaterial>(null)

  const texture = useMemo(() => {
    if (!memory) return null

    const texture =
      new THREE.TextureLoader().load(
        memory.image
      )

    texture.colorSpace =
      THREE.SRGBColorSpace

    return texture
  }, [memory])

  useFrame((state) => {
    if (!memory) return
    if (!groupRef.current) return
    if (!materialRef.current) return
    if (!glowRef.current) return

    const time =
      state.clock.elapsedTime

    materialRef.current.opacity +=
      (1 -
        materialRef.current.opacity) *
      0.035

    glowRef.current.opacity +=
      (0.14 -
        glowRef.current.opacity) *
      0.035

    groupRef.current.position.y =
      memory.position[1] +
      Math.sin(time * 0.35) * 0.08
  })

  if (!memory || !texture) {
    return null
  }

  return (
    <group
      ref={groupRef}
      position={[
        memory.position[0],
        memory.position[1],
        2.5,
      ]}
    >
      {/* PHOTO GLOW */}
      <mesh
        raycast={() => null}
        scale={[1.1, 1.1, 1]}
      >
        <planeGeometry
          args={[4.5, 5.8]}
        />

        <meshBasicMaterial
          ref={glowRef}
          map={texture}
          transparent
          opacity={0}
          color="#FFD27A"
          blending={
            THREE.AdditiveBlending
          }
          depthWrite={false}
        />
      </mesh>

      {/* ACTUAL PHOTO */}
      <mesh
        position={[0, 0, 0.08]}
        raycast={() => null}
      >
        <planeGeometry
          args={[4.2, 5.4]}
        />

        <meshBasicMaterial
          ref={materialRef}
          map={texture}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

function CameraController({
  selectedMemory,
}: {
  selectedMemory: Memory | null
}) {
  const targetPosition = useMemo(
    () => new THREE.Vector3(),
    []
  )

  const lookTarget = useMemo(
    () => new THREE.Vector3(),
    []
  )

  const dragX = useRef(0)
  const dragY = useRef(0)

  const lastX = useRef(0)
  const lastY = useRef(0)

  const dragging = useRef(false)

  useEffect(() => {
    const handlePointerDown = (
      event: PointerEvent
    ) => {
      if (event.button !== 0) return

      dragging.current = true

      lastX.current =
        event.clientX

      lastY.current =
        event.clientY
    }

    const handlePointerMove = (
      event: PointerEvent
    ) => {
      if (!dragging.current) return

      const deltaX =
        event.clientX -
        lastX.current

      const deltaY =
        event.clientY -
        lastY.current

      lastX.current =
        event.clientX

      lastY.current =
        event.clientY

      dragX.current -=
        deltaX * 0.03

      dragY.current -=
        deltaY * 0.03

      dragX.current =
        THREE.MathUtils.clamp(
          dragX.current,
          -12,
          12
        )

      dragY.current =
        THREE.MathUtils.clamp(
          dragY.current,
          -10,
          10
        )
    }

    const handlePointerUp = () => {
      dragging.current = false
    }

    window.addEventListener(
      'pointerdown',
      handlePointerDown
    )

    window.addEventListener(
      'pointermove',
      handlePointerMove
    )

    window.addEventListener(
      'pointerup',
      handlePointerUp
    )

    return () => {
      window.removeEventListener(
        'pointerdown',
        handlePointerDown
      )

      window.removeEventListener(
        'pointermove',
        handlePointerMove
      )

      window.removeEventListener(
        'pointerup',
        handlePointerUp
      )
    }
  }, [])

  useFrame(({ camera }) => {
    if (selectedMemory) {
      const [x, y] =
        selectedMemory.position

      targetPosition.set(
        x + dragX.current,
        y + dragY.current,
        8
      )

      lookTarget.set(
        x,
        y,
        0
      )
    } else {
      targetPosition.set(
        dragX.current,
        3 + dragY.current,
        38
      )

      lookTarget.set(
        0,
        0,
        0
      )
    }

    camera.position.lerp(
      targetPosition,
      0.025
    )

    camera.lookAt(lookTarget)
  })

  return null
}

function App() {
  const [intro, setIntro] =
    useState(true)

  const [selectedId, setSelectedId] =
    useState<MemoryId | null>(null)

  const selectedMemory =
    memories.find(
      (memory) =>
        memory.id === selectedId
    ) ?? null

  const handleExplore = () => {
    setIntro(false)
    setSelectedId(null)
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#02010A]">

      {/* NAVBAR */}
      <nav className="pointer-events-none absolute inset-x-0 top-0 z-[60] flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="pointer-events-auto">
          <span className="text-[11px] font-light uppercase tracking-[0.35em] text-[#EAF2FF]/70">
            Our Universe
          </span>
        </div>

        <div className="flex items-center gap-7 sm:gap-10">
          <button
            type="button"
            onClick={handleExplore}
            className="pointer-events-auto text-[9px] uppercase tracking-[0.3em] text-[#EAF2FF]/50 transition-opacity hover:opacity-100"
          >
            Explore
          </button>

          <button
            type="button"
            className="pointer-events-auto text-lg text-[#FFD27A]/70 transition-transform hover:scale-110"
            aria-label="Love"
          >
            ♡
          </button>
        </div>
      </nav>

      {/* UNIVERSE */}
      <Canvas
        camera={{
          position: [0, 3, 38],
          fov: 65,
        }}
        dpr={[1, 2]}
      >
        <CameraController
          selectedMemory={selectedMemory}
        />

        <Galaxy />

        <GalaxyCore />

        <StarConnection />

        <MemoryStar
          memory={memories[0]}
          moving="her"
          onClick={() =>
            setSelectedId('her')
          }
        />

        <MemoryStar
          memory={memories[1]}
          moving="me"
          onClick={() =>
            setSelectedId('me')
          }
        />

        {memories
          .slice(2)
          .map((memory) => (
            <MemoryStar
              key={memory.id}
              memory={memory}
              onClick={() =>
                setSelectedId(memory.id)
              }
            />
          ))}

        <MemoryPhoto
          memory={selectedMemory}
        />
      </Canvas>

      {/* CINEMATIC INTRO */}
      <div
        className={`
          pointer-events-none
          absolute inset-0
          z-50
          flex items-center justify-center
          bg-[#02010A]
          transition-opacity
          ${intro ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          transitionDuration: '1400ms',
        }}
      >
        <div className="px-8 text-center">
          <h1
            className="
              max-w-4xl
              text-xl
              font-light
              leading-relaxed
              tracking-[0.02em]
              text-[#EAF2FF]
              sm:text-3xl
              md:text-4xl
              lg:text-5xl
            "
          >
            When I say our love is beyond this world, I mean it.
          </h1>
        </div>
      </div>

      {/* EXPLORE HINT */}
      {!intro &&
        !selectedMemory && (
          <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-center">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#EAF2FF]/40">
              Drag to explore
            </p>
          </div>
        )}

      {/* MEMORY */}
      {selectedMemory && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-16 z-40 px-6 text-center">
            <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-[#FFD27A]/60">
              {selectedMemory.title}
            </p>

            <p className="text-lg font-light tracking-wide text-[#EAF2FF]/90 sm:text-xl">
              {selectedMemory.text}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setSelectedId(null)
            }
            className="pointer-events-auto absolute bottom-10 left-1/2 z-50 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-[#FFD27A] opacity-70 transition-opacity hover:opacity-100"
          >
            Return to the universe
          </button>
        </>
      )}
    </main>
  )
}

export default App