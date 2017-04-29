function initRenderer(width, height) {
    let renderer = new THREE.WebGLRenderer({
        alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(2);
    return renderer;
}

function initScene() {
    let scene = new THREE.Scene(),
        ambientLight = new THREE.AmbientLight(0x999999),
        directionalLight = new THREE.DirectionalLight(0xbbbbbb, .8);
    directionalLight.position.set(5, 3, 5);

    scene.add(ambientLight).add(directionalLight);
    return scene;
}

function initMesh(scrollRotation) {
    return new Promise((resolve, reject) => {
        new THREE.TextureLoader().load('img/earth.png', (texture) => {
            let geometry = new THREE.SphereGeometry(3, 30, 30);
            // let specular = new THREE.TextureLoader().load('img/specular.png');
            let material = new THREE.MeshPhongMaterial({
                map: texture
            });
            let mesh = new THREE.Mesh(geometry, material);

            mesh.rotation.x = .85;
            mesh.rotation.y = scrollRotation;

            resolve(mesh);
        }, undefined, (err) => {
            reject(err);
        });
    });

}

function initCamera(width, height) {
    let camera = new THREE.PerspectiveCamera(75, height / width);
    camera.position.z = 5;
    return camera;
}

function getScrollRotation(targetElem, offset) {
    let elemtop = targetElem.getBoundingClientRect().top,
        initialOffset = offset !== undefined ? offset : 4.2;

    return initialOffset + (elemtop / 1000);
}

export default function makeGlobe(targetElemSelecector) {
    let targetElem = document.querySelectorAll(targetElemSelecector)[0];
    let scrollRotation = getScrollRotation(targetElem);

    const width = 200,
        height = width,
        renderer = initRenderer(width, height),
        camera = initCamera(width, height),
        scene = initScene();


    initMesh(scrollRotation).then((mesh) => {
        let render = () => {
            mesh.rotation.y = scrollRotation;
            renderer.render(scene.add(mesh), camera);
        }

        render();
        targetElem.appendChild(renderer.domElement);

        document.addEventListener('scroll', () => {
            scrollRotation = getScrollRotation(targetElem);
            requestAnimationFrame(render);
        });
    }).catch((err) => {
        console.error(err);
    });
};
