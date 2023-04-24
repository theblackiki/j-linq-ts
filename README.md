# j-linq-ts
Aim to create a typescript library operating collections using Linq APIs in C#, by the way, it's an easy project, if you are not satisfied
with the functions, you can extend it by yourself. 

I'm a freshman to front-end world, I'm used to writing c# so when I write js/ts without linq I feel uncomfortable,
by chance, I know the Generator in js, so I think I can write a libaray like linq in c# which is  based on interface IEnumerable.
With the help of Generator, I can realize a delay computing to operate the collections, unlike the origin operations (map,filter,..)which
create a new array everytime you invoke the api.

I don't know too much underlying knowledge of js, so I hope you can forgive me if you found any error in my code and also I hope you will 
give me some advices to fix it.

In my conception, I hope all operations rely on the IEnumerable too, so I create some related interfaces which are exposed to users, but 
hide the implement classes of the interfaces.