
type Vec2 = [number, number];

const pointInLine = (a: Vec2, b: Vec2, T: number): Vec2 => [a[0] - (a[0] - b[0]) * T, a[1] - (a[1] - b[1]) * T];

// eslint-disable-next-line max-params
function cubicBezierLerp(p1: Vec2, p2: Vec2, p3: Vec2, p4: Vec2, T: number): Vec2 {
  const a = pointInLine(p1, p2, T);
  const b = pointInLine(p2, p3, T);
  const c = pointInLine(p3, p4, T);
  const d = pointInLine(a, b, T);
  const e = pointInLine(b, c, T);
  return pointInLine(d, e, T);
}

export function easeInAndOutLerp(T: number): number {
  return cubicBezierLerp([0, 0], [0.25, 0.4], [0.75, 0.6], [1, 1], T)[0];
}

export default cubicBezierLerp;
