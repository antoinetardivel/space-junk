import './style.scss';
import initGo from './utils/initGo';
import Experience from './webgl/Experience';
initGo();
new Experience(document.getElementById('canvas') as HTMLCanvasElement);
