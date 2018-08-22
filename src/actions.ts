export interface Time {
    kind: "time";
    delta: number;
}
export interface LeftPressed {
    kind: "leftPressed";
    delta: number;
}
export interface RightPressed {
    kind: "rightPressed";
    delta: number;
}
export interface LeftReleased {
    kind: "leftReleased";
    delta: number;
}
export interface RightReleased {
    kind: "rightReleased";
    delta: number;
}
export interface UpPressed {
    kind: "upPressed";
    delta: number;
}

export type Action = Time | UpPressed | RightPressed | LeftPressed | LeftReleased | RightReleased;
