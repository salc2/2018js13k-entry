export interface Time {
    kind: "t";
    delta: number;
}
export interface LeftPressed {
    kind: "lp";
    delta: number;
}
export interface RightPressed {
    kind: "rp";
    delta: number;
}
export interface LeftReleased {
    kind: "lr";
    delta: number;
}
export interface RightReleased {
    kind: "rr";
    delta: number;
}
export interface UpPressed {
    kind: "up";
    delta: number;
}

export type Action = Time | UpPressed | RightPressed | LeftPressed | LeftReleased | RightReleased;
