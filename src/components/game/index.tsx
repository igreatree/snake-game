import { useEffect, useRef, useState } from "react";
import { Space } from "canv";
import { Snake } from "./Snake";
import { Apple, tApplePosition } from "./Apple";
import { checkIntersects, generateRandomPos, Position, Size } from "./misc";
import styles from "./game.module.scss";
import AppleAudio from "../../assets/apple.mp3";
import BonusAudio from "../../assets/bonus.mp3";
import ThemeAudio from "../../assets/theme.mp3";

interface IGameProps {
    size: Size
}

const cellSize = 30;
const framesPerSecond = 1000 / 120;
const themeAudio = new Audio(ThemeAudio);
const appleAudio = new Audio(AppleAudio);
const bonusAudio = new Audio(BonusAudio);

themeAudio.volume = 0.3;
appleAudio.volume = 0.4;
bonusAudio.volume = 0.4;
themeAudio.loop = true;

export const Game = ({size}: IGameProps) => {
    const isMobile = size.width <= 768;
    const hasLoaded = useRef(false);
    const started = useRef(true);
    const [start, setStart] = useState(true);
    const [finished, setFinished] = useState(false);
    const canvas = useRef(null);
    const speed = useRef(0.7);
    const play = useRef(() => {});
    const [score, setScore] = useState(0);
    const apples : tApplePosition[] = [{...generateRandomPos(size, cellSize), type: "default"}];

    // for tests
    // const apples : tApplePosition[] = [{y: -400, x: 10, type: "default"}, {y: -350, x: -10, type: "default"}, {y: -300, x: 15, type: "default"}, {y: -250, x: -15, type: "default"}, {y: -200, x: 20, type: "default"}, {y: -150, x: -20, type: "default"}];
    // const apples : tApplePosition[] = [{x: -400, y: 10, type: "default"}, {x: -350, y: -10, type: "default"}, {x: -300, y: 15, type: "default"}, {x: -250, y: -15, type: "default"}, {x: -200, y: 20, type: "default"}, {x: -150, y: -20, type: "default"}];

    // motion controller
    const processPos = {
        x: (pos: number) => {
            if(pos >= size.width) return -size.width;
            if(pos < -size.width) return size.width;
            return pos
        },
        y: (pos: number) => {
            if(pos >= size.height) return -size.height;
            if(pos < -size.height) return size.height;
            return pos
        },
    }
    const direction = useRef({x: 0, y: speed.current})
    const onKeyDown = (e: KeyboardEvent) => {
        switch (e.code) {
            case "ArrowUp":
            case "KeyW":
                if(direction.current.y > 0) return
                direction.current = {x: 0, y: -speed.current};
                break;
            case "ArrowDown":
            case "KeyS":
                if(direction.current.y < 0) return
                direction.current = {x: 0, y: speed.current};
                break;
            case "ArrowLeft":
            case "KeyA":
                if(direction.current.x > 0) return
                direction.current = {x: -speed.current, y: 0};
                break;
            case "ArrowRight":
            case "KeyD":
                if(direction.current.x < 0) return
                direction.current = {x: speed.current, y: 0};
                break;
            case "Space":
                if(!started.current) {
                    play.current();
                    started.current = true;
                    setFinished(false);
                }
                break;
            case "KeyR":
                if(!started.current) window.location.reload();
                break;
        }
    };

    useEffect(() => {
        if(hasLoaded.current){
            console.log("Effect ran");
            return;
        } 
        if(!canvas.current || start) return
        hasLoaded.current = true
        document.addEventListener("keydown", onKeyDown);
        const space = Space(canvas.current, {scale: 1});
        const snake =  space.addDrawable(Snake(cellSize));
        space.addDrawable(Apple({pos: apples, size: cellSize}));

        space.draw();
        play.current = () => {
            const animation = setInterval(() => {
                const head = snake.data.pos[0];
                const tail = snake.data.pos[snake.data.pos.length - 1];
                snake.data.pos.forEach((p: Position, index: number) => {
                    if(index === 0) {
                        p.prev = {x: p.x, y: p.y};
                        p.x = processPos.x(p.x + direction.current.x);
                        p.y = processPos.y(p.y + direction.current.y);
                    } else {
                        p.prev = {x: p.x, y: p.y};
                        p.x = snake.data.pos[index - 1].prev.x;
                        p.y = snake.data.pos[index - 1].prev.y;
                        if(checkIntersects(head, p, speed.current)) {
                            setFinished(true);
                            started.current = false;
                            clearInterval(animation);
                        }
                        // p.x = p.x - (snake.data.pos[index - 1].prev.x - snake.data.pos[index - 1].x);
                        // p.y = p.y - (snake.data.pos[index - 1].prev.y - snake.data.pos[index - 1].y);
                        // if(snake.data.pos[index - 1].prev.x > p.x) {
                        //     p.x = snake.data.pos[index - 1].prev.x - cellSize
                        //     p.y = snake.data.pos[index - 1].prev.y;
                        // } else {
                        //     p.x = snake.data.pos[index - 1].prev.x;
                        //     p.y = snake.data.pos[index - 1].prev.y - cellSize;
                        // }
                    }
                });
                apples.forEach((apple, index) => {
                    const eatConfig = apple.type === "default" ?
                        {
                            size: cellSize,
                            bonus: 10,
                            speed: 0.05,
                            audio: appleAudio,
                        }
                        :
                        {
                            size: cellSize * 2,
                            bonus: 20,
                            speed: 0.2,
                            audio: bonusAudio,
                        };
                    if(checkIntersects(head, apple, eatConfig.size)) {
                        apples.splice(index, 1);
                        for(let i = 0; i < eatConfig.bonus; i++) {
                            snake.data.pos.push({x: tail.prev.x, y: tail.prev.y});
                        }
                        eatConfig.audio.pause();
                        eatConfig.audio.currentTime = 0.5;
                        eatConfig.audio.play();
                        setScore(++snake.data.score);
                        apples.push({...generateRandomPos(size, cellSize), type: snake.data.score % 10 === 0 ? "gold" : "default"});
                        speed.current = speed.current + eatConfig.speed;
                    }
                });

                space.draw();

                return () => {
                    document.removeEventListener("keydown", onKeyDown);
                    clearInterval(animation);
                }
            }, framesPerSecond);
        }
        play.current();
    }, [start]);

    if(start) return <div className={styles.game}>
        <button
            onClick={() => {
                themeAudio.play();
                setStart(false);
            }}
        >
            Start
        </button>
    </div>

    return <div className={styles.game}>
        <canvas ref={canvas} />
        <div className={styles.info}>
            {!finished && <h3>{score}</h3>}
            {finished && 
                <>
                    <h3>GAME OVER</h3>
                    {!isMobile && 
                        <>
                            <p>Hold <b>SPACE</b> to continue.</p>
                            <p>Press <b>R</b> to restart.</p>
                        </>
                    }
                    {isMobile && 
                        <div>
                            <button onClick={() => {
                                if(!started.current) {
                                    play.current();
                                    started.current = true;
                                    setFinished(false);
                                }
                            }}>Continue</button>
                            <button onClick={() => {
                                if(!started.current) window.location.reload();
                            }}>Restart</button>
                        </div>
                    }
                </>
            }
        </div>
        {isMobile &&
            <div className={styles.controller}>
                <button className={styles.up} onClick={() => onKeyDown({code: "KeyW"} as KeyboardEvent)}>⮕</button>
                <div>
                    <button className={styles.left} onClick={() => onKeyDown({code: "KeyA"} as KeyboardEvent)}>⮕</button>
                    <button className={styles.right} onClick={() => onKeyDown({code: "KeyD"} as KeyboardEvent)}>⮕</button>
                </div>
                <button className={styles.down} onClick={() => onKeyDown({code: "KeyS"} as KeyboardEvent)}>⮕</button>
            </div>
        }
    </div>;
}