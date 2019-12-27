# Návod na weby

Tento web slouží jako výchozí stanice pro tvorbu dalších webu. Ať už regionálních nebo specializovaných celostátních.
Nebojte se cokoliv přiohnout, koukejte se do dalšich pirátských webů o featurach které se vám líbí a přidejte si je do svého.

## Obsah

- [example.pirati.cz](#examplepiraticz)
  - [Obsah](#obsah)
  - [Úvod](#Úvod)
  - [Lokální spuštění](#lokální-spuštění)
    - [Linux](#linux)
    - [Docker](#docker)
  - [Souborová struktura](#souborová-struktura)
    - [Pomocné soubory](#pomocné-soubory)
    - [Data](#data)
    - [Webové stránky](#webové-stránky)
  - [Jednoduchá změna pomocí GitHub](#jednoduchá-změna-pomocí-github)
    - [Registrace na Githubu](#registrace-na-githubu)
    - [Drobná změna](#drobná-změna)
    - [Úprava textového souboru](#úprava-textového-souboru)
    - [Přidání textového souboru](#přidání-textového-souboru)
    - [Přidání fotky](#přidání-fotky)
    - [Přidání PDF](#přidání-PDF)
    - [Schválení změny](#schválení-změny)
    - [Kontrola](#kontrola)
  - [Vkládaní obrázků](#vkládání-obrázku)
  - [Složitější změny](#složitější-změny)
  - [Vytvoření regionálního webu](#vytvoření-regionálního-webu)
    - [Titulní obrázek](#titulní-obrázek)
    - [Kontaky na PiCe](#kontaky-na-pice)
    - [Více kandidátek](#více-kandidátek)
    - [Kalendář](#kalendář)
  - [Zobrazení mapky návrhů](#zobrazení-mapky-návrhů)
  - [Převedení na vyšší verzi](#Převedení-na-vyšši-verzi-thematu)
  - [Otestování buildu](#otestování-buildu)
  - [Získání pomoci](#získání-pomoci)

## Úvod

Pirátská strana má své weby pro veřejnost statické a umístěné na vlastním serveru.

Samotné texty a data jsou umístěné v GIT repozitářích jako je tento. Repozitář je taková
chytrá složka souborů. Chytrá je v tom, že si pamatuje veškerou historii umožňuje více
lidem pracovat zároveň a slučovat jejich práci.

Repozitáře si můžete stáhnout (clone) na svůj počítač nebo k němu přistupovat pomocí githubu.
Z githubu se repozitář stahuje na naše servery.

Když dojde ke změně dat tak se na naších serverech repozitář zkompiluje. K tomu se používá Jekyll,
ten vezme soubory z aktulání verze repozitáře, přidá k nim soubory z
[jekyll-theme-piraatit](https://github.com/texnokrates/jekyll-theme-piraatit) a vyrobí z nich samotné
html & css, které pak čte webový prohlížeč.

## Lokální spuštění

### Linux

Instalace na Fedora 25:
```
sudo dnf group install "C Development Tools and Libraries"
sudo dnf install ruby-devel rubygem-jekyll nodejs
```

Instalace Ubuntu 16.04:

```
sudo apt-get install ruby-dev gcc make libghc-zlib-dev
gem install rubygems-update
gem install jekyll bundler
bundle
```

Repozitář můžeme naklonovat do jakékoliv složky (nemusí být ve `/var/www/`).

Po stažení nové verze může být potřeba:
```
bundle install --path vendor/bundle
```

Spustění je pomocí
```
bundle exec jekyll serve --watch --livereload
```
, což stránku zkompiluje, spustí a ještě je stránka přístupná skrz [localhost](http://127.0.0.1:4000)

V některých případech (př ubuntu a systémová i bundle verze jekyllu) je nuté říct jaký jakyll použít
`bundle exec vendor/bundle/ruby/2.5.0/gems/jekyll-3.7.3/exe/jekyll server --watch --livereload`

Popřípadě můžeme spustit jen: `jekyll build`, což do složky `_site` připraví kompletní web (ten můžeme otevřít z prohlíže pomocí klavesové zkratky `ctrl+o`).

### Docker

instalujte docker podle návodu na váš operační systém (anglicky)

* [Windows](https://docs.docker.com/docker-for-windows/install/)
* [macOS](https://docs.docker.com/docker-for-mac/install/)
* [Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
* [Fedora](https://docs.docker.com/install/linux/docker-ce/fedora/)

a ověřte že máte `docker-compose` [official resources](https://docs.docker.com/compose/install/) a spušteného demona.
Pak stačí:
```
docker-compose up
```
Za vylepšení tohoto návodu budeme rádi.

## Souborová struktura

### Pomocné soubory

* `Gemfile` se soubor "knihoven" které potřebuje Jekyll, nastavit v něm můžete např verzi thema které použijete. `Gemfile.lock` je pomocný soubor pro stejnou věc.
* `_config.yml` slouží jako hlavní návod pro Jekyll jak překládat, vyplňuji se v něm důležité texty a odkazy a taky nastavují některé parametry thema
* `Dockerfile` a `docker-compose.yml` slouží k lokálnímu spuštění webu.
* `README.md` je tento text.
* `_site` a `vendor` jsou složky viditelné jen při lokálním spuštení. V `_site` jsou výsledné html stránky. V `vendor` jsou uložené "knihovny".

### Data

* V `assets` budete použítat primárně složku `img` kam patří fotky a obrázky.
* `_posts`, `_people`, `_program` obsahují soubory s články, lidmi a programovými body. Soubory jsou vždy ve formátu markdown a na vrhchu mají `yml` hlavičku která je ohraničená `---`.
* Složka `_data` obsahuje soubory které jsou pouze tou hlavičkou. Kromě `yml` mohou obsahovat i `json`.  V `_data/menu.yml` se nastavují odkazy v horní liště, menu i na spodu stránky.

### Webové stránky

Samotné stránky jsou v markdownu nebo v html (složitější struktura, např. vícesloupců apod)
* `index.html` popisuje titulní stránky
* v dalších složkách jako je např `kontakt` nebo `lide` najdeme popis stránek, které budou na *example.pirati.cz/kontakt/* resp *example.pirati.cz/lide/* krom indexu tam lze přidávat další stránky pokud např v `komunalni-volby` přidáte soubor `harmonogram.md` ve správném formátu, tak vyrobíte stránku *example.pirati.cz/komunalni-volby/harmonogram.html*
* obrázek se do stránky (i v markdown formátu) vkládá pomocí kódu ```{% asset 'posts/jmeno_obrazku.jpg' alt='Popis obrázku' %}``` přičemž obrázek *assets/img/posts/jmeno_obrazku.jpg* musí existovat; kromě parametru *alt* je možné použít parametr magick pro úpravu obrázku, např.: ```magick:resize='200x'```, kompletní dokumentace je k dispozici [zde](https://github.com/envygeeks/jekyll-assets)

## Jednoduchá změna pomocí GitHub

Rozlišujeme dva typy uživatelů.
Prvními jsou lidé pouze zaregistrovaný na githubu může navrhnout změnu kdekoliv.
Druhými jsou správci (collaborants) ti můžou rovnou přispívat a schvalovat změny.

Pro jednoduché weby doporučujeme mít pouze dva správce,
jednoho 'editora' který na web dáva články informace a na začátku ho plnil a druhého
technicky zdatného, který řeší problémy a dělat velké změny. Ostatní přispěvatelé
mohou navrhovat změny.

### Registrace na Githubu

Registrujte se [tady](https://github.com/join?source=header-home)
jako username doporučuji zvolit reálné jméno a přidat i fotku. Usnadníte tím práci editorům a celkovou spolupráci pirátu na webech.

### Drobná změna

Jako je např. oprava gramatické chyby nebo přidání telefoního čísla.

Najděte si daný soubor. Vpravo nahoře obsahu toho souboru je symbol tužky. Kliknětě a navrhněte změny. Pokud není naprosto jasné co děláte tak do commit message dole připište zdůvodnění. Dejte navrhnout úpravy a pak schválit merge request. Tj. je třeba kliknout dvakrát.

Existuje ještě elegantní trik jak se dostat k editaci: přímo na samotném webu najít vpravo dole tlačítko navrhnout změnu.


### Úprava textového souboru

Většina souborů se samotným textem jsou ve formánu [markdown](https://cs.wikipedia.org/wiki/Markdown) do kterého můžěte psát i html značky.

### Přidání textového souboru

Na githubu najeďte do složky, kam chcete soubor přidat, a klidněte na "create new file". Doporučuji si zároveň otevřít jiný soubor z dané složky, ať z něj můžete zkopírovat strukturu a vyměnit jenom data.

### Přidání fotky

Fotky může přidávat pouze 'editor'. Fotky přidávejte v dostatečném rozlišení
(lepší větší než menší). Web si fotky sám škáluje a ořezává podle toho, v jakém
formátu je zrovna na daném místě potřebuje.

Fotky osob je dobré dodávat ve čtvercovém formátu, protože jejich profilové
fotky, jsou vždycky čtvercové. Tím zamezíte nechtěným ořezům hlav lidí atp.

Pokud potřebujete použít stejnou funkcionalitu i na jiném místě ve vaší kopii webu,
mrkntěte na použítí
[tady](https://github.com/texnokrates/jekyll-theme-piraatit/blob/master/_includes/people/profile-badge.html#L12)
a [tady](https://github.com/envygeeks/jekyll-assets).

### Přidání PDF

1) pdf přejmenujte, aby vněm nebyli mezery či háčky a tím pádem nemělo ošklivou url
2) uložte jej do složky pirati.cz/assets/pdf či nahrajte na patřičné místo v github rozhraní
3) commitněte změny
4) ověřte si že je existuje na adrese:
https://pirati.cz/assets/pdf/nazev-dokumentu.pdf
5) můžete tiskovu a do ní dejte ten výse zmíniný odkaz!

Pokud vložíte odkaz přímo na github tak čtenář dostane pro něj nesrozumitnelnou a nechutnou hlavičku githubu:
https://github.com/texnokrates/pirati.cz/blob/gh-pages/assets/pdf/dr-stiznost-fin.pdf
Pokud vložíte odkaz přímo na naše stránky je náhled mnohem hezčí:
https://www.pirati.cz/assets/pdf/dr-stiznost-fin.pdf

### Schválení změny

Na hlavní stránce nahoře je pole "merge request" - tam se nachází seznam návrhů. Projděte si je, rozklikejte je a po kontrole můžete kliknout na "merge pull request" a následně "confirm merge".

### Kontrola

Pokud děláte změny takto přes github, může dojít k chybě, které si hned nevšimnete. Proto je po změně potřeba zkontrolovat, že se vše povedlo. Nicméně buťte trpěliví, může trvat až pět minut než se změna projeví. Existují tři typy chyb:

- První je, že se něco viditelně rozbije - například zmizí kus textu a vy vidíte jen "tel" a za tím nic
- Druhý je, že se něco rozbije natolik, že web ani nejde přeložit. V tom případě zůstane ve staré verzi a vy nevidíte žádnou změnu.
- Třetí a nejhorší je, že nahrajete něco, co byste na pirati.cz vůbec neměli nahrávat. Tomu zabráníte jedině tak, že pečlivě kontrolujete commity a nepustíte dál žadnou změnu, které nerozumíte.

To, že něco pokazíte se může stát každému. Důležité je nebát si říct o pomoc a chybu napravit.

## Vkládání obrázku

Tato sekce se týká webů které již mají obrázky a fotky na mraku, pokud je tam ještě nemáte kontaktujte TO a rádi vám pomužeme s migrací.

Ve vašem domovském adresáři by jste měli vidět složku `Assets` a v ní podsložku, která má stený název jako váš web (to co je před .pirati.cz) pokud ji nevidíte kontoktuje TO. V ideálním případě složku vidí a mohou do ni psát všichni členové místního MO.

Tato složka má stejnou strukturu jako složka assest měla v githubu. Nejdříve jsou složky `img` a `pdf` a přídaně další. Sami tam také můžete vytvořid dalši složku pro další druhy formátů.

Do složky můžete přistoupit přímo a dokonce i automaticky resizovat obrázky, díky tomu můžete vlkádat i obrázky s relativne velkým rozlišením. Můžete si [odkazem ověřit](https://wiki.pirati.cz/to/navody/asset-server), že jste fotky nahráli správně. Fotka zůstane v `a.pirati.cz/`, i pokud ji z mraku smažete. 

Ve složce `img/posts` web hledá fotky k článkům.  

POZOR na název souboru. Jak nazvete soubor takové bude mít url a jelikož url moc nedává mezery a háčky tak se snažce psát jen anglickou abecetou a pomlčky. Hezké je když název vystihuje co je na fotce a zároveň není příliš dlouhý.

Příklady dobře pojmenovaných souborů:
- `/img/people/Ivan-Bartos.jpg`
- `/img/post/zastupitele-brno-mesto.jpg`
- `/img/post/Lukas_Barton_opreny.png`

## Složitější změny

Tento web používá [jekyll-theme-piraatit](https://github.com/texnokrates/jekyll-theme-piraatit). Cokoliv z něj jde přepsat. Používejte co nejnovějši verzi. Verze se nastavuje v `Gemfile` a je zmíněna i v `assets` části `_config.yml`.

Pokud chcete zasahovat do JS nebo CSS tak si přečtete [dokumentaci thema](https://github.com/texnokrates/jekyll-theme-piraatit/blob/master/development.md)

## Vytvoření regionálního webu

Pokud byste tuto šablonu chtěli využít pro tvorbu webu svého místního sdružení, změňte následující:

- v souboru `_config.yml` změňte hodnoty v horní části (title, description, url) a odkazy pod tím
- v adresáři `_people` odstraňte naše lidi a místo toho založte vlastní
- v adresáři `assets/img/people` dejte fotky vašich lidí
- v adresáři `_posts` odstraňte vzorový blogový příspěvek a dejte vlastní
- v adresáři `assets/img/posts` odstraňte naše fotky pro blogové příspěvky a dávejte vlastní
- v souboru `kontakty/index.md` upravte doporučené kontakty, zároveň u jednoho člověka v people vyplňte `category` `kontaktni_osoba`
- v souboru `lide/index.html` upravte text a obsah stránky `O nas`

### Titulní obrázek

Přidejte široký webový a úzký mobilní obrázek a nastavte parametry v `_config.yml`

### Kontaky na PiCe

V `_config.yml` vyplně adresu PiCe a obrázek. Následně v `kontakty/index.html` nastavte `residence: yes`.

### Více kandidátek

To je trošku tricky nastavení, pro inspiraci se podívejte do `jekyll-theme-piraatit`.

### Kalendář

Pro vložení kaledáře existují dvě cesty:

* **Jednoduchá**: prostě zkopírujte adresu kalendáře pro vložení do stránky,
  takto vložený kalendář je zcela funkční, ale nevypadá úplně pěkně
* **Složitější**: zahrnuje nutnost získat Google Calendar API klíč, výhodou
  ovšem je, že kalendář bude vizuálně sladěný se zbytkem webu

V případě jednoduché varianty potřebujete pouze adresu pro embeddování.
Naleznete ji v nastavení kalendáře na Google Calendar webu. Tuto hodnotu vplňte
v `_config.yml` do pole `calendar.page`.

Složitější postup není ve skutečnosti nikterak komplikovaný. Budete potřebovat
získat ID kalendáře (napište ho do `calendar.id`), které je také k dispozici na
Google Calendar webu. Následně ještě budete potřebovat Google Calendar API key a
domluvit se se správcem webu aby vám ho zapnul.

API klíč získáte v [Google Developer
Consoli](https://console.developers.google.com). Nejprve si vytvořte nový
projekt (třeba example.pirati.cz). Poté je nutné přes "Enable APIs and services"
povolit pro projekt `Google Calendar API`. Poté si vytvořte samotný API klíč. To
provedete tak, že kliknete na "Create credentials" v sekci
[Credentials](https://console.developers.google.com/apis/credentials). Jako typ
vyberete "API key" a výsledkem bude změť písmen a znaků, které tvoří samotný
klíč. Je vhodné pomocí "Restrict key" omezit adresy, na kterých klíč může být
používán, aby vám ho někdo neukradnul. V "Application restrictions" vyberte
"HTTP referers" a vyplňte všechny adresy, na kterých web chcete provozovat
(např. `https://example.pirati.cz`, vždy jedna na řádek). Pokud chcete udělat
klíč pro lokální vývoj (např. `http://localhost:4000`), doporučujeme si na to
udělat samostatný klíč a ten nikomu neukazovat aby se  předešlo zneužití (protože
`localhost` vlastní každý).

Mějte na paměti, že s klíčem máte právo kromě čtení také věci editovat.

Jakmile máte platný klíč, tento klíč předejte správci, který s vámi řeší uvedení
webu do provozu. Řekněte mu, že potřebujete nastavit tzv. environment variable
`GOOGLE_CALENDAR_APIKEY` na hodnotu klíče, kterou jste předtím získali v
Developer Consoli. Poté bude váš kalendář vypadat jako např. na [pardubickém
webu](https://pardubice.pirati.cz).

## Zobrazení mapky návrhů

Implementace mapky návrhů byla ve verzi 6.1.0 jekyll-theme-piráti upravena,
nyní je mapový podklad řešen přes službu [Mapbox](https://www.mapbox.com/).

Abyste mapičku zobrazili, je nutné si tam vytvořit účet a následně získáte
*access token*. Ten pak při spuštění stránek poskytnete pomocí environment
variable `MAPBOX_ACCESS_TOKEN`. Následně můžete do kterékoliv stránky
přidat kód podobný tomuto:

```
{% if site.env.MAPBOX_ACCESS_TOKEN %}
  <div class="__vue-root" data-app="IntentionMap" data-accesstoken="{{ site.env.MAPBOX_ACCESS_TOKEN }}" data-dataset="https://gist.githubusercontent.com/xaralis/f9711e5d12f971504d0753ba40c3d33e/raw/4a1701c64de5eb7ed6aa1538cb269022965d82d6/map.geojson" data-ideaform="https://goo.gl/forms/wKSPmWNDzgRiUxLN2"></div>
{% endif %}
```

Jak je vidět, potřebujete nějaký geojson soubor, který definuje jednotlivé položky
na mapě. Pro vytvoření mapového podkladu můžete využít libovolný GeoJSON
editor, např. `http://geojson.io`. Aby mapa záměrů správně fungovala,
měly by jednotlivé položky mapy mít následující atributy:

* `id` - jedinečný identifikátor záměru, celé číslo
* `name` - definuje jméno záměru na mapě
* `category` - definuje kategorii záměru
* `description` - definuje detailní popis záměru
* `image` (volitelné) - URL obrázku záměru

Pomocí atributu `data-ideaform` lze volitelně připojit i link na formulář, kam vám
veřejnost může zasílat své nápady.


Editace mapy záměrů se provádí nahráním souboru přímo na webu geojson.io přes Open -> File. Soubor lze vzít z Gitu kterékoli mutace webu, která ho již má a upravit dle vlastních potřeb.

## Otestování buildu

Pokud chcete otestovat, jaké stránky se vám při nasazení vygenerují, spusťte
následující příkaz:

```
JEKYLL_ENV=production bundle exec jekyll build
```

Výsledné stránky jsou uloženy v adresáři `_site`. Je vhodné následně ještě
spustit [html-proofer](https://github.com/gjtorikian/html-proofer) pro ověření,
že všechny odkazy, které na webu máte, někam vedou:

```
bundle exec htmlproofer --assume-extension --disable-external --url-ignore "#,#fn:1" ./_site
```

Pokud tento příkaz selže, znamená to, že jste nejspíš někde uvedli špatnou adresu.

Můžete také využít příkaz `build.sh`, který obsahuje oba výše zmíněné příkazy:

```
./build.sh
```

## Převedení na vyšši verzi thematu

Nejprve se podívejte jaká [verze](https://github.com/texnokrates/jekyll-theme-piraatit/releases) je poslední.
Pak se podívejte do `Gemfile` a dolů do souboru `_config.yml` tam by měla být vaše aktuální verze. 

Pokud aktuální používaná verze a poslední verze začínaji stejným číslem stačí to číslo zvýšit, lokálně otestovat, že se nic nerozbilo a pushnout.

Pokud se liší v hlavním číšle je třeba udělat další změny podle [návodu](https://github.com/texnokrates/jekyll-theme-piraatit/blob/master/README.md)

## Statistiky přístupů - Piwik/Matomo

Pro generování statistik je možné použít [Matomo](https://matomo.org/) (před přejmenováním Piwik), což je otevřená alternativa ke Google Analytics. Je k tomu potřeba:

* na [Redmine TO](https://redmine.pirati.cz/projects/to) si vyžádat piwik id a napsat e-mail, na který mají chodit reporty + vybraný formát (PDF nebo HTML)
* v _config.yml doplnit:
```
piwik:
  siteId: vase_pridelene_id
  loadSDK: true
```
Reporty standardně chodí e-mailem. Po domluvě s Martinem Rejmanem je možné získat přístup k webovému rozhraní Matomo.

## Získání pomoci

Projděte si [návod na git](http://www.kutac.cz/blog/pocitace-a-internety/git-tutorialy-a-navody/) nebo
[knížku v čestine](https://www.root.cz/knihy/pro-git/)

Jekyll má velmi podrobnou [dokumentaci](http://jekyllrb.com/docs/home/). A při vývoji též doporučuji [cheat sheet](http://jekyll.tips/jekyll-cheat-sheet/)

Example web používá [jekyll-theme-piraatit](https://github.com/texnokrates/jekyll-theme-piraatit). Cokoliv z něj jde přepsat. Používejte co nejnovějši verzi.

Technicky přesné dotazy můžete směřovat na TODO-issue-theme nebo [redmine](https://redmine.pirati.cz/projects/to/issues/new)

Na cokoliv se zeptejte třeba na [chatu](https://chat.pirati.cz/channel/tech-weby)

Ptejte se lidí okolo vás, kteří danou věc dělali, TO a dalších. Jak říkala moje prababička "Líná huba, holé neštěstí".
