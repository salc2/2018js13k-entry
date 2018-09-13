# Cloudapocalypsis Now: The learning of machines.
## This project is an entry for the Js13k game jam which consists in develop an HTML5 game in one month in only 13 Kilobytes at most.
[GAME ONLINE](http://salc2.github.io/cloudapocalypsis/)
I got inspired by Apogee early 90's MS-DOS game. 
Bio Menace, Secret Agent. 
During my childhood I spent some hours at night playing those. 

I used Typescript instead of vanilla Javascript. Althoug I really like Javascript I do prefer have a type system.
I did not use any third party library or engine due to the obvious limitation of size.
Just use sonant-x for synth audio generation. 
During competition I bought an music instrument and learned a bit about music theory and composition. So I managed to 'compose' some theme song for my entry. It was quite cool, for sure I will continue learning.

I tried to architect game in an unidirectional data flow way kind of 'Functional?' Reactive Programming. Where `update` it is just a function which receive a new envent and the last state and returns a new state. (FSM).
Functional is between quotes and with question mark because even you try it, having a bunch of imperative things at your service and the rush factor do not help.
I evaluated using ReasonML, Purescript even ScalaJS but all of them need extra JS libraries in order to run the transpiled javascript code.

I avoid using classes and instanciation with new due to they generate more codebase or at least that I thought. Instead I just used Tuples of differents size with Type Aliases so like that I could have the type system safety and without any evidence in the generated JS.

The architecture is basically defined with the interaction of 6 building block which are:

- Cancellable
- Observable
- Subscription
- Subscriber
- Action
- Cmd

Those components interact with an `update` function and a `render` function mainly.
The update receive as parameters and Action (which could be an user input key pressed) and an initial state in first time or the latest one stored in some place and render receive that state and renders it.

I tried (again) to make all necessary functions testable but (again I failed) rush factor and the lack of functional purity of the language makes me do naugthy things. I used Jest and there is no doubt that make things testable from the beginning ables to me reason about it and allow me to implement them quickly.

I made from scratch pixel art and assets.
I used Gimp and Krita for arts. Krita only to test how good an sprite animation looked with how many fps. 
Later using the global time (performance.now()) I implemented frame based animation:
```
const seqTimeI = (t:number) =>  Math.floor(1+(t* (0.02/5))%2);
```
"player_1_walking.png"
"player_2_walking.png"

"player_"+seqTimeI(performance.now())+"_walking.png"

That function will iterate between 1 and 2, 5 times per second or each 200ms.

I decide to model my world/map in tiles of 20px, where the canvas size is 180px X 100px (Later I just scaled it up using CSS) That allowed me have atlases/ spritesheets really small.

I used texturePacker to package every sprite in one big atlas.

I mapped one ascii character to one tile in my atlas. Like this I could just drew my world using long string using this:

http://stable.ascii-flow.appspot.com/#Draw

Later I developed a function to encode, decode this string in something a bit smaller.

This is a quite naive solutions becase the amount of sprites will be limitated by the amout of ascii characters. But quite worked well for this small limited map.


I used `drawImage` implementation webgl from webglfundamentals.org:

https://webglfundamentals.org/webgl/lessons/webgl-2d-drawimage.html

I learned a lot in mozilla tutorials series. Like this:

https://developer.mozilla.org/en-US/docs/Games/Techniques/Tilemaps/Square_tilemaps_implementation:_Scrolling_maps

I wanted some post-processing effect just to bring up a bit of grunch to the final rendering so I managed to use this tutorial shader in webgl:

https://github.com/mattdesl/lwjgl-basics/wiki/ShaderLesson3






