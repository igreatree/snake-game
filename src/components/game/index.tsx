import { useEffect, useRef, useState } from "react";
import { Space } from "canv";
import { Snake } from "./Snake";
import { Apple, tApplePosition } from "./Apple";
import { checkIntersects, generateRandomPos, Position, Size, swipeController } from "./misc";
import styles from "./game.module.scss";
import AppleAudio from "../../assets/apple.mp3";
import BonusAudio from "../../assets/bonus.mp3";
import ThemeAudio from "../../assets/theme.mp3";
import SwipeToMoveImage from "../../assets/swipe-to-move.png";
import WASDImage from "../../assets/wasd.png";

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

export const Game = ({ size }: IGameProps) => {
    const isMobile = size.width <= 768;
    const hasLoaded = useRef(false);
    const started = useRef(true);
    const [start, setStart] = useState(true);
    const [finished, setFinished] = useState(false);
    const canvas = useRef(null);
    const speed = useRef(0.7);
    const play = useRef(() => { });
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(0);
    const apples: tApplePosition[] = [{ ...generateRandomPos(size, cellSize), type: "default" }];

    const min = Math.floor(time / 60);
    const sec = time % 60;
    const formattedTime = `${min > 0 ? `${min} min` : ""} ${sec > 0 ? `${sec}` : ""} s`;

    // motion controller
    const processPos = {
        x: (pos: number) => {
            if (pos >= size.width) return -size.width;
            if (pos < -size.width) return size.width;
            return pos
        },
        y: (pos: number) => {
            if (pos >= size.height) return -size.height;
            if (pos < -size.height) return size.height;
            return pos
        },
    }
    const direction = useRef({ x: 0, y: speed.current });
    const currentDirection = useRef(direction.current);
    const lastRotate = useRef({ x: 0, y: 0 });
    const onKeyDown = (e: KeyboardEvent) => {
        switch (e.code) {
            case "ArrowUp":
            case "KeyW":
                if (currentDirection.current.y > 0) return
                direction.current = { x: 0, y: -speed.current };
                break;
            case "ArrowDown":
            case "KeyS":
                if (currentDirection.current.y < 0) return
                direction.current = { x: 0, y: speed.current };
                break;
            case "ArrowLeft":
            case "KeyA":
                if (currentDirection.current.x > 0) return
                direction.current = { x: -speed.current, y: 0 };
                break;
            case "ArrowRight":
            case "KeyD":
                if (currentDirection.current.x < 0) return
                direction.current = { x: speed.current, y: 0 };
                break;
            case "Space":
                if (!started.current) {
                    play.current();
                    started.current = true;
                    setFinished(false);
                }
                break;
            case "KeyR":
                if (!started.current) window.location.reload();
                break;
        }
    };

    const { handleTouchStart, handleTouchMove } = swipeController({
        up: () => onKeyDown({ code: "ArrowUp" } as KeyboardEvent),
        down: () => onKeyDown({ code: "ArrowDown" } as KeyboardEvent),
        right: () => onKeyDown({ code: "ArrowRight" } as KeyboardEvent),
        left: () => onKeyDown({ code: "ArrowLeft" } as KeyboardEvent),
    })

    useEffect(() => {
        if (hasLoaded.current) {
            console.log("Effect ran");
            return;
        }
        if (!canvas.current || start) return
        hasLoaded.current = true
        document.addEventListener("keydown", onKeyDown, false);
        document.addEventListener("touchstart", handleTouchStart, false);
        document.addEventListener("touchmove", handleTouchMove, false);
        const space = Space(canvas.current, { scale: 1 });
        const snake = space.addDrawable(Snake(cellSize));
        space.addDrawable(Apple({ pos: apples, size: cellSize }));
        const timer = setInterval(() => {
            setTime((prev) => prev + 1);
        }, 1000);
        space.draw();
        play.current = () => {
            const animation = setInterval(() => {
                const head = snake.data.pos[0];
                const tail = snake.data.pos[snake.data.pos.length - 1];
                snake.data.pos.forEach((p: Position, index: number) => {
                    if (index === 0) {
                        p.prev = { x: p.x, y: p.y };
                        // process minimum range to rotate
                        if (JSON.stringify(direction.current) !== JSON.stringify(currentDirection.current) && ((p.x + cellSize < lastRotate.current.x || p.x - cellSize > lastRotate.current.x) || (p.y + cellSize < lastRotate.current.y || p.y - cellSize > lastRotate.current.y))) {
                            lastRotate.current = { x: p.x, y: p.y };
                            currentDirection.current = direction.current;
                        }
                        p.x = processPos.x(p.x + currentDirection.current.x);
                        p.y = processPos.y(p.y + currentDirection.current.y);
                    } else {
                        p.prev = { x: p.x, y: p.y };
                        p.x = snake.data.pos[index - 1].prev.x;
                        p.y = snake.data.pos[index - 1].prev.y;
                        if (index > (cellSize * 3) / speed.current && checkIntersects(head, p, cellSize)) {
                            setFinished(true);
                            started.current = false;
                            clearInterval(animation);
                            clearInterval(timer);
                        }
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
                    if (checkIntersects(head, apple, eatConfig.size)) {
                        apples.splice(index, 1);
                        for (let i = 0; i < eatConfig.bonus; i++) {
                            snake.data.pos.push({ x: tail.prev.x, y: tail.prev.y });
                        }
                        eatConfig.audio.pause();
                        eatConfig.audio.currentTime = 0.5;
                        eatConfig.audio.play();
                        setScore(++snake.data.score);
                        apples.push({ ...generateRandomPos(size, cellSize), type: snake.data.score % 10 === 0 ? "gold" : "default" });
                        speed.current = speed.current + eatConfig.speed;
                    }
                });

                space.draw();

                return () => {
                    document.removeEventListener("keydown", onKeyDown);
                    document.removeEventListener("touchstart", handleTouchStart);
                    document.removeEventListener("touchmove", handleTouchMove);
                    clearInterval(animation);
                    clearInterval(timer);
                }
            }, framesPerSecond);
        }
        play.current();
    }, [start]);

    if (start) return <div className={styles.game}>
        <div className={styles.start}>
            <h1>Snake</h1>
            <p>by Islam Gaibullaev</p>
            <button
                className={styles.gradientBorder}
                onClick={() => {
                    themeAudio.play();
                    setStart(false);
                }}
            >
                Start Game
            </button>
            <img src={isMobile ? SwipeToMoveImage : WASDImage} alt="info" width={100} />
            <p>{isMobile ? "swipe to rotate" : "use w,a,s,d or arrows to rotate"}</p>
        </div>
    </div>

    return <div className={styles.game}>
        <canvas ref={canvas} />
        <div className={styles.info}>
            {!finished &&
                <>
                    <h3>{score}</h3>
                    <h4>{formattedTime}</h4>
                </>
            }
            {finished &&
                <>
                    <h3>GAME OVER</h3>
                    <h3>{score}</h3>
                    <h4>{formattedTime}</h4>
                    {!isMobile &&
                        <>
                            <p>Press <b>R</b> to restart.</p>
                        </>
                    }
                    {isMobile &&
                        <div>
                            <button onClick={() => {
                                if (!started.current) window.location.reload();
                            }}>Restart</button>
                        </div>
                    }
                </>
            }
        </div>
    </div>;
}