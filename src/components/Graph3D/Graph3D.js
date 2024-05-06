import { useRef, useEffect } from "react";
import Math3D from "../../modules/Math3D/Math3D";
import useGraph from "../../modules/Graph/useGraph";
import Point from "../../modules/Math3D/entities/Point";
import Light from "../../modules/Math3D/entities/Light";
import Sphere from "../../modules/Math3D/surfaces/sphere";

import './Graph3D.css';

const Graph3D = () => {
    const graph3DViewPointsRef = useRef();
    const graph3DViewEdgesRef = useRef();
    const graph3DViewPolygonsRef = useRef();
    const graph3DRotateLightRef = useRef();
    const graph3DPlayAnimationRef = useRef();
    const WIN = {
        LEFT: -5,
        BOTTOM: -5,
        WIDTH: 10,
        HEIGHT: 10,
        CENTER: new Point(0, 0, -40),
        CAMERA: new Point(0, 0, -50),
    };
    let graph = null;
    const [getGraph, cancelGraph] = useGraph(renderScene)
    const math3D = new Math3D(WIN);
    const gradus = Math.PI / 180 / 4;
    const zoomStep = 0.1;
    const moveStep = 4;
    let canMove = false;
    const rotateXT = math3D.getOneT();
    const rotateYT = math3D.getOneT();
    const rotateZT = math3D.getOneT();
    const deltaPosT = [
        [1 + zoomStep, 0, 0, 0],
        [0, 1 + zoomStep, 0, 0],
        [0, 0, 1 + zoomStep, 0],
        [0, 0, 0, 1]
    ];
    const deltaNegT = [
        [1 - zoomStep, 0, 0, 0],
        [0, 1 - zoomStep, 0, 0],
        [0, 0, 1 - zoomStep, 0],
        [0, 0, 0, 1]
    ];
    const LIGHT = new Light(-30, 20, -30, 1500);
    let mouseButton;
    let dx = 0;
    let dy = 0;
    let viewShadows;

    const scene = [new Sphere({ color: '#ffff00' })];

    function wheelHandler(event) {
        event.preventDefault();
        let T = [];
        let delta = 0;
        if (event.wheelDelta > 0) {
            delta = 1 + zoomStep;
            T = deltaPosT;
        } else {
            delta = 1 - zoomStep;
            T = deltaNegT;
        }
        if (graph3DRotateLightRef.current.value) {
            LIGHT.lumen *= delta ** 2;
            math3D.transformPoint(LIGHT, T);
        }
        scene.forEach(surface => {
            surface.points.forEach(point => math3D.transformPoint(point, T));
            math3D.transformPoint(surface.center, T);
        });
    }

    function mouseupHandler() {
        canMove = false;
    }

    function mousedownHandler(event) {
        event.preventDefault();
        canMove = true;
        mouseButton = event.button;
    }

    function mousemoveHandler(event) {
        event.preventDefault();
        if (canMove) {
            switch (mouseButton) {
                case 0:
                    let alphaY = 0, alphaX = 0;
                    if (dy !== event.offsetY) {
                        alphaX = (dy - event.offsetY) * gradus;
                    }
                    if (dx !== event.offsetX) {
                        alphaY = (dx - event.offsetX) * gradus;
                    }
                    rotateXT = math3D.getOxRotateT(alphaX);
                    rotateYT = math3D.getOyRotateT(alphaY);
                    scene.forEach(surface => {
                        surface.points.forEach(point => {
                            math3D.transformPoint(point, rotateXT);
                            math3D.transformPoint(point, rotateYT);
                        });
                        math3D.transformPoint(surface.center, rotateYT);
                        math3D.transformPoint(surface.center, rotateXT);
                    });
                    if (graph3DRotateLightRef.current.value) {
                        math3D.transformPoint(LIGHT, rotateYT);
                        math3D.transformPoint(LIGHT, rotateXT);
                    }

                    break;
                case 1:
                    const dy = graph.sy(event.movementY) * moveStep;
                    const T1 = math3D.getMoveT({ dy });
                    scene.forEach(surface => {
                        surface.points.forEach(point =>
                            math3D.transformPoint(point, T1));
                        math3D.transformPoint(surface.center, T1);
                    });
                    if (graph3DRotateLightRef.current.value) {
                        math3D.transformPoint(LIGHT, T1);
                    }
                    break;
                case 2:
                    const dx = graph.sx(event.movementX) * moveStep;
                    const T2 = math3D.getMoveT({ dx })
                    scene.forEach(surface => {
                        surface.points.forEach(point =>
                            math3D.transformPoint(point, T2));
                        math3D.transformPoint(surface.center, T2);
                    });
                    if (graph3DRotateLightRef.current.value) {
                        math3D.transformPoint(LIGHT, T2);
                    }
                    break;
            }
        }
        dy = event.offsetY;
        dx = event.offsetX;
    }

    function mouseoutHandler() {
        canMove = false;
    }

    function checkboxHandler(ref) {
        return !ref.current.checked;
    }

    function clearScene() {
        scene = [];
    }

    function renderScene(FPS = 0) {
        if (graph) {
            graph.clear();
            scene.forEach((surface) => {
                if (graph3DViewPolygonsRef?.current?.value) {
                    let polygons = [];
                    scene.forEach((surface, index) => {
                        math3D.calcCenter(surface);
                        math3D.calcRadius(surface);
                        math3D.calcDistance(surface, WIN.CAMERA, 'distance');
                        math3D.calcDistance(surface, LIGHT, 'lumen');
                        if (surface.bulge)
                            math3D.calcVisibility(surface, WIN.CAMERA);
                        surface.polygons.forEach(polygon => {
                            polygon.index = index;
                            polygons.push(polygon);
                        })
                    });
                    math3D.sortByArtistAlgorithm(polygons);
                    polygons.forEach(polygon => {
                        if (polygon.visibility) {
                            const points = polygon.points.map(index => new Point(
                                math3D.xs(scene[polygon.index].points[index]),
                                math3D.ys(scene[polygon.index].points[index])
                            ));
                            let { r, g, b } = polygon.color;
                            const { isShadow, dark } = (viewShadows) ?
                                math3D.calcShadow(polygon, scene, LIGHT) :
                                { isShadow: false, dark: 1 };
                            const lumen = math3D.calcIllumination(polygon.lumen,
                                LIGHT.lumen) * (isShadow ? dark : 1);
                            r = Math.round(r * lumen);
                            g = Math.round(g * lumen);
                            b = Math.round(b * lumen);
                            graph.polygon(points, polygon.rgbToHex(r, g, b));
                        }
                    });
                }

                if (graph3DViewEdgesRef?.current?.value) {
                    surface.edges.forEach(edge => {
                        const point1 = surface.points[edge.p1];
                        const point2 = surface.points[edge.p2];
                        graph.line(
                            math3D.xs(point1), math3D.ys(point1),
                            math3D.xs(point2), math3D.ys(point2),
                            edge.color
                        );
                    });
                }

                if (graph3DViewPointsRef?.current?.value) {
                    graph.pointLite(math3D.xs(surface.center), math3D.ys(surface.center), 'red')
                    surface.points.forEach(
                        point => graph.pointLite(math3D.xs(point), math3D.ys(point), point.color)
                    );
                }
                graph.drawSun(math3D.xs(LIGHT), math3D.ys(LIGHT));
            });

            graph.text(`fps: ${FPS}`, WIN.LEFT, WIN.BOTTOM - 1, 'black', 25);
            graph.renderFrame();
        }
    }

    useEffect(() => {
        graph = getGraph({
            id: 'Graph3D',
            WIN,
            width: 600,
            height: 600,
            callbacks: {
                wheel: wheelHandler,
                mousemove: mousemoveHandler,
                mouseup: mouseupHandler,
                mousedown: mousedownHandler,
                mouseout: mouseoutHandler,
            }
        });
        const interval = setInterval(() => {
            if (graph3DPlayAnimationRef.current.value) {
                scene.forEach(surface => surface.doAnimation(math3D));
            }
        }, 20);

        return () => {
            cancelGraph();
            clearInterval(interval);
        }
    });

    return (<>
        <canvas id="Graph3D"></canvas>
        <div>
            <button onClick={clearScene}>очистить</button>
            <div>
                <input type="checkbox" ref={graph3DViewPointsRef} className="surfaceCustom"
                    onClick={() => checkboxHandler(graph3DViewPointsRef)} />
                <label>Точки</label>
                <input type="checkbox" ref={graph3DViewEdgesRef} className="surfaceCustom"
                    onClick={() => checkboxHandler(graph3DViewPointsRef)} />
                <label>Ребра</label>
                <input type="checkbox" ref={graph3DViewPolygonsRef} className="surfaceCustom"
                    onClick={() => checkboxHandler(graph3DViewPointsRef)} />
                <label>Грани</label>
                <input type="checkbox" className="surfaceCustom"
                    onClick={() => checkboxHandler(graph3DViewPointsRef)} />
                <label>Тени</label>
                {/* <input type="checkbox" ref={graph3DRotateLightRef} className="surfaceCustom" */}
                    {/* onClick={() => checkboxHandler(graph3DViewPointsRef)} /> */}
                {/* <label>Вращать свет со сценой</label> */}
                <input type="checkbox" ref={graph3DPlayAnimationRef} className="surfaceCustom"
                    onClick={() => checkboxHandler(graph3DViewPointsRef)} />
                <label>Анимация</label>
            </div>
        </div>
        {/* <div id="figuresPanel">
            <div id="addFiguresPanel">
                <button id="addCubeBtn" className="addFiguresBtn">куб</button>
                <button id="addSphereBtn" className="addFiguresBtn">сфера</button>
                <button id="addTorusBtn" className="addFiguresBtn">тор</button>
            </div>
            <div id="figuresList">
            </div>
        </div> */}
    </>);
}

export default Graph3D;