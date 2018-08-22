import {Cmd, run} from './cmd';
import {Sub} from './sub';

export type Update<A,M> = (a:A,m:M) => [M,Cmd<A>];
export type Render<M,A> = (s:Sub.Subscriber<A>) => (m:M) => void;

export function runGame<M,A>(update:Update<A,M>, render:Render<M,A>, subs: (m:M) => Sub.Subscription<A>[], initState:[M,Cmd<A>]){
  let currentSubscribedTo: [string, Sub.Cancellable][] = [];
  let [m,c] = initState;
  let currentModel = m;

  function onEvent(event:A){
    const [nModel, ef] = update(event, currentModel);
    runEffect(ef,subs(nModel));
    render(onEvent)(nModel);
    currentModel = nModel;
  };

  function runEffect(ef: Cmd<A>, ss: Sub.Subscription<A>[]):void{
    setTimeout(() =>{
      run(ef,onEvent);
      const currentIds = currentSubscribedTo.map(s => s[0])
      const [currAndRem, newSubs] = partition( su => currentIds.indexOf(su[0]) > -1, ss)
      const [,toRemove] = partition( id => currAndRem.map(s => s[0]).indexOf(id) > -1, currentIds)
      newSubs.forEach( s =>{
        const [id,obs] = s;
        currentSubscribedTo = [ [id, Sub.run(s,onEvent)] ,...currentSubscribedTo]
      } );
      toRemove.forEach( id => {
        currentSubscribedTo.filter( p => p[0] == id ).forEach(canc => canc[1]())
        currentSubscribedTo = currentSubscribedTo.filter( p => p[0] != id )
      } );

    },0);
  }

  function partition<A>(p: (a:A) => boolean, xs: A[]): [A[],A[]] {
    const left:A[] = [], right:A[] = [];
    xs.forEach(e =>{
      if(p(e)){
        left.push(e)
      }else{
        right.push(e)
      }
    });
    return [left,right];
  }

  runEffect(c,subs(m));
}


