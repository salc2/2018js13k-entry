  export function partition<A>(p: (a:A) => boolean, xs: A[]): [A[],A[]] {
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
