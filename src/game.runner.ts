import {Cmd, run} from './cmd';
import {Subscription, Cancellable, Subscriber, run as runSub} from './sub';
import {partition} from './utils';

export type Update<A,M> = (a:A,m:M) => [M,Cmd<A>];
export type Render<M,A> = (s:Subscriber<A>) => (m:M) => void;

export function runGame<M,A>(update:Update<A,M>, render:Render<M,A>, subs: (m:M) => Subscription<A>[], initState:[M,Cmd<A>]){
  let currentSubscribedTo: [string, Cancellable][] = [];
  let [m,c] = initState;
  let currentModel = m;

  function delayUpdate(event:A){
     setTimeout(() =>{
       const [nModel, ef] = update(event, currentModel);
        runEffect(ef,subs(nModel));
        currentModel = nModel;
     },30);
  }

  function onEvent(event:A){
    delayUpdate(event);
    render(onEvent)(currentModel);
  };

  function runEffect(ef: Cmd<A>, ss: Subscription<A>[]):void{
    
      run(ef,onEvent);
      const currentIds = currentSubscribedTo.map(s => s[0])
      const [currAndRem, newSubs] = partition( su => currentIds.indexOf(su[0]) > -1, ss)
      const [,toRemove] = partition( id => currAndRem.map(s => s[0]).indexOf(id) > -1, currentIds)
      newSubs.forEach( s =>{
        const [id,obs] = s;
        currentSubscribedTo = [ [id, runSub(s,onEvent)] ,...currentSubscribedTo]
      } );
      toRemove.forEach( id => {
        currentSubscribedTo.filter( p => p[0] == id ).forEach(canc => canc[1]())
        currentSubscribedTo = currentSubscribedTo.filter( p => p[0] != id )
      } );

   
  }

  runEffect(c,subs(m));
}


