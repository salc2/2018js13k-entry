export type Cancellable = () => void;
export type Subscriber<A> = (a:A) => void;
export type Observable<A> = (s:Subscriber<A>) => Cancellable;
export type Subscription<A> = [string, Observable<A>];

export function create<A>(id:string, obs:Observable<A>):Subscription<A> {
   return [id,obs];
}

export function run<A>(sub:Subscription<A>, sbr:Subscriber<A>): Cancellable{
   const [id, obs] = sub;
   return obs(sbr);
}

export function sampleOn<A>(s1:Subscription<A>,s2:Subscription<A>, zero: A):Subscription<A>{
   const [id1,obs1] = s1; 
   const [id2,obs2] = s2; 
   return create(`${id1}|${id2}`, (consumer) => {
  let tmp = zero;
  const canc2 = run(s2, (msg) => tmp = msg);
  const canc1 =
    run(
      s1,
      (msg) => {
        if (tmp == zero) {
          consumer(msg);
        } else {
          consumer(tmp);
        };
        tmp = zero;
      }
    );

  return () => {
    canc1();
    canc2();
  }

});
}
