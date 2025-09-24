const Utilities = function Utilities() {};

Utilities.clamp = function (value, min, max) {
  return Math.min(Math.max(value, min), max);
};

Utilities.getRandom = function (min, max) {
  return Math.random() * (max - min) + min;
};

Utilities.normalize = function (value, max) {
  return value / max;
};

Utilities.lerp = function (start, end, t) {
  return (end - start) * t + start;
};
