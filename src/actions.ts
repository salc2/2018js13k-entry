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
export interface UsePressed {
    kind: "use";
    delta: number;
}
export interface AttackPressed {
    kind: "attkp";
    delta: number;
}
export interface AttackReleased {
    kind: "attkr";
    delta: number;
}

export type Action = Time | UpPressed | RightPressed | LeftPressed | LeftReleased | RightReleased | UsePressed | AttackPressed | AttackReleased; 
