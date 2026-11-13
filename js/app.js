/* ==========================================================================
   1941–1945. Великая Отечественная война
   Ванильный JS: прелоадер, курсор, шапка, меню, анимации,canvas-сцены,
   оглавление, листы для чтения и хроника.
   ========================================================================== */
(() => {
  "use strict";

  const DATA = {"parts":[{"id":"part-i","numeral":"I","order":"01","theme":"НАПАДЕНИЕ НА СССР","listTitle":"Нападение на СССР","title":"Часть I. Нападение","titleAccent":"на СССР","dates":"22 ИЮНЯ 1941","intro":"Блок для вводного текста части. Расскажите здесь о вероломном нападении гитлеровской Германии на Советский Союз, о планах «молниеносной войны» и о том, как страна встала на смертельный бой.","stats":[{"value":"04:00","label":"начало вторжения"},{"value":"190","label":"дивизий противника"},{"value":"1418","label":"дней и ночей войны"}],"heroMedia":{"src":"media/photos/moscow1941.jpg","caption":"Командир на наблюдательном пункте. Зима 1941 года","credit":"Фото: Д. Чернов, Wikimedia Commons, Public Domain"},"subsections":[{"id":"barbarossa","title":"План «Барбаросса»","meta":"18 ДЕКАБРЯ 1940 • СТАВКА ВЕРМАХТА","blocks":[{"type":"text","text":["x Два-три абзаца о директиве № 21: расчёт на «молниеносную войну», три группы армий — «Север», «Центр», «Юг», цель — выйти на линию Архангельск — Волга."]},{"type":"fact","items":["Директива № 21 подписана 18 декабря 1940 года","Расчётный срок кампании — 8–10 недель","Против СССР сосредоточено 190 дивизий"]}]},{"id":"june-22","title":"22 июня 1941 года","meta":"22 ИЮНЯ 1941 • 04:00 УТРА","blocks":[{"type":"text","text":["x Рассказ о первых часах войны: артиллерийская подготовка, авиаудары по аэродромам и городам, выступление В. М. Молотова по радио в полдень."]},{"type":"fact","items":["Война началась в 4 часа утра","Указ Президиума ВС СССР о мобилизации — 22 июня","Речь Молотова по радио — 22 июня, 12:00"]}]},{"id":"mobilization","title":"Мобилизация страны","meta":"23–30 ИЮНЯ 1941 • ВСЯ СТРАНА","blocks":[{"type":"text","text":["x О создании Ставки Главного Командования (23 июня) и Государственного Комитета Обороны (30 июня) — всей полноте власти в руках ГКО."]},{"type":"stats","items":[{"value":"23 VI","label":"Ставка ГК"},{"value":"30 VI","label":"ГКО СССР"},{"value":"5,3 млн","label":"мобилизовано за первые 8 дней"}]}]},{"id":"brest","title":"Оборона Брестской крепости","meta":"22 ИЮНЯ — ИЮЛЬ 1941 • БРЕСТ","blocks":[{"type":"text","text":["x О героической обороне крепости: гарнизон принял бой одним из первых, держался более месяца в полном окружении."]},{"type":"fact","items":["Оборона продолжалась свыше месяца","Надпись защитников: «Умрём, но не уйдём!»","Медаль «За оборону Брестской крепости» учреждена в 1945 году"]}]},{"id":"smolensk","title":"Смоленское сражение","meta":"10 ИЮЛЯ — 10 СЕНТЯБРЯ 1941","blocks":[{"type":"text","text":["x О двухмесячном сражении на подступах к Москве, которое сорвало план беспрепятственного рывка к столице."]},{"type":"fact","items":["Крупнейшее сражение первого периода войны","Первое применение «катюш» БМ-13 — 14 июля 1941, Орша","Наступление на Москву задержано на два месяца"]}]},{"id":"moscow","title":"Битва за Москву","meta":"30.09.1941 — 20.04.1942 • МОСКВА","blocks":[{"type":"text","text":["x О обороне Москвы, ноябрьском параде 7 ноября на Красной площади и первом крупном контрнаступлении 5–6 декабря 1941 года."]},{"type":"stats","items":[{"value":"7 XI","label":"парад на Красной площади"},{"value":"5–6 XII","label":"контрнаступление"},{"value":"−35°C","label":"мороз зимы 1941-го"}]},{"type":"photo","media":{"src":"media/photos/t34b.jpg","caption":"Колонна Т-34 движется на Красногвардейск. 1941 год","credit":"Фото: Б. Лосин (ТАСС), Wikimedia Commons, Public Domain"}}]},{"id":"leningrad-ring","title":"Кольцо замкнулось: блокада Ленинграда","meta":"8 СЕНТЯБРЯ 1941 • ЛЕНИНГРАД","blocks":[{"type":"text","text":["x О начале 872-дневной блокады: Шлиссельбург взят, сухопутное кольцо замкнулось, единственной дорогой стала Ладога."]},{"type":"fact","items":["Блокада началась 8 сентября 1941 года","872 дня осады","«Дорога жизни» — трасса по льду Ладожского озера"]}]}]},{"id":"part-iii","numeral":"III","order":"02","theme":"В СОВЕТСКОМ ТЫЛУ","listTitle":"В советском тылу","title":"Часть III. В советском","titleAccent":"тылу","dates":"1941 — 1945","intro":"Блок для вводного текста части. Здесь — о тыле, который стал вторым фронтом: эвакуированные заводы, женщины и подростки у станков, хлеб из-под сохи, наука и искусство для победы.","stats":[{"value":"1500+","label":"заводов эвакуировано на восток"},{"value":"10 млн+","label":"человек эвакуировано"},{"value":"«Всё для фронта!»","label":"лозунг тыла"}],"heroMedia":{"src":"media/videos/rail41.mp4","caption":"Киножурнал «Железнодорожник», № 6, 1941 год","credit":"Хроника: Sovkinozhurnal, Wikimedia Commons, Public Domain"},"heroVideo":true,"subsections":[{"id":"evacuation","title":"Эвакуация на восток","meta":"ИЮЛЬ — ДЕКАБРЬ 1941 • УРАЛ • СИБИРЬ","blocks":[{"type":"text","text":["x О беспримерной переброске промышленности за Урал: эшелоны с оборудованием, семьями, чертежами — и запуск заводов под открытым небом."]},{"type":"stats","items":[{"value":"1523","label":"промышленных предприятия"},{"value":"10–12 млн","label":"эвакуированных граждан"},{"value":"1,5 млн","label":"вагонов с грузами"}]}]},{"id":"all-for-front","title":"«Всё для фронта, всё для победы!»","meta":"1941 — 1945 • ЗАВОДЫ И ФАБРИКИ","blocks":[{"type":"text","text":["x О тружениках тыла: женщины, старики и подростки у станков, двенадцатичасовые смены, фронтовые бригады, комсомольско-молодёжные смены."]},{"type":"fact","items":["Фронтовые бригады — с августа 1941 года","Лозунг провозглашён 29 июня 1941 в директиве СНК и ЦК ВКП(б)","Танк «Ферроплан» и эскадрильи, построенные на взносы трудящихся"]},{"type":"photo","media":{"src":"media/photos/il2.jpg","caption":"Штурмовик Ил-2 «Месть Бариновых», построенный на средства трудящихся","credit":"Фото: Г. Коновалов, Wikimedia Commons, Public Domain"}}]},{"id":"harvest","title":"Хлеб для фронта","meta":"1941 — 1945 • КОЛХОЗЫ И СОВХОЗЫ","blocks":[{"type":"text","text":["x О деревне военных лет: уборка урожая женскими бригадами, обязательные поставки зерна, помощь госпиталям и семьям фронтовиков."]},{"type":"fact","items":["Основная рабочая сила колхоза — женщины и подростки","Зерновые поставки государству сохранялись весь год","Трудодни, «черно-паровая» кампания 1942 года"]}]},{"id":"science","title":"Наука и конструкторы","meta":"1941 — 1945 • КБ И ЛАБОРАТОРИИ","blocks":[{"type":"text","text":["x О конструкторах и учёных: Т-34 М. И. Кошкина, Ил-2 С. В. Ильюшина, «катюша» БМ-13, новые сплавы и радиолокация."]},{"type":"stats","items":[{"value":"Т-34","label":"лучший танк войны"},{"value":"Ил-2","label":"«летающий танк»"},{"value":"БМ-13","label":"гвардейские миномёты"}]}]},{"id":"culture","title":"Литература и искусство","meta":"1941 — 1945 • ФРОНТ И ТЫЛ","blocks":[{"type":"text","text":["x О слове и музыке на войне: «Священная война» В. Лебедева-Кумача и А. Александрова, «Василий Тёркин» А. Твардовского, Седьмая «Ленинградская» симфония Д. Шостаковича."]},{"type":"fact","items":["«Священная война» — первая песня войны, июнь 1941","«Василий Тёркин» печатался с 1942 года","Премьера Седьмой симфонии в осаждённом Ленинграде — 9 августа 1942"]}]}]},{"id":"part-iv","numeral":"IV","order":"03","theme":"ГЕРОИ ФРОНТА","listTitle":"Герои фронта","title":"Часть IV. Герои","titleAccent":"фронта","dates":"1941 — 1945","intro":"Блок для вводного текста части. Здесь — имена: те, кто шёл в первую атаку, закрывал амбразуры, таранил врага и точным выстрелом защищал каждую пядь своей земли.","stats":[{"value":"11 600+","label":"Героев Советского Союза"},{"value":"104","label":"дважды и трижды Героя"},{"value":"1 млн+","label":"награждённых орденами"}],"heroMedia":{"src":"media/photos/pavlichenko.jpg","caption":"Снайпер Людмила Павличенко на позиции, 1942 год","credit":"Фото: В. Иванов, Wikimedia Commons, Public Domain"},"subsections":[{"id":"zoya","title":"Зоя Космодемьянская","meta":"НОЯБРЬ 1941 • ПЕТРИЩЕВО","blocks":[{"type":"text","text":["x О диверсионной работе московской комсомолки в тылу врага и её подвиге у деревни Петрищево. Первая женщина — Герой Советского Союза в годы войны."]},{"type":"fact","items":["Казнена 29 ноября 1941 года","Звание Героя Советского Союза — 16 февраля 1942 (посмертно)","Слова, обращённые к односельчанам: «Мне не страшно умирать»"]},{"type":"photo","media":{"src":"media/photos/zoya.png","caption":"Зоя Космодемьянская, 1941 год","credit":"Фото: Wikimedia Commons, Public Domain"}}]},{"id":"gastello","title":"Николай Гастелло","meta":"26 ИЮНЯ 1941 • ДОРОГОБУЖ","blocks":[{"type":"text","text":["x Об огненном таране капитана Гастелло: подбитый бомбардировщик направлен в скопление техники противника."]},{"type":"fact","items":["Таран совершен 26 июня 1941 года","Звание Героя Советского Союза присвоено 26 июля 1941","Экипаж: Н. Ф. Гастелло, А. А. Бурденюк, А. А. Скоробогатый, Г. Н. Скоробогатых"]},{"type":"photo","media":{"src":"media/photos/gastello.jpg","caption":"Капитан Николай Гастелло","credit":"Фото: Wikimedia Commons, Public Domain"}}]},{"id":"talalikhin","title":"Виктор Талалихин","meta":"7 АВГУСТА 1941 • МОСКВА","blocks":[{"type":"text","text":["x Об одном из первых ночных таранов в истории авиации: младший лейтенант Талалихин сбил бомбардировщик врага над Подмосковьем."]},{"type":"fact","items":["Ночной таран — ночь на 7 августа 1941","Герой Советского Союза — 8 августа 1941","Погиб в воздушном бою 27 октября 1941 года"]}]},{"id":"panfilovtsy","title":"28 панфиловцев","meta":"НОЯБРЬ 1941 • ДУБОСЕКОВО","blocks":[{"type":"text","text":["x О бойцах 316-й стрелковой дивизии генерала И. В. Панфилова, стоявших насмерть у разъезда Дубосеково: «Велика Россия, а отступать некуда — позади Москва!»"]},{"type":"stats","items":[{"value":"28","label":"героев-панфиловцев"},{"value":"18","label":"танков противника остановлено"},{"value":"4 часа","label":"боя у разъезда Дубосеково"}]}]},{"id":"matrosov","title":"Александр Матросов","meta":"23 ФЕВРАЛЯ 1943 • ЧЕРНУШКИ","blocks":[{"type":"text","text":["x О подвиге гвардии рядового Матросова, закрывшего своим телом амбразуру вражеского дзота и открывшего путь отделению."]},{"type":"fact","items":["Подвиг совершен 23 февраля 1943 года у деревни Чернушки","Герой Советского Союза — 19 сентября 1943 (посмертно)","Его имя навечно зачислено в списки части"]},{"type":"photo","media":{"src":"media/photos/matrosov.jpg","caption":"Гвардии рядовой Александр Матросов","credit":"Фото: Wikimedia Commons, Public Domain"}}]},{"id":"pavlichenko","title":"Людмила Павличенко","meta":"1941 — 1942 • ОДЕССА • СЕВАСТОПОЛЬ","blocks":[{"type":"text","text":["x О самом результативном женщине-снайпере в истории: 309 уничтоженных солдат и офицеров противника, оборона Одессы и Севастополя."]},{"type":"stats","items":[{"value":"309","label":"победных выстрелов"},{"value":"187","label":"из них — под Севастополем"},{"value":"1942","label":"поездка в США и Канаду"}]}]},{"id":"partisans","title":"Партизаны и подпольщики","meta":"1941 — 1944 • ВРАЖЕСКИЙ ТЫЛ","blocks":[{"type":"text","text":["x О всенародной борьбе в тылу врага: рельсовая война, «концерты» на железных дорогах, подпольные группы в оккупированных городах."]},{"type":"fact","items":["Свыше 6200 отрядов и соединений","Более 1 млн партизан и подпольщиков","Операции «Рельсовая война» (1943) и «Концерт» (1943)"]},{"type":"photo","media":{"src":"media/photos/partisans.jpg","caption":"Партизаны клянутся отомстить за убитого товарища","credit":"Фото: М. Альперт, Wikimedia Commons, Public Domain"}}]}]},{"id":"part-v","numeral":"V","order":"04","theme":"РАЗГРОМ ФАШИСТСКИХ ЗАХВАТЧИКОВ","listTitle":"Разгром захватчиков","title":"Часть V. Разгром фашистских","titleAccent":"захватчиков","dates":"1942 — 1945","intro":"Блок для вводного текста части. От Сталинграда до Берлина: коренной перелом, великие битвы на Волге, дуге, Днепре, освобождение Белоруссии и Европы.","stats":[{"value":"2 II 1943","label":"победа под Сталинградом"},{"value":"III","label":"коренной перелом в войне"},{"value":"9 I 1945","label":"ранее срока союзникам помогли"}],"heroMedia":{"src":"media/photos/stalingrad.jpg","caption":"Бойцы 13-й гвардейской дивизии в уличных боях. Сталинград, 1942","credit":"Фото: Wikimedia Commons, CC BY-SA 4.0"},"subsections":[{"id":"stalingrad","title":"Сталинградская битва","meta":"17.07.1942 — 02.02.1943 • ВОЛГА","blocks":[{"type":"text","text":["x О 200 днях и ночах на Волге: оборона «За Волгой для нас земли нет», операция «Уран», окружение 330-тысячной группировки, капитуляция армии Паулюса 2 февраля 1943 года."]},{"type":"stats","items":[{"value":"200","label":"дней и ночей"},{"value":"«Уран»","label":"операция окружения"},{"value":"2 II 1943","label":"конец битвы — начало перелома"}]},{"type":"photo","media":{"src":"media/photos/stalingrad.jpg","caption":"13-я гвардейская стрелковая дивизия в уличном бою. Сталинград","credit":"Фото: Wikimedia Commons, CC BY-SA 4.0"}}]},{"id":"iskra","title":"Прорыв блокады Ленинграда","meta":"18 ЯНВАРЯ 1943 • ОПЕРАЦИЯ «ИСКРА»","blocks":[{"type":"text","text":["x О встрече фронтов на Неве 18 января 1943 года и полном освобождении Ленинграда 27 января 1944-го: салют из 324 орудий над Невой."]},{"type":"fact","items":["Блокада прорвана 18 января 1943 года","«Дорога победы» — железная дорога вдоль Ладоги","Ленинград полностью освобождён 27 января 1944 года"]},{"type":"photo","media":{"src":"media/photos/leningradmedal.jpg","caption":"Награждение защитников Ленинграда медалью «За оборону Ленинграда»","credit":"Фото: Б. Кудояров, Wikimedia Commons, CC BY-SA 3.0"}}]},{"id":"kursk","title":"Курская дуга","meta":"05.07 — 23.08.1943 • КУРСК","blocks":[{"type":"text","text":["x О величайшем танковом сражении под Прохоровкой 12 июля 1943 года и окончательном переходе стратегической инициативы к Красной армии."]},{"type":"stats","items":[{"value":"50 дней","label":"длилась битва"},{"value":"12 VII","label":"Прохоровка"},{"value":"1200","label":"танков в сражении под Прохоровкой"}]},{"type":"photo","media":{"src":"media/photos/kursk.jpg","caption":"89-я гвардейская стрелковая дивизия входит в Белгород. 5 августа 1943","credit":"Фото: Wikimedia Commons, CC BY 4.0"}}]},{"id":"dnieper","title":"Битва за Днепр","meta":"АВГУСТ — ДЕКАБРЬ 1943 • ДНЕПР","blocks":[{"type":"text","text":["x О форсировании Днепра под огнём, о плацдармах и освобождении Киева 6 ноября 1943 года. За переправу — Герой Советского Союза сразу двум тысячам бойцов."]},{"type":"fact","items":["Освобождение Киева — 6 ноября 1943 года","2438 воинов стали Героями Советского Союза за Днепр","Партизанский рейд Ковпака вглубь Правобережья — 1943"]},{"type":"photo","media":{"src":"media/photos/dnieper.jpg","caption":"«Днём Киев!» Сапёры строят переправу через Сиваш","credit":"Фото: Wikimedia Commons, Public Domain"}}]},{"id":"bagration","title":"Операция «Багратион»","meta":"23 ИЮНЯ — 29 АВГУСТА 1944 • БЕЛОРУССИЯ","blocks":[{"type":"text","text":["x Об освобождении Белоруссии: разгром группы армий «Центр», выход к Висле и к границе Восточной Пруссии, возвращение Минска 3 июля 1944 года."]},{"type":"stats","items":[{"value":"17","label":"дивизий противника разгромлено"},{"value":"3 VII 1944","label":"освобождён Минск"},{"value":"600 км","label":"продвижение на запад"}]},{"type":"photo","media":{"src":"media/photos/bagration.png","caption":"Отступление противника под Лидой. Июль 1944","credit":"Фото: Wikimedia Commons, Public Domain"}}]},{"id":"europe","title":"Освобождение Европы","meta":"1944 — 1945 • ПОЛЬША — АВСТРИЯ — ЧЕХОСЛОВАКИЯ","blocks":[{"type":"text","text":["x Об освобождении Польши, Румынии, Болгарии, Югославии, Венгрии, Австрии и Чехословакии: Висло-Одерская операция, взятие Будапешта и Вены, Пражская операция."]},{"type":"fact","items":["Висло-Одерская операция — январь — февраль 1945","Освобождение Кракова — 19 января 1945","Прага освобождена 9 мая 1945 года"]}]}]},{"id":"part-vi","numeral":"VI","order":"05","theme":"ЕДИНСТВО СВОБОДОЛЮБИВЫХ НАРОДОВ","listTitle":"Единство народов","title":"Часть VI. Единство","titleAccent":"свободолюбивых народов","dates":"1941 — 1945","intro":"Блок для вводного текста части. Война сплотила народы: сто наций в строю одной армии, коалиция двадцати шести государств, Сопротивление от Парижа до Праги.","stats":[{"value":"100+","label":"наций в рядах армии"},{"value":"26","label":"государств — Объединённые Нации"},{"value":"3","label":"конференции «Большой тройки»"}],"heroMedia":{"src":"media/photos/yalta.jpg","caption":"Крымская конференция. Ялта, февраль 1945","credit":"Фото: U.S. Navy, Wikimedia Commons, Public Domain"},"subsections":[{"id":"nations","title":"Все народы — на защиту Отчизны","meta":"1941 — 1945 • ВСЕ РЕСПУБЛИКИ","blocks":[{"type":"text","text":["x О многонациональном единстве: дивизии из всех республик, Герои Советского Союза каждой национальности, дружба народов как оружие Победы."]},{"type":"fact","items":["В рядах армии сражались представители 100+ народов","Национальные соединения формировались во всех республиках","Среди Героев Советского Союза — представители всех народов СССР"]}]},{"id":"coalition","title":"Антигитлеровская коалиция","meta":"1 ЯНВАРЯ 1942 • ВАШИНГТОН","blocks":[{"type":"text","text":["x О складывании коалиции: заявление Черчилля и речь Рузвельта в день нападения, советско-британский союз (12 июля 1941), Декларация Объединённых Наций (1 января 1942)."]},{"type":"stats","items":[{"value":"26","label":"государств подписали Декларацию"},{"value":"12 VII 1941","label":"советско-британское соглашение"},{"value":"1942","label":"год рождения ООН-коалиции"}]}]},{"id":"big-three","title":"Тегеран — Ялта — Потсдам","meta":"1943 — 1945 • «БОЛЬШАЯ ТРОЙКА»","blocks":[{"type":"text","text":["x О трёх встречах руководителей СССР, США и Великобритании: решение о втором фронте, послевоенный мир, устройство Германии."]},{"type":"fact","items":["Тегеран — 28 ноября — 1 декабря 1943","Ялта (Крымская конференция) — 4–11 февраля 1945","Потсдам — 17 июля — 2 августа 1945"]},{"type":"photo","media":{"src":"media/photos/yalta.jpg","caption":"Ялтинская конференция «Большой тройки». Февраль 1945","credit":"Фото: U.S. Navy, Wikimedia Commons, Public Domain"}}]},{"id":"resistance","title":"Движение Сопротивления","meta":"1941 — 1945 • ЕВРОПА","blocks":[{"type":"text","text":["x О борцах Сопротивления: Югославия, Польша, Франция, Чехословакия, Албания, Греция; Словацкое национальное восстание 1944 года; помощь Красной армии."]},{"type":"fact","items":["Словацкое национальное восстание — август 1944","Варшавское восстание — август — октябрь 1944","Советские партизанские соединения помогали братским народам"]}]},{"id":"second-front","title":"Второй фронт","meta":"6 ИЮНЯ 1944 • НОРМАНДИЯ","blocks":[{"type":"text","text":["x Об открытии второго фронта: высадка союзников в Нормандии, операция «Оверлорд», вклад западных союзников в общую победу."]},{"type":"fact","items":["Высадка в Нормандии — 6 июня 1944 года","Операция «Оверлорд» — крупнейший десант в истории","Встреча на Эльбе — 25 апреля 1945 года"]},{"type":"video","media":{"src":"media/videos/dday44.mp4","caption":"Высадка союзников в Нормандии. Кинохроника OWI, 1944 год","credit":"Хроника: Office of War Information, Wikimedia Commons, Public Domain"}}]}]},{"id":"part-vii","numeral":"VII","order":"06","theme":"ПОБЕДА НАД ФАШИСТСКОЙ ГЕРМАНИЕЙ","listTitle":"Победа над Германией","title":"Часть VII. Победа над","titleAccent":"фашистской Германией","dates":"АПРЕЛЬ — МАЙ 1945","intro":"Блок для вводного текста части. Финал: штурм Берлина, Знамя Победы над Рейхстагом, подпись под капитуляцией и первый салют мира — 9 мая 1945 года.","stats":[{"value":"30 IV","label":"Знамя Победы над Рейхстагом"},{"value":"9 V 1945","label":"День Победы"},{"value":"24 VI","label":"Парад Победы на Красной площади"}],"heroMedia":{"src":"media/photos/reichstag.jpg","caption":"Знамя Победы над Рейхстагом. Май 1945","credit":"Фото: Е. Халдей, Wikimedia Commons, Public Domain"},"subsections":[{"id":"berlin","title":"Берлинская операция","meta":"16 АПРЕЛЯ — 8 МАЯ 1945 • БЕРЛИН","blocks":[{"type":"text","text":["x О последнем штурме: три фронта Жукова, Конева и Рокоссовского, бой за Зееловские высоты, уличные бои, взятие центра Берлина."]},{"type":"stats","items":[{"value":"2,5 млн","label":"солдат в операции"},{"value":"41 600","label":"орудий и миномётов"},{"value":"8 V","label":"подписание капитуляции"}]},{"type":"photo","media":{"src":"media/photos/berlin1945.jpg","caption":"Танк Т-34 у Бранденбургских ворот. Берлин, май 1945","credit":"Фото: Wikimedia Commons, Public Domain"}}]},{"id":"banner","title":"Знамя Победы","meta":"30 АПРЕЛЯ 1945 • РЕЙХСТАГ","blocks":[{"type":"text","text":["x О знамени 150-й стрелковой ордена Кутузова дивизии, водружённом М. А. Егоровым и М. В. Кантария над Рейхстагом."]},{"type":"fact","items":["Знамя Победы водружено 30 апреля 1945 года","М. А. Егоров и М. В. Кантария при поддержке А. П. Береста","Знамя Победы — символ победы советского народа"]},{"type":"photo","media":{"src":"media/photos/reichstag.jpg","caption":"Знамя Победы над Рейхстагом. Фото Е. Халдея","credit":"Фото: Е. Халдей, Wikimedia Commons, Public Domain"}}]},{"id":"surrender","title":"Капитуляция Германии","meta":"8 МАЯ 1945 • КАРЛСХОРСТ","blocks":[{"type":"text","text":["x О подписании Акта о безоговорочной капитуляции в Карлсхорсте: в 22:43 по центральноевропейскому времени — уже 9 мая по московскому."]},{"type":"fact","items":["Акт подписан в ночь с 8 на 9 мая 1945 года","От СССР подпись поставил маршал Г. К. Жуков","Салют Победы — 9 мая 1945, 30 залпов тысячи орудий"]},{"type":"photo","media":{"src":"media/photos/konevzhukov.jpg","caption":"Акт о безоговорочной капитуляции Германии","credit":"Фото: OWI, Wikimedia Commons, Public Domain"}}]},{"id":"victory-parade","title":"Парад Победы","meta":"24 ИЮНЯ 1945 • КРАСНАЯ ПЛОЩАДЬ","blocks":[{"type":"text","text":["x О Параде Победы 24 июня 1945 года: принимал парад маршал Г. К. Жуков, командовал маршал К. К. Рокоссовский, 200 знамён противника опущены к Мавзолею."]},{"type":"stats","items":[{"value":"24 VI 1945","label":"день Парада Победы"},{"value":"200","label":"знамён опущено к подножию"},{"value":"Маршал Жуков","label":"принимал парад"}]},{"type":"photo","media":{"src":"media/photos/parade1945.jpg","caption":"Колонны Парада Победы на Красной площади. 24 июня 1945","credit":"Фото: Минобороны России, Wikimedia Commons, CC BY 4.0"}},{"type":"video","media":{"src":"media/videos/zhukov45.mp4","caption":"Речь маршала Г. К. Жукова на Параде Победы, 24 июня 1945 года","credit":"Хроника: Wikimedia Commons, Public Domain"}},{"type":"video","media":{"src":"media/videos/parade45.mp4","caption":"Парад Победы на Красной площади, 24 июня 1945 года","credit":"Хроника: Sovkinozhurnal, Wikimedia Commons, Public Domain"}}]}]},{"id":"part-viii","numeral":"VIII","order":"07","theme":"РАЗГРОМ ЯПОНИИ","listTitle":"Разгром Японии","title":"Часть VIII. Разгром","titleAccent":"Японии","dates":"АВГУСТ — СЕНТЯБРЬ 1945","intro":"Блок для вводного текста части. Финальная кампания войны: молниеносный разгром Квантунской армии, освобождение Маньчжурии и Кореи, Сахалин и Курилы, конец Второй мировой.","stats":[{"value":"9 VIII","label":"начало операции"},{"value":"23 дня","label":"длилась кампания"},{"value":"2 IX 1945","label":"капитуляция Японии"}],"heroMedia":{"src":"media/photos/manchuria.jpg","caption":"39-я армия в степях Маньчжурии. Август 1945","credit":"Фото: Wikimedia Commons, Public Domain"},"subsections":[{"id":"fareast","title":"Дальний Восток: решение Москвы","meta":"ФЕВРАЛЬ — АВГУСТ 1945 • ЯЛТА","blocks":[{"type":"text","text":["x О вступлении СССР в войну с Японией в соответствии с договорённостями Крымской конференции: через три месяца после окончания войны в Европе."]},{"type":"fact","items":["Заявление о войне — 8 августа 1945 года","Боевые действия начались 9 августа 1945","Три фронта под командованием А. М. Василевского"]}]},{"id":"manchuria","title":"Маньчжурская операция","meta":"09.08 — 02.09.1945 • МАНЬЧЖУРИЯ","blocks":[{"type":"text","text":["x О стремительном наступлении через Большой Хинган и пустыни: окружение Квантунской армии, десанты в Порт-Артуре, Дайрене и Сейсине."]},{"type":"stats","items":[{"value":"1 млн+","label":"Квантунская армия разгромлена"},{"value":"Хинган","label":"танковый переход через хребет"},{"value":"19 VIII","label":"десант в Порт-Артуре"}]},{"type":"photo","media":{"src":"media/photos/manchuria.jpg","caption":"Колонны 39-й армии в степях Маньчжурии","credit":"Фото: Wikimedia Commons, Public Domain"}},{"type":"video","media":{"src":"media/videos/china44.mp4","caption":"Советская киноэкспедиция в Китае, 1944 год","credit":"Хроника: Wikimedia Commons, Public Domain"}}]},{"id":"sakhalin-kurils","title":"Сахалин и Курилы","meta":"11 — 25 АВГУСТА 1945 • ТИХИЙ ОКЕАН","blocks":[{"type":"text","text":["x О Южно-Сахалинской операции и Курильском десанте: возвращение южной части Сахалина и Курильских островов, включая Шикотан и Кунашир."]},{"type":"fact","items":["Южный Сахалин возвращён в августе 1945","Курильская десантная операция — 18 августа — 1 сентября","2 сентября 1945 — Акт о капитуляции Японии подписан на линкоре «Миссури»"]}]},{"id":"ww2-end","title":"Конец Второй мировой","meta":"2 СЕНТЯБРЯ 1945 • ТОКИЙСКИЙ ЗАЛИВ","blocks":[{"type":"text","text":["x Об итогах шести лет мировой войны: победа над милитаризмом, цена в десятках миллионов жизней, начало нового мира."]},{"type":"stats","items":[{"value":"2 IX 1945","label":"конец Второй мировой"},{"value":"3 IX","label":"День Победы над Японией"},{"value":"Указ 1945","label":"медаль «За победу над Японией»"}]}]}]}],"chronicle":[{"date":"22 ИЮНЯ 1941","title":"Нападение на СССР","text":"Германия начинает «план Барбаросса». Начинается Великая Отечественная война."},{"date":"30.09.1941","title":"Битва за Москву","text":"Начало обороны столицы. 7 ноября — парад на Красной площади."},{"date":"5–6.12.1941","title":"Контрнаступление под Москвой","text":"Первое крупное поражение врага во Второй мировой войне."},{"date":"17.07.1942","title":"Сталинградская битва","text":"Начало 200 дней и ночей на Волге — битвы, изменившей ход войны."},{"date":"02.02.1943","title":"Победа на Волге","text":"Армия Паулюса капитулирует. Начинается коренной перелом."},{"date":"05.07.1943","title":"Курская дуга","text":"Крупнейшее танковое сражение под Прохоровкой. Инициатива — у Красной армии."},{"date":"06.11.1943","title":"Киев освобождён","text":"Завершение битвы за Днепр. Салют в честь освобождения столицы Украины."},{"date":"23.06.1944","title":"Операция «Багратион»","text":"Разгром группы армий «Центр», освобождение Белоруссии."},{"date":"16.04.1945","title":"Берлинская операция","text":"Начало решающего штурма логова фашизма."},{"date":"09.05.1945","title":"День Победы","text":"Акт о безоговорочной капитуляции Германии. Салют Победы над Москвой."},{"date":"09.08.1945","title":"Война с Японией","text":"Начало Маньчжурской операции — разгром Квантунской армии."},{"date":"02.09.1945","title":"Конец Второй мировой","text":"Капитуляция Японии. Победа союзных народов в мировой войне."}],"footer":[{"label":"ФОТОАРХИВЫ","items":["Е. Халдей — Знамя над Рейхстагом","М. Альперт, Б. Кудояров, А. Гаранин — РИА Новости","Минобороны России — Парад Победы","ТАСС, OWI, U.S. Navy"]},{"label":"КИНОХРОНИКА","items":["«Речь Жукова на параде Победы» (1945)","«Парад Победы 1945 года»","«Железнодорожник» № 6 (1941)","D-Day OWI (1944), «Here is China» (1944)"]},{"label":"ИСТОЧНИКИ","items":["Wikimedia Commons — Public Domain / CC BY-SA","Официальные советские издания 1941–1953","Хроника СМД — Союзкинохроника"]}]};

  const doc = document;
  const root = doc.documentElement;
  // Анимации включены всегда, независимо от системной настройки reduced motion.
  const reduced = false;
  const $ = (sel, scope = doc) => scope.querySelector(sel);
  const $$ = (sel, scope = doc) => Array.from(scope.querySelectorAll(sel));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const esc = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[ch],
    );

  const partById = (id) => DATA.parts.find((part) => part.id === id);
  const subById = (part, id) => part && part.subsections.find((sub) => sub.id === id);

  /* ------------------------------------------------------------------ */
  /* Блокировка прокрутки (счётчик — чтобы меню и лист не мешали друг другу) */
  /* ------------------------------------------------------------------ */
  let locks = 0;
  let previousOverflow = "";

  function lockScroll() {
    if (locks === 0) {
      previousOverflow = doc.body.style.overflow;
      doc.body.style.overflow = "hidden";
    }
    locks += 1;
  }

  function unlockScroll() {
    if (!locks) return;
    locks -= 1;
    if (!locks) doc.body.style.overflow = previousOverflow;
  }

  /* ------------------------------------------------------------------ */
  /* Прелоадер                                                          */
  /* ------------------------------------------------------------------ */
  function initPreloader() {
    const preloader = doc.getElementById("preloader");
    if (!preloader) return;

    const number = doc.getElementById("preloader-number");
    const bar = doc.getElementById("preloader-bar-inner");

    const hide = () => {
      preloader.classList.add("is-hiding");
      window.setTimeout(() => {
        preloader.classList.add("is-gone");
        preloader.remove();
      }, 760);
    };

    if (reduced) {
      hide();
      return;
    }

    const started = performance.now();
    let raf = 0;

    const tick = (now) => {
      const progress = clamp((now - started) / 1500, 0, 1);
      if (number) number.textContent = String(1941 + Math.round(4 * progress));
      if (bar) bar.style.transform = `scaleX(${progress})`;
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(hide, 240);
      }
    };

    if (bar) {
      bar.style.transformOrigin = "left";
      bar.style.transform = "scaleX(0)";
    }
    raf = requestAnimationFrame(tick);
    window.addEventListener("pagehide", () => cancelAnimationFrame(raf), { once: true });
  }

  /* ------------------------------------------------------------------ */
  /* Кастомный курсор                                                   */
  /* ------------------------------------------------------------------ */
  function initCursor() {
    if (!window.matchMedia("(pointer: fine)").matches || reduced) return;

    const dot = doc.createElement("div");
    const ring = doc.createElement("div");
    dot.className = "cursor-dot";
    dot.setAttribute("aria-hidden", "true");
    ring.className = "cursor-ring";
    ring.setAttribute("aria-hidden", "true");
    doc.body.append(dot, ring);
    root.classList.add("cursor-none-desktop");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let dotX = targetX;
    let dotY = targetY;
    let ringX = targetX;
    let ringY = targetY;
    let shown = false;
    let raf = 0;

    const render = () => {
      dotX += (targetX - dotX) * 0.85;
      dotY += (targetY - dotY) * 0.85;
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      raf = requestAnimationFrame(render);
    };

    window.addEventListener(
      "pointermove",
      (event) => {
        targetX = event.clientX;
        targetY = event.clientY;
        if (!shown) {
          shown = true;
          dotX = ringX = targetX;
          dotY = ringY = targetY;
          dot.style.opacity = "1";
          ring.style.opacity = "1";
        }
        const interactive = event.target.closest("a, button, [role='button'], [data-cursor], video");
        ring.classList.toggle("is-hover", Boolean(interactive));
      },
      { passive: true },
    );

    window.addEventListener("pointerleave", () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      shown = false;
    });

    raf = requestAnimationFrame(render);
    window.addEventListener("pagehide", () => cancelAnimationFrame(raf), { once: true });
  }

  /* ------------------------------------------------------------------ */
  /* Шапка: цвет текста в зависимости от секции                          */
  /* ------------------------------------------------------------------ */
  function initHeader() {
    const header = doc.getElementById("site-header");
    if (!header) return;

    const sections = [
      "top",
      "parts",
      "part-i",
      "scene-1941",
      "part-iii",
      "part-iv",
      "part-v",
      "scene-perelom",
      "part-vi",
      "part-vii",
      "scene-victory",
      "part-viii",
      "chronicle",
    ];

    let queued = false;

    const update = () => {
      queued = false;
      let dark = false;
      for (const id of sections) {
        const section = doc.getElementById(id);
        if (!section) continue;
        const rect = section.getBoundingClientRect();
        if (rect.top <= 40 && rect.bottom > 40) {
          const rgb = (getComputedStyle(section).backgroundColor.match(/\d+/g) || []).map(Number);
          if (rgb.length >= 3) {
            const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
            dark = luminance < 0.5;
          }
          break;
        }
      }
      header.classList.toggle("on-dark", dark);
    };

    const schedule = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
  }

  /* ------------------------------------------------------------------ */
  /* Мобильное меню                                                     */
  /* ------------------------------------------------------------------ */
  function initMobileMenu() {
    const openButton = doc.getElementById("menu-btn");
    if (!openButton) return;

    const menu = doc.createElement("div");
    menu.className = "mobile-menu";
    menu.setAttribute("aria-hidden", "true");
    menu.innerHTML = `
      <div class="flex h-16 flex-none items-center justify-between px-5">
        <span class="mono-label text-fog">ОГЛАВЛЕНИЕ</span>
        <button type="button" class="menu-close mono-label border border-white/30 px-3 py-2 text-paper transition-colors hover:bg-paper hover:text-ink" aria-label="Закрыть меню">ЗАКРЫТЬ ✕</button>
      </div>
      <nav class="flex flex-1 flex-col justify-center gap-1 px-6 pb-10" aria-label="Части">
        ${DATA.parts
          .map(
            (part, index) => `
          <a href="#${part.id}" class="headline border-b border-white/10 py-3 text-3xl text-paper transition-colors hover:text-grass-bright sm:text-4xl">
            <span class="mono-label mr-4 align-middle text-grass-bright">&lt;${String(index + 1).padStart(2, "0")}&gt;</span>Часть ${esc(part.numeral)}
          </a>`,
          )
          .join("")}
        <a href="#chronicle" class="headline border-b border-white/10 py-3 text-3xl text-paper transition-colors hover:text-grass-bright sm:text-4xl">
          <span class="mono-label mr-4 align-middle text-grass-bright">&lt;08&gt;</span>Хроника
        </a>
      </nav>`;
    doc.body.appendChild(menu);

    const closeButton = $(".menu-close", menu);
    let isOpen = false;

    const close = () => {
      if (!isOpen) return;
      isOpen = false;
      menu.classList.remove("open");
      menu.setAttribute("aria-hidden", "true");
      openButton.setAttribute("aria-expanded", "false");
      unlockScroll();
    };

    const open = () => {
      if (isOpen) return;
      isOpen = true;
      menu.classList.add("open");
      menu.setAttribute("aria-hidden", "false");
      openButton.setAttribute("aria-expanded", "true");
      lockScroll();
      window.setTimeout(() => closeButton && closeButton.focus(), 480);
    };

    openButton.addEventListener("click", open);
    closeButton.addEventListener("click", close);
    $$("a", menu).forEach((link) => link.addEventListener("click", close));
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Появление блоков при прокрутке                                     */
  /* ------------------------------------------------------------------ */
  function initReveal() {
    const elements = $$('[style*="opacity:0"]');
    if (!elements.length) return;

    if (reduced || !("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.style.opacity = "1";
        element.style.transform = "none";
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let index = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target;
          observer.unobserve(element);
          const delay = Math.min(320, index * 70);
          index += 1;
          element.style.transition =
            "opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1)";
          element.style.transitionDelay = `${delay}ms`;
          requestAnimationFrame(() => {
            element.style.opacity = "1";
            element.style.transform = "none";
          });
          window.setTimeout(() => {
            element.style.transitionDelay = "0ms";
            element.style.willChange = "auto";
          }, 900 + delay);
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -6% 0px" },
    );

    elements.forEach((element) => {
      element.style.willChange = "opacity, transform";
      observer.observe(element);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Оглавление: превью части при наведении                             */
  /* ------------------------------------------------------------------ */
  function initParts() {
    const list = $("#parts ul");
    if (!list) return;

    const links = $$("a", list);
    const preview = doc.getElementById("parts-preview");
    const media = doc.getElementById("parts-preview-media");
    const caption = doc.getElementById("parts-preview-caption");
    const credit = doc.getElementById("parts-preview-credit");
    const tags = doc.getElementById("parts-preview-tags");

    links.forEach((link, index) => {
      const number = link.children[0];
      const title = link.children[1];
      if (number) {
        number.className = "mono-label w-14 flex-none part-num";
      }
      if (title) {
        title.className = "headline text-3xl sm:text-5xl part-title";
      }
      link.classList.add("part-link");
      link.addEventListener("mouseenter", () => setActive(index));
      link.addEventListener("focus", () => setActive(index));
    });

    function renderPreview(part) {
      if (!media || !part) return;

      const item = part.heroMedia;
      if (part.heroVideo) {
        media.innerHTML = `<video src="${esc(item.src)}" class="aspect-video w-full object-cover" muted loop playsinline autoplay preload="metadata" data-cursor="true"></video>`;
        const video = $("video", media);
        if (video) {
          video.muted = true;
          const attempt = video.play();
          if (attempt && attempt.catch) attempt.catch(() => {});
        }
      } else {
        media.innerHTML = `<img src="${esc(item.src)}" alt="${esc(item.caption)}" class="aspect-video w-full object-cover" loading="lazy" data-cursor="true"/>`;
      }

      if (caption) caption.textContent = item.caption;
      if (credit) credit.textContent = item.credit;
      if (tags) {
        tags.innerHTML = `
          <span class="mono-tag text-paper/80">ЧАСТЬ ${esc(part.numeral)}</span>
          <span class="mono-tag text-grass-bright">${esc(part.dates)}</span>
          <span class="mono-tag text-paper/80">${part.subsections.length} ПОДРАЗДЕЛА</span>`;
      }
    }

    function setActive(index) {
      links.forEach((link, i) => {
        const active = i === index;
        link.classList.toggle("is-active", active);
        link.setAttribute("aria-current", active ? "true" : "false");
      });
      renderPreview(DATA.parts[index]);
    }

    if (preview) {
      preview.style.opacity = "0";
      preview.style.transform = "translateY(24px) scale(.985)";
      preview.style.transition =
        "opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1)";

      const reveal = () => {
        preview.style.opacity = "1";
        preview.style.transform = "none";
      };

      if (reduced || !("IntersectionObserver" in window)) {
        reveal();
      } else {
        const observer = new IntersectionObserver(
          (entries) => {
            if (!entries[0].isIntersecting) return;
            observer.disconnect();
            requestAnimationFrame(reveal);
          },
          { threshold: 0.12 },
        );
        observer.observe(preview);
      }
    }

    setActive(0);
  }

  /* ------------------------------------------------------------------ */
  /* Лист для чтения                                                    */
  /* ------------------------------------------------------------------ */
  let reader = null;

  function initReader() {
    const element = doc.createElement("div");
    element.className = "reader-root";
    element.setAttribute("aria-hidden", "true");
    element.innerHTML = `
      <button type="button" class="reader-backdrop" data-reader-close aria-label="Закрыть лист"></button>
      <aside class="reader-panel" role="dialog" aria-modal="true" aria-label="Лист для чтения" tabindex="-1">
        <div class="flex h-full min-h-0 w-full flex-col">
          <div class="flex flex-none items-center justify-between gap-3 border-b border-ink/10 px-5 py-4 sm:px-6">
            <p class="mono-label flex items-center gap-2.5 text-smoke">
              <span class="dot-live"></span><span class="reader-kicker"></span>
            </p>
            <button type="button" class="reader-close mono-label flex-none border border-ink/25 px-3 py-2 text-ink transition-colors hover:bg-ink hover:text-white" aria-label="Закрыть лист">ЗАКРЫТЬ ✕</button>
          </div>
          <div class="reader-scroll min-h-0 flex-1 overflow-y-auto px-5 py-7 sm:px-9"></div>
        </div>
      </aside>`;
    doc.body.appendChild(element);

    reader = {
      element,
      panel: $(".reader-panel", element),
      scroll: $(".reader-scroll", element),
      kicker: $(".reader-kicker", element),
      closeButton: $(".reader-close", element),
      trigger: null,
      open: false,
    };

    reader.closeButton.addEventListener("click", closeReader);
    $(".reader-backdrop", element).addEventListener("click", closeReader);
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeReader();
    });

    $$(".subsection-btn").forEach((button) => {
      const section = button.closest("section[id]");
      if (!section) return;
      const part = partById(section.id);
      if (!part) return;
      const buttons = $$(".subsection-btn", section);
      const index = buttons.indexOf(button);
      const sub = part.subsections[index];
      if (!sub) return;
      button.addEventListener("click", (event) => {
        event.preventDefault();
        openReader(part, sub, button);
      });
    });
  }

  function mediaFigure(media, isVideo) {
    const badge = isVideo
      ? '<span class="mono-label pointer-events-none absolute left-3 top-3 bg-grass px-2 py-1 text-ink">КИНОХРОНИКА</span>'
      : '<span class="mono-label absolute left-3 top-3 bg-ink/85 px-2 py-1 text-white">КАДР ХРОНИКИ</span>';
    const source = isVideo
      ? `<video src="${esc(media.src)}" class="h-auto w-full" controls muted loop playsinline preload="metadata"></video>`
      : `<img src="${esc(media.src)}" alt="${esc(media.caption)}" class="h-auto w-full object-cover" loading="lazy"/>`;

    return `
      <figure>
        <div class="relative border border-ink/15 bg-ink">
          ${source}
          ${badge}
        </div>
        <figcaption class="mt-2.5">
          <p class="text-[13.5px] font-medium leading-snug text-ink">${esc(media.caption)}</p>
          <p class="mono-label mt-1 text-[9.5px] text-smoke">${esc(media.credit || "")}</p>
        </figcaption>
      </figure>`;
  }

  function renderBlock(block) {
    if (!block) return "";

    if (block.type === "text") {
      const paragraphs = Array.isArray(block.text) ? block.text : [block.text];
      return `
        <div class="border border-dashed border-ink/30 bg-paper-soft p-5">
          <p class="mono-label flex flex-wrap items-center gap-2 text-smoke">
            <span class="text-grass">[ ТЕКСТОВЫЙ БЛОК ]</span> место для вашего текста
          </p>
          <div class="mt-3 space-y-3">
            ${paragraphs.map((text) => `<p class="text-[15px] leading-relaxed text-ink/70">${esc(text)}</p>`).join("")}
          </div>
        </div>`;
    }

    if (block.type === "fact") {
      return `
        <div>
          <p class="mono-label text-smoke">/ФАКТЫ И ДАТЫ</p>
          <ul class="mt-3 space-y-2.5 border-l-2 border-grass pl-4">
            ${(block.items || []).map((item) => `<li class="text-[14.5px] font-medium leading-snug text-ink">${esc(item)}</li>`).join("")}
          </ul>
        </div>`;
    }

    if (block.type === "stats") {
      return `
        <div class="grid grid-cols-3 gap-px border border-ink/15 bg-ink/15">
          ${(block.items || [])
            .map(
              (item) => `
            <div class="bg-paper-soft px-2 py-4 text-center sm:px-3">
              <p class="headline font-mono text-base text-ink sm:text-xl">${esc(item.value)}</p>
              <p class="mono-label mt-1.5 text-[9.5px] leading-tight text-smoke">${esc(item.label)}</p>
            </div>`,
            )
            .join("")}
        </div>`;
    }

    if (block.type === "photo") return mediaFigure(block.media, false);
    if (block.type === "video") return mediaFigure(block.media, true);
    return "";
  }

  function openReader(part, sub, trigger) {
    if (!reader) return;

    reader.trigger = trigger || null;
    reader.kicker.textContent = `ЧАСТЬ ${part.numeral} — ${part.theme}`;
    reader.scroll.innerHTML = `
      <p class="mono-label text-grass">${esc(sub.meta)}</p>
      <h3 class="headline mt-3 text-4xl text-ink sm:text-[2.6rem]">${esc(sub.title)}</h3>
      <hr class="dotted-rule mt-6"/>
      <div class="mt-6 space-y-6 pb-10">
        ${(sub.blocks || []).map(renderBlock).join("")}
        <p class="mono-label border border-dashed border-ink/25 px-4 py-3 text-[10px] leading-relaxed text-smoke">
          &gt; ТЕКСТ ЭТОГО ЛИСТА БУДЕТ ДОБАВЛЕН АВТОРОМ ПРОЕКТА. ЗАГОЛОВКИ, МЕТА-ДАННЫЕ, ФАКТЫ И МЕДИА УЖЕ РАЗМЕЩЕНЫ.
        </p>
      </div>`;
    reader.scroll.scrollTop = 0;

    if (!reader.open) {
      lockScroll();
      reader.open = true;
    }
    reader.element.classList.add("open");
    reader.element.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => reader.closeButton.focus());
  }

  function closeReader() {
    if (!reader || !reader.open) return;
    reader.open = false;
    reader.element.classList.remove("open");
    reader.element.setAttribute("aria-hidden", "true");
    unlockScroll();
    if (reader.trigger) {
      const trigger = reader.trigger;
      reader.trigger = null;
      trigger.focus({ preventScroll: true });
    }
  }

  /* ------------------------------------------------------------------ */
  /* Хроника                                                           */
  /* ------------------------------------------------------------------ */
  function initChronicle() {
    const section = doc.getElementById("chronicle");
    if (!section) return;

    const items = $$(".chronicle-item", section);
    if (!items.length) return;

    items.forEach((item, index) => {
      const button = $("button[aria-expanded]", item);
      if (!button) return;

      const initiallyOpen = button.getAttribute("aria-expanded") === "true";
      const oldBody = Array.from(item.children).find(
        (child) => child !== button && child.classList.contains("overflow-hidden"),
      );
      if (oldBody) oldBody.remove();

      const date = button.children[0];
      if (date) {
        date.classList.remove("text-grass");
        date.classList.add("text-smoke");
      }

      const plus = button.lastElementChild;
      if (plus) {
        plus.classList.remove("rotate-45", "border-grass", "bg-grass", "text-ink");
        plus.classList.add("border-ink/25");
      }

      const data = DATA.chronicle[index];
      if (!data) return;

      const body = doc.createElement("div");
      body.className = "chronicle-body";
      body.innerHTML = `
        <div class="grid grid-cols-1 gap-4 pb-7 sm:gap-8 sm:pl-40">
          <span class="mono-label text-grass sm:hidden">${esc(data.date)}</span>
          <p class="max-w-2xl border-l-2 border-grass pl-4 text-[15px] leading-relaxed text-ink/75">${esc(data.text)}</p>
        </div>`;
      item.appendChild(body);

      item.classList.toggle("open", initiallyOpen);
      button.setAttribute("aria-expanded", String(initiallyOpen));

      button.addEventListener("click", () => {
        const wasOpen = item.classList.contains("open");
        items.forEach((other) => {
          if (other !== item) closeChronicle(other);
        });
        if (wasOpen) closeChronicle(item);
        else openChronicle(item);
      });

      if (initiallyOpen) {
        openChronicle(item);
      }
    });

    function openChronicle(item) {
      const button = $("button[aria-expanded]", item);
      const body = $(".chronicle-body", item);
      if (!button || !body) return;
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
      body.style.height = `${body.scrollHeight}px`;
    }

    function closeChronicle(item) {
      const button = $("button[aria-expanded]", item);
      const body = $(".chronicle-body", item);
      if (!button || !body) return;
      item.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
      body.style.height = "0px";
    }

    window.addEventListener("resize", () => {
      items.forEach((item) => {
        if (!item.classList.contains("open")) return;
        const body = $(".chronicle-body", item);
        if (body) body.style.height = `${body.scrollHeight}px`;
      });
    });

    window.addEventListener(
      "load",
      () => {
        items.forEach((item) => {
          if (!item.classList.contains("open")) return;
          const body = $(".chronicle-body", item);
          if (body) body.style.height = `${body.scrollHeight}px`;
        });
      },
      { once: true },
    );
  }

  /* ------------------------------------------------------------------ */
  /* Canvas: «ПОБЕДА» и «1941·1945»                                     */
  /* ------------------------------------------------------------------ */
  function initParticleTexts() {
    $$('[role="img"]').forEach((parent) => {
      const text = parent.getAttribute("aria-label");
      const canvas = parent.querySelector("canvas");
      if (!text || !canvas) return;
      createParticleText(parent, canvas, text, Boolean(parent.closest("footer")));
    });
  }

  function createParticleText(parent, canvas, text, dark) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let points = [];
    let raf = 0;
    let lastTime = 0;
    let running = false;
    const mouse = { x: -9999, y: -9999 };

    const build = () => {
      const rect = parent.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(160, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const offscreen = doc.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const off = offscreen.getContext("2d");
      if (!off) return;

      let fontSize = Math.min(width / (0.72 * text.length), 0.92 * height);
      off.font = `900 ${fontSize}px "Inter Tight", sans-serif`;
      for (let i = 0; i < 24; i += 1) {
        const measured = off.measureText(text).width;
        if (measured <= 0.96 * width) break;
        fontSize *= (0.96 * width) / measured;
        off.font = `900 ${fontSize}px "Inter Tight", sans-serif`;
      }
      off.textAlign = "center";
      off.textBaseline = "middle";
      off.fillStyle = "#fff";
      off.fillText(text, width / 2, height / 2);

      const pixels = off.getImageData(0, 0, width, height).data;
      const step = Math.max(5, Math.round(fontSize / 30));
      points = [];
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          if (pixels[(y * width + x) * 4 + 3] > 120) {
            points.push({
              x: x + (Math.random() - 0.5) * step * 0.6,
              y: y + (Math.random() - 0.5) * step * 0.6,
              s: step * (0.34 + 0.3 * Math.random()),
              a: (Math.random() - 0.5) * 0.7,
              phase: Math.random() * Math.PI * 2,
              green: Math.random() < 0.055,
            });
          }
        }
      }
    };

    const draw = (time) => {
      if (!running) return;
      const color = dark ? "#efeee9" : "#0b0b0a";
      const seconds = time / 1000;
      ctx.clearRect(0, 0, width, height);

      for (const point of points) {
        const wave = Math.sin(1.6 * seconds + point.phase);
        let x = point.x + 1.2 * wave;
        let y = point.y + 1.2 * Math.cos(1.3 * seconds + point.phase);
        let angle = point.a + 0.35 * wave;

        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const distanceSq = dx * dx + dy * dy;
        if (distanceSq < 8100) {
          const distance = Math.sqrt(distanceSq) || 1;
          const push = ((90 - distance) / 90) * 26;
          x += (dx / distance) * push;
          y += (dy / distance) * push;
          angle += (dx / distance) * push * 0.04;
        }

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        const size = point.s * (1 + 0.08 * wave);
        ctx.strokeStyle = point.green ? "#1ec15e" : color;
        ctx.lineWidth = Math.max(1.1, 0.34 * size);
        ctx.lineCap = "square";
        ctx.beginPath();
        ctx.moveTo(-size, -(0.85 * size));
        ctx.lineTo(0, 0.15 * size);
        ctx.lineTo(size, -(0.85 * size));
        ctx.stroke();
        ctx.restore();
      }

      lastTime = time;
      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Один статичный кадр: для режима «уменьшить движение» и после
    // перерисовки из-за загрузки шрифтов (build() очищает canvas).
    const paintStatic = () => {
      running = true;
      draw(performance.now());
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointerMove = (event) => {
      const rect = parent.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };
    const onPointerLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    parent.addEventListener("pointermove", onPointerMove, { passive: true });
    parent.addEventListener("pointerleave", onPointerLeave);

    build();
    if (doc.fonts && doc.fonts.ready) {
      doc.fonts.ready
        .then(() => {
          build();
          if (reduced) paintStatic();
        })
        .catch(() => {});
    }

    if (!reduced) {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) start();
          else stop();
        },
        { rootMargin: "200px" },
      );
      observer.observe(parent);
    } else {
      paintStatic();
    }

    new ResizeObserver(() => {
      build();
      if (reduced) paintStatic();
    }).observe(parent);
  }

  /* ------------------------------------------------------------------ */
  /* Canvas-сцены 1941 / перелом / победа                               */
  /* ------------------------------------------------------------------ */
  const SCENES = {
    "scene-1941": { kind: "text", value: "1941" },
    "scene-perelom": { kind: "star" },
    "scene-victory": { kind: "text", value: "9 МАЯ" },
  };

  function initScenes() {
    Object.entries(SCENES).forEach(([id, shape]) => {
      const section = doc.getElementById(id);
      if (section) createScene(section, shape);
    });
  }

  function createScene(section, shape) {
    const canvas = section.querySelector("canvas");
    if (!canvas) return;
    const parent = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    const counter = section.querySelector(".scene-counter span:nth-child(2)");
    if (!ctx || !parent) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let particles = [];
    let progress = 0;
    let lastCounter = "";
    let raf = 0;
    let running = false;
    let inView = false;

    const build = () => {
      const rect = parent.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(300, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const offscreen = doc.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const off = offscreen.getContext("2d");
      if (!off) return;
      off.fillStyle = "#fff";

      if (shape.kind === "text") {
        let fontSize = Math.min(width / (0.62 * shape.value.length), 0.6 * height);
        off.font = `900 ${fontSize}px "Inter Tight", sans-serif`;
        for (let i = 0; i < 20; i += 1) {
          const measured = off.measureText(shape.value).width;
          if (measured <= 0.9 * width) break;
          fontSize *= (0.9 * width) / measured;
          off.font = `900 ${fontSize}px "Inter Tight", sans-serif`;
        }
        off.textAlign = "center";
        off.textBaseline = "middle";
        off.fillText(shape.value, width / 2, height / 2);
      } else {
        const cx = width / 2;
        const cy = height / 2 + 0.02 * height;
        const outer = 0.42 * Math.min(width, height);
        const inner = 0.42 * outer;
        off.beginPath();
        for (let i = 0; i < 10; i += 1) {
          const angle = (Math.PI / 5) * i - Math.PI / 2;
          const radius = i % 2 === 0 ? outer : inner;
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius;
          if (i === 0) off.moveTo(x, y);
          else off.lineTo(x, y);
        }
        off.closePath();
        off.fill();
      }

      const pixels = off.getImageData(0, 0, width, height).data;
      particles = [];
      for (let y = 0; y < height; y += 9) {
        for (let x = 0; x < width; x += 9) {
          if (pixels[(y * width + x) * 4 + 3] > 120) {
            particles.push({
              sx: Math.random() * width,
              sy: Math.random() * height,
              tx: x,
              ty: y,
              s: 3.2 + 2.6 * Math.random(),
              phase: Math.random() * Math.PI * 2,
              green: Math.random() < 0.16,
            });
          }
        }
      }
    };

    const draw = (time) => {
      if (!running) return;
      const seconds = time / 1000;
      ctx.clearRect(0, 0, width, height);

      if (progress > 0.05) {
        const gradient = ctx.createRadialGradient(
          width / 2,
          height / 2,
          10,
          width / 2,
          height / 2,
          0.42 * Math.max(width, height),
        );
        gradient.addColorStop(0, `rgba(30,193,94,${0.16 * progress})`);
        gradient.addColorStop(1, "rgba(30,193,94,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      const ease = 1 - Math.pow(1 - progress, 3);

      for (const particle of particles) {
        const wave = Math.sin(1.4 * seconds + particle.phase);
        const x =
          particle.sx +
          (particle.tx - particle.sx) * ease +
          (ease > 0.98 ? 0.8 * wave : 0);
        const y =
          particle.sy +
          (particle.ty - particle.sy) * ease +
          (ease > 0.98 ? 0.8 * Math.cos(1.2 * seconds + particle.phase) : 0);
        const angle =
          (1 - ease) * Math.PI * 2 * (particle.phase > Math.PI ? 1 : -1) +
          Math.PI / 2 +
          0.25 * wave * ease;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.strokeStyle = particle.green
          ? "#3ee87e"
          : `rgba(238,237,232,${0.35 + 0.6 * ease})`;
        ctx.lineWidth = 1.4;
        const size = particle.s * (0.7 + 0.3 * ease);
        ctx.beginPath();
        ctx.moveTo(-size, -0.8 * size);
        ctx.lineTo(0, 0.2 * size);
        ctx.lineTo(size, -0.8 * size);
        ctx.stroke();
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Статичный кадр для режима «уменьшить движение» и после
    // перерисовки из-за шрифтов (build() очищает canvas).
    const paintStatic = () => {
      running = true;
      draw(performance.now());
      running = false;
      cancelAnimationFrame(raf);
    };

    const updateProgress = () => {
      const rect = section.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      const raw = clamp(-rect.top / total, 0, 1);
      progress = clamp((raw - 0.12) / 0.5, 0, 1);

      const index = clamp(Math.ceil(progress * 3), 1, 3);
      const label = `<0${index}/03>`;
      if (counter && label !== lastCounter) {
        lastCounter = label;
        counter.textContent = label;
      }
    };

    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        updateProgress();
        if (reduced) {
          paintStatic();
        }
      });
    };

    build();
    if (doc.fonts && doc.fonts.ready) {
      doc.fonts.ready
        .then(() => {
          build();
          if (reduced) paintStatic();
        })
        .catch(() => {});
    }
    updateProgress();
    if (reduced) {
      paintStatic();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        inView = entries[0].isIntersecting;
        if (inView) start();
        else stop();
      },
      { rootMargin: "200px" },
    );
    observer.observe(section);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      build();
      onScroll();
    });

    new ResizeObserver(() => {
      build();
      onScroll();
    }).observe(parent);
  }

  /* ------------------------------------------------------------------ */
  /* Прочее                                                             */
  /* ------------------------------------------------------------------ */
  function initVideos() {
    $$("video[autoplay]").forEach((video) => {
      video.muted = true;
      const attempt = video.play();
      if (attempt && attempt.catch) attempt.catch(() => {});
    });
  }

  function initMarquee() {
    // Анимация задана в CSS; дубликат ленты уже есть в HTML.
  }

  function init() {
    root.classList.add("js");
    root.classList.remove("no-js");
    initPreloader();
    initReveal();
    initCursor();
    initHeader();
    initMobileMenu();
    initParts();
    initReader();
    initChronicle();
    initScenes();
    initParticleTexts();
    initVideos();
    initMarquee();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
