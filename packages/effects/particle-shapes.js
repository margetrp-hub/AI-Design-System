// Coordinate geometry extracted from the maintainer's original corporate homepage.
// The runtime is independent of the old page and has no business or global state.
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
export function createParticleShapes(count) {
  const ribbon = new Float32Array(count * 3);
  const sphere = new Float32Array(count * 3);
  const helix = new Float32Array(count * 3);
  const rings = new Float32Array(count * 3);
  const galaxy = new Float32Array(count * 3);
  const ringCount = 5;
  const pointsPerRing = Math.ceil(count / ringCount);

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    const normalizedIndex = index / Math.max(1, count - 1);
    const goldenAngle = index * GOLDEN_ANGLE;
    const sphereY = 1 - (2 * index + 1) / count;
    const sphereRadius = Math.sqrt(Math.max(0, 1 - sphereY * sphereY));
    const fill = (index + 0.5) / count;
    const band = index % 13;
    const exponent =
      band < 4 ? 0.56 : band < 8 ? 0.64 : band < 11 ? 0.78 : 0.96;
    const radius = Math.pow(fill, exponent);
    const arm = (index % 5) * ((Math.PI * 2) / 5);
    const curl =
      radius * 5.05 + Math.sin(normalizedIndex * Math.PI * 11) * 0.13;
    const ribbonAngle = goldenAngle * 0.54 + arm + curl;
    const ribbonX = Math.cos(ribbonAngle) * radius;
    const ribbonY = Math.sin(ribbonAngle) * radius;
    const innerWave = Math.sin(goldenAngle * 1.7) * (1 - radius) * 0.24;
    const outerWave =
      Math.sin(goldenAngle * 2.3 + arm) * (0.16 + radius * 0.28);

    ribbon[offset] =
      ribbonX * 6.75 + Math.sin(goldenAngle * 3.1) * (0.22 + radius * 0.2);
    ribbon[offset + 1] = ribbonY * 2.34 + innerWave + outerWave;
    ribbon[offset + 2] =
      (Math.sin(ribbonAngle * 1.4) * 0.98 + Math.cos(goldenAngle) * 0.44) *
      (1.02 + radius * 0.18);

    sphere[offset] = Math.cos(goldenAngle) * sphereRadius * 3.05;
    sphere[offset + 1] = sphereY * 2.86;
    sphere[offset + 2] = Math.sin(goldenAngle) * sphereRadius * 3.05;

    const strand = index % 7;
    const strandAngle = strand * ((Math.PI * 2) / 7);
    const helixAngle =
      goldenAngle * 0.62 + normalizedIndex * Math.PI * 7.5 + strandAngle;
    const helixRadius =
      2.35 +
      (strand % 4) * 0.46 +
      Math.sin(normalizedIndex * Math.PI * 10 + strandAngle) * 0.22;
    const helixWave =
      Math.sin(normalizedIndex * Math.PI * 6 + strandAngle) * 0.44;

    helix[offset] =
      Math.cos(helixAngle) * helixRadius + Math.sin(goldenAngle * 1.4) * 0.32;
    helix[offset + 1] = (normalizedIndex - 0.5) * 5.85 + helixWave;
    helix[offset + 2] =
      Math.sin(helixAngle) * (helixRadius * 0.86) +
      Math.cos(normalizedIndex * Math.PI * 12 + strandAngle) * 0.42;

    const ring = index % ringCount;
    const ringAngle =
      (Math.floor(index / ringCount) / pointsPerRing) * Math.PI * 2 +
      ring * 0.012;
    const ringRadius = 1.55 + ring * 0.78;
    const ringHeight = (ring - (ringCount - 1) / 2) * 0.42;

    rings[offset] = Math.cos(ringAngle) * ringRadius;
    rings[offset + 1] = ringHeight + Math.sin(ringAngle * 2) * 0.1;
    rings[offset + 2] = Math.sin(ringAngle) * ringRadius * 0.72;

    const galaxyArm = index % 9;
    const galaxyAngle = goldenAngle * 0.46 + galaxyArm * ((Math.PI * 2) / 9);
    const galaxyRadius =
      2.7 +
      Math.pow(fill, 0.7) * 3.45 +
      Math.sin(normalizedIndex * Math.PI * 13) * 0.2;
    const galaxyWave =
      Math.sin(galaxyAngle * 2 + normalizedIndex * Math.PI * 4) * 0.48;

    galaxy[offset] = Math.cos(galaxyAngle) * galaxyRadius;
    galaxy[offset + 1] = (galaxyArm - 4) * 0.28 + galaxyWave;
    galaxy[offset + 2] =
      Math.sin(galaxyAngle) * galaxyRadius * 0.62 +
      Math.cos(goldenAngle * 0.8) * 0.34;
  }

  return [ribbon, sphere, helix, rings, galaxy];
}
