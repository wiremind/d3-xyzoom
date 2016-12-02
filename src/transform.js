export function Transform(x, y, kx, ky) {
  this.kx = kx;
  this.ky = ky || kx;
  this.x = x;
  this.y = y;
}

Transform.prototype = {
  constructor: Transform,
  scale: function(kx, ky) {
    ky = ky === undefined ? kx : ky;
    return kx === 1 && (!ky || ky === 1) ? this : new Transform(this.x, this.y, this.kx * kx, this.ky * ky);
  },
  translate: function(x, y) {
    return x === 0 & y === 0 ? this : new Transform(this.x + this.kx * x, this.y + this.ky * y, this.kx, this.ky);
  },
  apply: function(point) {
    return [point[0] * this.kx + this.x, point[1] * this.ky + this.y];
  },
  applyX: function(x) {
    return x * this.kx + this.x;
  },
  applyY: function(y) {
    return y * this.ky + this.y;
  },
  invert: function(location) {
    return [(location[0] - this.x) / this.kx, (location[1] - this.y) / this.ky];
  },
  invertX: function(x) {
    return (x - this.x) / this.kx;
  },
  invertY: function(y) {
    return (y - this.y) / this.ky;
  },
  rescaleX: function(x) {
    return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
  },
  rescaleY: function(y) {
    return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.kx + "," + this.ky + ")";
  }
};

export var identity = new Transform(0, 0, 1, 1);

transform.prototype = Transform.prototype;

export default function transform(node) {
  return node.__zoom || identity;
}
