// playerTransform.ts

export function getPlayerTransform(
  progress: number,
  enterStart: number,
  animEnd: number
) {
  const localRaw = (progress - enterStart) / (animEnd - enterStart);
  const local = Math.min(Math.max(localRaw, 0), 1);

  const startPos = { x: 4.5, y: 1.2, z: -13 };
  const endPos = { x: 0.5, y: -0.5, z: -4.5 }; 
  
  const x = startPos.x + (endPos.x - startPos.x) * local;
  const y = startPos.y + (endPos.y - startPos.y) * local;
  const z = startPos.z + (endPos.z - startPos.z) * local;

  const startScale = 0.7;
  // Drastically reduced scale so he doesn't clip out of the screen
  const endScale = 1.5; 
  const scale = startScale + (endScale - startScale) * local;

  return { x, y, z, scale, local };
}

export function getBallTransform(
  progress: number,
  enterStart: number,
  animEnd: number,
  kickStart: number,
  kickEnd: number
) {
  if (progress < kickStart || progress > kickEnd) {
    return { visible: false, x: 0, y: 0, z: 0, scale: 0 };
  }

  const player = getPlayerTransform(kickStart, enterStart, animEnd);
  
  const startX = player.x - (player.scale * 3.5); 

  const startY = player.y - (player.scale * 0.20); 
  
  const startZ = player.z + (player.scale * 0.80);

  const local = (progress - kickStart) / (kickEnd - kickStart);
  const eased = local * local;

  return {
    visible: true,
    x: startX - eased * startX,
    y: startY + eased * (0.3 - startY),
    z: startZ + eased * 6,
    scale: 0.15 + eased * 0.9,
  };
}