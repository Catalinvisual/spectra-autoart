// Vehicle data for fallback and population
export const fallbackModels = {
  'Abarth': ['124 Spider', '500', '500C', '595', '695', 'Grande Punto'],
  'Acura': ['CL', 'EL', 'ILX', 'Integra', 'Legend', 'MDX', 'NSX', 'RDX', 'RL', 'RLX', 'RSX', 'SLX', 'TL', 'TLX', 'TSX', 'Vigor', 'ZDX'],
  'Alfa Romeo': ['145', '146', '147', '155', '156', '159', '164', '166', '33', '75', '90', 'Alfetta', 'Brera', 'Giulia', 'Giulietta', 'GT', 'GTV', 'MiTo', 'Spider', 'Stelvio'],
  'Alpina': ['B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'D3', 'D4', 'D5', 'XD3', 'XD4'],
  'Ariel': ['Atom', 'Nomad'],
  'Aston Martin': ['Cygnet', 'DB11', 'DB7', 'DB9', 'DBS', 'Lagonda', 'Rapide', 'V12 Vantage', 'V8 Vantage', 'Vanquish', 'Virage', 'Vulcan'],
  'Audi': ['100', '200', '80', '90', 'A1', 'A2', 'A3', 'A4', 'A4 allroad', 'A5', 'A6', 'A6 allroad', 'A7', 'A8', 'e-tron', 'e-tron GT', 'Q2', 'Q3', 'Q4 e-tron', 'Q5', 'Q7', 'Q8', 'Quattro', 'R8', 'RS Q3', 'RS Q8', 'RS2', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'SQ2', 'SQ5', 'SQ7', 'SQ8', 'TT', 'TT RS', 'TTS', 'V8'],
  'Bentley': ['Arnage', 'Azure', 'Bentayga', 'Brooklands', 'Continental', 'Eight', 'Flying Spur', 'Mulsanne'],
  'BMW': ['1 Series', '2 Series', '2 Series Active Tourer', '2 Series Gran Tourer', '3 Series', '3 Series Gran Turismo', '4 Series', '5 Series', '5 Series Gran Turismo', '6 Series', '6 Series Gran Turismo', '7 Series', '8 Series', 'i3', 'i4', 'i7', 'i8', 'M2', 'M3', 'M4', 'M5', 'M6', 'X1', 'X2', 'X3', 'X4', 'X5', 'X5 M', 'X6', 'X6 M', 'X7', 'Z1', 'Z3', 'Z4', 'Z8'],
  'Bugatti': ['Chiron', 'Divo', 'EB 110', 'Veyron'],
  'Buick': ['Cascada', 'Century', 'Electra', 'Enclave', 'Encore', 'Encore GX', 'Envision', 'LaCrosse', 'LeSabre', 'Lucerne', 'Park Avenue', 'Rainier', 'Reatta', 'Regal', 'Rendezvous', 'Riviera', 'Roadmaster', 'Skylark', 'Terraza', 'Verano'],
  'Cadillac': ['ATS', 'BLS', 'Catera', 'CT4', 'CT5', 'CT6', 'CTS', 'DeVille', 'DTS', 'Eldorado', 'ELR', 'Escalade', 'Fleetwood', 'Seville', 'SRX', 'STS', 'XLR', 'XT4', 'XT5', 'XT6', 'XTS'],
  'Chevrolet': ['Astro', 'Avalanche', 'Aveo', 'Bel Air', 'Blazer', 'Camaro', 'Caprice', 'Captiva', 'Cavalier', 'Celebrity', 'Chevelle', 'Chevette', 'Citation', 'Cobalt', 'Colorado', 'Corsica', 'Corvette', 'Cruze', 'El Camino', 'Epica', 'Equinox', 'Express', 'HHR', 'Impala', 'Lumina', 'Malibu', 'Monte Carlo', 'Nova', 'Orlando', 'S-10', 'Silverado', 'Sonic', 'Spark', 'Spin', 'SS', 'SSR', 'Suburban', 'Tacuma', 'Tahoe', 'Tracker', 'TrailBlazer', 'Traverse', 'Trax', 'Uplander', 'Vectra', 'Venture', 'Volt'],
  'Chrysler': ['200', '300', '300M', 'Aspen', 'Cirrus', 'Concorde', 'Cordoba', 'Crossfire', 'Fifth Avenue', 'Grand Voyager', 'Imperial', 'LeBaron', 'LHS', 'Neon', 'New Yorker', 'Pacifica', 'Prowler', 'PT Cruiser', 'Saratoga', 'Sebring', 'Stratus', 'Town & Country', 'Valiant', 'Viper', 'Vision', 'Voyager'],
  'Citroën': ['AX', 'Berlingo', 'BX', 'C1', 'C2', 'C3', 'C3 Aircross', 'C3 Picasso', 'C4', 'C4 Aircross', 'C4 Cactus', 'C4 Picasso', 'C4 Spacetourer', 'C5', 'C5 Aircross', 'C6', 'C8', 'C15', 'C25', 'C35', 'DS3', 'DS4', 'DS5', 'Evasion', 'Jumper', 'Jumpy', 'Nemo', 'Saxo', 'Xantia', 'XM', 'Xsara', 'Xsara Picasso', 'ZX'],
  'Dacia': ['Dokker', 'Duster', 'Lodgy', 'Logan', 'Sandero', 'Spring'],
  'Daewoo': 'Espero|Kalos|Korando|Lacetti|Lanos|Leganza|Matiz|Musso|Nexia|Nubira|Rezzo|Tacuma|Tico'.split('|'),
  'Daihatsu': ['Applause', 'Charade', 'Copen', 'Cuore', 'Domino', 'Fourtrak', 'Gran Move', 'Materia', 'Move', 'Rocky', 'Sirion', 'Sportrak', 'Taft', 'Terios', 'Trevis', 'YRV'],
  'Dodge': ['Avenger', 'Caliber', 'Caravan', 'Challenger', 'Charger', 'Colt', 'Dakota', 'Dart', 'Daytona', 'Durango', 'Dynasty', 'Grand Caravan', 'Intrepid', 'Journey', 'Magnum', 'Monaco', 'Neon', 'Nitro', 'Omni', 'Ram', 'Ramcharger', 'Shadow', 'Spirit', 'Stealth', 'Stratus', 'Viper'],
  'Eagle': ['Premier', 'Summit', 'Talon', 'Vision'],
  'Ferrari': ['288 GTO', '308', '328', '348', '355', '360', '430', '456', '458', '488', '512', '550', '575M', '599', '612', '812 Superfast', 'California', 'Daytona', 'F12', 'F355', 'F40', 'F430', 'F50', 'F512', 'FF', 'GTC4Lusso', 'LaFerrari', 'Mondial', 'Portofino', 'Roma', 'Testarossa'],
  'Fiat': ['1100', '124', '126', '127', '128', '130', '131', '132', '500', '500L', '500X', '600', '850', 'Albea', 'Barchetta', 'Brava', 'Bravo', 'Cinquecento', 'Coupe', 'Croma', 'Doblo', 'Ducato', 'Fiorino', 'Freemont', 'Grande Punto', 'Idea', 'Linea', 'Marea', 'Multipla', 'Palio', 'Panda', 'Punto', 'Qubo', 'Regata', 'Ritmo', 'Scudo', 'Sedici', 'Seicento', 'Stilo', 'Strada', 'Talento', 'Tempra', 'Tipo', 'Topolino', 'Ulysse', 'Uno'],
  'Fisker': ['Karma'],
  'Ford': ['Aerostar', 'Bronco', 'Bronco II', 'C-Max', 'Capri', 'Contour', 'Corsair', 'Courier', 'Crown Victoria', 'Econoline', 'Edge', 'Escape', 'Escort', 'Excursion', 'Expedition', 'Explorer', 'F-150', 'F-250', 'F-350', 'Fairlane', 'Festiva', 'Fiesta', 'Five Hundred', 'Flex', 'Focus', 'Freestar', 'Freestyle', 'Fusion', 'Galaxie', 'Galaxy', 'Granada', 'GT', 'Ka', 'Laser', ' LTD', 'Maverick', 'Mondeo', 'Mustang', 'Orion', 'Pinto', 'Probe', 'Puma', 'Ranchero', 'Ranger', 'S-Max', 'Scorpio', 'Sierra', 'Taurus', 'Taurus X', 'Telstar', 'Tempo', 'Thunderbird', 'Tourneo', 'Transit', 'Transit Connect', 'Windstar', 'Zephyr'],
  'Genesis': ['G70', 'G80', 'G90', 'GV60', 'GV70', 'GV80'],
  'Geo': ['Metro', 'Prizm', 'Spectrum', 'Storm', 'Tracker'],
  'GMC': ['Acadia', 'Canyon', 'Envoy', 'Envoy XL', 'Jimmy', 'S-15', 'Safari', 'Savana', 'Sierra', 'Sierra 1500', 'Sierra 2500', 'Sierra 3500', 'Sonoma', 'Suburban', 'Syclone', 'Terrain', 'Typhoon', 'Yukon', 'Yukon XL'],
  'Honda': ['Accord', 'Accord Crosstour', 'Airwave', 'Ascot', 'Avancier', 'Ballade', 'Beat', 'Capa', 'City', 'Civic', 'Clarity', 'Concerto', 'CR-V', 'CR-X', 'CR-Z', 'Crosstour', 'Element', 'EV Plus', 'Fit', 'FR-V', 'HR-V', 'Insight', 'Integra', 'Jazz', 'Legend', 'Life', 'Logo', 'MDX', 'Mobilio', 'N-Box', 'NSX', 'Odyssey', 'Orthia', 'Partner', 'Passport', 'Pilot', 'Prelude', 'Ridgeline', 'S-MX', 'Shuttle', 'Stepwgn', 'Stream', 'Today', 'Torneo', 'Vamos'],
  'Hummer': ['H1', 'H2', 'H3'],
  'Hyundai': ['Accent', 'Atos', 'Avante', 'Azera', 'Creta', 'Elantra', 'Equus', 'Excel', 'Galloper', 'Genesis', 'Getz', 'Grand i10', 'Grand Santa Fe', 'Grandeur', 'H-1', 'H100', 'i10', 'i20', 'i30', 'i40', 'Ioniq', 'ix20', 'ix35', 'ix55', 'Kona', 'Lantra', 'Marcia', 'Matrix', 'Maxcruz', 'Pony', 'Santa Fe', 'Santamo', 'Scoupe', 'Solaris', 'Sonata', 'Starex', 'Terracan', 'Tiburon', 'Trajet', 'Tucson', 'Veloster', 'Venue', 'Veracruz', 'XG', 'Xcent'],
  'Infiniti': ['EX', 'FX', 'G', 'I', 'J30', 'JX', 'M', 'Q30', 'Q40', 'Q45', 'Q50', 'Q60', 'Q70', 'QX30', 'QX4', 'QX50', 'QX56', 'QX60', 'QX70', 'QX80'],
  'Isuzu': ['Amigo', 'Ascender', 'Axiom', 'D-Max', 'Gemini', 'Hombre', 'i-Series', 'Impulse', 'KB', 'MU', 'Oasis', 'Panther', 'Rodeo', 'Stylus', 'Trooper', 'VehiCROSS'],
  'Jaguar': ['E-Pace', 'E-Type', 'F-Pace', 'F-Type', 'Mark X', 'S-Type', 'X-Type', 'XE', 'XF', 'XJ', 'XJ6', 'XJ8', 'XJR', 'XJS', 'XK', 'XK8', 'XKR', 'X-Type'],
  'Jeep': ['Cherokee', 'CJ', 'Commander', 'Compass', 'Grand Cherokee', 'Liberty', 'Patriot', 'Renegade', 'Wagoneer', 'Willys', 'Wrangler'],
  'Kia': ['Avella', 'Borrego', 'Cadenza', 'Carens', 'Carnival', 'Cerato', 'Forte', 'K3', 'K5', 'K7', 'K8', 'K9', 'Mohave', 'Niro', 'Opirus', 'Optima', 'Picanto', 'Pregio', 'Pride', 'Quoris', 'Ray', 'Rio', 'Seltos', 'Sephia', 'Shuma', 'Sorento', 'Soul', 'Spectra', 'Sportage', 'Stinger', 'Telluride', 'Venga'],
  'Koenigsegg': ['Agera', 'CC', 'CCR', 'CCX', 'Gemera', 'Jesko', 'Regera'],
  'Lamborghini': ['Aventador', 'Countach', 'Diablo', 'Espada', 'Gallardo', 'Huracan', 'Jalpa', 'Jarama', 'Miura', 'Murcielago', 'Reventon', 'Sian', 'Urus'],
  'Lancia': ['Beta', 'Dedra', 'Delta', 'Kappa', 'Lybra', 'Musa', 'Phedra', 'Prisma', 'Thema', 'Thesis', 'Trevi', 'Ypsilon', 'Zeta'],
  'Land Rover': ['Defender', 'Discovery', 'Discovery Sport', 'Freelander', 'Range Rover', 'Range Rover Evoque', 'Range Rover Sport', 'Range Rover Velar'],
  'Lexus': ['CT', 'ES', 'GS', 'GX', 'HS', 'IS', 'LC', 'LFA', 'LS', 'LX', 'NX', 'RC', 'RX', 'SC', 'UX'],
  'Lincoln': ['Aviator', 'Blackwood', 'Continental', 'Corsair', 'LS', 'Mark', 'MKC', 'MKS', 'MKT', 'MKX', 'MKZ', 'Nautilus', 'Navigator', 'Town Car', 'Zephyr'],
  'Lotus': ['Elan', 'Elise', 'Esprit', 'Evora', 'Exige'],
  'Maserati': ['222', '3200', '4200', 'Biturbo', 'Coupe', 'Ghibli', 'GranSport', 'GranTurismo', 'Karif', 'Levante', 'MC20', 'Quattroporte', 'Shamal', 'Spyder'],
  'Maybach': ['57', '62', 'S 650'],
  'Mazda': ['121', '2', '3', '323', '5', '6', '626', '929', 'B-Series', 'BT-50', 'CX-3', 'CX-30', 'CX-5', 'CX-50', 'CX-7', 'CX-9', 'Demio', 'Eunos', 'Millenia', 'MPV', 'MX-3', 'MX-5', 'MX-6', 'Premacy', 'Protege', 'RX-7', 'RX-8', 'Tribute', 'Xedos'],
  'McLaren': ['540C', '570GT', '570S', '600LT', '620R', '650S', '675LT', '720S', 'Artura', 'GT', 'MP4-12C', 'P1', 'Senna'],
  'Mercedes-Benz': ['190', 'A-Class', 'AMG GT', 'B-Class', 'C-Class', 'CL', 'CL-Class', 'CLA', 'CLC', 'CLK', 'CLS', 'E-Class', 'EQA', 'EQB', 'EQC', 'EQE', 'EQS', 'G-Class', 'GL', 'GLA', 'GLB', 'GLC', 'GLE', 'GLK', 'GLS', 'M-Class', 'R-Class', 'S-Class', 'SL', 'SLC', 'SLK', 'SLS', 'Sprinter', 'V-Class', 'Vaneo', 'Vario', 'Vito', 'X-Class'],
  'Mercury': ['Capri', 'Cougar', 'Grand Marquis', 'Marauder', 'Mariner', 'Milan', 'Monarch', 'Montego', 'Monterey', 'Mountaineer', 'Mystique', 'Sable', 'Topaz', 'Tracer', 'Villager'],
  'MG': ['F', 'Maestro', 'MGB', 'MGF', 'MGTF', 'ZR', 'ZS', 'ZT'],
  'Mini': ['Clubman', 'Convertible', 'Cooper', 'Countryman', 'Coupe', 'Paceman', 'Roadster'],
  'Mitsubishi': ['3000GT', 'ASX', 'Carisma', 'Celeste', 'Challenger', 'Colt', 'Cordia', 'Diamante', 'Eclipse', 'Endeavor', 'FTO', 'Galant', 'Grandis', 'i-MiEV', 'L200', 'L300', 'Lancer', 'Magna', 'Mirage', 'Montero', 'Nativa', 'Outlander', 'Pajero', 'Pajero Mini', 'Pajero Sport', 'RVR', 'Sapporo', 'Sigma', 'Space Star', 'Space Wagon', 'Starion', 'Tredia'],
  'Morgan': ['4/4', 'Aero 8', 'Aero Max', 'Plus 4', 'Plus 8', 'Roadster'],
  'Nissan': ['100NX', '200SX', '240SX', '300ZX', '350Z', '370Z', 'Almera', 'Almera Tino', 'Altima', 'Armada', 'Avenir', 'Bluebird', 'Cedric', 'Cherry', 'Cube', 'Dualis', 'Elgrand', 'Expert', 'Fairlady Z', 'Figaro', 'Frontier', 'Gloria', 'GT-R', 'Interstar', 'Juke', 'King Cab', 'Kubistar', 'Lafesta', 'Laurel', 'Leaf', 'Liberty', 'Maxima', 'Micra', 'Murano', 'Navara', 'Note', 'NP300', 'NV200', 'NV400', 'Pathfinder', 'Patrol', 'Pixo', 'Prairie', 'Presage', 'Presea', 'Primastar', 'Primera', 'Pulsar', 'Qashqai', 'Quest', 'Rogue', 'Sentra', 'Serena', 'Silvia', 'Skyline', 'Stanza', 'Sunny', 'Teana', 'Terrano', 'Tiida', 'Titan', 'Trade', 'Urvan', 'Vanette', 'Versa', 'Wingroad', 'X-Trail', 'Xterra'],
  'Oldsmobile': ['Achieva', 'Alero', 'Aurora', 'Bravada', 'Calais', 'Custom Cruiser', 'Cutlass', 'Eighty-Eight', 'Intrigue', 'Ninety-Eight', 'Regency', 'Silhouette', 'Toronado'],
  'Opel': ['Adam', 'Agila', 'Ampera', 'Antara', 'Ascona', 'Astra', 'Calibra', 'Campo', 'Cascada', 'Combo', 'Commodore', 'Corsa', 'Crossland', 'Frontera', 'Grandland', 'GT', 'Insignia', 'Kadett', 'Manta', 'Meriva', 'Mokka', 'Monterey', 'Monza', 'Omega', 'Rekord', 'Senator', 'Signum', 'Sintra', 'Speedster', 'Tigra', 'Vectra', 'Vivaro', 'Zafira'],
  'Peugeot': ['104', '106', '107', '108', '2008', '205', '206', '207', '208', '3008', '305', '306', '307', '308', '4007', '4008', '405', '406', '407', '408', '5008', '504', '505', '508', '604', '605', '607', '806', '807', 'Bipper', 'Boxer', 'Expert', 'iOn', 'J5', 'Partner', 'RCZ'],
  'Plymouth': ['Acclaim', 'Breeze', 'Caravelle', 'Champ', 'Colt', 'Cricket', 'Duster', 'Grand Voyager', 'Horizon', 'Laser', 'Neon', 'Prowler', 'Reliant', 'Sapporo', 'Sundance', 'Trailduster', 'Turismo', 'Voyager'],
  'Pontiac': ['6000', 'Aztek', 'Bonneville', 'Catalina', 'Fiero', 'Firebird', 'G3', 'G4', 'G5', 'G6', 'G8', 'Grand Am', 'Grand Prix', 'GTO', 'LeMans', 'Montana', 'Parisienne', 'Phoenix', 'Solstice', 'Sunbird', 'Sunfire', 'Tempest', 'Torrent', 'Trans Sport', 'Vibe'],
  'Porsche': ['718', '911', '924', '928', '944', '959', '968', 'Boxster', 'Carrera GT', 'Cayenne', 'Cayman', 'Macan', 'Panamera', 'Taycan'],
  'Proton': ['Aeroback', 'Arena', 'Gen-2', 'Impian', 'Juara', 'Perdana', 'Persona', 'Saga', 'Satria', 'Savvy', 'Waja', 'Wira'],
  'Renault': ['11', '12', '14', '15', '16', '17', '18', '19', '20', '21', '25', '30', '4', '5', 'Alaskan', 'Avantime', 'Captur', 'Clio', 'Espace', 'Express', 'Fluence', 'Fuego', 'Grand Espace', 'Grand Modus', 'Grand Scenic', 'Kadjar', 'Kangoo', 'Koleos', 'Laguna', 'Latitude', 'Master', 'Megane', 'Modus', 'R11', 'R19', 'R21', 'R25', 'R5', 'Safrane', 'Scenic', 'Spider', 'Talisman', 'Trafic', 'Twingo', 'Twizy', 'Vel Satis', 'Wind', 'Zoe'],
  'Rolls-Royce': ['Corniche', 'Cullinan', 'Dawn', 'Ghost', 'Park Ward', 'Phantom', 'Silver Dawn', 'Silver Seraph', 'Silver Shadow', 'Silver Spirit', 'Silver Spur', 'Wraith'],
  'Rover': ['100', '200', '25', '400', '45', '600', '75', '800', 'CityRover', 'Metro', 'Mini', 'Montego', 'SD1', 'Streetwise'],
  'Saab': ['9-2X', '9-3', '9-4X', '9-5', '9-7X', '900', '9000', '99'],
  'Saturn': ['Aura', 'Ion', 'L-Series', 'Outlook', 'Relay', 'S-Series', 'Sky', 'Vue'],
  'Scion': ['FR-S', 'iA', 'iM', 'iQ', 'tC', 'xA', 'xB', 'xD'],
  'Seat': ['Alhambra', 'Altea', 'Arona', 'Arosa', 'Ateca', 'Cordoba', 'Exeo', 'Ibiza', 'Inca', 'Leon', 'Malaga', 'Marbella', 'Mii', 'Tarraco', 'Terra', 'Toledo'],
  'Skoda': ['Citigo', 'Enyaq', 'Fabia', 'Favorit', 'Felicia', 'Kamiq', 'Karoq', 'Kodiaq', 'Octavia', 'Praktik', 'Rapid', 'Roomster', 'Scala', 'Superb', 'Yeti'],
  'Smart': ['EQ Forfour', 'EQ Fortwo', 'Forfour', 'Fortwo', 'Roadster'],
  'SsangYong': ['Actyon', 'Chairman', 'Korando', 'Kyron', 'Musso', 'Rexton', 'Rodius', 'Tivoli', 'XLV'],
  'Subaru': ['B9 Tribeca', 'Baja', 'BRAT', 'BRZ', 'Dex', 'Exiga', 'Forester', 'Impreza', 'Justy', 'Legacy', 'Levorg', 'Liberty', 'Outback', 'Pleo', 'R1', 'R2', 'Rex', 'Sambar', 'Stella', 'SVX', 'Trezia', 'Tribeca', 'Vivio', 'WRX', 'XT', 'XV'],
  'Suzuki': ['Alto', 'Baleno', 'Cappuccino', 'Carry', 'Celerio', 'Cultus', 'Escudo', 'Esteem', 'Every', 'Grand Vitara', 'Ignis', 'Jimny', 'Kizashi', 'Liana', 'Samurai', 'Sidekick', 'Splash', 'Swift', 'SX4', 'Vitara', 'Wagon R+', 'X-90'],
  'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y', 'Roadster'],
  'Toyota': ['4Runner', '86', 'Allex', 'Allion', 'Alphard', 'Auris', 'Avalon', 'Avanza', 'Avensis', 'Aygo', 'C-HR', 'Cami', 'Camry', 'Carina', 'Celica', 'Coaster', 'Corolla', 'Corona', 'Cressida', 'Crown', 'Cynos', 'Duet', 'Echo', 'Esquire', 'Estima', 'Etios', 'FJ Cruiser', 'Fortuner', 'GR86', 'Granvia', 'Harrier', 'Hiace', 'Highlander', 'Hilux', 'Innova', 'iQ', 'Land Cruiser', 'Mark II', 'Mark X', 'Matrix', 'MR2', 'Nadia', 'Noah', 'Paseo', 'Passo', 'Picnic', 'Prado', 'Previa', 'Prius', 'Proace', 'Probox', 'RAV4', 'Rush', 'Sequoia', 'Sienna', 'Sienta', 'Soarer', 'Solara', 'Sprinter', 'Starlet', 'Supra', 'Tacoma', 'Tercel', 'Town Ace', 'Tundra', 'Venza', 'Verso', 'Vios', 'Vista', 'Vitz', 'Voxy', 'Will Cypha', 'Will VS', 'Windom', 'Wish', 'Yaris', 'Yaris Verso'],
  'Volkswagen': ['Amarok', 'Arteon', 'Beetle', 'Bora', 'Caddy', 'California', 'Caravelle', 'CC', 'Corrado', 'Crafter', 'Eos', 'Fox', 'Golf', 'ID.3', 'ID.4', 'ID.5', 'Jetta', 'Karmann Ghia', 'LT', 'Lupo', 'Multivan', 'New Beetle', 'Passat', 'Phaeton', 'Polo', 'Routan', 'Santana', 'Scirocco', 'Sharan', 'T-Cross', 'T-Roc', 'Tiguan', 'Touareg', 'Touran', 'Transporter', 'Type 2', 'Up', 'Vento'],
  'Volvo': ['240', '244', '245', '340', '360', '440', '460', '480', '740', '760', '850', '940', '960', 'C30', 'C40', 'C70', 'S40', 'S60', 'S70', 'S80', 'S90', 'V40', 'V50', 'V60', 'V70', 'V90', 'XC40', 'XC60', 'XC70', 'XC90']
}

// Helper function to get all makes
export function getAllMakes() {
  return Object.keys(fallbackModels)
}

// Helper function to get models for a specific make
export function getModelsForMake(make) {
  return fallbackModels[make] || []
}

// Helper function to get all vehicles as flat array
export function getAllVehicles() {
  const vehicles = []
  for (const [make, models] of Object.entries(fallbackModels)) {
    for (const model of models) {
      vehicles.push({
        id: `${make}_${model}`.replace(/\s+/g, '_'),
        make,
        model,
        type: 'Car',
        body: 'Sedan'
      })
    }
  }
  return vehicles
}