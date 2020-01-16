**TP DAWIN - WebGL (three.js)**

ATTENTION:
Ce github est un condensé de différents tests WebGL sous THREE.JS non polis pour un projet de cours en licence professionnelle.



*Ce que j'ai tenter de faire avant ces résultats:*


J'ai perdu énormement de temps de travail pour essayer de réaliser une animation d'explosion ainsi que de tenter de jouer une animation appliquée à un FBX.

Malheureusement, je n'ai pas réussi. L'explosion, transformée en particules de type feu d'artifice, ne fonctionnait pas (les particules réstaient à un endroit sans bouger). Je n'ai pas non plus réussi à faire jouer une animation à un model FBX.



*Ce que j'ai produit:*

On en viens donc aux résultats, par manque de temps dû à mes premières tentatives, je me suis rabattu sur quelque chose de beaucoup plus simple:
reprendre le projet de cours et ajouter de la musique ainsi qu'une detection de mouvement et clique de souris.
L'utilisateur peux cliquer sur la statuette de gauche et du milieu, celles-ci font une petite animation random et déclanche quelques évenements, dont une musique.

La statuette de gauche lance une animation faisant sauter toutes les statues au rythme de la musique en canon et celle du milieu lance une animation très spécial...


**Ce résultat est disponible à cette adresse: https://nathanael-piquet.tk/**



Un Deuxième résultat que je n'ai pas eu le temps de terminer est une sorte de copie de Beat Saber: un jeu où l'on doit cliquer sur les blocs défilants en rythme avec la musique.

Je me suis malheureusement mis trop tard sur cette production, et n'ai pas eu le temps de la terminer...


**Ce résultat est cependant disponible ici: https://nathanael-piquet.tk/beatsaber/**



*Installation et architecture:**

La seul chose à installer est THREE.JS, qui doit être situé dans "shuvi/vendor/three.js-master". Voici l'architecture de ce github:

- En index, le premier résultat énnoncé
- Dans le dossier BeatSaber, le deuxième résultat
- Dans le dossier Shuvi, les modèles ainsi que le projet fait en cours