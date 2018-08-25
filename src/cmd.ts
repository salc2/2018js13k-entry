import {Subscriber} from './sub';
export type Cmd<A> = [() => void, A];

export function emptyCmd<A>(): Cmd<A> { return [null, null] };

export function run<A>(cmd:Cmd<A>, sbr:Subscriber<A>): void{
    if(cmd[0] == null && cmd[1] == null){}
        else {
            const [eff,a] = cmd;
            eff();
            if(a != null){
                sbr(a)
            }
        }
    }

export function create<A>(body: () => void, a: A): Cmd<A>{
    return [body, a]
    }

