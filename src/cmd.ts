import {Subscriber} from './sub';
export type Cmd<A> = [() => void, A];

export function emptyCmd<A>(): Cmd<A> { return [()=>{}, null] };

export function run<A>(cmd:Cmd<A>, sbr:Subscriber<A>): void{
    if(cmd[1] == null){}
        else {
            const [eff,a] = cmd;
            eff();
        }
    }

