varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

attribute vec3 prevPosition;

uniform float uInterPositionPourcentage;

void main() {
    vec3 newPos = vec3(mix(prevPosition.x, position.x, uInterPositionPourcentage), mix(prevPosition.y, position.y, uInterPositionPourcentage), mix(prevPosition.z, position.z, uInterPositionPourcentage));
    gl_PointSize = 5.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);

    vUv = uv;
    vPosition = position;
    vNormal = normal;
}