import * as THREE from 'three'

const COLORS = {
  bg: '#050508',
  dim: '#6272a4',
  l2: '#d4614e',
  l1: '#8B62B8',
  l0: '#2BC9A0',
  warn: '#ffb86c',
  white: '#f8f8f2',
}

export interface PrvseAtmosphere {
  group: THREE.Group
  tick: (elapsed: number) => void
}

function makeRing(radius: number, color: string, opacity: number, z: number, tilt = 0): THREE.LineLoop {
  const points: THREE.Vector3[] = []
  for (let i = 0; i < 192; i++) {
    const a = (Math.PI * 2 * i) / 192
    points.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius * 0.55, z))
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points)
  const mat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
  })
  const ring = new THREE.LineLoop(geo, mat)
  ring.rotation.z = tilt
  ring.userData = { baseOpacity: opacity }
  return ring
}

function makeStarField(): THREE.Points {
  const positions: number[] = []
  const colors: number[] = []
  const palette = [COLORS.dim, COLORS.white, COLORS.l2, COLORS.l1, COLORS.l0].map(c => new THREE.Color(c))

  for (let i = 0; i < 260; i++) {
    const r = 160 + Math.random() * 520
    const a = Math.random() * Math.PI * 2
    const z = -90 + Math.random() * 130
    positions.push(Math.cos(a) * r, Math.sin(a) * r * 0.62, z)
    const c = palette[i % palette.length]
    colors.push(c.r, c.g, c.b)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const mat = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.52,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const stars = new THREE.Points(geo, mat)
  stars.userData = { spin: 0.005 }
  return stars
}

function makeFlowParticles(): THREE.Points {
  const positions: number[] = []
  const colors: number[] = []
  const palette = [COLORS.l2, COLORS.l1, COLORS.l0, COLORS.warn].map(c => new THREE.Color(c))
  for (let i = 0; i < 96; i++) {
    const lane = i % 3
    const radius = 155 + lane * 72
    const a = (i / 96) * Math.PI * 2
    positions.push(Math.cos(a) * radius, Math.sin(a) * radius * 0.55, -30 + lane * 18)
    const c = palette[lane]
    colors.push(c.r, c.g, c.b)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  const mat = new THREE.PointsMaterial({
    size: 4,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const points = new THREE.Points(geo, mat)
  points.userData = { flow: true }
  return points
}

export function createPrvseAtmosphere(): PrvseAtmosphere {
  const group = new THREE.Group()
  group.name = 'prvse-controlled-constellation'

  const stars = makeStarField()
  const flow = makeFlowParticles()
  const rings = [
    makeRing(245, COLORS.l2, 0.2, -54, 0.18),
    makeRing(315, COLORS.l1, 0.16, -68, -0.24),
    makeRing(385, COLORS.l0, 0.12, -82, 0.08),
  ]

  group.add(stars)
  rings.forEach(ring => group.add(ring))
  group.add(flow)

  return {
    group,
    tick(elapsed: number) {
      stars.rotation.z = elapsed * 0.01
      flow.rotation.z = elapsed * 0.12
      flow.rotation.x = Math.sin(elapsed * 0.18) * 0.06
      rings.forEach((ring, index) => {
        ring.rotation.z += 0.0008 * (index + 1)
        const mat = ring.material as THREE.LineBasicMaterial
        mat.opacity = (ring.userData.baseOpacity as number) * (0.82 + Math.sin(elapsed * (0.7 + index * 0.2)) * 0.18)
      })
    },
  }
}
