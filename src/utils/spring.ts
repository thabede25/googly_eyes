export class Spring {
  value: number;
  velocity: number = 0;
  stiffness: number;
  damping: number;

  constructor(initialValue: number, stiffness = 200, damping = 0.7) {
    this.value = initialValue;
    this.stiffness = stiffness;
    this.damping = damping;
  }

  step(target: number, dt: number): number {
    const c = 2 * Math.sqrt(this.stiffness) * this.damping;
    this.velocity += (this.stiffness * (target - this.value) - c * this.velocity) * dt;
    this.value += this.velocity * dt;
    return this.value;
  }

  snapTo(v: number) {
    this.value = v;
    this.velocity = 0;
  }
}
