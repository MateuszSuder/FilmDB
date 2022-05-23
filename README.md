# FilmDB


> ## DISCLAIMER
> 
> Whole project is in polish, as it's for my studies.
> 
> For the sake of keeping whole project in polish, rest of readme will be in it.


```
FilmDB
│   index.js - plik wejściowy
│   filmdb.sqlite - plik bazy danych
│
└───controllers - folder zawierajacy pliki kontrolujace wyswietlanie podstron
│   │   homeController.js - plik zawierajacy logike wyswietlania widoku startowego
│   │   [x]Controler.js - plik zawierajacy logike wyswietlania widoku x
│
└───views - folder zawierajacy pliki ejs poszczegolnych elementow strony
│   │   home.ejs - plik zawierajacy wyglad strony startowej
│   │   [x].ejs - plik zawierajacy wyglad strony x
│
└───routes - folder zawierajacy pliki, które obsługują endpointy routera
│   │   home.js - plik zawierajacy obsługę endpointu '/home'
│   │   [x].js - plik zawierajacy obsługę endpointu '/x'
│
└───public - folder zawierajacy pliki, które będą publicznie dostępne
│   └───assets - folder z plikami multimedialnymi (obrazki, wektory itp)
│   │
│   └───style - folder z plikami stylów
│
└───src - folder zawierajacy pliki źródłowe
    └───database - implementacja połączenia z bazom danych
    │
    └───js - folder z plikami javascriptowymi
```